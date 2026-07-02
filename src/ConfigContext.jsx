// src/ConfigContext.jsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { MONO_MODELS } from "../data/monoModels";
import { ABA_MODELS } from "../data/abaModels";
import { THREE_LAYER_MODELS } from "../data/threeLayerModels";
import { EXTRUDER_COMPONENTS } from "../src/data/extruders";
import { DIE_COMPONENTS } from "../src/data/dies";
import { BUBBLE_CAGE_COMPONENTS, MANUAL_BC_PRICES, OPEN_CLOSE_BC_PRICES, UP_DOWN_BC_PRICES } from "../src/data/bubbleCages";
import { HAULOFF_COMPONENTS, HAULOFF_PRICES } from "../src/data/hauloffs";
import { TOWER_COMPONENTS, TOWER_PRICES } from "../src/data/tower";
import { WINDER_COMPONENTS, MANUAL_BACK_TO_BACK_PRICES, SURFACE_WINDER_PRICES, AUTOMATIC_WINDER_PRICES, SINGLE_SURFACE_PRICES } from "../src/data/winders";
import { AIR_RING_COMPONENTS } from "../src/data/airRing";
import { IBC_COMPONENTS } from "../src/data/ibc";
import { COLLAPSING_FRAME_COMPONENTS, COLLAPSING_FRAME_PRICES } from "../src/data/collapsingFrame";
import { CORONA_TREATER_COMPONENTS } from "../src/data/corona";
import { TRIM_ADDONS } from "../src/data/trim";
import { MATERIAL_HANDLING_ADDONS } from "../src/data/materialHandling";
import { GAUGE_ADDONS } from "./data/gauge";
import { WEB_GUIDE_ADDONS } from "./data/webGuide";
import { CHILLER_ADDONS } from "./data/chiller";
import { EXTRUDER_ADDONS } from "./data/extruderAddons";
import { HEAT_EXCHANGER_ADDONS } from "./data/heatExchanger";
import { HYDRAULIC_UNLOADER_ADDONS } from "./data/hydraulicUnloader";
import { MDO_ADDONS } from "./data/mdo";
import { ELECTRICAL_ADDONS } from "./data/electricalPanel";
import { BIMETALLIC_BASE, SCREW_SIZES } from "./data/bimetallic";
import { WINDER_ADDONS } from "./data/winderAddons";
import { DIE_ROTATION_ADDON } from "./data/dieAddons";
import { EPC_COMPONENTS } from "./data/epc";
import { MODEL_PRESETS } from "./data/modelPresets";

import { Modal } from "../components/ui/Modal"; // ← keep your existing Modal
import { useToast } from "../components/ui/Toast"; // ← same hook you already use
import { numberToWords } from "../utils/numberToWords"; // ← your existing helper

// import html2pdf from "html2pdf.js";
import { createRoot } from "react-dom/client";
import { AdroitQuotation } from "./components/quotation/AdroitQuotation";
import { KioskFlyer } from "./components/quotation/KioskFlyer";
import { generateNextQuotationRef } from './utils/quotationGenerator';
import { generateScopeDesc, generateWinder, generateSecondaryNip } from "./utils/generateScopeDesc";

export const ConfigContext = createContext(null);

// ---------------------------------------------------------------------------
// STATIC DATA
// ---------------------------------------------------------------------------

export const COMPANY = {
  name: "Adroit Extrusion Tech Pvt. Ltd.",
  addressLine1: "Unit 1: Survey 822, Village Bhumapura, Ahmedabad - Mahemdavad Road, Gujarat",
  addressLine2: "Unit 2: 75/A, Akshar Industrial Park, Vatva, GIDC Phase-4, Ahmedabad",
  phone1: "+91 8758665507",
  email: "info@adroitextrusion.com",
  website: "adroitextrusion.com",
};

const STORAGE_KEY = "adroit_configurator_v4";

// Module-level cache for heavy client-side libraries to avoid ChunkLoadErrors in Next.js dev server hot-reloads
let html2pdfModule = null;
let html2canvasModule = null;
let jsPDFModule = null;

// 💡 Base components – extend this as you like
// Machine types we use in "supported"
export const MACHINE_TYPE_KEYS = ["mono", "aba", "3layer", "5layer"];
const MACHINE_MODELS = {
  mono: MONO_MODELS,
  aba: ABA_MODELS,
  "3layer": THREE_LAYER_MODELS,
  // 5layer: [] // keep for future if you add 5-layer data
};

export const COMPONENTS_DATA = {
  Extruder: EXTRUDER_COMPONENTS,
  "Die Head": DIE_COMPONENTS,
  "Air Ring": AIR_RING_COMPONENTS,
  IBC: IBC_COMPONENTS,
  "Collapsing Frame": COLLAPSING_FRAME_COMPONENTS,
  "Haul-Off": HAULOFF_COMPONENTS.filter(c => !c.id.includes("main-nip")),
  "Main Nip": HAULOFF_COMPONENTS.filter(c => c.id.includes("main-nip")),
  "Bubble Cage": BUBBLE_CAGE_COMPONENTS,
  "Tower / Platform": TOWER_COMPONENTS,
  Winder: WINDER_COMPONENTS,
  "Electrical & Control Panel": ELECTRICAL_ADDONS,
};

export const ADDONS_DATA = {

  "Corona Treater": CORONA_TREATER_COMPONENTS,
  // "Trim Handling": TRIM_ADDONS,
  "Material Handling": MATERIAL_HANDLING_ADDONS,
  // "Gauge / Thickness Control": GAUGE_ADDONS,
  "Web Guide": WEB_GUIDE_ADDONS,
  "Cooling System": CHILLER_ADDONS,
  "Heat Exchanger": HEAT_EXCHANGER_ADDONS,
  // "Hydraulic Unloader": HYDRAULIC_UNLOADER_ADDONS,
  "Die Addons": [DIE_ROTATION_ADDON],
  "Extruder Addons": [BIMETALLIC_BASE],
  "Winder Addons": WINDER_ADDONS,
  // "MDO Unit": MDO_ADDONS,
  "EPC": EPC_COMPONENTS,
};


// ---------------------------------------------------------------------------
// PROVIDER
// ---------------------------------------------------------------------------

