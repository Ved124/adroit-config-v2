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
import { BUBBLE_CAGE_COMPONENTS } from "../src/data/bubbleCages";
import { HAULOFF_COMPONENTS } from "../src/data/hauloffs";
import { WINDER_COMPONENTS } from "../src/data/winders";
import { AIR_RING_COMPONENTS } from "../src/data/airRing";
import { IBC_COMPONENTS } from "../src/data/ibc";
import { COLLAPSING_FRAME_COMPONENTS } from "../src/data/collapsingFrame";
import { CORONA_TREATER_COMPONENTS } from "../src/data/corona";
import { TRIM_ADDONS } from "../src/data/trim";
import { MATERIAL_HANDLING_ADDONS } from "../src/data/materialHandling";
import { GAUGE_ADDONS } from "./data/gauge";
import { WEB_GUIDE_ADDONS } from "./data/webGuide";
import { CHILLER_ADDONS } from "./data/chiller";
import { HYDRAULIC_UNLOADER_ADDONS } from "./data/hydraulicUnloader";
import { MDO_ADDONS } from "./data/mdo";
import { ELECTRICAL_ADDONS } from "./data/electricalPanel";
import { TOWER_COMPONENTS } from "../src/data/tower";

import { MODEL_PRESETS } from "./data/modelPresets";

import { Modal } from "../components/ui/Modal"; // ← keep your existing Modal
import { useToast } from "../components/ui/Toast"; // ← same hook you already use
import { numberToWords } from "../utils/numberToWords"; // ← your existing helper

// import html2pdf from "html2pdf.js";
import { createRoot } from "react-dom/client";
import { AdroitQuotation } from "./components/quotation/AdroitQuotation";
import { KioskFlyer } from "./components/quotation/KioskFlyer";
import { generateNextQuotationRef } from './utils/quotationGenerator';

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
  "Haul-Off": HAULOFF_COMPONENTS,
  "Bubble Cage": BUBBLE_CAGE_COMPONENTS,
  "Tower / Platform": TOWER_COMPONENTS,
  Winder: WINDER_COMPONENTS,
};

export const ADDONS_DATA = {

  "Corona Treater": CORONA_TREATER_COMPONENTS,
  "Trim Handling": TRIM_ADDONS,
  "Material Handling": MATERIAL_HANDLING_ADDONS,
  "Gauge / Thickness Control": GAUGE_ADDONS,
  "Web Guide": WEB_GUIDE_ADDONS,
  "Cooling System": CHILLER_ADDONS,
  "Hydraulic Unloader": HYDRAULIC_UNLOADER_ADDONS,
  "MDO Unit": MDO_ADDONS,
  "Electrical & Control Panel": ELECTRICAL_ADDONS,

};


// ---------------------------------------------------------------------------
// PROVIDER
// ---------------------------------------------------------------------------

export function ConfigProvider({ children }) {
  const toast = useToast();

  const [customer, setCustomer] = useState({
    quotationRef: "Loading..." // Temporary initial state
  });
  const [machineType, setMachineTypeState] = useState("mono"); // "mono" | "aba" | "3layer" | "5layer"
  const [selected, setSelected] = useState([]);               // base components
  const [selectedAddons, setSelectedAddons] = useState([]);   // optional add-ons
  const [discount, setDiscount] = useState(0);
  const [markup, setMarkup] = useState(0);
  const [showMarkupField, setShowMarkupField] = useState(false);
  const [showDiscountField, setShowDiscountField] = useState(false);
  const [customOutput, setCustomOutput] = useState("");
  const [customLayflat, setCustomLayflat] = useState("");

  const [components] = useState(COMPONENTS_DATA);
  const [addons] = useState(ADDONS_DATA);

  const [modalItem, setModalItem] = useState(null);
  const [showPrices, setShowPrices] = useState(false);

  // which row in the CSV list is selected
  const [machineModelIndex, setMachineModelIndex] = useState(null);

  // human-readable label like "AE-1350 (50/50/50)"
  const [selectedMachineModelLabel, setSelectedMachineModelLabel] = useState("");

  // true = “Customise yourself” (show all components for that family)
  const [customMode, setCustomMode] = useState(false);

  const duplicateToastRef = useRef({});
  const dirHandleRef = useRef(null); // kept for future folder import if you use it

  // ---------- MACHINE MODELS PER FAMILY (from your TS/json) ----------
  const machineModels = useMemo(() => {
    switch (machineType) {
      case "mono":
        return MONO_MODELS || [];
      case "aba":
        return ABA_MODELS || [];
      case "3layer":
        return THREE_LAYER_MODELS || [];
      case "5layer":
        // when you have 5-layer data, plug it here
        return [];
      default:
        return [];
    }
  }, [machineType]);

  const currentMachineModel =
    machineModelIndex != null && machineModels[machineModelIndex]
      ? machineModels[machineModelIndex]
      : null;


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
      // 1. Existing data found? Use it.
      setCustomer(savedData.customer);
      if (typeof savedData.machineType === "string") setMachineTypeState(savedData.machineType);
      else setMachineTypeState("mono");
      if (Array.isArray(savedData.selected)) setSelected(savedData.selected);
      if (Array.isArray(savedData.selectedAddons)) setSelectedAddons(savedData.selectedAddons);
      if (typeof savedData.discount === "number") setDiscount(savedData.discount);
      if (typeof savedData.markup === "number") setMarkup(savedData.markup);
      if (typeof savedData.machineModelIndex === "number") {
        setMachineModelIndex(savedData.machineModelIndex);
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
    } else {
      // 2. New Session? GENERATE A NEW NUMBER
      const newRef = generateNextQuotationRef();
      console.log("INITIAL ID GENERATED:", newRef);
      setCustomer((prev) => ({
        ...prev,
        ...savedData?.customer, // keep partial details if any
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
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.warn("Failed to save storage:", e);
      }
    }
  }, [customer, machineType, selected, selectedAddons, machineModelIndex, discount, markup, selectedMachineModelLabel, customMode, customOutput, customLayflat]);


  // ---------------- MACHINE TYPE ----------------

  function setMachineTypeAndReset(type) {
    setMachineTypeState(type);
    setSelected([]);
    setSelectedAddons([]);
    setSelectedMachineModelLabel(""); // reset model
    setCustomMode(false);             // default = not custom
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

    // 2) Build selected base components
    preset.components.forEach(({ category, id, qty }) => {
      const list = components[category] || [];
      const base = list.find((c) => c.id === id);
      if (!base) {
        console.warn("Component not found for preset:", category, id);
        return;
      }
      nextSelected.push({ ...base, category, qty: qty ?? 1 });
    });

    // 3) Build selected add-ons
    (preset.addons || []).forEach(({ category, id, qty }) => {
      const list = addons[category] || [];
      const base = list.find((a) => a.id === id);
      if (!base) {
        console.warn("Add-on not found for preset:", category, id);
        return;
      }
      nextAddons.push({ ...base, category, qty: qty ?? 1 });
    });

    // 4) Apply into state
    setSelected(nextSelected);
    setSelectedAddons(nextAddons);
    setCustomMode(false);
    setSelectedMachineModelLabel(modelLabel);

    // also store some basic info on customer (nice for summary/Word)
    setCustomer((prev) => ({
      ...prev,
      customMachine: false,
      machineFamily:
        preset.machineType === "mono"
          ? "Unoflex Monolayer"
          : preset.machineType === "aba"
            ? "Duoflex ABA / AB"
            : preset.machineType === "3layer"
              ? "Innoflex 3 Layer"
              : "Innoflex 5 Layer",
      machineModel: modelLabel,
      machineModelCode: modelLabel, // if you want code separately, adjust here
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


  function addComponent(category, item) {
    setSelected((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
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
      toast.push({
        title: "Added",
        description: item.name,
        variant: "success",
        durationMs: 700,
      });
      return [...prev, { ...item, category, qty: 1 }];
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
      return prev.filter((p) => p.id !== id);
    });
  }

  function setQty(id, qty) {
    if (qty < 1) return;
    setSelected((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  }

  // ---------------- ADD-ON CRUD ----------------

  function addAddon(category, item) {
    setSelectedAddons((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
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
      toast.push({
        title: "Added",
        description: item.name,
        variant: "success",
        durationMs: 700,
      });
      return [...prev, { ...item, category, qty: 1 }];
    });
  }

  function removeAddon(id) {
    setSelectedAddons((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) {
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

        // 2) fixed model mode → filter by usedInModels, but match flexibly
        if (!customMode && modelLabel) {
          if (Array.isArray(comp.usedInModels) && comp.usedInModels.length > 0) {
            const labelNorm = modelLabel.toUpperCase().trim();

            const matches = comp.usedInModels.some((tag) => {
              const t = String(tag).toUpperCase().trim();
              // exact match or label starts with code (e.g. "AE-1125 (40/40/40)")
              return labelNorm === t || labelNorm.startsWith(t + " ");
            });

            if (!matches) return false;
          }
        }

        // 3) otherwise allowed
        return true;
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

    return out;
  }, [addons, machineType, selectedAddons]);


  // ---------------- MACHINE MODEL DETAILS (from CSV/TS) ----------------

  function getMachineDetails(safeCustomer, mType) {
    const selectedCode =
      safeCustomer.machineModelCode || safeCustomer.machineModel;

    let models = [];
    if (mType === "mono") models = MONO_MODELS;
    else if (mType === "aba") models = ABA_MODELS;
    else if (mType === "3layer") models = THREE_LAYER_MODELS;

    let model =
      models.find((m) => m.code === selectedCode) ||
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
    const basicTotal = selected.reduce(
      (sum, item) => sum + (item.price || 0) * (item.qty || 1),
      0
    );

    // 2. Calculate Optional Addons Total
    const addonsTotal = selectedAddons.reduce(
      (sum, item) => sum + (item.price || 0) * (item.qty || 1),
      0
    );

    // 3. Margin & Discount Logic (Apply ONLY to Basic Scope as requested)
    const beforeMargin = basicTotal;

    const withMarkup =
      markup && markup > 0
        ? beforeMargin * (1 + markup / 100)
        : beforeMargin;

    const afterDiscount =
      discount && discount > 0
        ? withMarkup * (1 - discount / 100)
        : withMarkup;

    return {
      basicTotal,
      addonsTotal, // Kept separate
      beforeMargin,
      withMarkup,
      afterDiscount, // This is now your Final Price (Main Scope Only)
    };
  }, [selected, selectedAddons, markup, discount]);

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
    const safeCustomer = customer || {};

    // --- QUOTATION META (REF + DATE) ---
    const today = new Date();
    const quotationDate = today.toLocaleDateString("en-IN");
    const quotationRef =
      safeCustomer.ref || safeCustomer.quotationRef || generateQuotationRef();

    // --- PRICE CALC ---
    const basicTotal =
      (selected || []).reduce(
        (sum, item) => sum + (item.price || 0) * (item.qty || 1),
        0
      ) +
      (selectedAddons || []).reduce(
        (sum, item) => sum + (item.price || 0) * (item.qty || 1),
        0
      );

    const markupPercent = typeof markup === "number" ? markup : 0;
    const discountPercent = typeof discount === "number" ? discount : 0;

    const priceWithMarkup = basicTotal + (basicTotal * markupPercent) / 100;
    const finalTotal =
      priceWithMarkup - (priceWithMarkup * discountPercent) / 100;
    const finalRounded = Math.round(finalTotal || 0);

    // --- MACHINE DETAILS (for front page + spec table) ---
    const machineDetails = getMachineDetails(safeCustomer, machineType) || {};
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    return {
      company: COMPANY,

      // Customer block (for header & address)
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

      // Quotation meta – this maps directly to your proposal header
      quotation: {
        ref_no: quotationRef,
        date: quotationDate,
        subject:
          safeCustomer.subject ||
          "Proposal for Blown Film Extrusion Line",
      },

      // Convenience aliases (easy to bind in Word template if needed)
      quotation_ref: quotationRef,
      quotation_date: quotationDate,

      // Short machine summary used on page 1
      machine: {
        model:
          machineDetails.label ||
          safeCustomer.machineModel ||
          "BLOWN FILM LINE",
        family: safeCustomer.machineFamily || machineType || "",
        width_mm: machineDetails.widthMm || safeCustomer.machineWidth || "",
        screw_sizes: machineDetails.extruder || safeCustomer.screwSizes || "",
        output_capacity_kgph:
          machineDetails.outputKgHr || safeCustomer.outputCapacity || "",
      },

      // Full technical details from model arrays
      machine_details: machineDetails,

      // single big machine image on front page
      machine_image: machineDetails.machineImagePath ? `${baseUrl}/${machineDetails.machineImagePath.replace(/^\//, "")}` : null,

      // Scope of supply – base components
      components: (selected || []).map((item, idx) => ({
        item_no: idx + 1,
        name: item.name,
        category: item.category || "",
        tech_desc: item.techDesc || item.desc || "",
        image: item.image ? `${baseUrl}/${item.image.replace(/^\//, "")}` : null,
        qty: item.qty || 1,
        unit_price: item.price || 0,
      })),

      // Optional equipment
      optional_items: (selectedAddons || []).map((a, idx) => ({
        item_no: idx + 1,
        name: a.name,
        category: a.category || "",
        tech_desc: a.techDesc || a.desc || "",
        image: a.image ? `${baseUrl}/${a.image.replace(/^\//, "")}` : null,
        qty: a.qty || 1,
        unit_price: a.price || 0,
      })),

      // Pricing block – directly matches what you show in Summary
      pricing: {
        basic_total_number: basicTotal,
        markup_percent: markupPercent,
        discount_percent: discountPercent,
        basic_price_text: `INR ${Math.round(
          priceWithMarkup || 0
        ).toLocaleString("en-IN")}/-`,
        final_price_number: finalRounded,
        final_price_text: `INR ${finalRounded.toLocaleString("en-IN")}/-`,
        final_price_in_words: finalRounded
          ? `INR ${numberToWords(finalRounded)} only`
          : "INR Zero",
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
  }, [customer, selected, selectedAddons, markup, discount, machineType, customOutput]);

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

      // Optional: add a small schema marker so we know this is "new style"
      const payload = {
        schema: "adroit_quotation_v1",
        generated_at: new Date().toISOString(),
        ...ctx,
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

      function formatCurrency(n) {
        const num = Number(n || 0);
        // Indian style, no decimals
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

      // Price math (same logic used elsewhere)
      const basicTotal = (selected || []).reduce((a, b) => a + (b.price || 0) * (b.qty || 1), 0);
      const addonTotal = (selectedAddons || []).reduce((a, b) => a + (b.price || 0) * (b.qty || 1), 0);
      const subtotal = basicTotal + addonTotal;
      const priceWithMarkup = subtotal + (subtotal * (markup || 0)) / 100;
      const disc = typeof discount === "number" ? discount : 0;
      const finalTotal = priceWithMarkup - (priceWithMarkup * disc) / 100;

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
            <div class="line">Basic Price (EX-Works): ${formatCurrency(priceWithMarkup)}</div>
            <div class="line">Final Price After Discount: ${formatCurrency(finalTotal)}</div>
            <div class="inwords">In Words: ${numberToWords(Math.round(finalTotal))} only</div>
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
      const html2canvas = (await import("html2canvas")).default;
      const { default: jsPDF } = await import("jspdf");

      const safeCustomer = customer || {};
      const safeName = (safeCustomer.name || "customer").replace(/\s+/g, "_");
      const safeCity = (safeCustomer.city || "city").replace(/\s+/g, "_");

      // ---------- helper: currency formatting ----------
      function formatCurrency(n) {
        const num = Number(n || 0);
        // ₹ + grouping (zero fractional digits shown)
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

      // ---------- Totals ----------
      ensureRoom(lineHeight * 4);
      const baseTotal = (selected || []).reduce((acc, it) => acc + (it.price || 0) * (it.qty || 1), 0);
      const addonTotal = (selectedAddons || []).reduce((acc, it) => acc + (it.price || 0) * (it.qty || 1), 0);
      const subtotal = baseTotal + addonTotal;
      const withMarkup = subtotal + (subtotal * (markup || 0)) / 100;
      const disc = typeof discount === "number" ? discount : 0;
      const finalTotal = withMarkup - (withMarkup * disc) / 100;

      pdf.setFontSize(12);
      pdf.setTextColor(220, 38, 38);
      pdf.text(`Basic Price (EX-Works): ${formatCurrency(withMarkup)}`, left, y);
      y += lineHeight;
      pdf.text(`Final Price After Discount: ${formatCurrency(finalTotal)}`, left, y);
      y += lineHeight;
      pdf.setFontSize(10);
      pdf.setTextColor(0);
      pdf.text(`In Words: ${numberToWords(Math.round(finalTotal))}`, left, y);
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
      const html2pdf = (await import("html2pdf.js")).default;
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

      const html2pdf = (await import("html2pdf.js")).default;

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
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: 'avoid-all' }
      }).outputPdf('blob');

      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          const res = await fetch('/api/save-kiosk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfBase64: base64data, fullContextData: robustData })
          });
          const json = await res.json();
          if (json.url) {
            toast.dismiss(loadingToast);
            if (setQrUrlState) setQrUrlState(json.url);
          }
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
          machineModel: m.model_label || c.machine_model_label || "",
          machineModelCode: m.model_code || c.machine_model_code || "",
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
      const html2pdf = (await import("html2pdf.js")).default;
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
      unlocked: false
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
    setCustomOutput("");
    setCustomLayflat("");

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
    selected,
    setSelected,
    selectedAddons,
    setSelectedAddons,

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
    buildWordContext,
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
            <div className="flex flex-col md:flex-row gap-4 bg-black">
              {/* LEFT: big image */}
              <div className="md:w-2/5 w-full">
                <div className="bg-black rounded-xl p-3 flex items-center justify-center">
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
                  <p className="text-sm mb-3 text-white">
                    {item.desc || item.shortDesc}
                  </p>
                )}

                {techRows ? (
                  <div className="max-h-72 overflow-auto border border-slate-200 rounded-xl p-3 bg-black">
                    <table className="w-full text-xs border-separate border-spacing-y-1">
                      <tbody>
                        {techRows.map((row, idx) => (
                          <tr key={idx}>
                            <td className="whitespace-nowrap pr-3 text-white align-top font-medium">
                              {row.label}
                            </td>
                            <td className="text-white align-top">
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