export function ConfigProvider({ children }) {
  const toast = useToast();

  useEffect(() => {
    // Preload heavy client-side libraries to prevent ChunkLoadErrors during hot-reload/dev session
    if (typeof window !== "undefined") {
      if (!html2pdfModule) {
        import("html2pdf.js").then((mod) => {
          html2pdfModule = mod.default;
        }).catch(() => { });
      }

      if (!html2canvasModule) {
        import("html2canvas").then((mod) => {
          html2canvasModule = mod.default;
        }).catch(() => { });
      }

      if (!jsPDFModule) {
        import("jspdf").then((mod) => {
          jsPDFModule = mod.default;
        }).catch(() => { });
      }
    }
  }, []);

  const [customer, setCustomer] = useState({
    quotationRef: "Loading...", // Temporary initial state
    region: "DOM", // "DOM" or "EXP"
    isImported: false,
  });
  const [machineType, setMachineTypeState] = useState("mono"); // "mono" | "aba" | "3layer" | "5layer"
  const [selected, setSelected] = useState([]);               // base components
  const [selectedAddons, setSelectedAddons] = useState([]);   // optional add-ons
  const [discount, setDiscount] = useState(0);
  const [showPrices, setShowPrices] = useState(false);
  const [showAddonPricing, setShowAddonPricing] = useState(false);
  const [markup, setMarkup] = useState(0);
  const [showMarkupField, setShowMarkupField] = useState(false);
  const [showDiscountField, setShowDiscountField] = useState(false);
  const [customOutput, setCustomOutput] = useState("");
  const [customLayflat, setCustomLayflat] = useState("");
  const [customRollerWidth, setCustomRollerWidth] = useState("");
  const [scopeOverrides, setScopeOverrides] = useState({});
  const defaultTemplate = process.env.NODE_ENV === "development" ? "v2" : "classic";
  const [quoteTemplate, setQuoteTemplate] = useState(defaultTemplate);
  const [showPricingFields, setShowPricingFields] = useState(false);
  const [presetBasePrice, setPresetBasePrice] = useState(0); // ← NEW: stores fixed price from modelPreset

  // --- Export Conversion States ---
  const [conversionRate, setConversionRate] = useState(94);
  const [quotationDate, setQuotationDate] = useState(null); // null = "Use Today"

  // Ref to store the snapshot of the configuration immediately after an import.
  // This allows us to detect if "anything" has changed.
  const lastImportedSnapshotRef = useRef(null);

  useEffect(() => {
    // We only care about resetting the date if one was explicitly imported/set
    if (!quotationDate) return;

    const currentSnapshot = JSON.stringify({
      customer, machineType, selected, selectedAddons, discount, markup,
      customOutput, customLayflat, customRollerWidth, scopeOverrides,
      quoteTemplate, showPricingFields, showPrices, showAddonPricing,
      showMarkupField, showDiscountField, conversionRate, presetBasePrice
    });

    // If we haven't set a base snapshot yet, set it now (likely just after import)
    if (!lastImportedSnapshotRef.current) {
      lastImportedSnapshotRef.current = currentSnapshot;
      return;
    }

    // If the configuration now differs from the imported one, reset the date to today (null)
    if (currentSnapshot !== lastImportedSnapshotRef.current) {
      setTimeout(() => {
        setQuotationDate(null);
        lastImportedSnapshotRef.current = null; // Clear to prevent recursive loops

        toast.push({
          title: "Date updated",
          description: "Configuration changed; date updated to today.",
          variant: "info",
          durationMs: 1500,
        });
      }, 0);
    }
  }, [
    customer, machineType, selected, selectedAddons, discount, markup,
    customOutput, customLayflat, customRollerWidth, scopeOverrides,
    quoteTemplate, showPricingFields, showPrices, showAddonPricing,
    showMarkupField, showDiscountField, conversionRate, presetBasePrice,
    quotationDate // included so we only check if a date is present
  ]);

  const components = COMPONENTS_DATA;
  const addons = ADDONS_DATA;

  const [modalItem, setModalItem] = useState(null);

  // which row in the CSV list is selected
  const [machineModelIndex, setMachineModelIndex] = useState(null);

  // human-readable label like "AE-1350 (50/50/50)"
  const [selectedMachineModelLabel, setSelectedMachineModelLabel] = useState("");

  // true = “Customise yourself” (show all components for that family) 
  const [customMode, setCustomMode] = useState(false);

  const duplicateToastRef = useRef({});
  const dirHandleRef = useRef(null); // kept for future folder import if you use it

  // ---------- MACHINE MODELS PER FAMILY (from your TS/json) ----------
  let machineModels = [];
  switch (machineType) {
    case "mono":
      machineModels = MONO_MODELS || [];
      break;
    case "aba":
      machineModels = ABA_MODELS || [];
      break;
    case "3layer":
      machineModels = THREE_LAYER_MODELS || [];
      break;
    default:
      machineModels = [];
  }

  const currentMachineModel = useMemo(() => {
    if (machineModelIndex != null && machineModels[machineModelIndex]) {
      return machineModels[machineModelIndex];
    }
    // Fallback: search by label/code if index is stale or missing
    if (selectedMachineModelLabel) {
      return machineModels.find(m =>
        m.label === selectedMachineModelLabel ||
        m.code === selectedMachineModelLabel
      );
    }
    return null;
  }, [machineModelIndex, machineModels, selectedMachineModelLabel]);


  // ---------------- LOAD / SAVE TO LOCAL STORAGE ----------------

  const [isLoaded, setIsLoaded] = useState(false);

  // ---------------- LOAD / SAVE TO LOCAL STORAGE ----------------

  useEffect(() => {
    let savedData = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) savedData = JSON.parse(raw);
    } catch (e) {
      console.warn("Storage Load Error", e);
    }

    if (savedData && savedData.customer && savedData.customer.quotationRef) {
      // 1. Existing data found?
      let cust = { ...savedData.customer };

      // Upgrade legacy formats (AET/ -> AE/)
      if (cust.quotationRef.startsWith("AET/")) {
        const parts = cust.quotationRef.split('/');
        const reg = cust.region || parts[1] || "DOM";
        const seq = parts.pop() || "01";
        const twoDigitSeq = seq.length > 2 ? seq.slice(-2) : seq.padStart(2, '0');
        const roller = savedData.customRollerWidth ? savedData.customRollerWidth.match(/\d+/)?.[0] : "MW";
        const newRef = `AE/${reg}/${roller || "MW"}/${twoDigitSeq}`;
        cust.quotationRef = newRef;
        cust.ref = newRef;
      } else if (cust.quotationRef === "Loading...") {
        // Fallback for edge case
        const nextRef = generateNextQuotationRef(cust.region || "DOM");
        cust.quotationRef = nextRef;
        cust.ref = nextRef;
      }

      setCustomer(cust);
      if (typeof savedData.machineType === "string") setMachineTypeState(savedData.machineType);
      else setMachineTypeState("mono");

      if (Array.isArray(savedData.selected)) {
        setSelected(savedData.selected.map(syncComponentWithBase));
      }
      if (Array.isArray(savedData.selectedAddons)) {
        setSelectedAddons(savedData.selectedAddons.map(syncAddonWithBase));
      }
      if (typeof savedData.discount === "number") setDiscount(savedData.discount);
      if (typeof savedData.markup === "number") setMarkup(savedData.markup);
      if (typeof savedData.machineModelIndex === "number") {
        setMachineModelIndex(savedData.machineModelIndex);
      }
      if (typeof savedData.customRollerWidth === "string") {
        setCustomRollerWidth(savedData.customRollerWidth);
      }
      if (typeof savedData.selectedMachineModelLabel === "string") {
        setSelectedMachineModelLabel(savedData.selectedMachineModelLabel);
      }
      if (typeof savedData.customMode === "boolean") {
        setCustomMode(savedData.customMode);
      }
      if (typeof savedData.customOutput === "string") {
        setCustomOutput(savedData.customOutput);
      }
      if (typeof savedData.customLayflat === "string") {
        setCustomLayflat(savedData.customLayflat);
      }
      if (typeof savedData.presetBasePrice === "number") {
        setPresetBasePrice(savedData.presetBasePrice);
      }
      if (typeof savedData.conversionRate === "number") {
        setConversionRate(savedData.conversionRate);
      }
      if (savedData.scopeOverrides && typeof savedData.scopeOverrides === "object") {
        setScopeOverrides(savedData.scopeOverrides);
      }
      if (typeof savedData.quoteTemplate === "string") {
        setQuoteTemplate(savedData.quoteTemplate);
      }
      if (typeof savedData.showMarkupField === "boolean") {
        setShowMarkupField(savedData.showMarkupField);
      }
      if (typeof savedData.showDiscountField === "boolean") {
        setShowDiscountField(savedData.showDiscountField);
      }
      if (typeof savedData.showAddonPricing === "boolean") {
        setShowAddonPricing(savedData.showAddonPricing);
      }
      if (typeof savedData.showPricingFields === "boolean") {
        setShowPricingFields(savedData.showPricingFields);
      }
      if (typeof savedData.showPrices === "boolean") {
        setShowPrices(savedData.showPrices);
      }
    } else {
      // 2. New Session? GENERATE A NEW NUMBER
      const newRef = generateNextQuotationRef("DOM");
      setCustomer((prev) => ({
        ...prev,
        ...savedData?.customer,
        quotationRef: newRef,
        ref: newRef
      }));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Only save if we actually have data (avoid overwriting on first render)
    if (customer.quotationRef !== "Loading...") {
      try {
        const payload = {
          customer,
          machineType,
          selected,
          selectedAddons,
          discount,
          markup,
          machineModelIndex,
          selectedMachineModelLabel,
          customMode,
          customOutput,
          customLayflat,
          customRollerWidth,
          presetBasePrice,
          conversionRate,
          scopeOverrides,
          quoteTemplate,
          showMarkupField,
          showDiscountField,
          showAddonPricing,
          showPricingFields,
          showPrices,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.warn("Failed to save storage:", e);
      }
    }
  }, [customer, machineType, selected, selectedAddons, machineModelIndex, discount, markup, selectedMachineModelLabel, customMode, customOutput, customLayflat, presetBasePrice, conversionRate, scopeOverrides, quoteTemplate, showMarkupField, showDiscountField, showAddonPricing, showPricingFields, showPrices]);

  // Real-time synchronization for Quotation Reference
  useEffect(() => {
    if (customer.isImported) return; // Don't overwrite if imported

    setCustomer(prev => {
      const reg = prev.region || "DOM";

      // Auto-sync for AE/ standard, legacy AET/ or initial state
      const isInitial = prev.quotationRef === "Loading..." || prev.quotationRef?.startsWith("AET/");
      const isStandard = prev.quotationRef?.startsWith("AE/");

      if (isInitial || isStandard) {
        // Upgrade legacy format and normalize sequence (ensure 2 digits)
        const parts = (prev.quotationRef || "").split('/');
        let seq = parts.pop() || "01";
        if (seq.length > 2) seq = seq.slice(-2);
        else seq = seq.padStart(2, '0');

        let newRef = prev.quotationRef;
        if (machineType === "material-handling") {
          const hasMixerDryer = selectedAddons?.some(x => x.id === "mixer-dryer-dynamic");
          const hasMixerWithoutDryer = selectedAddons?.some(x => x.id === "mixer-dynamic");

          let mixPrefix = "MIX";
          if (hasMixerDryer) mixPrefix = "MIXD";
          else if (hasMixerWithoutDryer) mixPrefix = "MIXWD";

          newRef = `AE/${reg}/${mixPrefix}/${seq}`;
        } else {
          // Extract roller width number or use "MW" placeholder
          const rollerMatched = String(customRollerWidth).match(/\d+/);
          const roller = rollerMatched ? rollerMatched[0] : "MW";

          let prefix = "";
          if (machineType === "mono") prefix = "U";
          else if (machineType === "aba") prefix = "D";

          newRef = `AE/${reg}/${prefix}${roller}/${seq}`;
        }

        if (newRef !== prev.quotationRef) {
          return { ...prev, quotationRef: newRef, ref: newRef };
        }
      }
      return prev;
    });
  }, [customer.region, customRollerWidth, machineType, selectedAddons]);

  // Helper to strip unwanted fields from techDesc
  function sanitizeTechDesc(category, techDesc) {
    if (!techDesc || typeof techDesc !== "object") return techDesc;
    const clean = { ...techDesc };
    if (category === "Bubble Cage") {
      delete clean["Segments"];
    }
    if (category === "Die Head") {
      clean["Surface Treatment"] = "Chrome plated and highly polished.";
    }
    if (category === "Winder") {
      delete clean["Maximum web width"];
    }
    if (category === "Haul-Off" || category === "Main Nip") {
      delete clean["Nip roller width"];
      delete clean["Nip roller drive"];
      delete clean["Max linespeed"];
    }
    return clean;
  }

  // Helper to re-sync a component from a save/import with its base definition in the library
  function syncComponentWithBase(row) {
    if (!row || !row.category) return row;
    const list = COMPONENTS_DATA[row.category] || [];
    const base = list.find(c => c.id === row.id) || list.find(c => c.name === row.name);

    if (!base) return row; // fallback to existing row data if not found in library

    // Deep merge techDesc: prioritize base data but keep overrides from row
    const mergedTechDesc = sanitizeTechDesc(row.category, { ...(base.techDesc || {}), ...(row.techDesc || {}) });

    return {
      ...base,
      ...row,
      category: row.category,
      qty: row.qty || 1,
      techDesc: mergedTechDesc,
      // If row has an image, keep it, otherwise use base image
      image: row.image || base.image
    };
  }

  function syncAddonWithBase(row) {
    if (!row || !row.category) return row;
    const list = ADDONS_DATA[row.category] || [];
    const base = list.find(a => a.id === row.id) || list.find(a => a.name === row.name);
    if (!base) return row;
    return { ...base, ...row, category: row.category, qty: row.qty || 1 };
  }



  // ---------------- MACHINE TYPE ----------------

  function setMachineTypeAndReset(type) {
    setMachineTypeState(type);
    setSelected([]);
    setSelectedAddons([]);
    setSelectedMachineModelLabel(""); // reset model
    setCustomMode(false);             // default = not custom
    setPresetBasePrice(0);
  }

  // ---------------- MODEL PRESET (auto-select components by model code) ----------------

  // Normalize a model code for comparison (AE-1350A → AE-1350, uppercased)
  function normalizeModelCode(code) {
    if (!code) return "";
    return String(code).trim().toUpperCase();
  }

  function applyModelPreset(modelLabel) {
    const preset = MODEL_PRESETS[modelLabel];
    if (!preset) {
      console.warn("No MODEL_PRESETS entry for", modelLabel);
      return false;
    }

    // 1) set machineType from preset (mono / aba / 3layer / 5layer)
    setMachineTypeState(preset.machineType);

    const nextSelected = [];
    const nextAddons = [];

    // 1.5) Set fixed base price if preset defines one
    setPresetBasePrice(preset.basePrice || 0);

    // 2) Build selected base components
    preset.components.forEach((comp) => {
      const { category, id, qty, metadata = {} } = comp;
      const list = components[category] || [];
      const base = list.find((c) => c.id === id);
      if (!base) {
        // Allow preset-only components (e.g. "Main Nip" for DR models) that carry all
        // their info in metadata.customName / metadata.techDesc without a registry entry.
        if (metadata.customName) {
          const mergedTechDesc = sanitizeTechDesc(category, metadata.techDesc || {});
          nextSelected.push({
            id,
            category,
            qty: qty ?? 1,
            name: metadata.customName,
            ...metadata,
            techDesc: mergedTechDesc,
          });
        } else {
          console.warn("Component not found for preset:", category, id);
        }
        return;
      }
      // Deep merge techDesc if it exists in metadata
      const mergedTechDesc = sanitizeTechDesc(category, { ...(base.techDesc || {}), ...(metadata.techDesc || {}) });
      nextSelected.push({ ...base, category, qty: qty ?? 1, ...metadata, techDesc: mergedTechDesc });
    });

    // 3) Build selected add-ons
    const isPackage = (preset.basePrice || 0) > 0;
    (preset.addons || []).forEach(({ category, id, qty }) => {
      const list = addons[category] || [];
      const base = list.find((a) => a.id === id);
      if (!base) {
        console.warn("Add-on not found for preset:", category, id);
        return;
      }
      nextAddons.push({
        ...base,
        category,
        qty: qty ?? 1,
        price: isPackage ? 0 : base.price,
        isIncluded: isPackage
      });
    });

    // 4) Sync specifications (Roller Width, Layflat & Output) from the source model data
    let models = [];
    if (preset.machineType === "mono") models = MONO_MODELS || [];
    else if (preset.machineType === "aba") models = ABA_MODELS || [];
    else if (preset.machineType === "3layer") models = THREE_LAYER_MODELS || [];

    const modelObj = models.find(m => m.code === modelLabel);
    const isMonoOrAba = preset.machineType === "mono" || preset.machineType === "aba";

    // Extract Roller Width from label (e.g., "32" from "MONOLAYER - 32\"")
    const rollerMatch = String(modelLabel).match(/\d+/);
    const rollerNum = rollerMatch ? parseInt(rollerMatch[0], 10) : 0;

    let machineWidth = 0;
    if (rollerNum > 0) {
      const diff = isMonoOrAba ? 50 : ((rollerNum === 1450) ? 100 : 120);
      if (isMonoOrAba) {
        setCustomRollerWidth(`${rollerNum} inch`);
        machineWidth = modelObj?.layflatWidthMm || modelObj?.widthMm || ((rollerNum * 25) - diff);
        setCustomLayflat(`${machineWidth} mm`);
      } else {
        setCustomRollerWidth(`${rollerNum} mm`);
        machineWidth = rollerNum - diff;
        setCustomLayflat(`${machineWidth} mm`);
      }

      // Update Quotation Ref to follow new format automatically
      setCustomer(prev => {
        const region = prev.region || "DOM";
        let prefix = "";
        if (preset.machineType === "mono") prefix = "U";
        else if (preset.machineType === "aba") prefix = "D";
        const newRef = `AE/${region}/${prefix}${rollerNum}/01`;
        return { ...prev, quotationRef: newRef, ref: newRef };
      });
    } else if (modelObj) {
      machineWidth = modelObj.layflatWidthMm || modelObj.widthMm || 0;
      if (machineWidth) setCustomLayflat(`${machineWidth} mm`);
    }

    // 4.5) DYNAMIC BUBBLE CAGE LOGIC
    if (machineWidth > 0) {
      nextSelected.forEach((item, index) => {
        if (item.category === "Bubble Cage" && (item.isDynamic || item.id.includes("dynamic"))) {
          const name = (item.name || "").toLowerCase();
          const isManual = name.includes("manual") || item.id.includes("manual");
          const isUpDown = name.includes("up down") || item.id.includes("up-down");
          const isOC = name.includes("open close") || item.id.includes("open-close") || (!isManual && !isUpDown);

          let priceMap = OPEN_CLOSE_BC_PRICES;
          let label = "Film width range";
          let minRatio = 0.5;

          if (isManual) {
            priceMap = MANUAL_BC_PRICES;
            label = "Bubble width range";
            minRatio = 0.6;
          } else if (isUpDown) {
            priceMap = UP_DOWN_BC_PRICES;
            label = "Bubble width range";
            minRatio = 0.5;
          }

          // Find smallest size >= machineWidth
          const availableSizes = Object.keys(priceMap).map(Number).sort((a, b) => a - b);
          const presetSize = parseInt(item.size) || 0;
          const chosenSize = presetSize > 0 ? presetSize : (availableSizes.find(s => s >= machineWidth) || availableSizes[availableSizes.length - 1]);

          const displaySize = (rollerNum > 0) ? (isMonoOrAba ? (rollerNum * 25) : rollerNum) : chosenSize;
          const diff = isMonoOrAba ? 50 : ((displaySize === 1450) ? 100 : 120);
          const maxFilmWidth = (rollerNum > 0) ? (displaySize - diff) : chosenSize;
          const minRange = Math.round((maxFilmWidth * minRatio) / 10) * 10;
          const newPrice = priceMap[chosenSize.toString()] || 0;

          const dynamicBCItem = BUBBLE_CAGE_COMPONENTS.find(bc => bc.id === item.id) || item;
          const segments = (chosenSize >= 2370) ? 9 : (chosenSize >= 2000 ? 8 : 6);
          const typeStr = `Calibration bubble guide basket with ${segments} arms arranged to provide full support. Bubble contact is through PBT for minimum drag.`;

          // Determine actuation string based on variant
          const actuationStr = isManual
            ? "Manual Open-Close operation."
            : isUpDown
              ? "Motorized Up Down & Open-Close with Linear Actuator."
              : "Motorized Open-Close operation.";

          // Update item properties directly at the top level
          // Dynamic keys come LAST so they always override any stale preset techDesc
          nextSelected[index] = {
            ...item,
            name: `${item.name} - ${displaySize} mm`,
            size: chosenSize.toString(),
            segments: segments,
            price: newPrice,
            image: dynamicBCItem.image || item.image,
            customName: isManual ? `Manual Bubble Cage` : `Motorised Bubble Cage`,
            techDesc: sanitizeTechDesc("Bubble Cage", {
              ...(dynamicBCItem.techDesc || {}),
              ...(item.techDesc || {}),
              "Type": typeStr,
              "Actuation of arms": actuationStr,
              [label]: `${minRange} to ${maxFilmWidth} mm`,
            })
          };
        }
      });

      // 4.6) DYNAMIC HAULOFF LOGIC
      nextSelected.forEach((item, index) => {
        const isHaulOffId = ["haul-horizontal-standard", "haul-horizontal-heavy", "haul-oscillating", "haul-horizontal-dynamic"].includes(item.id);

        if (item.category === "Haul-Off" && (isHaulOffId || item.isDynamic)) {
          const availableSizes = Object.keys(HAULOFF_PRICES).map(Number).sort((a, b) => a - b);
          // Find smallest size >= machineWidth
          const minSize = availableSizes.find(s => s >= machineWidth) || availableSizes[0];
          // Respect preset size
          const presetSize = parseInt(item.size) || 0;
          const chosenSize = presetSize > 0 ? presetSize : minSize;
          const newPrice = HAULOFF_PRICES[chosenSize.toString()] || 0;

          const dynamicHauloffItem = HAULOFF_COMPONENTS.find(h => h.id === "haul-horizontal-dynamic") || item;

          let hp = "2 HP";
          if (chosenSize >= 1500 && chosenSize <= 2000) hp = "3 HP";
          else if (chosenSize > 2000) hp = "5 HP";

          const speed = (chosenSize >= 2370) ? "100 MPM" : "80 MPM";

          const displaySize = (rollerNum > 500) ? rollerNum : chosenSize;

          // Update item properties
          nextSelected[index] = {
            ...item, // Preserve metadata from preset
            category: "Haul-Off",
            qty: 1,
            size: chosenSize.toString(),
            price: newPrice,
            image: dynamicHauloffItem.image || item.image, // Ensure image is preserved
            customName: `HORIZONTAL HAULOFF`,
            techDesc: {
              ...(dynamicHauloffItem.techDesc || {}), // Start with base data (all static fields)
              ...(sanitizeTechDesc("Haul-Off", item.techDesc) || {}), // Overlay existing overrides (stripped of dynamic keys)
              // Dynamic keys come LAST — always override stale preset values
              "Nip roller width": `${displaySize} mm`,
              "Nip roller drive": `${hp} AC motor with variable frequency drive.`,
              "Max linespeed": speed,
            }
          };
        }
      });

      // 4.7) DYNAMIC TOWER LOGIC
      nextSelected.forEach((item, index) => {
        const isTowerId = ["tower_std", "tower_h", "tower-dynamic"].includes(item.id);

        if (item.category === "Tower / Platform" && (isTowerId || item.isDynamic)) {
          const availableSizes = Object.keys(TOWER_PRICES).map(Number).sort((a, b) => a - b);
          // Find smallest size >= machineWidth, or fallback to smallest available
          const presetSize = parseInt(item.size) || 0;
          const chosenSize = presetSize > 0 ? presetSize : (availableSizes.find(s => s >= machineWidth) || availableSizes[0]);
          const newPrice = TOWER_PRICES[chosenSize.toString()] || 0;

          const dynamicTowerItem = TOWER_COMPONENTS.find(h => h.id === "tower-dynamic") || item;

          const displaySize = (rollerNum > 500) ? rollerNum : chosenSize;

          // Update item properties
          nextSelected[index] = {
            ...item, // Preserve metadata from preset
            category: "Tower / Platform",
            qty: 1,
            size: chosenSize.toString(),
            price: newPrice,
            image: dynamicTowerItem.image || item.image,
            customName: `TOWER / PLATFORM`,
            techDesc: {
              ...(dynamicTowerItem.techDesc || {}),
              "Staircase": "Staircase with hand rails.",
              "Idler rollers": `Set of idler aluminium rollers of ${displaySize} mm face width.`,
              ...(item.techDesc || {})
            }
          };
        }
      });
      
      // 4.9) DYNAMIC MAIN NIP LOGIC
      nextSelected.forEach((item, index) => {
        if (item.category === "Main Nip" && item.isDynamic) {
          const availableSizes = Object.keys(HAULOFF_PRICES).map(Number).sort((a, b) => a - b);
          const minSize = availableSizes.find(s => s >= machineWidth) || availableSizes[0];
          const presetSize = parseInt(item.size) || 0;
          const chosenSize = presetSize > 0 ? presetSize : minSize;
          const newPrice = HAULOFF_PRICES[chosenSize.toString()] || 0;

          const mainNipId = (machineType === "3layer" || machineType === "5layer") ? "main-nip-dynamic-multi" : "main-nip-dynamic";
          const dynamicMainNipItem = HAULOFF_COMPONENTS.find(h => h.id === mainNipId) || item;

          let hp = "2 HP";
          if (chosenSize >= 1500 && chosenSize <= 2000) hp = "3 HP";
          else if (chosenSize > 2000) hp = "5 HP";

          const displaySize = (rollerNum > 500) ? rollerNum : chosenSize;

          nextSelected[index] = {
            ...item,
            category: "Main Nip",
            qty: 1,
            size: chosenSize.toString(),
            price: newPrice,
            image: dynamicMainNipItem.image || item.image,
            customName: `MAIN NIP`,
            techDesc: {
              ...(dynamicMainNipItem.techDesc || {}),
              "Nip roller width": (rollerNum > 500) ? `${rollerNum} mm` : `${chosenSize + ((rollerNum === 1450) ? 100 : 120)} mm`,
              "Nip roller drive": `${hp} AC motor with variable frequency drive.`,
              ...(item.techDesc || {})
            }
          };
        }
      });

      // 4.8) DYNAMIC WINDER LOGIC
      nextSelected.forEach((item, index) => {
        const isWinderId = [
          "winder-manual-back-to-back-dynamic",
          "winder-single-surface-only-dynamic",
          "winder-surface-dynamic",
          "winder-automatic-dynamic",
          "winder-surface-manual",
          "winder-surface-semi-auto",
          "winder-surface-auto"
        ].includes(item.id);

        if (item.category === "Winder" && isWinderId) {
          const name = (item.name || "").toLowerCase();
          const isManual = name.includes("manual");
          const isAuto = name.includes("automatic") || name.includes("auto");
          const isSurface = !isManual && !isAuto;
          const isSingleSurfaceWinder = item.id === "winder-single-surface-only-dynamic";

          let priceMap = SURFACE_WINDER_PRICES;
          if (isManual) priceMap = MANUAL_BACK_TO_BACK_PRICES;
          else if (isSingleSurfaceWinder) priceMap = SINGLE_SURFACE_PRICES;
          else if (isAuto) priceMap = AUTOMATIC_WINDER_PRICES;

          const availableSizes = Object.keys(priceMap).map(Number).sort((a, b) => a - b);
          // Find smallest size >= machineWidth
          const minSize = availableSizes.find(s => s >= machineWidth) || availableSizes[0];
          // Respect preset size
          const presetSize = parseInt(item.size) || 0;
          const chosenSize = presetSize > 0 ? presetSize : minSize;
          const newPrice = priceMap[chosenSize.toString()] || 0;

          const stationLabel = isSingleSurfaceWinder ? "Surface Winder (01 No.)" : "Surface Winders (02 Nos.)";

          const dynamicWinderItem = WINDER_COMPONENTS.find(w => w.id === item.id) || item;

          let nipHP = "2 HP";
          if (chosenSize >= 1500 && chosenSize <= 2000) nipHP = "3 HP";
          else if (chosenSize > 2000) nipHP = "5 HP";

          const displaySize = (rollerNum > 0) ? (isMonoOrAba ? (rollerNum * 25) : rollerNum) : chosenSize;
          const diff = isMonoOrAba ? 50 : ((displaySize === 1450) ? 100 : 120);
          const maxFilmWidth = (isMonoOrAba && currentMachineModel?.layflatWidthMm) ? currentMachineModel.layflatWidthMm : ((rollerNum > 0) ? (displaySize - diff) : chosenSize);

          // Update item properties
          nextSelected[index] = {
            ...item,
            size: displaySize.toString(),
            price: newPrice,
            image: dynamicWinderItem.image || item.image,
            customName: `${item.name}`,
            techDesc: {
              ...(dynamicWinderItem.techDesc || {}),
              ...(sanitizeTechDesc("Winder", item.techDesc) || {}),
              "Nip roller width": `${displaySize} mm`,
              "Maximum web width": `${maxFilmWidth} mm`,
              "Nip roller drive": `${nipHP} AC motor with variable frequency drive. Gear motor-Bon Vario, Italy or Equivalent.`,
              "Surface winder drive": isMonoOrAba ? `${nipHP} AC motor with variable frequency drive.` : `${nipHP} AC motor with variable frequency drive. Gear motor-Bon Vario, Italy or Equivalent.`,
              [stationLabel]: `Maximum web width of ${maxFilmWidth} mm with ${isAuto ? "Automatic" : "Manual"} Changeover.`,
            }
          };
        }
      });

      // 4.9) DYNAMIC COLLAPSING FRAME LOGIC
      nextSelected.forEach((item, index) => {
        if (item.category === "Collapsing Frame" && (item.isDynamic || item.id.includes("dynamic"))) {
          const availableSizes = Object.keys(COLLAPSING_FRAME_PRICES).map(Number).sort((a, b) => a - b);


          // Find smallest size >= machineWidth
          const minSize = availableSizes.find(s => s >= machineWidth) || availableSizes[0];
          // Respect preset size
          const presetSize = parseInt(item.size) || 0;
          const chosenSize = presetSize > 0 ? presetSize : minSize;

          const newPrice = COLLAPSING_FRAME_PRICES[chosenSize.toString()] || 0;
          const dynamicCFItem = COLLAPSING_FRAME_COMPONENTS.find(cf => cf.id === "cf-pbt-dynamic") || item;

          const displaySize = (rollerNum > 0) ? (isMonoOrAba ? (rollerNum * 25) : rollerNum) : chosenSize;
          const diff = isMonoOrAba ? 50 : ((displaySize === 1450) ? 100 : 120);
          const maxFilmWidth = (rollerNum > 0) ? (displaySize - diff) : chosenSize;

          const actualLayflat = (machineType === "aba" && currentMachineModel?.layflatWidthMm) 
            ? currentMachineModel.layflatWidthMm 
            : maxFilmWidth;

          // Update item properties
          nextSelected[index] = {
            ...item,
            category: "Collapsing Frame",
            qty: 1,
            size: chosenSize.toString(),
            price: newPrice,
            image: dynamicCFItem.image || item.image,
            customName: `${item.name}`,
            techDesc: {
              ...(dynamicCFItem.techDesc || {}),
              "Width Capability": `${actualLayflat} mm layflat`,
              ...(item.techDesc || {})
            }
          };
        }
      });
    }


    // 5) Apply into state
    setSelected(nextSelected);
    setSelectedAddons(nextAddons);
    setCustomMode(false);
    setSelectedMachineModelLabel(modelLabel);

    if (modelObj) {
      const output = modelObj.maxOutputKgHr || modelObj.outputKgHr;
      if (output) setCustomOutput(output);

      // Ensure machineModelIndex is synchronized so currentMachineModel works
      const idx = models.findIndex(m => m.code === modelLabel);
      if (idx !== -1) setMachineModelIndex(idx);
    }

    // also store some basic info on customer (nice for summary/Word)
    setCustomer((prev) => ({
      ...prev,
      customMachine: false,
      machineFamily:
        preset.machineType === "mono"
          ? "Monolayer"
          : preset.machineType === "aba"
            ? "ABA"
            : preset.machineType === "3layer"
              ? "3 Layer"
              : "5 Layer",
      machineModel: modelLabel,
      machineModelCode: modelLabel,
    }));

    return true;
  }


  function resetToModelPreset() {
    const label =
      selectedMachineModelLabel ||
      customer?.machineModel ||
      customer?.machineModelCode;

    if (!label) return false;
    return applyModelPreset(label);
  }


  // ---------------- COMPONENT CRUD ----------------


  function addComponent(category, item, metadata = null) {
    setSelected((prev) => {
      const foundIndex = prev.findIndex((p) => p.id === item.id);

      // For non-dynamic items, handle as duplicate
      if (foundIndex !== -1 && !item.isDynamic) {
        const now = Date.now();
        const last = duplicateToastRef.current[item.id] || 0;
        if (now - last > 800) {
          duplicateToastRef.current[item.id] = now;
          toast.push({
            title: "Already added",
            description: item.name,
            variant: "info",
            durationMs: 650,
          });
        }
        return prev;
      }

      // For dynamic items or new items, notify and add/replace
      toast.push({
        title: foundIndex !== -1 ? "Updated" : "Added",
        description: metadata?.customName || item.name,
        variant: "success",
        durationMs: 700,
      });

      setPresetBasePrice(0); // Revert to sum of parts if modified

      const mergedTechDesc = sanitizeTechDesc(category, { ...(item.techDesc || {}), ...(metadata?.techDesc || {}) });
      const newItem = { ...item, category, qty: 1, ...metadata, techDesc: mergedTechDesc };

      if (foundIndex !== -1) {
        const newArr = [...prev];
        newArr[foundIndex] = newItem;
        return newArr;
      }

      return [...prev, newItem];
    });
  }

  function removeComponent(id) {
    setSelected((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) {
        toast.push({
          title: "Removed",
          description: `${item.name} removed from configuration`,
          variant: "error",
        });
      }
      setPresetBasePrice(0); // Revert to sum of parts if modified
      return prev.filter((p) => p.id !== id);
    });
  }

  function setQty(id, qty) {
    if (qty < 1) return;
    setPresetBasePrice(0); // Revert to sum of parts if modified
    setSelected((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  }

  // ---------------- ADD-ON CRUD ----------------

  function addAddon(category, item, metadata = null) {
    setSelectedAddons((prev) => {
      const foundIndex = prev.findIndex((p) => p.id === item.id);

      // For non-dynamic items, handle as duplicate
      if (foundIndex !== -1 && !item.isDynamic) {
        const now = Date.now();
        const last = duplicateToastRef.current[item.id] || 0;
        if (now - last > 800) {
          duplicateToastRef.current[item.id] = now;
          toast.push({
            title: "Already added",
            description: item.name,
            variant: "info",
            durationMs: 650,
          });
        }
        return prev;
      }

      // For dynamic items or new items, notify and add/replace
      toast.push({
        title: foundIndex !== -1 ? "Updated" : "Added",
        description: metadata?.customName || item.name,
        variant: "success",
        durationMs: 700,
      });

      const newItem = { ...item, category, qty: metadata?.qty || item.qty || 1, ...metadata };

      if (foundIndex !== -1) {
        const newArr = [...prev];
        newArr[foundIndex] = newItem;
        return newArr;
      }

      return [...prev, newItem];
    });
  }

  function removeAddon(id) {
    setSelectedAddons((prev) => {
      const item = prev.find((p) => p.id === id);
      // Skip toast for internal summary lines (grand-total-line) — button state is feedback enough
      if (item && id !== "grand-total-line") {
        toast.push({
          title: "Add-on removed",
          description: `${item.name} removed`,
          variant: "error",
        });
      }
      return prev.filter((p) => p.id !== id);
    });
  }

  function setAddonQty(id, qty) {
    if (qty < 1) return;
    setSelectedAddons((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty } : p))
    );
  }

  function incAddon(id) {
    setSelectedAddons((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: (p.qty || 1) + 1 } : p
      )
    );
  }

  function decAddon(id) {
    setSelectedAddons((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = (p.qty || 1) - 1;
        return { ...p, qty: next < 1 ? 1 : next };
      })
    );
  }

  function updateAddonPricing(id, pricing) {
    setSelectedAddons((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, markup: pricing.markup, discount: pricing.discount } : p
      )
    );
  }



  // ---------------- FILTER BY MACHINE TYPE ----------------

  // flatten components & addons for easy filtering
  // components allowed for current machineType / model / customMode
  const filteredComponents = useMemo(() => {
    if (!machineType) return {};

    const out = {};
    const modelLabel = selectedMachineModelLabel || "";

    for (const [category, items] of Object.entries(components)) {
      const filtered = items.filter((comp) => {
        // 1) must support this family (if machineTypes is defined)
        if (Array.isArray(comp.machineTypes) && comp.machineTypes.length > 0) {
          if (!comp.machineTypes.includes(machineType)) return false;
        }

        // We show all components for the family now, to allow tweaking presets.
        // But we'll mark which ones are "standard" for this model.
        return true;
      }).map(comp => {
        // Add a recommendation flag if it matches the model tags
        let isRecommended = true;
        if (!customMode && modelLabel && Array.isArray(comp.usedInModels) && comp.usedInModels.length > 0) {
          const labelNorm = modelLabel.toUpperCase().trim();
          isRecommended = comp.usedInModels.some((tag) => {
            const t = String(tag).toUpperCase().trim();
            return labelNorm === t || labelNorm.startsWith(t + " ");
          });
        }
        return { ...comp, isRecommended };
      });

      if (filtered.length > 0) {
        out[category] = filtered;
      }
    }

    return out;
  }, [components, machineType, customMode, selectedMachineModelLabel]);

  // addons: only filter by family for now
  const filteredAddons = useMemo(() => {
    if (!machineType) return {};

    const out = {};

    for (const [category, items] of Object.entries(addons)) {
      const filtered = items.filter((addon) => {
        // Always show preselected add-ons
        const isPreselected = selectedAddons.some((a) => a.id === addon.id);
        if (isPreselected) return true;

        if (Array.isArray(addon.machineTypes) && addon.machineTypes.length > 0) {
          return addon.machineTypes.includes(machineType);
        }

        // no restriction = allowed for all
        return true;
      });

      if (filtered.length > 0) {
        out[category] = filtered;
      }
    }

    // --- DYNAMIC PER-EXTRUDER BIMETALLIC ADDONS + STATIC EXTRUDER ADDONS ---
    const extAddons = [];

    // Add static upgrades (like Lever Screen Changer)
    if (EXTRUDER_ADDONS && EXTRUDER_ADDONS.length > 0) {
      EXTRUDER_ADDONS.forEach(addon => {
        if (!addon.supportedTypes || addon.supportedTypes.includes(machineType)) {
          extAddons.push(addon);
        }
      });
    }

    const selectedExtruders = (selected || []).filter(s =>
      s.category === "Extruder" ||
      (s.name || "").toLowerCase().includes("extruder") ||
      (s.id || "").includes("ext-")
    );

    let totalExtruders = 0;
    let sizes = [];
    selectedExtruders.forEach((ext) => {
      const q = ext.qty || 1;
      for (let i = 0; i < q; i++) {
        totalExtruders++;
        sizes.push(String(ext.sizeMm || ext.size || ext.extruder || "45").split('/')[i] || String(ext.sizeMm || ext.size || ext.extruder || "45"));
      }
    });

    if (totalExtruders > 0) {
      const bimetallicItem = {
        ...BIMETALLIC_BASE,
        id: `bimetallic-upgrade-all`,
        name: `Bi-metallic Screw Barrel (All Extruders)`,
        cardDesc: `Upgrade all ${totalExtruders} Extruders (${sizes.join(', ')} mm) to premium wear-resistant Bi-metallic screw and barrel.`,
        qty: totalExtruders,
        isDynamic: false,
        metadata: {
          ...BIMETALLIC_BASE.metadata,
          sizes: sizes
        }
      };
      extAddons.push(bimetallicItem);
    }

    if (extAddons.length > 0) {
      out["Extruder Addons"] = extAddons;
    }

    // --- DYNAMIC DIE ROTATION ADDON ---
    const selectedDie = (selected || []).find(s => s.category === "Die Head");
    if (selectedDie) {
      const dieSize = selectedDie.diameterMm || selectedDie.size || "";
      out["Die Addons"] = [{
        ...DIE_ROTATION_ADDON,
        name: `Die Rotation System for ${dieSize} mm Die`,
        id: "die-rotation-addon",
        metadata: { ...DIE_ROTATION_ADDON.metadata, size: String(dieSize) }
      }];
    }

    return out;
  }, [addons, machineType, selectedAddons, selected]);

  const processedSelected = useMemo(() => {
    const isDieRotationSelected = selectedAddons.some(a => a.id === "die-rotation-addon");
    const isLeverScreenChanger = selectedAddons.some(a => a.id === "addon-lever-screen-changer");
    const isBimetallicSelected = selectedAddons.some(a => a.id?.startsWith("bimetallic-upgrade-"));

    return selected.map(item => {
      let updatedItem = { ...item };
      const category = (item.category || "").toLowerCase();

      // 1. Die Updates (Rotation + Clean Name for Mono/ABA)
      if (category.includes("die")) {
        let newName = updatedItem.name;
        let newCustomName = updatedItem.customName;
        let newTechDesc = { ...updatedItem.techDesc };

        if (machineType === "mono" || machineType === "aba") {
          newName = (newName || "").replace(/\s*\d+\s*(?:\/\s*\d+\s*)?mm/i, "").trim();
          if (newCustomName) {
            newCustomName = newCustomName.replace(/\s*\d+\s*(?:\/\s*\d+\s*)?mm/i, "").trim();
          }
          const dieSizeKey = Object.keys(newTechDesc).find(k => k.toLowerCase().includes("die size") || k.toLowerCase().includes("diameter"));
          if (dieSizeKey) {
            newTechDesc[dieSizeKey] = "Diameter as per width and lip gap.";
          }
        }

        updatedItem = {
          ...updatedItem,
          name: newName,
          customName: newCustomName || updatedItem.customName,
          techDesc: newTechDesc
        };

        if (isDieRotationSelected) {
          updatedItem = {
            ...updatedItem,
            isRotationSelected: true,
            techDesc: {
              ...updatedItem.techDesc,
              "Die Rotation": "Provided"
            }
          };
        }
      }

      // 2. Extruder Updates (Screen Changer and Bimetallic)
      if (category.includes("extruder")) {
        let newTechDesc = { ...updatedItem.techDesc };
        let modified = false;

        // Screen Changer
        if (isLeverScreenChanger) {
          const currentSC = newTechDesc["Screen changer"] || newTechDesc["Screen Changer"] || "";
          if (currentSC.toLowerCase().includes("candle")) {
            newTechDesc["Screen changer"] = currentSC.replace(/candle/i, "Lever");
            modified = true;
          } else if (!currentSC) {
            newTechDesc["Screen changer"] = "Lever type Manual Screen Changer";
            modified = true;
          }
        }

        // Bimetallic
        if (isBimetallicSelected) {
          newTechDesc["Material"] = "Bi-metallic screw";
          modified = true;
        }

        if (modified) {
          updatedItem = {
            ...updatedItem,
            techDesc: newTechDesc
          };
        }
      }

      // 3. Winder Updates (Back to Back Winder replacement)
      const isBackToBackSelected = selectedAddons.some(a => a.id === "winder-manual-back-to-back-dynamic");
      if (category === "winder" && isBackToBackSelected) {
        const addon = selectedAddons.find(a => a.id === "winder-manual-back-to-back-dynamic");
        if (addon) {
          updatedItem = {
            ...updatedItem,
            name: addon.name || "Two back to back Surface Winder",
            customName: addon.customName || addon.name || "Two back to back Surface Winder",
            image: addon.image || updatedItem.image,
            techDesc: {
              ...updatedItem.techDesc,
              "Type": "Back to back Surface Winder",
              "Actuation": "Manual Changeover.",
              "Roll diameter": "Bow roller prior to drum roller for wrinkle free winding.",
              "Surface winder drive": (machineType === "mono" || machineType === "aba") ? "2 HP AC motor with variable frequency drive." : "2 HP AC motor with variable frequency drive. Gear motor-Bon Vario, Italy or Equivalent.",
              "Tension control": "Through Torque mode.",
              "Length counter meter": "Provided",
              "Trim Suction Blower": "Provided"
            }
          };
        }
      }

      // 4. Bubble Cage Updates
      if (category.includes("bubble cage")) {
        let newTechDesc = { ...updatedItem.techDesc };
        if (newTechDesc["Type"]) {
          const isMonoOrAba = machineType === "mono" || machineType === "aba";
          const armsText = isMonoOrAba ? "4 arms" : "6 arms";
          
          let typeDesc = newTechDesc["Type"];
          typeDesc = typeDesc.replace(/with \d+ arms /gi, "");
          typeDesc = typeDesc.replace(/arranged to /gi, `with ${armsText} arranged to `);
          newTechDesc["Type"] = typeDesc;
        }
        updatedItem = {
          ...updatedItem,
          techDesc: newTechDesc
        };
      }

      // 5. Global Component Name Clean-up
      let finalName = updatedItem.customName || updatedItem.name || "";
      if (finalName) {
        // Strip leading sizes (e.g., "300 mm " or "75mm ")
        finalName = finalName.replace(/^\d+\s*mm\s*-\s*/i, "");
        finalName = finalName.replace(/^\d+\s*mm\s*/i, "");
        
        // Strip trailing sizes (e.g., " - 1120 mm" or " 150 mm")
        finalName = finalName.replace(/\s*-\s*\d+\s*mm$/i, "");
        finalName = finalName.replace(/\s*\d+\s*mm$/i, "");
        
        // Strip trailing parenthesis (e.g., "(10 HP)" or "(2 HP Blower)")
        finalName = finalName.replace(/\s*\([^)]*\)\s*$/i, "");
        
        updatedItem = {
          ...updatedItem,
          customName: finalName.trim()
        };
      }

      return updatedItem;
    });
  }, [selected, selectedAddons]);


  // ---------------- MACHINE MODEL DETAILS (from CSV/TS) ----------------

  function getMachineDetails(safeCustomer, mType) {
    const selectedCode =
      safeCustomer.machineModelCode || safeCustomer.machineModel;

    let models = [];
    if (mType === "mono") models = MONO_MODELS;
    else if (mType === "aba") models = ABA_MODELS;
    else if (mType === "3layer") models = THREE_LAYER_MODELS;

    let model =
      models.find((m) => m.code === selectedCode || m.label === selectedCode) ||
      models.find(
        (m) =>
          (m.layflatWidthMm || m.widthMm || m.width) ===
          safeCustomer.machineWidth
      ) ||
      null;

    return model || null;
  }

  // ---------------- WORD / PDF / JSON CONTEXT ----------------


  const computePriceSummary = React.useCallback(() => {
    // 1. Calculate Standard Components Total
    let basicTotal = selected.reduce(
      (sum, item) => sum + (item.price || 0) * (item.qty || 1),
      0
    );

    // If a preset base price is active, use it instead of sum of parts
    if (presetBasePrice > 0) {
      basicTotal = presetBasePrice;
    }

    // 2. Split Optional Addons into Visible and Hidden (e.g. Bimetallic Upgrades, Loadcell)
    let hiddenUpgradesTotal = 0;
    const visibleAddons = [];
    let materialHandlingBasicTotal = 0;

    (selectedAddons || []).forEach(item => {
      const isBimetallic = item.id?.startsWith("bimetallic-upgrade-");
      const isLoadcell = item.id === "addon-loadcell-tension";
      const isGrandTotal = item.id === "grand-total-line";
      const isDieRotation = item.id === "die-rotation-addon";
      const isLeverScreenChanger = item.id === "addon-lever-screen-changer";

      const isMixer = item.id === "mixer-dynamic" || item.id === "mixer-dryer-dynamic";
      const isHidden = isBimetallic || isLoadcell || isGrandTotal || isDieRotation || isLeverScreenChanger;

      const base = (item.price || 0) * (item.qty || 1);
      const m = item.markup || 0;
      const d = item.discount || 0;
      const adjusted = base * (1 + m / 100) * (1 - d / 100);

      if (machineType === "material-handling" && isMixer) {
        materialHandlingBasicTotal += adjusted;
      } else if (isHidden) {
        if (!isGrandTotal) hiddenUpgradesTotal += adjusted; // grand-total contributes nothing
      } else {
        visibleAddons.push(item);
      }
    });

    if (machineType === "material-handling") {
      basicTotal = materialHandlingBasicTotal;
    }

    const addonsTotal = visibleAddons.reduce(
      (sum, item) => {
        const base = (item.price || 0) * (item.qty || 1);
        const m = item.markup || 0;
        const d = item.discount || 0;
        const adjusted = base * (1 + m / 100) * (1 - d / 100);
        return sum + adjusted;
      },
      0
    );

    // 3. Margin & Discount Logic (Apply ONLY to Basic Scope + Hidden Upgrades)
    const beforeMargin = basicTotal + hiddenUpgradesTotal;

    const withMarkup =
      markup && markup > 0
        ? beforeMargin * (1 + markup / 100)
        : beforeMargin;

    const afterDiscount =
      discount && discount > 0
        ? withMarkup * (1 - discount / 100)
        : withMarkup;

    // --- Currency Conversion ---
    const isExport = customer.region === 'EXP';
    let currency = 'INR';
    let rate = 1;

    if (isExport) {
      currency = 'USD';
      rate = conversionRate || 94; // Fallback to 94 to avoid div zero
    }

    return {
      basicTotal: isExport ? Math.ceil(basicTotal / rate) : basicTotal,
      addonsTotal: isExport ? Math.ceil(addonsTotal / rate) : addonsTotal,
      beforeMargin: isExport ? Math.ceil(beforeMargin / rate) : beforeMargin,
      withMarkup: isExport ? Math.ceil(withMarkup / rate) : withMarkup,
      afterDiscount: isExport ? Math.ceil(afterDiscount / rate) : afterDiscount,
      totalWithAddons: isExport ? Math.ceil((afterDiscount + addonsTotal) / rate) : (afterDiscount + addonsTotal),
      isPackagePrice: presetBasePrice > 0,
      currency,
      rate,
      raw: {
        basicTotal,
        addonsTotal,
        afterDiscount
      }
    };
  }, [selected, selectedAddons, markup, discount, presetBasePrice, customer.region, conversionRate]);

  function getMachineDetailsForWord(machineType, safeCustomer) {
    if (!machineType) return null;

    let models = [];
    if (machineType === "mono") models = MONO_MODELS || [];
    else if (machineType === "aba") models = ABA_MODELS || [];
    else if (machineType === "3layer") models = THREE_LAYER_MODELS || [];
    else models = [];

    if (!models || models.length === 0) return null;

    const modelCode = safeCustomer.machineModelCode || safeCustomer.machineModelCodeAlt || "";
    const modelLabel = safeCustomer.machineModel || "";

    let found = null;

    // 1) Try by explicit code
    if (modelCode) {
      found =
        models.find((m) => m.code === modelCode) ||
        models.find((m) => m.MODEL_CODE === modelCode);
    }

    // 2) Try by label / equipment name
    if (!found && modelLabel) {
      found =
        models.find((m) => m.label === modelLabel) ||
        models.find((m) => m.EQUIPMENT === modelLabel) ||
        models.find((m) => m.model === modelLabel);
    }

    // 3) Last fallback: first model
    if (!found) {
      found = models[0] || null;
    }

    if (!found) return null;

    // Build a normalized "specs table" for Word
    const specs_table = Object.entries(found)
      .filter(([key, value]) => {
        if (value == null || value === "") return false;
        if (key === "image" || key === "photo") return false;
        return true;
      })
      .map(([key, value]) => ({
        label: key,
        value: String(value),
      }));

    return {
      raw: found,
      specs_table,
    };
  }

  // Generate a quotation reference number similar to your proposals
  function generateQuotationRef() {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);      // e.g. "25"
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    // You can tweak this format to exactly match your company style
    // Example: "AET/DOM/25/1123/001"
    return `AET/DOM/${yy}/${mm}${dd}/001`;
  }


  const buildWordContext = React.useCallback(() => {
    const isExport = customer.region === 'EXP';
    const safeCustomer = customer || {};

    // --- QUOTATION META (REF + DATE) ---
    const today = new Date();
    const qDate = quotationDate || today.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
    const qRef = safeCustomer.ref || safeCustomer.quotationRef || (typeof generateQuotationRef === 'function' ? generateQuotationRef() : "DRAFT");

    // --- PRICE CALC (Refactored to use computePriceSummary) ---
    const { withMarkup, afterDiscount, addonsTotal, currency, rate, isPackagePrice } = computePriceSummary();
    const finalRounded = Math.round(afterDiscount || 0);

    // Number to words helper with currency
    const fmtWordsFull = (n, curr) => {
      if (!n) return curr === "USD" ? "Zero Dollars" : "INR Zero";
      const system = curr === "USD" ? "US" : "IN";
      const w = numberToWords(Math.round(n), system);
      return curr === "USD" ? `${w} Dollars Only` : `INR ${w} Only`;
    };

    const fmtPriceFull = (n, curr) => {
      if (curr === "USD") return `$ ${Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
      return `Rs. ${Math.round(n).toLocaleString("en-IN")}/-`;
    };

    // --- MACHINE DETAILS (for front page + spec table) ---
    const machineDetails = getMachineDetails(safeCustomer, machineType) || {};
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    const overrides = scopeOverrides || {};
    let hasExtruder = false;

    let preProcessedSelected = processedSelected || [];
    let preSelectedAddons = selectedAddons || [];
    if (machineType === "mono") {
      preProcessedSelected = preProcessedSelected.filter(item => {
        if (!item) return false;
        const n = (item.name || "").toLowerCase();
        const c = (item.category || "").toLowerCase();
        return !(n.includes("tower") || c.includes("tower") || n.includes("platform") || c.includes("platform"));
      });
      preSelectedAddons = preSelectedAddons.filter(item => {
        if (!item) return false;
        const n = (item.name || "").toLowerCase();
        const c = (item.category || "").toLowerCase();
        return !(n.includes("tower") || c.includes("tower") || n.includes("platform") || c.includes("platform"));
      });
    }

    const selectedScopeItems = preProcessedSelected
      .filter(item => item && item.name)
      .flatMap(item => {
        const c = (item.category || "").toLowerCase();
        const nameLc = (item.name || "").toLowerCase();
        const isExtruder = c.includes("extruder") || nameLc.includes("extruder") || (item.id || "").includes("ext-");

        const isControl = c.includes("panel") || nameLc.includes("panel") || c.includes("control") || nameLc.includes("control");
        if (isControl) return [];
        if (c.includes("collapsing frame") || c.includes("filter")) return [];

        const key = item.id || item.name;
        const customDesc = overrides[key];

        // Check for combined Winder + Secondary Nip
        const isCombinedWinder = c.includes("winder") && (nameLc.includes("secondary") || nameLc.includes("nip"));

        if (isCombinedWinder && !customDesc) {
          const nipDesc = generateSecondaryNip(item, currentMachineModel);
          const winderDesc = generateWinder(item, currentMachineModel, { includeNipPrefix: false, selectedAddons });

          if (machineType === "aba") {
            let nipWidth = 0;
            if (currentMachineModel && currentMachineModel.layflatWidthMm) {
              nipWidth = currentMachineModel.layflatWidthMm + 50;
            } else if (currentMachineModel && currentMachineModel.widthMm) {
              nipWidth = currentMachineModel.widthMm + 50;
            } else {
              nipWidth = (parseInt(item.size) || 0) + 50; // fallback
            }
            
            let hp = "2 HP";
            if (nipWidth >= 1500 && nipWidth <= 2000) hp = "3 HP";
            else if (nipWidth > 2000) hp = "5 HP";
            
            const nipWidthStr = nipWidth > 50 ? ` of ${nipWidth} mm width` : "";
            const cfDesc = `Collapsing frame with PBT rollers, side guides, Main Nip${nipWidthStr} with ${hp} AC Drive.`;

            return [
              {
                id: `${item.id}-cf`,
                name: "Collapsing Frame",
                qty: 1,
                category: "Collapsing Frame",
                desc: cfDesc,
              },
              {
                id: `${item.id}-winder`,
                name: item.name.replace(/Secondary Nip & /i, ""),
                qty: item.qty || 1,
                desc: winderDesc,
              }
            ];
          } else {
            return [
              {
                id: `${item.id}-nip`,
                name: "Secondary Nip Assembly",
                qty: 1,
                desc: nipDesc,
              },
              {
                id: `${item.id}-winder`,
                name: item.name.replace(/Secondary Nip & /i, ""),
                qty: item.qty || 1,
                desc: winderDesc,
              }
            ];
          }
        }

        const autoDesc = generateScopeDesc(item, selected, currentMachineModel, selectedAddons);
        const finalDesc = customDesc !== undefined ? customDesc : autoDesc;

        if (isExtruder) {
          if (hasExtruder) return [];
          hasExtruder = true;
        }

        return [{
          id: item.id || "",
          name: isExtruder ? "Extruders" : (item.customName || item.name || ""),
          qty: isExtruder ? 1 : (item.qty || 1),
          category: item.category || "",
          desc: finalDesc
        }];
      });

    const winderTowerAddonsRaw = preSelectedAddons.filter(item => {
      if (!item || !item.name) return false;
      const n = item.name.toLowerCase();
      const c = (item.category || "").toLowerCase();
      return (n.includes("winder") || c.includes("winder") || n.includes("tower") || c.includes("tower")) && !n.includes("trim") && !c.includes("panel") && item.id !== "addon-loadcell-tension";
    });

    const winderTowerScopeItems = winderTowerAddonsRaw.flatMap(item => {
      const key = item.id || item.name;
      const customDesc = overrides[key];
      const nameLc = (item.name || "").toLowerCase();
      const isWinder = (item.category || "").toLowerCase().includes("winder") || nameLc.includes("winder");
      const isCombinedWinder = isWinder && (nameLc.includes("secondary") || nameLc.includes("nip"));

      if (isCombinedWinder && !customDesc) {
        const nipDesc = generateSecondaryNip(item, currentMachineModel);
        const winderDesc = generateWinder(item, currentMachineModel, { includeNipPrefix: false, selectedAddons });
        if (machineType === "aba" || machineType === "mono") {
          return [
            {
              id: `${item.id}-cf`,
              name: "Collapsing Frame",
              qty: 1,
              category: "Collapsing Frame",
              desc: "if there is hauloff then hauloff will come with collapsing frame",
            },
            {
              id: `${item.id}-winder`,
              name: item.name.replace(/Secondary Nip & /i, ""),
              qty: item.qty || 1,
              desc: winderDesc,
            }
          ];
        } else {
          return [
            { id: `${item.id}-nip`, name: "Secondary Nip Assembly", qty: 1, desc: nipDesc },
            { id: `${item.id}-winder`, name: item.name.replace(/Secondary Nip & /i, ""), qty: item.qty || 1, desc: winderDesc }
          ];
        }
      }

      const autoDesc = generateScopeDesc(item, selected, currentMachineModel, selectedAddons) || item.shortDesc || item.cardDesc;
      const finalDesc = customDesc !== undefined ? customDesc : autoDesc;
      const isExtruder = (item.category || "").toLowerCase().includes("extruder") || (item.name || "").toLowerCase().includes("extruder");
      const qtySuffix = (isExtruder && item.qty > 0) ? ` (${String(item.qty).padStart(2, '0')} NOS.)` : "";

      return {
        id: item.id || "",
        name: (item.name || "") + qtySuffix,
        qty: item.qty || 1,
        category: item.category || "",
        desc: (finalDesc || "") + qtySuffix
      };
    });

    const hasSelectedTower = [...selectedScopeItems, ...winderTowerScopeItems].some(item => (item.name || "").toLowerCase().includes("tower"));
    const hasSelectedCF = [...selectedScopeItems, ...winderTowerScopeItems].some(item => {
      const n = (item.name || "").toLowerCase();
      const c = (item.category || "").toLowerCase();
      return n.includes("collapsing") || c.includes("collapsing");
    });
    const hasHaulOffItem = [...selectedScopeItems, ...winderTowerScopeItems].some(item => {
      const n = (item.name || "").toLowerCase();
      const c = (item.category || "").toLowerCase();
      return c.includes("haul") || n.includes("haul");
    });

    const staticItems = [
      { name: "Idler Rollers", qty: 1, desc: "Aluminum Idler rollers as per layout drawing." },
      !hasSelectedTower && { name: "Tower Structure", qty: 1, desc: "Tower Structure to support bubble stabilizing basket, haul-off, etc." },
      (machineType === "aba" || machineType === "mono") && !hasSelectedCF && !hasHaulOffItem && {
        name: "Main Nip and Collapsing Frame", qty: 1, category: "Collapsing Frame", desc: "Main Nip with AC Drive. Side mounted PBT rollers to collapse the layflat bubble."
      },
      { name: "Control Panel", qty: 1, desc: "Complete extrusion controls on main panel with Touch Panel." }
    ].filter(Boolean);

    const is3or5Layer = machineType === "3layer" || machineType === "5layer";

    const getIdx = (item) => {
      const n = String(item.name || "").toLowerCase();
      const c = String(item.category || "").toLowerCase();
      const combined = n + " " + c;

      if (is3or5Layer) {
        // 3/5-layer SOS order:
        // extruder → extrusion control → die → air ring → bubble cage →
        // haul-off → collapsing frame (only if die rotation) → idler → secondary nip → winder → tower
        if (n.includes("extruder")) return 1;
        if (n.includes("control") || n.includes("panel") || combined.includes("extrusion control")) return 2;
        if (n.includes("die")) return 3;
        if (combined.includes("air ring") || combined.includes("airring")) return 4;
        if (combined.includes("ibc")) return 4.5;
        if (combined.includes("bubble cage") || combined.includes("cage") || combined.includes("basket")) return 5;
        if (combined.includes("haul-off") || combined.includes("hauloff") || (combined.includes("haul") && combined.includes("off"))) return 6;
        // main nip and collapsing frame (may be combined into one entry for DR models)
        if (combined.includes("main nip") || combined.includes("collapsing frame") || combined.includes("collapsing")) return 7;
        if (combined.includes("idler")) return 8;
        if (combined.includes("secondary nip")) return 9;
        if (combined.includes("winder")) return 10;
        if (n.includes("tower") || n.includes("platform")) return 100;
        return 90;
      }

      // Default order (mono / aba)
      if (n.includes("extruder")) return 1;
      if (n.includes("control") || n.includes("panel") || combined.includes("extrusion control")) return 2;
      if (n.includes("die")) return 3;
      if (combined.includes("air ring") || combined.includes("airring")) return 4;
      if (combined.includes("ibc")) return 5;
      if (combined.includes("bubble cage") || combined.includes("cage") || combined.includes("basket")) return 6;
      if (combined.includes("collapsing frame") || combined.includes("collapsing") || combined.includes("haul-off") || combined.includes("hauloff") || combined.includes("main nip") || (combined.includes("haul") && combined.includes("off"))) return 7;
      if (combined.includes("idler")) return 8;
      if (combined.includes("secondary nip")) return 9;
      if (combined.includes("winder")) return 10;
      if (n.includes("tower") || n.includes("platform")) return 100;

      return 90;
    };

    const manualExtraDesc = (overrides["manual_extra"] || "").trim();
    const manualExtra = manualExtraDesc ? [{ name: "Additional Item", qty: 1, desc: manualExtraDesc }] : [];

    let preCombineScope = [...selectedScopeItems, ...winderTowerScopeItems, ...staticItems];

    const hauloffIdx = preCombineScope.findIndex(item => {
      const category = (item.category || "").toLowerCase();
      if (category.includes("haul")) return true;
      const name = String(item.name || "").toLowerCase();
      return name.includes("haul-off") || name.includes("hauloff") || (name.includes("haul") && name.includes("off"));
    });

    const collapsingIdx = preCombineScope.findIndex(item => {
      const category = (item.category || "").toLowerCase();
      if (category.includes("collapsing")) return true;
      const name = String(item.name || "").toLowerCase();
      const isCollapsing = name.includes("collapsing frame") || name.includes("collapsing");
      const isHaulOff = category.includes("haul") || name.includes("haul-off") || name.includes("hauloff") || (name.includes("haul") && name.includes("off"));
      return isCollapsing && !isHaulOff;
    });

    // For 3-layer/5-layer: keep haul-off and collapsing frame as separate SOS entries.
    if (!is3or5Layer && hauloffIdx !== -1 && collapsingIdx !== -1) {
      const cfItem = preCombineScope[collapsingIdx];
      const hoItem = preCombineScope[hauloffIdx];
      
      preCombineScope[hauloffIdx] = {
        ...hoItem,
        name: "Haul-Off and Collapsing Frame",
        desc: `${cfItem.desc || cfItem.description || ""}\n${hoItem.desc || hoItem.description || ""}`,
        techDesc: { ...cfItem.techDesc, ...hoItem.techDesc }
      };
      preCombineScope.splice(collapsingIdx, 1);
    }

    // For ALL models SOS: combine Main Nip + Collapsing Frame into one labelled entry.
    // Haul-off (if present) stays as its own separate entry.
    {
      const mainNipIdx = preCombineScope.findIndex(item => {
        const cat = (item.category || "").toLowerCase();
        const n = (item.name || "").toLowerCase();
        return cat.includes("main nip") || cat === "main nip" || n.includes("main nip");
      });

      const cfIdx3L = preCombineScope.findIndex(item => {
        const cat = (item.category || "").toLowerCase();
        const n = (item.name || "").toLowerCase();
        const isCollapsing = cat.includes("collapsing") || n.includes("collapsing frame");
        const isMainNip = cat.includes("main nip") || n.includes("main nip");
        const isCombinedWithHaulOff = n.includes("haul-off") || n.includes("hauloff") || cat.includes("haul");
        return isCollapsing && !isMainNip && !isCombinedWithHaulOff;
      });

      if (mainNipIdx !== -1) {
        const mnItem = preCombineScope[mainNipIdx];
        if (cfIdx3L !== -1) {
          const cfItem3L = preCombineScope[cfIdx3L];
          preCombineScope[mainNipIdx] = {
            ...mnItem,
            name: "Main Nip and Collapsing Frame",
            desc: mnItem.desc || mnItem.description || "",
            techDesc: { ...cfItem3L.techDesc, ...mnItem.techDesc }
          };
          preCombineScope.splice(cfIdx3L, 1);
        } else {
          preCombineScope[mainNipIdx] = {
            ...mnItem,
            name: "Main Nip and Collapsing Frame",
          };
        }
      } else if (cfIdx3L !== -1) {
        preCombineScope[cfIdx3L] = {
          ...preCombineScope[cfIdx3L],
          name: "Main Nip and Collapsing Frame",
        };
      }
    }

    if (machineType === "mono") {
      const mnCfIdx = preCombineScope.findIndex(item => item.name === "Main Nip and Collapsing Frame");
      if (mnCfIdx !== -1 && preCombineScope[mnCfIdx].techDesc) {
        const newTechDesc = { ...preCombineScope[mnCfIdx].techDesc };
        delete newTechDesc["Construction"];
        delete newTechDesc["Material"];
        delete newTechDesc["Adjustment"];
        delete newTechDesc["Width Capability"];
        preCombineScope[mnCfIdx].techDesc = newTechDesc;
      }
    }

    const sortedScope = [...preCombineScope].sort((a, b) => getIdx(a) - getIdx(b));
    const finalScope = [...sortedScope, ...manualExtra].map(item => ({ ...item, description: item.desc }));

    return {
      company: COMPANY,
      customer: {
        company_name: safeCustomer.company || "-",
        contact_name: safeCustomer.name || "-",
        address: safeCustomer.address || "-",
        city: safeCustomer.city || "-",
        state: safeCustomer.state || "",
        country: safeCustomer.country || "",
        phone: safeCustomer.phone || "-",
        email: safeCustomer.email || "-",
        gst: safeCustomer.gst || "-",
      },
      quotation: {
        ref_no: qRef,
        refNo: qRef,
        date: qDate,
        subject: safeCustomer.subject || "Proposal for Blown Film Extrusion Line",
      },
      machine: {
        type: machineType || "",           // e.g. "material-handling", "mono", "aba" etc.
        model: machineDetails.label || safeCustomer.machineModel || "BLOWN FILM LINE",
        family: safeCustomer.machineFamily || machineType || "",
        modelCode: machineDetails.code || safeCustomer.machineModelCode || safeCustomer.machineModel || "",
      },
      machine_details: machineDetails,
      scope: finalScope,
      optional_items: (selectedAddons || []).filter(a => {
        if (!a) return false;
        const isBimetallic = a.id?.startsWith("bimetallic-upgrade-");
        const isLoadcell = a.id === "addon-loadcell-tension";
        const isGrandTotal = a.id === "grand-total-line";
        const isDieRotation = a.id === "die-rotation-addon";
        const isLeverScreenChanger = a.id === "addon-lever-screen-changer";
        const isMixer = a.id === "mixer-dynamic" || a.id === "mixer-dryer-dynamic";

        if (machineType === "material-handling" && isMixer) {
          return false;
        }
        return !isBimetallic && !isLoadcell && !isGrandTotal && !isDieRotation && !isLeverScreenChanger;
      }).map((a, idx) => {
        const rawPrice = (a.price || 0) * (a.qty || 1);
        const convertedPrice = isExport ? (rawPrice / rate) : rawPrice;
        return {
          item_no: idx + 1,
          name: a.customName || a.name,
          category: a.category || "",
          qty: a.qty || 1,
          price: convertedPrice,
          markup: a.markup || 0,
          discount: a.discount || 0,
        };
      }),
      material_handling_mixers: (() => {
        const mixerAddons = (selectedAddons || []).filter(a => a.id === "mixer-dynamic" || a.id === "mixer-dryer-dynamic");
        return mixerAddons.map(a => ({
          id: a.id || "",
          name: a.customName || a.name || "",
          qty: a.qty || 1,
          image: a.image || "",
          shortDesc: a.shortDesc || a.cardDesc || "",
          techDesc: a.techDesc || {},
          metadata: a.metadata || {},
          price: a.price || 0,
          size: a.size || a.metadata?.size || "",
        }));
      })(),
      // Keep backward-compat single field (first mixer)
      material_handling_mixer: (() => {
        const a = (selectedAddons || []).find(a => a.id === "mixer-dynamic" || a.id === "mixer-dryer-dynamic");
        return a ? { id: a.id, name: a.customName || a.name, qty: a.qty || 1, image: a.image, metadata: a.metadata || {}, price: a.price || 0, size: a.size || a.metadata?.size || "" } : null;
      })(),
      pricing: {
        basicPrice: fmtPriceFull(withMarkup, currency),
        basicPriceWords: "(" + fmtWordsFull(withMarkup, currency).toUpperCase() + ")",
        finalPrice: fmtPriceFull(afterDiscount, currency),
        discountAmount: Number(discount) || 0,
        basic_price_text: fmtPriceFull(withMarkup, currency),
        basic_price_inr: Math.round(withMarkup), // note: this is in display currency despite the 'inr' name
        afterDiscount: afterDiscount,
        final_price_text: fmtPriceFull(afterDiscount, currency),
        final_price_in_words: fmtWordsFull(afterDiscount, currency),
        currency: currency,
        rate: rate,
        markup_percent: markup,
        discount_percent: discount,
        addons_total: addonsTotal,
        total_price: afterDiscount + addonsTotal,
        total_price_text: fmtPriceFull(afterDiscount + addonsTotal, currency),
      },

      // Performance (you can tweak more later)
      indicative_performance: {
        product:
          safeCustomer.productToMake ||
          "High Quality Monolayer / ABA / Three Layer Film",
        max_pumping_capacity:
          machineDetails.outputKgHr || safeCustomer.maxPump || "",
        max_output: customOutput || safeCustomer.maxOutput || "As per screw design",
      },

      prepared_by: "Urveesh Jepaliya",
      // Power loads — derived from selected + selectedAddons
      power_loads: (() => {
        const POWER_MAP = [
          { pattern: /35\s*mm/i, category: "Extruder", heating: 9.0, motive: 7.5 },
          { pattern: /40\s*mm/i, category: "Extruder", heating: 10.0, motive: 11.0 },
          { pattern: /45\s*mm/i, category: "Extruder", heating: 12.0, motive: 15.0 },
          { pattern: /50\s*mm/i, category: "Extruder", heating: 14.0, motive: 22.5 },
          { pattern: /55\s*mm/i, category: "Extruder", heating: 15.0, motive: 30.0 },
          { pattern: /60\s*mm/i, category: "Extruder", heating: 15.0, motive: 30.0 },
          { pattern: /65\s*mm/i, category: "Extruder", heating: 18.4, motive: 75.0 },
          { pattern: /75\s*mm/i, category: "Extruder", heating: 22.4, motive: 85.0 },
          { pattern: /90\s*mm/i, category: "Extruder", heating: 24.2, motive: 93.0 },
          { pattern: /100\s*mm/i, category: "Extruder", heating: 31.5, motive: 45.0 },
          { pattern: /Air ring/i, heating: "", motive: 15 },
          { pattern: /haul.?off/i, heating: "", motive: 0 },
          { pattern: /winder/i, heating: "", motive: 11 },
        ];

        function processItem(item, loads) {
          const name = (item.name || "").trim();
          const cat = (item.category || "").trim();
          const qty = item.qty || 1;

          // Extruders (by category or name)
          if (cat === "Extruder" || /extruder/i.test(name)) {
            const match = POWER_MAP.find(p => p.category === "Extruder" && p.pattern.test(name));
            loads.push({ name: name.toUpperCase(), qty, heating: match ? match.heating : "", motive: match ? match.motive : "" });
            return;
          }

          // Air Ring (by category OR name) — extract HP dynamically (1 HP = 0.746 kW)
          if (cat === "Air Ring" || /air\s*ring/i.test(name)) {
            const hpMatch = name.match(/(\d+)\s*hp/i);
            const motiveKw = hpMatch ? (parseFloat(hpMatch[1]) * 0.746).toFixed(1) : "";
            loads.push({ name: name.toUpperCase(), qty, heating: "", motive: motiveKw });
            return;
          }

          // Die Head (by category OR name) — also add Screen Changer row
          if (cat === "Die Head" || /\bdie\b/i.test(name)) {
            loads.push({ name: name.toUpperCase(), qty, heating: 38.30, motive: "" });
            loads.push({ name: "SCREEN CHANGER", qty, heating: 8.60, motive: "" });
            return;
          }

          // Other components via pattern map
          const rule = POWER_MAP.find(p => !p.category && p.pattern.test(name));
          if (rule) loads.push({ name: name.toUpperCase(), qty, heating: rule.heating, motive: rule.motive });
        }

        const loads = [];
        (selected || []).forEach(item => processItem(item, loads));
        (selectedAddons || []).forEach(item => processItem(item, loads));
        return loads;
      })(),
    };
  }, [customer, selected, selectedAddons, markup, discount, machineType, customOutput, conversionRate, currentMachineModel, scopeOverrides, customLayflat, customRollerWidth]);

  // ---------------- EXPORT: JSON (template-style, for re-import) ----------------

  function exportJsonOnly() {
    try {
      // This builds the full structured object:
      // {
      //   company,
      //   customer,
      //   quotation,
      //   machine,
      //   components,
      //   optional_items,
      //   pricing,
      //   indicative_performance,
      //   prepared_by,
      //   date
      // }
      const ctx = buildWordContext();

      const payload = {
        schema: "adroit_quotation_v1",
        generated_at: new Date().toISOString(),
        ...ctx,
        _restore: {
          schema: "adroit_v2",
          machineType,
          customer,
          selected: selected, // Save full object to preserve dynamic techDesc and headers
          selectedAddons: selectedAddons, // Save full object
          markup_percent: markup,
          discount_percent: discount,
          machineModelIndex,
          selectedMachineModelLabel,
          customMode,
          customOutput,
          customLayflat,
          customRollerWidth,
          scopeOverrides,
          conversionRate,
          quoteTemplate,
          showPricingFields,
          showMarkupField,
          showDiscountField,
          showAddonPricing,
          showPrices,
          presetBasePrice,
          quotationDate,
        }
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });

      // Nice filename: YYYYMMDD_Ref_Customer_Quotation.json
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");

      // we stored quotation ref in customer.ref / quotation.ref_no earlier
      const ref =
        (ctx.customer && (ctx.customer.ref || ctx.customer.quotationRef)) ||
        (ctx.quotation && ctx.quotation.ref_no) ||
        "";

      const refSafe = ref ? String(ref).replace(/[^\w\-]/g, "_") : "NOREF";
      const nameSafe = (ctx.customer.contact_name || "Customer")
        .toString()
        .replace(/\s+/g, "_");

      const fileName = `${dateStr}_${refSafe}_${nameSafe}_Quotation.json`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("JSON export failed:", e);
      alert("Could not export JSON configuration.");
    }
  }

  // ---------------- EXPORT: WORD (template-based) ----------------
  async function exportWordOnly() {
    try {
      // Helpers / safe names
      const safeCustomer = customer || {};
      const safeName = (safeCustomer.name || "customer").replace(/\s+/g, "_");
      const safeCity = (safeCustomer.city || "city").replace(/\s+/g, "_");

      const { withMarkup, afterDiscount, currency, rate, isPackagePrice } = computePriceSummary();

      function formatCurrency(n) {
        const num = Number(n || 0);
        if (currency === "USD") return `$${num.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
        return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
      }

      // Convert image URL to DataURL for embedding
      async function imageToDataUrl(url) {
        if (!url) return "";
        try {
          const resp = await fetch(url, { mode: "cors" });
          if (!resp.ok) return "";
          const blob = await resp.blob();
          return await new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result);
            reader.onerror = (e) => rej(e);
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.warn("imageToDataUrl failed:", url, e);
          return "";
        }
      }

      // Preload letterhead and selected images
      const letterheadUrl = "/images/letterhead-bg.png"; // adjust path if necessary
      const letterheadData = await imageToDataUrl(letterheadUrl);

      const allItems = [...(selected || []), ...(selectedAddons || [])];
      const imagesMap = {};
      await Promise.all(
        allItems.map(async (it) => {
          if (!it || !it.image) return;
          imagesMap[it.image] = await imageToDataUrl(it.image);
        })
      );

      // Price math (Refactored to use computePriceSummary)
      const finalTotal = afterDiscount;
      const priceWithMarkup = withMarkup;

      // CSS tuned to match your sample (red headings, spaced totals, inner borders)
      const css = `
      @page { size: A4; margin: 0; }
      body { font-family: "Arial", "Helvetica", sans-serif; color:#222; margin:0; padding:0; background: #fff; }
      .page { padding: 28mm 18mm 18mm 18mm; box-sizing:border-box; }
      .letterhead { width:100%; margin-bottom:8px; }
      .letterhead img { width:100%; height:auto; display:block; }

      h1.title { color:#c62828; font-size:20px; letter-spacing:1px; margin:4px 0 8px 0; }
      h2.section-heading { color:#c62828; font-size:13px; margin:14px 0 8px 0; letter-spacing:0.8px; }
      p.opening { font-size:12.2px; color:#333; line-height:1.45; margin:8px 0 12px 0; }

      .customer-block { margin-bottom:10px; font-size:12px; }
      .customer-block strong { color:#111; }

      table.tbl { width:100%; border-collapse: collapse; margin-bottom:8px; }
      table.tbl thead th { background:#f7f7f7; padding:10px 10px; border:1px solid #cfcfcf; font-size:12px; text-align:left; color:#111; }
      table.tbl tbody td { padding:10px 10px; border:1px solid #e0e0e0; vertical-align:top; font-size:12px; color:#222; }
      table.tbl tbody tr + tr td { /* spacing is the border, padding gives breathing room */ }

      /* slightly larger left column for component name */
      .col-name { width:35%; }
      .col-desc { width:55%; }
      .col-qty { width:10%; text-align:center; }

      /* Addons table price column */
      .col-price { width:120px; text-align:right; }

      /* Component detail blocks */
      .component-block { display:flex; gap:16px; align-items:flex-start; margin-bottom:18px; }
      .component-block .imgwrap { width:220px; flex:0 0 220px; border:1px solid #e2e2e2; padding:6px; background:#fff; }
      .component-block .imgwrap img { width:100%; height:auto; display:block; }
      .component-block .spec { flex:1; font-size:12px; color:#222; line-height:1.45; }
      .component-block .spec h3 { color:#c62828; margin:0 0 6px 0; font-size:13px; }

      .price-lines { margin-top:8px; }
      .price-lines .line { color:#c62828; font-weight:700; font-size:16px; letter-spacing:2px; margin:6px 0; }
      .inwords { font-size:12px; color:#333; margin-top:6px; }

      .terms { margin-top:14px; font-size:12px; color:#222; line-height:1.45; }
      .terms p { margin:10px 0; }

      .signature { margin-top:24px; font-size:12px; }
      .signature .sign-line { margin-top:26px; border-top:1px solid #111; display:inline-block; padding-top:8px; }

      /* keep content comfortable for Word */
      img { max-width:100%; }
    `;

      // Opening paragraph (as in Aeromat style)
      const openingPara = `
      <p class="opening">
        We thank you for your enquiry and are pleased to submit our detailed proposal for the supply of equipment as listed below. The scope, pricing and terms contained in this quotation are subject to the conditions stated and are valid for 30 days from the quotation date.
      </p>
    `;

      // Build components table rows (NO prices per your request for components table)
      const basicRowsHtml = (selected || []).map((it) => {
        const shortDesc = it.shortDesc || it.desc || (Array.isArray(it.techDesc) ? it.techDesc.join(" | ") : (it.techDesc || ""));
        return `
        <tr>
          <td class="col-name">${it.name || "-"}</td>
          <td class="col-desc">${shortDesc || "-"}</td>
          <td class="col-qty">${it.qty || 1}</td>
        </tr>
      `;
      }).join("\n");

      // Addons table rows (with price column)
      const addonsRowsHtml = (selectedAddons || []).map((a) => {
        const shortDesc = a.shortDesc || a.desc || (Array.isArray(a.techDesc) ? a.techDesc.join(" | ") : (a.techDesc || ""));
        return `
        <tr>
          <td class="col-name">${a.name || "-"}</td>
          <td class="col-desc">${shortDesc || "-"}</td>
          <td class="col-qty">${a.qty || 1}</td>
          <td class="col-price">${formatCurrency(a.price || 0)}</td>
        </tr>
      `;
      }).join("\n");

      // Component detail blocks (image left, full description right). No prices displayed here.
      const detailsHtml = allItems.map((it) => {
        const imgData = imagesMap[it.image] || "";
        const descParts = it.fullDesc || it.desc || it.techDesc || it.shortDesc || "-";
        const safeDesc = Array.isArray(descParts) ? descParts.join(" | ") : String(descParts);
        return `
        <div class="component-block">
          <div class="imgwrap">${imgData ? `<img src="${imgData}" alt="${it.name || ''}" />` : `<div style="width:100%;height:120px;display:flex;align-items:center;justify-content:center;color:#999">No image</div>`}</div>
          <div class="spec">
            <h3>${it.name || "-"}</h3>
            <div>${safeDesc}</div>
          </div>
        </div>
      `;
      }).join("\n");

      // Terms & Warranty EXACT text you provided (kept formatting and phrasing)
      const termsHtml = `
      <div class="terms">
        <p><strong>PRICES:</strong><br/>
        Prices are Un Packed, Ex-works, Ahmedabad, Gujarat basis. All Government taxes and duties are not considered. These are applicable as per rule. Prices are valid for 30 days from the date of quotation.</p>

        <p><strong>PACKING & FORWARDING:</strong><br/>
        Packing charges will be charged extra.</p>

        <p><strong>INSURANCE:</strong><br/>
        Insurance to be organized by the customer.</p>

        <p><strong>TRANSPORTATION:</strong><br/>
        Cost of the transport will be borne by the customer.</p>

        <p><strong>DELIVERY:</strong><br/>
        04 Months from the date receipt of technically and commercially clear purchase order with minimum 30% irrevocable security deposit.</p>

        <p><strong>PAYMENT TERMS:</strong><br/>
        We require 20% as token advance, 30% after 45 days of given order and Balance payment along with all incidental charges, Taxes & Duties are to be paid before delivery. The deposit is non-interest bearing, and will be forfeited in the event of cancellation of the order.</p>

        <p><strong>PRE-DISPATCH TESTING & TRIALS:</strong><br/>
        We follow discrete testing methods. This method involves discrete testing of individual system elements like Winders, Extruders etc. to our pre-designed standards to ensure faultless running of the complete line on installation at Customer end.</p>

        <p><strong>ERECTION & COMMISSIONING:</strong><br/>
        Our service engineers will supervise erection, installation and commissioning of the machine. Customer will provide skilled and semi skilled labor for the purpose of erection & commissioning. Customer will arrange Erection Team. Customer will ensure that all utilities and power connections are ready before customer calls our service engineer. The customer will pay To & Fro Fare, Lodging, Boarding, and Transportation during period of the services provided.</p>

        <p>Thanking you,<br/>Yours truly,<br/><strong>FOR ADROIT EXTRUSION</strong><br/>Urveesh Jepaliya</p>

        <h4 style="margin-top:12px">STANDARRD WARRANTY TERMS</h4>

        <p><strong>WARRANTY PERIOD:</strong><br/>
        For electrical, Boughtout items & Manufacturing items : 12 months from date of commissioning against faulty material or bad workmanship and undertake to repair/replacement the defective parts within period. The defect brought to notice has to be genuine. For Third Party Products : Manufacturers warranty will be applicable.</p>

        <p><strong>WARRANTY EXCLUDES:</strong><br/>
        Parts made of rubber, plastic, glass. Bearings, wearing parts, fuses, heaters, lamps, contactors, MCB’s etc. The warranty does not cover damages caused by dropping, fire, floods or other natural calamity, misuse, accident or improper installation. The life span of screw and barrel depends upon abrasive material being processed and hence cannot be specified.</p>

        <p><strong>WARRANTY IS LIMITED:</strong><br/>
        Warranty is limited to the extent of the repairs or replacement of manufacturing defects and other things or workmanship. No liability is assumed beyond such replacements. Any condition or other matters relating to this quotation not expressly stimulated will be a matter of mutual discussion and agreement at the time of accepting the order.</p>

        <p><strong>CANCELLATION:</strong><br/>
        It is understood that order once placed cannot be cancelled without payment of cancellation charges, in addition to forfeiture of the advance paid by the customer.</p>
      </div>
    `;

      // Signature block
      const signatureHtml = `
      <div class="signature">
        <div>For Adroit Extrusion</div>
        <div class="sign-line">Authorised Signatory</div>
      </div>
    `;

      // Compose the final HTML doc
      const html = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Quotation - ${safeCustomer.name || ""}</title>
        <style>${css}</style>
      </head>
      <body>
        <div class="page">
          ${letterheadData ? `<div class="letterhead"><img src="${letterheadData}" alt="letterhead" /></div>` : ""}
          <h1 class="title">QUOTATION</h1>

          <div class="customer-block">
            <div><strong>To:</strong> ${safeCustomer.name || "-"}</div>
            <div><strong>Company:</strong> ${safeCustomer.company || "-"}</div>
            <div><strong>Phone:</strong> ${safeCustomer.phone || "-"}</div>
            <div><strong>Email:</strong> ${safeCustomer.email || "-"}</div>
            <div><strong>Address:</strong> ${safeCustomer.address || "-"}</div>
          </div>

          ${openingPara}

          <h2 class="section-heading">Scope of Supply - Basic Machine Components</h2>
          <table class="tbl">
            <thead>
              <tr>
                <th>Component</th>
                <th>Description</th>
                <th style="text-align:center">Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${basicRowsHtml || `<tr><td colspan="3">No basic components selected.</td></tr>`}
            </tbody>
          </table>

          <h2 class="section-heading">Optional Equipments</h2>
          <table class="tbl">
            <thead>
              <tr>
                <th>Component</th>
                <th>Description</th>
                <th style="text-align:center">Qty</th>
                <th style="text-align:right">Price</th>
              </tr>
            </thead>
            <tbody>
              ${addonsRowsHtml || `<tr><td colspan="4">No optional equipments selected.</td></tr>`}
            </tbody>
          </table>

          <div class="price-lines">
            <div class="line">${isPackagePrice ? "Fixed Package Base Price" : "Basic Price (EX-Works)"}: ${formatCurrency(priceWithMarkup)}</div>
            <div class="line">Final Price After Discount: ${formatCurrency(finalTotal)}</div>
            <div class="inwords">In Words: ${currency === "USD" ? numberToWords(Math.round(finalTotal)) + " Dollars Only" : numberToWords(Math.round(finalTotal)) + " Only"} </div>
          </div>

          <h2 class="section-heading">Component Details</h2>
          ${detailsHtml}

          <h2 class="section-heading">Terms & Warranty</h2>
          ${termsHtml}

          ${signatureHtml}
        </div>
      </body>
      </html>
    `;

      // Create & download blob as application/msword (Word will open)
      const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const fname = `${dateStr}_${safeName}_${safeCity}_Quotation.doc`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fname;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Export Word failed:", err);
      alert("Could not generate Word document");
    }
  }

  // ---------------- EXPORT: PDF (simple jsPDF) ----------------

  async function exportPdfOnly() {
    try {
      // dynamic imports (keep bundle small)
      const html2canvas = html2canvasModule || (await import("html2canvas")).default;
      const jsPDF = jsPDFModule || (await import("jspdf")).default;

      const safeCustomer = customer || {};
      const safeName = (safeCustomer.name || "customer").replace(/\s+/g, "_");
      const safeCity = (safeCustomer.city || "city").replace(/\s+/g, "_");

      // ---------- helper: currency formatting ----------
      const { withMarkup, afterDiscount, currency, rate, isPackagePrice } = computePriceSummary();

      function formatCurrency(n) {
        const num = Number(n || 0);
        if (currency === "USD") return `$${num.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
        return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
      }

      // ---------- helper: ArrayBuffer -> base64 ----------
      function arrayBufferToBase64(buffer) {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, i + chunkSize);
          binary += String.fromCharCode.apply(null, chunk);
        }
        return btoa(binary);
      }

      // ---------- load font from public/fonts (do NOT import the TTF) ----------
      // Put NotoSans-Regular.ttf in /public/fonts/NotoSans-Regular.ttf
      let fontBase64 = null;
      try {
        const fontResp = await fetch("/fonts/NotoSans-Regular.ttf");
        if (!fontResp.ok) throw new Error("Font fetch failed");
        const fontBuf = await fontResp.arrayBuffer();
        fontBase64 = arrayBufferToBase64(fontBuf);
      } catch (e) {
        console.warn("Could not load font from /fonts/NotoSans-Regular.ttf — continuing with default PDF font", e);
      }

      // ---------- create pdf ----------
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();

      // register the font with jsPDF (if available)
      if (fontBase64) {
        try {
          pdf.addFileToVFS("NotoSans-Regular.ttf", fontBase64);
          pdf.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");
          pdf.setFont("NotoSans");
        } catch (e) {
          console.warn("jsPDF font registration failed, falling back to built-in fonts", e);
        }
      } else {
        // optionally set one of jsPDF built-ins:
        pdf.setFont("helvetica");
      }

      // ---------- letterhead (optional background) ----------
      const letterheadPath = "/images/letterhead-bg.png"; // keep under public/images
      let letterheadImg = null;
      try {
        const img = new Image();
        img.src = letterheadPath;
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
        letterheadImg = img;
      } catch (e) {
        console.warn("letterhead load failed", e);
        letterheadImg = null;
      }

      const drawLetterhead = (pageNum = 1) => {
        if (!letterheadImg) return;
        try {
          // Fill entire page with letterhead background (the PNG should include header+footer)
          pdf.addImage(letterheadImg, "PNG", 0, 0, pdfW, pdfH);
        } catch (e) {
          console.warn("drawLetterhead failed", e);
        }
      };

      // ---------- margins & spacing ----------
      const left = 14;
      const right = 14;
      const top = 38;      // leave top space so letterhead header won't overlap (tune as per actual PNG)
      const bottom = 20;   // leave space for footer area in the PNG
      const usableW = pdfW - left - right;
      const lineHeight = 6; // mm
      const smallLine = 5;

      // helper to manage vertical position & page breaks
      const startNewPage = () => {
        pdf.addPage();
        if (letterheadImg) drawLetterhead(pdf.internal.getNumberOfPages());
        y = top;
      };
      const ensureRoom = (heightNeeded) => {
        // If remaining vertical space is less than heightNeeded, start a new page
        const remaining = pdfH - bottom - y;
        if (remaining < heightNeeded) {
          startNewPage();
        }
      };

      // ---------- page 1: summary / customer details ----------
      if (letterheadImg) drawLetterhead(1);
      let y = top;

      pdf.setFontSize(12);
      pdf.setTextColor(0);
      pdf.text("CUSTOMER DETAILS", left, y);
      y += smallLine + 2;

      pdf.setFontSize(10);
      const custLines = [
        `Name: ${safeCustomer.name || "-"}`,
        `Company: ${safeCustomer.company || "-"}`,
        `Phone: ${safeCustomer.phone || "-"}`,
        `Email: ${safeCustomer.email || "-"}`,
        `City: ${safeCustomer.city || "-"}`,
        `GST: ${safeCustomer.gst || "-"}`,
        `Address: ${safeCustomer.address || "-"}`,
      ];
      for (let i = 0; i < custLines.length; i++) {
        ensureRoom(lineHeight);
        pdf.text(custLines[i], left, y);
        y += lineHeight;
      }
      y += 4;

      // ---------- Selected Components table (with borders) ----------
      ensureRoom(lineHeight * 3);
      pdf.setFontSize(13);
      pdf.setTextColor(220, 38, 38);
      pdf.text("SELECTED COMPONENTS", left, y);
      y += lineHeight;

      // table geometry
      const col1W = 65; // component name
      const col2W = usableW - col1W - 20; // description
      const col3W = 20; // qty
      const tableX = left;
      let tableY = y + 2;

      // header row
      const cellPad = 3;
      const headerH = lineHeight + 2;
      pdf.setFillColor(240);
      pdf.setDrawColor(160);
      pdf.rect(tableX, tableY, col1W, headerH, "F");
      pdf.rect(tableX + col1W, tableY, col2W, headerH, "F");
      pdf.rect(tableX + col1W + col2W, tableY, col3W, headerH, "F");
      pdf.setFontSize(10);
      pdf.setTextColor(0);
      pdf.text("Component", tableX + cellPad, tableY + cellPad + 2);
      pdf.text("Description", tableX + col1W + cellPad, tableY + cellPad + 2);
      pdf.text("Qty", tableX + col1W + col2W + col3W - cellPad, tableY + cellPad + 2, { align: "right" });

      tableY += headerH;

      // rows
      for (let i = 0; i < (selected || []).length; i++) {
        const s = selected[i];
        // measure description wrapping
        const descLines = pdf.splitTextToSize(s.desc || "-", col2W - cellPad * 2);
        const nameLines = pdf.splitTextToSize(s.name || "-", col1W - cellPad * 2);
        const rowsNeeded = Math.max(descLines.length, nameLines.length, 1);
        const rowH = rowsNeeded * (lineHeight * 0.9) + cellPad * 2;

        ensureRoom(rowH + 6);
        // draw cell outlines
        pdf.setDrawColor(160);
        pdf.rect(tableX, tableY, col1W, rowH, "S");
        pdf.rect(tableX + col1W, tableY, col2W, rowH, "S");
        pdf.rect(tableX + col1W + col2W, tableY, col3W, rowH, "S");

        // write text
        pdf.setFontSize(10);
        pdf.setTextColor(0);
        pdf.text(nameLines, tableX + cellPad, tableY + cellPad + 2);
        pdf.text(descLines, tableX + col1W + cellPad, tableY + cellPad + 2);
        pdf.text(String(s.qty || 1), tableX + col1W + col2W + col3W - cellPad, tableY + cellPad + 2, { align: "right" });

        tableY += rowH;
        y = tableY + 6;
      }

      y = tableY + 8;

      // ---------- Optional Addons table (separate with borders) ----------
      if (selectedAddons && selectedAddons.length > 0) {
        ensureRoom(lineHeight * 3);
        pdf.setFontSize(13);
        pdf.setTextColor(220, 38, 38);
        pdf.text("OPTIONAL EQUIPMENTS", left, y);
        y += lineHeight;

        // build header area
        tableY = y + 2;
        const aCol1 = 70;
        const aCol2 = usableW - aCol1 - 30;
        const aCol3 = 30;
        const aHeaderH = lineHeight + 2;
        pdf.setFillColor(240);
        pdf.setDrawColor(160);
        pdf.rect(tableX, tableY, aCol1, aHeaderH, "F");
        pdf.rect(tableX + aCol1, tableY, aCol2, aHeaderH, "F");
        pdf.rect(tableX + aCol1 + aCol2, tableY, aCol3, aHeaderH, "F");
        pdf.setFontSize(10);
        pdf.setTextColor(0);
        pdf.text("Component", tableX + cellPad, tableY + cellPad + 2);
        pdf.text("Description", tableX + aCol1 + cellPad, tableY + cellPad + 2);
        pdf.text("Price", tableX + aCol1 + aCol2 + aCol3 - cellPad, tableY + cellPad + 2, { align: "right" });

        tableY += aHeaderH;

        for (let i = 0; i < selectedAddons.length; i++) {
          const a = selectedAddons[i];
          const descLines = pdf.splitTextToSize(a.desc || "-", aCol2 - cellPad * 2);
          const nameLines = pdf.splitTextToSize(a.name || "-", aCol1 - cellPad * 2);
          const usedRows = Math.max(descLines.length, nameLines.length, 1);
          const rowH = usedRows * (lineHeight * 0.9) + cellPad * 2;

          ensureRoom(rowH + 6);
          pdf.setDrawColor(160);
          pdf.rect(tableX, tableY, aCol1, rowH, "S");
          pdf.rect(tableX + aCol1, tableY, aCol2, rowH, "S");
          pdf.rect(tableX + aCol1 + aCol2, tableY, aCol3, rowH, "S");

          pdf.setFontSize(10);
          pdf.setTextColor(0);
          pdf.text(nameLines, tableX + cellPad, tableY + cellPad + 2);
          pdf.text(descLines, tableX + aCol1 + cellPad, tableY + cellPad + 2);
          pdf.text(formatCurrency(a.price || 0), tableX + aCol1 + aCol2 + aCol3 - cellPad, tableY + cellPad + 2, { align: "right" });

          tableY += rowH;
          y = tableY + 6;
        }
      }

      // ---------- Totals (Refactored) ----------
      const finalTotal = afterDiscount;

      pdf.setFontSize(12);
      pdf.setTextColor(220, 38, 38);
      pdf.text(`${isPackagePrice ? "Fixed Package Base Price" : "Basic Price (EX-Works)"}: ${formatCurrency(withMarkup)}`, left, y);
      y += lineHeight;
      pdf.text(`Final Price After Discount: ${formatCurrency(finalTotal)}`, left, y);
      y += lineHeight;
      pdf.setFontSize(10);
      pdf.setTextColor(0);
      const finalWords = currency === "USD" ? `${numberToWords(Math.round(finalTotal))} Dollars Only` : `${numberToWords(Math.round(finalTotal))} Only`;
      pdf.text(`In Words: ${finalWords}`, left, y);
      y += lineHeight + 8;

      // ---------- Component details page(s): images on left, desc on right ----------
      const details = [...(selected || []), ...(selectedAddons || [])];
      if (details.length > 0) {
        startNewPage();
        pdf.setFontSize(13);
        pdf.setTextColor(220, 38, 38);
        pdf.text("COMPONENT DETAILS", left, y);
        y += lineHeight + 4;

        for (let i = 0; i < details.length; i++) {
          const item = details[i];
          // compute how many text lines we'll need
          const textX = left + 66;
          const textW = pdfW - right - textX;
          const descLines = pdf.splitTextToSize(item.desc || "-", textW);
          const textBlockH = Math.max(45, descLines.length * (lineHeight * 0.85) + 18);

          ensureRoom(textBlockH + 6);
          // image
          try {
            if (item.image) {
              const resp = await fetch(item.image);
              const blob = await resp.blob();
              const dataUrl = await new Promise((res) => {
                const r = new FileReader();
                r.onload = () => res(r.result);
                r.readAsDataURL(blob);
              });
              pdf.addImage(dataUrl, "PNG", left, y, 60, 45);
            }
          } catch (e) {
            console.warn("image load fail", item.id, e);
          }

          // title + desc + (no price next to desc as you asked)
          pdf.setFontSize(12);
          pdf.setTextColor(220, 38, 38);
          pdf.text(item.name || "-", textX, y + 6);
          pdf.setFontSize(10);
          pdf.setTextColor(0);
          pdf.text(descLines, textX, y + 12);

          y += textBlockH + 6;
        }
      }

      // ---------- Terms & Warranty (final pages) ----------
      startNewPage();
      pdf.setFontSize(13);
      pdf.setTextColor(220, 38, 38);
      pdf.text("Terms & Warranty", left, y);
      y += lineHeight + 2;

      pdf.setFontSize(10);
      pdf.setTextColor(0);
      const termsBlocks = [
        "PRICES: Prices are Un Packed, Ex-works, Ahmedabad, Gujarat basis. All Government taxes and duties are not considered. These are applicable as per rule. Prices are valid for 30 days from the date of quotation.",
        "PACKING & FORWARDING: Packing charges will be charged extra.",
        "INSURANCE: Insurance to be organized by the customer.",
        "TRANSPORTATION: Cost of the transport will be borne by the customer.",
        "DELIVERY: 04 Months from the date receipt of technically and commercially clear purchase order with minimum 30% irrevocable security deposit.",
        "PAYMENT TERMS: We require 20% as token advance, 30% after 45 days of given order and Balance payment along with all incidental charges, Taxes & Duties are to be paid before delivery. The deposit is non-interest bearing, and will be forfeited in the event of cancellation of the order.",
        "PRE-DISPATCH TESTING & TRIALS: We follow discrete testing methods. This method involves discrete testing of individual system elements like Winders, Extruders etc. to our pre-designed standards to ensure faultless running of the complete line on installation at Customer end.",
        "ERECTION & COMMISSIONING: Our service engineers will supervise erection, installation and commissioning of the machine. Customer will provide skilled and semi skilled labor for the purpose of erection & commissioning. Customer will arrange Erection Team. Customer will ensure that all utilities and power connections are ready before customer calls our service engineer. The customer will pay To & Fro Fare, Lodging, Boarding, and Transportation during period of the services provided.",
        "Thanking you,",
        "Yours truly,",
        "FOR ADROIT EXTRUSION",
        "Urveesh Jepaliya",
        "STANDARD WARRANTY TERMS:",
        "WARRANTY PERIOD: For electrical, Boughtout items & Manufacturing items : 12 months from date of commissioning against faulty material or bad workmanship and undertake to repair/replacement the defective parts within period. The defect brought to notice has to be genuine. For Third Party Products : Manufacturers warranty will be applicable.",
        "WARRANTY EXCLUDES: Parts made of rubber, plastic, glass. Bearings, wearing parts, fuses, heaters, lamps, contactors, MCB’s etc. The warranty does not cover damages caused by dropping, fire, floods or other natural calamity, misuse, accident or improper installation. The life span of screw and barrel depends upon abrasive material being processed and hence cannot be specified.",
        "WARRANTY IS LIMITED to the extent of the repairs or replacement of manufacturing defects and other things or workmanship. No liability is assumed beyond such replacements.",
        "Any condition or other matters relating to this quotation not expressly stimulated will be a matter of mutual discussion and agreement at the time of accepting the order.",
        "CANCELLATION: It is understood that order once placed cannot be cancelled without payment of cancellation charges, in addition to forfeiture of the advance paid by the customer."
      ];

      for (const block of termsBlocks) {
        const wrap = pdf.splitTextToSize(block, usableW);
        ensureRoom(wrap.length * (lineHeight * 0.9) + 6);
        pdf.text(wrap, left, y);
        y += wrap.length * (lineHeight * 0.9) + 6;
      }

      // ---------- Save / download ----------
      const blob = pdf.output("blob");
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const fname = `${dateStr}_${safeName}_${safeCity}_Quotation.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fname;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Could not generate PDF: " + (err?.message || err));
    }
  }

  // ---------------- EXPORT: PRO PDF (using html2pdf with AdroitQuotation template) ----------------

  async function exportProPdf() {
    const loadingToast = toast.push({ title: "Generating Pro PDF...", variant: "loading", persist: true });

    try {
      const html2pdf = html2pdfModule || (await import("html2pdf.js")).default;
      const contextData = buildWordContext();

      // Render a hidden container for the PDF generator
      const container = document.createElement("div");
      container.id = "pdf-render-vault";
      container.style.cssText = "position:absolute; left:-9999px; top:0; width:210mm;";
      document.body.appendChild(container);

      const root = createRoot(container);

      // Wait for rendering and image loading
      await new Promise((resolve) => {
        root.render(
          <AdroitQuotation
            data={contextData}
            ref={(el) => { if (el) setTimeout(resolve, 2000); }}
          />
        );
      });

      // Ensure all images are loaded
      const element = container.querySelector("#quotation-template-container");
      if (element) {
        const images = element.querySelectorAll('img');
        await Promise.all(
          Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve; // Continue even if image fails
            });
          })
        );
      }

      const opt = {
        margin: 0,
        filename: `Quotation_${contextData.quotation_ref || 'Draft'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      toast.dismiss(loadingToast);
      toast.push({ title: "Success", description: "PDF ready!", variant: "success" });

      // Cleanup
      root.unmount();
      document.body.removeChild(container);
    } catch (err) {
      console.error("PDF Export Crash:", err);
      toast.dismiss(loadingToast);
      toast.push({ title: "Error", description: "PDF generation failed: " + err.message, variant: "error" });
    }
  }



  async function generateKioskQR(setQrUrlState) {
    const loadingToast = toast.push({ title: "Processing...", variant: "loading", persist: true });

    try {
      const data = buildWordContext();

      // CRITICAL FIX: Explicitly ensure customer data is attached from current State
      // because sometimes 'buildWordContext' might use stale data or map keys differently.
      const robustData = {
        ...data,
        customer: {
          ...data.customer,
          company: customer.company || data.customer.company_name || "",
          city: customer.city || ""
        }
      };

      const html2pdf = html2pdfModule || (await import("html2pdf.js")).default;

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-10000px";
      container.style.top = "0";
      document.body.appendChild(container);

      const root = createRoot(container);

      await new Promise(resolve => {
        root.render(
          <KioskFlyer
            data={robustData} // Use the robust data
            ref={(el) => {
              if (!el) return;
              const imgs = el.querySelectorAll('img');
              if (imgs.length === 0) resolve();
              let loaded = 0;
              const check = () => { if (++loaded >= imgs.length) resolve(); };
              imgs.forEach(i => {
                if (i.complete) check();
                else { i.onload = check; i.onerror = check; }
              });
            }}
          />
        );
      });

      const element = container.querySelector("#kiosk-flyer-root");
      const pdfBlob = await html2pdf().from(element).set({
        margin: 0,
        filename: 'flyer.pdf',
        image: { type: 'jpeg', quality: 0.92 },
        html2canvas: { scale: 1.8, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        pagebreak: { mode: 'avoid-all' }
      }).outputPdf('blob');

      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          // Build the full restorable payload
          const payload = {
            schema: "adroit_quotation_v1",
            generated_at: new Date().toISOString(),
            ...robustData,
            _restore: {
              schema: "adroit_v2",
              machineType,
              customer,
              selected: selected,
              selectedAddons: selectedAddons,
              markup_percent: markup,
              discount_percent: discount,
              machineModelIndex,
              selectedMachineModelLabel,
              customMode,
              customOutput,
              customLayflat,
              customRollerWidth,
              scopeOverrides,
              conversionRate,
              quoteTemplate,
              showPricingFields,
              showMarkupField,
              showDiscountField,
              showAddonPricing,
              showPrices,
              presetBasePrice,
              quotationDate: quotationDate || new Date().toLocaleDateString("en-IN")
            }
          };

          const res = await fetch('/api/save-kiosk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfBase64: base64data, fullContextData: payload })
          });

          const data = await res.json();

          // Construct the Landing Page URL
          const pdfUrl = data.url;
          let origin = window.location.origin;

          // LOGIC:
          // 1. If we are on Vercel (Cloud Mode), we MUST use window.location.origin 
          //    because that is where the /proposal page is hosted. 
          //    The pdfUrl origin (vercel-storage.com) does NOT host pages.
          // 2. If we are in Local Mode (Offline WiFi), the pdfUrl origin is the laptop's IP.
          //    In this case, window.location.origin might be "localhost", so we 
          //    prefer the IP from pdfUrl so phones can connect.

          const isVercelBlob = pdfUrl.includes("vercel-storage.com");

          if (!isVercelBlob) {
            try {
              const urlObj = new URL(pdfUrl);
              // Only use PDF origin if it's an IP address or not localhost
              if (urlObj.hostname !== "localhost") {
                origin = urlObj.origin;
              }
            } catch (e) {
              console.error("URL parsing failed", e);
            }
          }

          const landingPageUrl = origin + "/proposal?pdf=" + encodeURIComponent(pdfUrl) + "&name=" + encodeURIComponent(robustData.customer.company || "Visitor");

          setQrUrlState(landingPageUrl);
          toast.dismiss(loadingToast);

        } catch (e) { console.error(e); }
        finally {
          setTimeout(() => {
            root.unmount();
            if (document.body.contains(container)) document.body.removeChild(container);
          }, 100);
        }
      };

    } catch (err) {
      console.error("Error", err);
      toast.dismiss(loadingToast);
    }
  }

  // ---------------- IMPORT JSON ----------------

  async function saveLeadWithBase64Pdf(base64data) {
    try {
      const data = buildWordContext();
      const robustData = {
        ...data,
        customer: {
          ...data.customer,
          company: customer.company || data.customer.company_name || "",
          city: customer.city || ""
        }
      };
      const payload = {
        schema: "adroit_quotation_v1",
        generated_at: new Date().toISOString(),
        ...robustData,
        _restore: {
          schema: "adroit_v2",
          machineType,
          customer,
          selected: selected,
          selectedAddons: selectedAddons,
          markup_percent: markup,
          discount_percent: discount,
          machineModelIndex,
          selectedMachineModelLabel,
          customMode,
          customOutput,
          customLayflat,
          customRollerWidth,
          scopeOverrides,
          conversionRate,
          quoteTemplate,
          showPricingFields,
          showMarkupField,
          showDiscountField,
          showAddonPricing,
          showPrices,
          presetBasePrice,
          quotationDate: quotationDate || new Date().toLocaleDateString("en-IN")
        }
      };

      const res = await fetch('/api/save-kiosk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfBase64: base64data, fullContextData: payload })
      });
      return await res.json();
    } catch (err) {
      console.error("saveLeadWithBase64Pdf error:", err);
    }
  }

  // NEW: Automatically load from URL parameter if present
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const loadUrl = params.get('loadUrl');
    if (loadUrl) {
      const fetchAndApply = async () => {
        const loadingToast = toast.push({ title: "Loading configuration...", variant: "loading", persist: true });
        try {
          const res = await fetch(loadUrl);
          const text = await res.text();
          const file = new File([text], "CRM_Quote.json", { type: "application/json" });
          const fakeEvent = { target: { files: [file], value: "" } };
          await importJsonFile(fakeEvent);
          toast.dismiss(loadingToast);
        } catch (e) {
          console.error("Failed to load from URL", e);
          toast.dismiss(loadingToast);
          toast.push({ title: "Error", description: "Failed to load Quote from CRM", variant: "error" });
        }
      };
      fetchAndApply();
      // Clear URL parameter so it doesn't trigger again on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // -------------------------------------------------------------
  // 5. Upload to API



  async function importJsonFile(event) {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const text = await file.text();
      const data = JSON.parse(text);

      // Helper: map "family" string to our internal machineType key
      const toMachineTypeKey = (family) => {
        if (!family) return null;
        const f = String(family).toLowerCase();
        if (f === "material-handling" || f.includes("material") || f.includes("mixer") || f.includes("hopper")) return "material-handling";
        if (f.includes("unoflex") || f.includes("mono")) return "mono";
        if (f.includes("duoflex") || f.includes("aba") || f.includes("a/b")) return "aba";
        if (f.includes("innoflex 3")) return "3layer";
        if (f.includes("innoflex 5")) return "5layer";
        if (f === "mono" || f === "aba" || f === "3layer" || f === "5layer") return f;
        return null;
      };

      // Helper: resolve a base component from our master COMPONENTS_DATA
      const resolveBaseComponent = (category, nameOrId) => {
        if (!nameOrId) return null;
        const target = String(nameOrId).trim();
        // Try within declared category first
        if (COMPONENTS_DATA[category]) {
          const list = COMPONENTS_DATA[category];
          const byId = list.find((c) => c.id === target);
          if (byId) return { base: byId, category };
          const byName = list.find((c) => c.name === target);
          if (byName) return { base: byName, category };
        }
        // Fallback: search all categories by name
        for (const [cat, list] of Object.entries(COMPONENTS_DATA)) {
          const byName = list.find((c) => c.name === target);
          if (byName) return { base: byName, category: cat };
        }
        return null;
      };

      // Helper: resolve base add-on from ADDONS_DATA
      const resolveBaseAddon = (category, nameOrId) => {
        if (!nameOrId) return null;
        const target = String(nameOrId).trim();
        if (ADDONS_DATA[category]) {
          const list = ADDONS_DATA[category];
          const byId = list.find((a) => a.id === target);
          if (byId) return { base: byId, category };
          const byName = list.find((a) => a.name === target);
          if (byName) return { base: byName, category };
        }
        for (const [cat, list] of Object.entries(ADDONS_DATA)) {
          const byName = list.find((a) => a.name === target);
          if (byName) return { base: byName, category: cat };
        }
        return null;
      };

      // ------------------------------------------------------------------
      // RESTORE FORMAT — _restore block present (from downloadJson button)
      // This is a perfect round-trip: contains all raw state.
      // ------------------------------------------------------------------
      if (data && data._restore && data._restore.schema === "adroit_v2") {
        const r = data._restore;
        const c = data.customer || {};
        const q = data.quotation || {};

        // 1) Rebuild customer — prioritized order: _restore.customer > top-level data.customer
        const rebuiltCustomer = {
          ...(data.customer || {}),
          ...(r.customer || {}),
          // Handle both old and new quotation Ref naming
          quotationRef: r.quotationRef || q.refNo || r.customer?.quotationRef || data.customer?.quotationRef || "",
          unlocked: true,
          isImported: true,
        };

        // 2) Machine type
        if (r.machineType) {
          setMachineTypeState(r.machineType);
        }

        // 3) Rebuild selected components — try to merge with master data for full techDesc/images
        const newSelected = (r.selected || []).map(syncComponentWithBase);
        const newAddons = (r.selectedAddons || []).map(syncAddonWithBase);

        // 5) Apply all state
        setCustomer(rebuiltCustomer);
        setSelected(newSelected);
        setSelectedAddons(newAddons);

        if (typeof r.markup_percent === "number") setMarkup(r.markup_percent);
        if (typeof r.discount_percent === "number") setDiscount(r.discount_percent);
        if (typeof r.machineModelIndex === "number") setMachineModelIndex(r.machineModelIndex);
        if (r.selectedMachineModelLabel) setSelectedMachineModelLabel(r.selectedMachineModelLabel);
        if (typeof r.customMode === "boolean") setCustomMode(r.customMode);
        if (typeof r.customOutput === "string") setCustomOutput(r.customOutput);
        if (typeof r.customLayflat === "string") setCustomLayflat(r.customLayflat);
        if (r.scopeOverrides && typeof r.scopeOverrides === "object") {
          setScopeOverrides(r.scopeOverrides);
        }
        if (r.quoteTemplate) setQuoteTemplate(r.quoteTemplate);
        if (typeof r.showPricingFields === "boolean") setShowPricingFields(r.showPricingFields);
        if (typeof r.customRollerWidth === "string") setCustomRollerWidth(r.customRollerWidth);
        if (typeof r.presetBasePrice === "number") setPresetBasePrice(r.presetBasePrice);

        // Export Conversion Fields
        if (typeof r.conversionRate === "number") setConversionRate(r.conversionRate);
        if (typeof r.showMarkupField === "boolean") setShowMarkupField(r.showMarkupField);
        if (typeof r.showDiscountField === "boolean") setShowDiscountField(r.showDiscountField);
        if (typeof r.showAddonPricing === "boolean") setShowAddonPricing(r.showAddonPricing);
        if (typeof r.showPrices === "boolean") setShowPrices(r.showPrices);
        if (typeof r.showPricingFields === "boolean") setShowPricingFields(r.showPricingFields);

        // Smart Date Tracking: Load the date from JSON
        if (r.quotationDate) setQuotationDate(r.quotationDate);

        // Reset the "Import Snapshot" so that any subsequent changes trigger a date update
        lastImportedSnapshotRef.current = null;

        toast.push({
          title: "Configuration imported ✓",
          description: `${file.name} — all fields restored`,
          variant: "success",
        });
        return;
      }

      // ------------------------------------------------------------------
      // NEW FORMAT (from buildWordContext / template JSON)
      // ------------------------------------------------------------------
      if (data && data.customer && data.machine && data.pricing) {
        const c = data.customer || {};
        const m = data.machine || {};
        const perf = data.indicative_performance || {};
        const q = data.quotation || {};

        // 1) Customer object in our internal shape
        const rebuiltCustomer = {
          company: c.company_name || c.company || "",
          name: c.contact_name || c.name || "",
          address: c.address || "",
          city: c.city || "",
          state: c.state || "",
          country: c.country || "",
          phone: c.phone || "",
          email: c.email || "",
          gst: c.gst || "",

          machineFamily: m.family || c.machine_family || "",
          machineModel: m.model || m.model_label || c.machine_model_label || "",
          machineModelCode: m.modelCode || m.model_code || c.machine_model_code || "",
          machineWidth: m.width_mm || c.machine_width || "",
          machineThickness: m.thickness_range || c.machine_thickness || "",
          outputCapacity: m.output_capacity_kgph || c.output_capacity || "",
          screwSizes: m.screw_sizes || c.screw_sizes || "",
          customMachine:
            typeof m.custom_machine === "boolean"
              ? m.custom_machine
              : !!c.custom_machine,

          productToMake: perf.product || "",
          maxPump: perf.max_pumping_capacity || "",
          maxOutput: perf.max_output || "",

          quotationRef: q.ref_no || c.quotationRef || c.ref || "",
          ref: q.ref_no || c.quotationRef || c.ref || "",
          isImported: true,
        };

        // 2) Machine type (mono / aba / 3layer / 5layer)
        const mType =
          toMachineTypeKey(m.family) ||
          toMachineTypeKey(c.machine_family) ||
          null;

        if (mType) {
          // use low-level setter so we DON'T auto-clear selections here
          setMachineTypeState(mType);
        }

        // 3) Rebuild selected base components
        const newSelected = [];
        if (Array.isArray(data.components)) {
          data.components.forEach((row) => {
            const cat = row.category || "Scope of Supply";
            const qty = row.qty || row.quantity || 1;
            const name = row.name;

            const resolved =
              resolveBaseComponent(cat, row.id) ||
              resolveBaseComponent(cat, name);

            if (resolved) {
              const { base, category } = resolved;
              newSelected.push({
                ...base,
                category,
                qty,
              });
            } else {
              // fallback: keep whatever is in JSON
              newSelected.push({
                id: row.id || `${cat}_${name}`,
                name,
                category: cat,
                qty,
                price: row.price ?? 0,
                shortDesc: row.tech_desc || "",
                desc: row.tech_desc || "",
                image: row.image || null,
              });
            }
          });
        }

        // 4) Rebuild selected add-ons
        const newAddons = [];
        if (Array.isArray(data.optional_items)) {
          data.optional_items.forEach((row) => {
            const cat = row.category || "Optional Items";
            const qty = row.qty || row.quantity || 1;
            const name = row.name;

            const resolved =
              resolveBaseAddon(cat, row.id) ||
              resolveBaseAddon(cat, name);

            if (resolved) {
              const { base, category } = resolved;
              newAddons.push({
                ...base,
                category,
                qty,
              });
            } else {
              newAddons.push({
                id: row.id || `${cat}_${name}`,
                name,
                category: cat,
                qty,
                price: row.price ?? row.price_number ?? 0,
                shortDesc: row.desc || "",
                desc: row.desc || "",
              });
            }
          });
        }

        // 5) Pricing – restore markup & discount
        if (data.pricing) {
          const p = data.pricing;
          if (typeof p.markup_percent === "number") {
            setMarkup(p.markup_percent);
          } else if (typeof p.markup === "number") {
            setMarkup(p.markup);
          }
          if (typeof p.discount_percent === "number") {
            setDiscount(p.discount_percent);
          } else if (typeof p.discount === "number") {
            setDiscount(p.discount);
          }
        }

        // 6) Apply state (this overwrites existing config)
        rebuiltCustomer.unlocked = true;
        setCustomer(rebuiltCustomer);
        setSelected(newSelected);
        setSelectedAddons(newAddons);

        // These are model-related UI helpers – best guess from machine section
        const label = rebuiltCustomer.machineModel || m.model_label || "";
        if (label) {
          setSelectedMachineModelLabel(label);
          setCustomMode(!label); // if we have a label, assume not custom
        }

        toast.push({
          title: "Configuration imported",
          description: file.name,
          variant: "success",
        });

        return;
      }

      // ------------------------------------------------------------------
      // OLD FORMAT (flat: customer, machineType, selected, selectedAddons…)
      // ------------------------------------------------------------------
      if (
        data.customer ||
        typeof data.machineType === "string" ||
        Array.isArray(data.selected) ||
        Array.isArray(data.selectedAddons)
      ) {
        if (data.customer) {
          setCustomer({ ...data.customer, unlocked: true });
        }

        if (typeof data.machineType === "string") {
          // use our reset helper here (keeps old behavior for old JSON)
          setMachineTypeAndReset(data.machineType);
        }

        if (Array.isArray(data.selected)) {
          setSelected(data.selected);
        } else {
          setSelected([]);
        }

        if (Array.isArray(data.selectedAddons)) {
          setSelectedAddons(data.selectedAddons);
        } else {
          setSelectedAddons([]);
        }

        if (typeof data.discount === "number") setDiscount(data.discount);
        if (typeof data.markup === "number") setMarkup(data.markup);

        toast.push({
          title: "Old JSON imported",
          description: file.name,
          variant: "success",
        });

        return;
      }

      // ------------------------------------------------------------------
      // Unknown format
      // ------------------------------------------------------------------
      toast.push({
        title: "Import failed",
        description: "JSON structure not recognised",
        variant: "error",
      });
    } catch (e) {
      console.error("Import JSON failed:", e);
      toast.push({
        title: "Import failed",
        description: "Could not parse JSON file",
        variant: "error",
      });
    } finally {
      // reset input value so same file can be selected again if needed
      if (event?.target) {
        event.target.value = "";
      }
    }
  }

  // ---------------- RESET ----------------
  // ---------------- EXPORT: PROFESSIONAL HTML-TO-PDF (Crash-Proof Version) ----------------
  // import html2pdf dynamic import inside function...

  // --- Inside exportProPdf() ---
  async function exportProPdf() {
    console.log("PDF: Starting...");
    const loadingToast = toast.push({ title: "Generating PDF...", variant: "loading", persist: true });

    try {
      const html2pdf = html2pdfModule || (await import("html2pdf.js")).default;
      const contextData = buildWordContext();

      const container = document.createElement("div");
      container.id = "pdf-root";
      container.style.position = "absolute";
      container.style.left = "-5000px";
      container.style.top = "0px";
      document.body.appendChild(container);

      const root = createRoot(container);

      // 1. Render and wait for images (Max 3 seconds)
      await new Promise((resolve) => {
        let isResolved = false;

        // Timeout A: Stop waiting for images after 3s
        const maxWait = setTimeout(() => {
          if (!isResolved) {
            console.warn("PDF: Image wait timed out. Rendering anyway.");
            isResolved = true;
            resolve();
          }
        }, 3000);

        root.render(
          <AdroitQuotation
            data={contextData}
            ref={(element) => {
              if (!element || isResolved) return;

              const images = Array.from(element.querySelectorAll("img"));
              if (images.length === 0) {
                isResolved = true;
                clearTimeout(maxWait);
                resolve();
                return;
              }

              let loaded = 0;
              const check = () => {
                loaded++;
                if (loaded >= images.length && !isResolved) {
                  isResolved = true;
                  clearTimeout(maxWait);
                  resolve();
                }
              };

              images.forEach(img => {
                if (img.complete) check();
                else {
                  img.onload = check;
                  img.onerror = check; // proceed even on 404
                }
              });
            }}
          />
        );
      });

      const element = container.querySelector("#quotation-template-container");
      if (!element) throw new Error("Template Element not found");

      // 2. Generate PDF with LIGHTER settings (Scale 1 = 10x faster)
      // 2. Generate PDF with PROFESSIONAL settings
      const opt = {
        margin: [0, 0, 0, 0], // Explicit zero margins
        filename: `${contextData.quotation_ref}_Quotation.pdf`,
        image: { type: 'jpeg', quality: 0.98 }, // Higher quality JPEG
        html2canvas: {
          scale: 2,  // Higher scale for sharp images (2 = 2x resolution)
          useCORS: true,
          logging: false, // Disable logging for production
          letterRendering: true, // Better text rendering
          scrollY: 0, // Prevent scroll offset issues
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // Better page break handling
      };

      console.log("PDF: Saving...");
      await html2pdf().set(opt).from(element).save();
      console.log("PDF: Done.");

      // 3. Cleanup
      toast.dismiss(loadingToast);
      toast.push({ title: "Success", description: "Quotation PDF downloaded", variant: "success" });

      setTimeout(() => {
        root.unmount();
        if (document.body.contains(container)) document.body.removeChild(container);
      }, 500);

    } catch (err) {
      console.error("PDF Crash:", err);
      toast.dismiss(loadingToast);
      toast.push({ title: "Export Error", description: err.message, variant: "error" });
    }
  }


  function resetAll() {
    // 1. Clear saved state
    localStorage.removeItem(STORAGE_KEY);

    // 2. Generate NEXT Reference Number
    const nextRef = generateNextQuotationRef();
    console.log("RESETTING - NEW REF:", nextRef); // Debug log

    // 3. Set Fresh State (With Ref pre-filled)
    setCustomer({
      name: "",
      company: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      gst: "",
      quotationRef: nextRef, // IMPORTANT
      ref: nextRef,          // Backup key for legacy
      unlocked: false,
      isImported: false
    });

    // 4. Reset Config
    setSelected([]);
    setSelectedAddons([]);
    setMachineTypeState(null);
    setMachineModelIndex(null);
    setSelectedMachineModelLabel("");
    setCustomMode(false);
    setDiscount(0);
    setMarkup(0);
    setQuoteTemplate(process.env.NODE_ENV === "development" ? "v2" : "classic");
    setShowPricingFields(false);
    setCustomOutput("");
    setCustomLayflat("");
    setConversionRate(94);

    toast.push({
      title: "New Quotation Started",
      description: `Ref Generated: ${nextRef}`,
      variant: "success",
    });
  }

  // ---------------- VALUE ----------------

  const value = {
    COMPANY,
    // raw data
    components,
    addons,

    // filtered lists for UI
    filteredComponents,
    filteredAddons,

    // customer + pricing
    customer,
    setCustomer,
    discount,
    setDiscount,
    markup,
    setMarkup,
    customOutput,
    setCustomOutput,
    customLayflat,
    setCustomLayflat,
    customRollerWidth,
    setCustomRollerWidth,
    conversionRate,
    setConversionRate,
    computePriceSummary,

    // machine selection
    machineType,
    setMachineType: setMachineTypeAndReset,
    machineModels,
    machineModelIndex,
    setMachineModelIndex,
    currentMachineModel,
    selectedMachineModelLabel,
    setSelectedMachineModelLabel,
    customMode,
    setCustomMode,
    applyModelPreset,
    resetToModelPreset,

    // selected items
    selected: processedSelected,
    rawSelected: selected,
    setSelected,
    selectedAddons,
    setSelectedAddons,
    scopeOverrides,
    setScopeOverrides,
    quoteTemplate,
    setQuoteTemplate,
    showPricingFields,
    setShowPricingFields,
    setPresetBasePrice,

    // component CRUD
    addComponent,
    removeComponent,
    setQty,

    // addon CRUD
    addAddon,
    removeAddon,
    setAddonQty,
    incAddon,
    decAddon,

    // UI
    showPrices,
    setShowPrices,
    showMarkupField,
    setShowMarkupField,
    showDiscountField,
    setShowDiscountField,
    showAddonPricing,
    setShowAddonPricing,
    openModal: setModalItem,
    dirHandleRef,

    // exports / import
    exportJsonOnly,
    exportPdfOnly,
    exportWordOnly,
    exportProPdf,
    importJsonFile,
    resetAll,
    generateKioskQR,
    saveLeadWithBase64Pdf,
    buildWordContext,
    updateAddonPricing,
  };


  return (
    <ConfigContext.Provider value={value}>
      {children}
      {modalItem && (() => {
        const item = modalItem.item || modalItem;

        // Normalise techDesc:
        // - if it's already an array of {label,value}, keep it
        // - if it's an object/map (like in extruders.ts), convert to array
        let techRows = null;

        if (Array.isArray(item.techDesc) && item.techDesc.length > 0) {
          techRows = item.techDesc;
        } else if (
          item.techDesc &&
          typeof item.techDesc === "object" &&
          Object.keys(item.techDesc).length > 0
        ) {
          techRows = Object.entries(item.techDesc).map(([label, value]) => ({
            label,
            value: String(value),
          }));
        }

        return (
          <Modal
            open={!!modalItem}
            onClose={() => setModalItem(null)}
            title={item.name || "Details"}
            widthClass="max-w-4xl"
          >
            <div className="flex flex-col md:flex-row gap-4 bg-white">
              {/* LEFT: big image */}
              <div className="md:w-2/5 w-full">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-auto rounded-lg object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-500">No image</span>
                  )}
                </div>
              </div>

              {/* RIGHT: tech specs */}
              <div className="flex-1">
                {/* short paragraph if present */}
                {(item.desc || item.shortDesc) && (
                  <p className="text-sm mb-3 text-slate-700">
                    {item.desc || item.shortDesc}
                  </p>
                )}

                {techRows ? (
                  <div className="max-h-72 overflow-auto border border-slate-200 rounded-xl p-3 bg-white">
                    <table className="w-full text-xs border-separate border-spacing-y-1">
                      <tbody>
                        {techRows.map((row, idx) => (
                          <tr key={idx}>
                            <td className="whitespace-nowrap pr-3 text-slate-500 align-top font-medium">
                              {row.label}
                            </td>
                            <td className="text-slate-900 align-top">
                              {row.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    No detailed technical data attached yet.
                    (Add a <code>techDesc</code> array to this component.)
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      addComponent(modalItem.category, item);
                      setModalItem(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-dark text-white text-sm font-medium shadow-sm"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setModalItem(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        );
      })()}
    </ConfigContext.Provider>
  );
}

// Small helper hook if you like to use it
export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used inside ConfigProvider");
  return ctx;
}
