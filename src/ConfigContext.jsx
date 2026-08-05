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

import {
  ALL_MODELS,
  MONO_MODELS,
  ABA_MODELS,
  THREE_LAYER_MODELS,
  COMPONENTS_DATA,
  ADDONS_DATA,
  applyCatalogOverride,
} from "./data/catalogRegistry";
// The imports below are still used directly by dynamic per-model sizing/pricing
// logic further down in this file (Bubble Cage/Tower/Collapsing Frame/Bimetallic/
// Extruder Addons §4.x blocks) — that logic is unchanged, so these stay as
// direct static imports rather than going through the overridable registry.
import { BUBBLE_CAGE_COMPONENTS } from "./data/bubbleCages";
import { TOWER_COMPONENTS, TOWER_PRICES } from "./data/tower";
import { MAIN_NIP_PRICES } from "./data/mainNip";
import { WINDER_COMPONENTS } from "./data/winders";
import { COLLAPSING_FRAME_COMPONENTS, COLLAPSING_FRAME_PRICES } from "./data/collapsingFrame";
import { EXTRUDER_ADDONS } from "./data/extruderAddons";
import { BIMETALLIC_BASE, BIMETALLIC_PRICES } from "./data/bimetallic";
import { DIE_ADDONS } from "./data/dieAddons";
import { resolveTechDesc, resolveScopeDesc, toTechRows } from "./utils/mergeCatalogItem";
import { EXPORT_PRICE_MARKUP } from "./lib/pricing";

import { Modal } from "../components/ui/Modal"; // ← keep your existing Modal
import { useToast } from "../components/ui/Toast"; // ← same hook you already use
import { numberToWords } from "../utils/numberToWords"; // ← your existing helper

// import html2pdf from "html2pdf.js";
import { useRouter } from "next/router";
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

// 💡 Base components – extend this as you like
// Machine types we use in "supported"
export const MACHINE_TYPE_KEYS = ["mono", "aba", "3layer", "5layer"];

// COMPONENTS_DATA / ADDONS_DATA now live in ./data/catalogRegistry (imported
// above) so the same catalog can be shared with server-side routes and swapped
// for admin-edited data at runtime. Re-exported here for anything that still
// imports them from this module.
export { COMPONENTS_DATA, ADDONS_DATA };


// ---------------------------------------------------------------------------
// PROVIDER
// ---------------------------------------------------------------------------

export function ConfigProvider({ children }) {
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    // Preload heavy client-side libraries to prevent ChunkLoadErrors during hot-reload/dev session
    if (typeof window !== "undefined") {
      if (!html2pdfModule) {
        import("html2pdf.js").then((mod) => {
          html2pdfModule = mod.default;
        }).catch(() => { });
      }
    }
  }, []);

  const [adminDataLoaded, setAdminDataLoaded] = useState(false);



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
  const [presetBaseComponents, setPresetBaseComponents] = useState([]); // ← NEW: tracks base preset components for differential pricing

  // --- Export Conversion States ---
  const [conversionRate, setConversionRate] = useState(94);
  const [quotationDate, setQuotationDate] = useState(null); // null = "Use Today"

  // --- Admin-editable catalog override ---
  // Fetches the live catalog (admin-edited data, if any) from /api/catalog. On
  // success, applyCatalogOverride() reassigns the exported COMPONENTS_DATA/
  // ADDONS_DATA/ALL_MODELS/etc. bindings in ./data/catalogRegistry in place —
  // every read of those bindings anywhere in this file (and in
  // pages/addons.jsx, pages/selection.jsx) picks it up automatically. On any
  // failure (network error, malformed response, blob outage) this is a no-op:
  // whatever catalogRegistry.js already had (static defaults, or a previous
  // successful fetch) keeps being used, so the app never breaks from this.
  //
  // Runs on boot AND on every client-side route change (see the
  // routeChangeComplete effect below). Without the route-change refetch, an
  // admin who edits a model/component/addon and then navigates around the
  // configurator in the *same browser tab* would keep seeing the catalog
  // snapshot from whenever this tab's session first booted, since Next's
  // client-side routing never re-runs this provider's mount effect.
  const [catalogVersion, setCatalogVersion] = useState(0);
  const refreshCatalog = React.useCallback(async () => {
    try {
      const res = await fetch("/api/catalog");
      if (!res.ok) return false;
      const data = await res.json();
      const applied = applyCatalogOverride(data);
      if (applied) setCatalogVersion((v) => v + 1);
      return applied;
    } catch (err) {
      console.error("Catalog fetch failed, continuing with current catalog:", err);
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    refreshCatalog().then((applied) => {
      if (cancelled) return; // no-op, just avoids a warning; refreshCatalog already guards internally
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      refreshCatalog();
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, refreshCatalog]);

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
      showMarkupField, showDiscountField, conversionRate, presetBasePrice, presetBaseComponents
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
    showMarkupField, showDiscountField, conversionRate, presetBasePrice, presetBaseComponents,
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
      if (Array.isArray(savedData.presetBaseComponents)) {
        setPresetBaseComponents(savedData.presetBaseComponents);
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
          presetBaseComponents,
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
  }, [customer, machineType, selected, selectedAddons, machineModelIndex, discount, markup, selectedMachineModelLabel, customMode, customOutput, customLayflat, presetBasePrice, presetBaseComponents, conversionRate, scopeOverrides, quoteTemplate, showMarkupField, showDiscountField, showAddonPricing, showPricingFields, showPrices]);

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
    const mergedTechDesc = resolveTechDesc({
      category: row.category,
      baseTechDesc: base.techDesc,
      metadataTechDesc: row.techDesc,
      sanitize: sanitizeTechDesc,
    });
    const scopeDesc = resolveScopeDesc({ base, size: row.size, metadataScopeDesc: row.scopeDesc });

    return {
      ...base,
      ...row,
      category: row.category,
      qty: row.qty || 1,
      techDesc: mergedTechDesc,
      ...(scopeDesc !== undefined ? { scopeDesc } : {}),
      // If row has an image, keep it, otherwise use base image
      image: row.image || base.image
    };
  }

  function syncAddonWithBase(row) {
    if (!row || !row.category) return row;
    const list = ADDONS_DATA[row.category] || [];
    const base = list.find(a => a.id === row.id) || list.find(a => a.name === row.name);
    if (!base) return row;
    const mergedTechDesc = resolveTechDesc({
      category: row.category,
      baseTechDesc: base.techDesc,
      metadataTechDesc: row.techDesc || row.metadata?.techDesc,
      sanitize: sanitizeTechDesc,
    });
    const scopeDesc = resolveScopeDesc({
      base,
      size: row.size || row.metadata?.size,
      metadataScopeDesc: row.scopeDesc || row.metadata?.scopeDesc,
    });
    return {
      ...base,
      ...row,
      category: row.category,
      qty: row.qty || 1,
      techDesc: mergedTechDesc,
      ...(scopeDesc !== undefined ? { scopeDesc } : {}),
    };
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
    const preset = ALL_MODELS.find((m) => m.code === modelLabel);
    if (!preset) {
      console.warn("No model found for", modelLabel);
      return false;
    }

    // 1) set machineType from preset (mono / aba / 3layer / 5layer)
    setMachineTypeState(preset.machineType);

    const nextSelected = [];
    const nextAddons = [];

    // 1.5) Set fixed base price if preset defines one
    setPresetBasePrice(preset.basePrice || 0);

    // 2) Build selected base components
    let extruderCount = 0;
    const labels = ["A", "B", "C", "D", "E"];

    preset.components.forEach((comp) => {
      const { category, id, qty, metadata = {} } = comp;
      const list = components[category] || [];
      const base = list.find((c) => c.id === id);
      if (!base) {
        // Allow preset-only components (e.g. "Main Nip" for DR models) that carry all
        // their info in metadata.customName / metadata.techDesc without a registry entry.
        if (metadata.customName) {
          const mergedTechDesc = resolveTechDesc({
            category,
            baseTechDesc: null,
            metadataTechDesc: metadata.techDesc,
            sanitize: sanitizeTechDesc,
          });
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
      const isMonoAbaPreset = preset.machineType === "mono" || preset.machineType === "aba";
      // Electrical & Control Panel and Air Ring are now split into dedicated
      // mono/ABA/3-layer-5-layer components, each with their own .prices —
      // base.prices already resolves to the right table via item.id.
      const effectivePrices = base.prices || {};

      // Smart default for web-width components if size is missing
      if (base.isDynamic && !metadata.size && base.prices) {
        if (["Winder", "Main Nip", "Haul-Off", "Bubble Cage", "Electrical & Control Panel", "Air Ring", "Tower", "Tower / Platform"].includes(category)) {
          let targetSize = null;

          if (preset.code) {
            let directCodeSize = null;
            if (preset.code.startsWith("UNOFLEX-")) {
              directCodeSize = "U" + preset.code.split("-")[1].split(" ")[0];
            } else if (preset.code.startsWith("DUOFLEX-")) {
              directCodeSize = "D" + preset.code.split("-")[1].split(" ")[0];
            }
            if (directCodeSize) {
              const exactKey = Object.keys(effectivePrices).find(k => k === directCodeSize || k === `${directCodeSize}"`);
              if (exactKey) {
                targetSize = exactKey;
              }
            }
          }

          if (!targetSize) {
            // The U#/D# direct-code branch only makes sense against a price table that
            // actually has those keys (the legacy shared PANEL_DYNAMIC_PRICES/
            // MAIN_NIP_PRICES tables do, for 3-layer/5-layer). Mono/ABA now resolve to
            // their own dedicated components (panel-mono/aba-dynamic,
            // main-nip-mono/aba-dynamic) with plain mm-tier keys only, so building a
            // "U32"/"D24" targetSize against them would never match — falling through to
            // the numeric closest-match fallback below, which (since "U32" isn't
            // numeric) always picked the smallest available tier. Skip straight to the
            // layflatWidthMm-based tier lookup instead.
            const skipDirectCodeForMonoAba = ["Electrical & Control Panel", "Main Nip"].includes(category) && isMonoAbaPreset;
            if (["Electrical & Control Panel", "Main Nip"].includes(category) && preset.code && !skipDirectCodeForMonoAba) {
               const code = preset.code;
               if (code.startsWith("UNOFLEX-")) {
                 targetSize = "U" + code.split("-")[1].split(" ")[0]; // UNOFLEX-40-55MM -> U40
               } else if (code.startsWith("DUOFLEX-")) {
                 targetSize = "D" + code.split("-")[1].split(" ")[0]; // DUOFLEX-50-65/55 -> D50
               }
            } else if (category === "Air Ring" && preset.dieSizeHmLd) {
               const dieNumMatch = preset.dieSizeHmLd.match(/\d+/);
               if (dieNumMatch) targetSize = dieNumMatch[0];
            } else if (["Winder", "Haul-Off", "Bubble Cage", "Tower", "Tower / Platform"].includes(category) && preset.code && !preset.layflatWidthMm) {
               // Only use the inches-from-code approximation when the model has no
               // precise layflatWidthMm at all — it's a rougher estimate (e.g. "32" from
               // UNOFLEX-32 rounds to 800mm, but the model's real width is 750mm) and the
               // block below already prefers layflatWidthMm when present.
               const code = preset.code;
               if (code.startsWith("UNOFLEX-") || code.startsWith("DUOFLEX-")) {
                 const inchesStr = code.split("-")[1].split(" ")[0].replace(/[^\d]/g, '');
                 if (inchesStr) {
                   const inches = parseInt(inchesStr, 10);
                   targetSize = String(Math.round((inches * 25.4) / 50) * 50);
                 }
               }
            }

            if (!targetSize && preset.layflatWidthMm) {
               targetSize = String(preset.layflatWidthMm);
            }
          }
          if (targetSize) {
            const availableSizes = Object.keys(effectivePrices);
            if (availableSizes.includes(targetSize)) {
              metadata.size = targetSize;
            } else {
              // Fallback for a numeric targetSize: smallest tier >= target (matching the
              // "smallest size >= machineWidth" convention every live recompute block
              // uses), falling back to the largest available tier if target exceeds all
              // of them. This keeps every mm-tiered category resolving the same model
              // width to the same tier consistently.
              const numericSizes = availableSizes.filter(s => !isNaN(Number(s))).map(Number).sort((a, b) => a - b);
              if (numericSizes.length > 0 && !isNaN(Number(targetSize))) {
                const target = Number(targetSize);
                const nextTier = numericSizes.find((s) => s >= target);
                metadata.size = String(nextTier != null ? nextTier : numericSizes[numericSizes.length - 1]);
              } else {
                 metadata.size = availableSizes[0];
              }
            }
          }
        }
      }

      // Electrical Panel / Air Ring / Extruder / Die Head all carry no live recompute
      // block (unlike Tower/Main Nip/Bubble Cage/Winder), so the resolved price table
      // must be applied here directly for every machine type — otherwise a model's
      // metadata.price silently stays unset (most Extruder/Die Head preset entries only
      // specify a size, never a price) whenever these tables are updated.
      // effectivePrices is already mono/ABA-specific for Panel/Air Ring when applicable,
      // and falls back to base.prices — the right table for whichever specific
      // component id (mono/ABA/3-layer Extruder or Die variant) this model uses — for
      // every other category, including Extruder and Die Head.
      if (base.isDynamic && metadata.size && ["Electrical & Control Panel", "Air Ring", "Extruder", "Die Head"].includes(category)) {
        if (effectivePrices[metadata.size] != null) metadata.price = effectivePrices[metadata.size];
      }

      // Resolve base techDesc from sizeDetails if dynamic
      let baseTechDesc = base.techDesc || {};
      if (base.isDynamic && metadata.size && base.sizeDetails && base.sizeDetails[metadata.size]) {
        baseTechDesc = base.sizeDetails[metadata.size].techDesc || baseTechDesc;
      }

      // Deep merge techDesc if it exists in metadata
      const mergedTechDesc = resolveTechDesc({
        category,
        baseTechDesc,
        metadataTechDesc: metadata.techDesc,
        sanitize: sanitizeTechDesc,
      });
      const resolvedScopeDesc = resolveScopeDesc({ base, size: metadata.size, metadataScopeDesc: metadata.scopeDesc });
      const scopeDescPatch = resolvedScopeDesc !== undefined ? { scopeDesc: resolvedScopeDesc } : {};
      if (category === "Extruder" && base.isDynamic) {
        const q = qty || 1;
        for (let i = 0; i < q; i++) {
          const label = labels[extruderCount] || `${extruderCount + 1}`;
          nextSelected.push({
            ...base,
            category,
            qty: 1,
            ...metadata,
            ...scopeDescPatch,
            id: `${base.id}-${label}`,
            name: `${base.name} ${label}`,
            techDesc: mergedTechDesc
          });
          extruderCount++;
        }
      } else {
        nextSelected.push({ ...base, category, qty: qty ?? 1, ...metadata, ...scopeDescPatch, techDesc: mergedTechDesc });
      }
    });

    // 3) Build selected add-ons
    const isPackage = (preset.basePrice || 0) > 0;
    (preset.addons || []).forEach(({ category, id, qty }) => {
      // Bimetallic upgrades are per-extruder dynamic addons (bimetallic-upgrade-1/-2/-3...,
      // one per selected extruder, each targeting that extruder's id) — there's no single
      // static catalog entry to look up by id. A preset asking for "bimetallic-upgrade-N"
      // with qty=Q means "pre-select the upgrade on the first Q extruders".
      if (category === "Extruder Addons" && id.startsWith("bimetallic-upgrade")) {
        const liveBimetallicBase = (addons["Extruder Addons"] || []).find((a) => a.id === "bimetallic-upgrade") || BIMETALLIC_BASE;
        const selectedExtruders = nextSelected.filter((s) => s.category === "Extruder");
        const q = Math.min(qty ?? selectedExtruders.length, selectedExtruders.length);
        for (let i = 0; i < q; i++) {
          const ext = selectedExtruders[i];
          const sizeStr = String(ext.sizeMm || ext.size || ext.extruder || "45");
          nextAddons.push({
            ...liveBimetallicBase,
            id: `bimetallic-upgrade-${i + 1}`,
            name: `Bi-metallic Screw Barrel (Extruder ${i + 1})`,
            category,
            qty: 1,
            isDynamic: true,
            price: isPackage ? 0 : (BIMETALLIC_PRICES[sizeStr] ?? liveBimetallicBase.price),
            isIncluded: isPackage,
            metadata: { ...liveBimetallicBase.metadata, size: sizeStr, targetExtruderId: ext.id },
          });
        }
        return;
      }

      const list = addons[category] || [];
      const base = list.find((a) => a.id === id);
      if (!base) {
        console.warn("Add-on not found for preset:", category, id);
        return;
      }

      let metadata = { ...qty.metadata } || {};
      // Electrical & Control Panel and Air Ring are now split into dedicated
      // mono/ABA/3-layer-5-layer components, each with their own .prices —
      // base.prices already resolves to the right table via item.id.
      const effectivePrices = base.prices;
      if (base.isDynamic && !metadata.size && base.prices) {
        if (["Winder", "Main Nip", "Haul-Off", "Bubble Cage", "Electrical & Control Panel", "Air Ring", "Tower", "Tower / Platform", "Corona", "Material Handling"].includes(category)) {
          let targetSize = null;

          if (preset.code) {
            let directCodeSize = null;
            if (preset.code.startsWith("UNOFLEX-")) {
              directCodeSize = "U" + preset.code.split("-")[1].split(" ")[0];
            } else if (preset.code.startsWith("DUOFLEX-")) {
              directCodeSize = "D" + preset.code.split("-")[1].split(" ")[0];
            }
            if (directCodeSize) {
              const exactKey = Object.keys(effectivePrices).find(k => k === directCodeSize || k === `${directCodeSize}"`);
              if (exactKey) {
                targetSize = exactKey;
              }
            }
          }

          if (!targetSize) {
            if (["Electrical & Control Panel", "Main Nip"].includes(category) && preset.code) {
               const code = preset.code;
               if (code.startsWith("UNOFLEX-")) {
                 targetSize = "U" + code.split("-")[1].split(" ")[0];
               } else if (code.startsWith("DUOFLEX-")) {
                 targetSize = "D" + code.split("-")[1].split(" ")[0];
               }
            } else if (category === "Air Ring" && preset.dieSizeHmLd) {
               const dieNumMatch = preset.dieSizeHmLd.match(/\d+/);
               if (dieNumMatch) targetSize = dieNumMatch[0];
            } else if (["Winder", "Haul-Off", "Bubble Cage", "Tower", "Tower / Platform", "Corona"].includes(category) && preset.code) {
               const code = preset.code;
               if (code.startsWith("UNOFLEX-") || code.startsWith("DUOFLEX-")) {
                 const inchesStr = code.split("-")[1].split(" ")[0].replace(/[^\d]/g, '');
                 if (inchesStr) {
                   const inches = parseInt(inchesStr, 10);
                   targetSize = String(Math.round((inches * 25.4) / 50) * 50);
                 }
               }
            }
            
            if (!targetSize && preset.layflatWidthMm) {
               targetSize = String(preset.layflatWidthMm);
            }
          }
          
          if (targetSize) {
            const availableSizes = Object.keys(effectivePrices);
            if (availableSizes.includes(targetSize)) {
              metadata.size = targetSize;
            } else {
              const numericSizes = availableSizes.filter(s => !isNaN(Number(s)));
              if (numericSizes.length > 0 && !isNaN(Number(targetSize))) {
                const closest = numericSizes.reduce((prev, curr) => 
                  Math.abs(Number(curr) - Number(targetSize)) < Math.abs(Number(prev) - Number(targetSize)) ? curr : prev
                );
                metadata.size = closest;
              } else {
                 metadata.size = availableSizes[0];
              }
            }
          }
        }
      }

      // For dynamically-sized addons (Electrical Panel, Corona, etc. when pre-added by a
      // preset), the size was just resolved above — look its real price up from
      // base.prices rather than falling back to the flat (usually 0) base.price.
      const resolvedPrice = (base.isDynamic && effectivePrices && metadata.size && effectivePrices[metadata.size] != null)
        ? effectivePrices[metadata.size]
        : base.price;

      // Resolve techDesc/scopeDesc the same way the components path does. `metadata`
      // stays nested (other code reads item.metadata.size elsewhere) but the resolved
      // values are also promoted to the top level so a model's metadata.scopeDesc on an
      // addon is no longer silently ignored (it previously never got read by anything).
      let addonBaseTechDesc = base.techDesc || {};
      if (base.isDynamic && metadata.size && base.sizeDetails && base.sizeDetails[metadata.size]) {
        addonBaseTechDesc = base.sizeDetails[metadata.size].techDesc || addonBaseTechDesc;
      }
      const resolvedAddonTechDesc = resolveTechDesc({
        category,
        baseTechDesc: addonBaseTechDesc,
        metadataTechDesc: metadata.techDesc,
        sanitize: sanitizeTechDesc,
      });
      const resolvedAddonScopeDesc = resolveScopeDesc({ base, size: metadata.size, metadataScopeDesc: metadata.scopeDesc });

      nextAddons.push({
        ...base,
        category,
        qty: qty ?? 1,
        price: isPackage ? 0 : resolvedPrice,
        isIncluded: isPackage,
        techDesc: resolvedAddonTechDesc,
        ...(resolvedAddonScopeDesc !== undefined ? { scopeDesc: resolvedAddonScopeDesc } : {}),
        metadata
      });
    });

    // 4) Sync specifications (Roller Width, Layflat & Output) from the same unified model record
    const modelObj = preset;
    const isMonoOrAba = preset.machineType === "mono" || preset.machineType === "aba";

    // Extract Roller Width from label (e.g., "32" from "MONOLAYER - 32\"")
    const rollerMatch = String(modelLabel).match(/\d+/);
    const rollerNum = rollerMatch ? parseInt(rollerMatch[0], 10) : 0;

    let machineWidth = 0;
    if (rollerNum > 0) {
      const diff = isMonoOrAba ? 50 : ((rollerNum === 1450) ? 100 : 120);
      if (isMonoOrAba) {
        setCustomRollerWidth(`${rollerNum} inch`);
        machineWidth = modelObj?.layflatWidthMm || ((rollerNum * 25) - diff);
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
      machineWidth = modelObj.layflatWidthMm || 0;
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

          let label = "Film width range";
          let minRatio = 0.5;

          if (isManual) {
            label = "Bubble width range";
            minRatio = 0.6;
          } else if (isUpDown) {
            label = "Bubble width range";
            minRatio = 0.5;
          }

          // Look up by the item's own id (bc-manual-dynamic for 3-layer/5-layer,
          // bc-manual-mono-dynamic / bc-manual-dynamic-aba for mono/ABA, plus
          // bc-open-close-dynamic / bc-up-down-dynamic for the motorised variants) so
          // each gets its own independently-editable price table.
          const bcComp = COMPONENTS_DATA["Bubble Cage"]?.find(c => c.id === item.id);
          const priceMap = bcComp?.prices || {};

          // Find smallest size >= machineWidth. Only trust a pre-set item.size if it's
          // actually a valid key in the CURRENT priceMap — a size inherited from an
          // earlier resolution pass against a different table (e.g. the mono/ABA split)
          // would otherwise silently price at $0 instead of falling back to auto-calc.
          const availableSizes = Object.keys(priceMap).map(Number).sort((a, b) => a - b);
          const rawPresetSize = parseInt(item.size) || 0;
          const presetSize = (rawPresetSize > 0 && priceMap[rawPresetSize.toString()] != null) ? rawPresetSize : 0;
          const chosenSize = presetSize > 0 ? presetSize : (availableSizes.find(s => s >= machineWidth) || availableSizes[availableSizes.length - 1]);

          const displaySize = (presetSize > 0) ? presetSize : ((rollerNum > 0) ? (isMonoOrAba ? (rollerNum * 25) : rollerNum) : chosenSize);
          const diff = isMonoOrAba ? 50 : ((displaySize === 1450) ? 100 : 120);
          const isMultiLayer = preset.machineType === "3layer" || preset.machineType === "5layer";

          let maxFilmWidth, minRange;
          if (isMultiLayer && modelObj?.layflatWidthMm) {
            // 3-layer/5-layer: max = model's max layflat width; min = ceil((die size * 1.5) / 0.637), rounded up to nearest 10.
            maxFilmWidth = modelObj.layflatWidthMm;
            const dieSizeMatch = (modelObj.dieSizeHmLd || "").match(/\d+/);
            const dieSize = dieSizeMatch ? parseInt(dieSizeMatch[0]) : 0;
            minRange = dieSize > 0 ? Math.ceil((dieSize * 1.5) / 0.637 / 10) * 10 : Math.round((maxFilmWidth * minRatio) / 10) * 10;
          } else {
            maxFilmWidth = (isMonoOrAba && modelObj?.layflatWidthMm) ? modelObj.layflatWidthMm : ((rollerNum > 0) ? (displaySize - diff) : chosenSize);
            minRange = Math.round((maxFilmWidth * minRatio) / 10) * 10;
          }
          const newPrice = priceMap[chosenSize.toString()] || 0;

          const dynamicBCItem = bcComp || BUBBLE_CAGE_COMPONENTS.find(bc => bc.id === item.id) || item;
          const segments = (chosenSize >= 2370) ? 9 : (chosenSize >= 2000 ? 8 : 6);
          let typeStr = dynamicBCItem.techDesc?.["Type"] || `Calibration bubble guide basket arranged to provide full support. Bubble contact is through PBT for minimum drag.`;
          if (typeStr.includes("arranged to provide full support")) {
            typeStr = typeStr.replace("arranged to provide full support", `with ${segments} arms arranged to provide full support`);
          }

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
          // Match by id only — a broad name-substring fallback here previously matched
          // "haul-vertical-compact" (name "Vertical Haul-Off (Compact)" contains "haul-off")
          // before ever reaching this dynamic entry, since it's the earlier array element.
          // That static component has no price table, so Haul-Off silently priced at $0
          // for every model regardless of any preset size override.
          const hauloffComp = COMPONENTS_DATA["Haul-Off"]?.find(c => c.id === "haul-horizontal-dynamic");
          const priceMap = hauloffComp?.prices || {};
          const availableSizes = Object.keys(priceMap).map(Number).sort((a, b) => a - b);
          // Find smallest size >= machineWidth
          const minSize = availableSizes.find(s => s >= machineWidth) || availableSizes[0] || 0;
          // Respect preset size
          const presetSize = parseInt(item.size) || 0;
          const chosenSize = presetSize > 0 ? presetSize : minSize;
          const newPrice = priceMap[chosenSize.toString()] || 0;

          const dynamicHauloffItem = hauloffComp || item;

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
        const isTowerId = ["tower_std", "tower_h", "tower-dynamic", "tower-mono-dynamic", "tower-aba-dynamic"].includes(item.id);

        if (item.category === "Tower / Platform" && (isTowerId || item.isDynamic)) {
          // Look up by the item's own id (tower-dynamic for 3-layer/5-layer,
          // tower-mono-dynamic / tower-aba-dynamic for mono/ABA) so each gets its own
          // independently-editable price table instead of a hardcoded shared one.
          const towerComp = COMPONENTS_DATA["Tower / Platform"]?.find(t => t.id === item.id);
          const priceMap = towerComp?.prices || TOWER_PRICES;
          const availableSizes = Object.keys(priceMap).map(Number).sort((a, b) => a - b);
          // Find smallest size >= machineWidth, or fallback to smallest available. Only
          // trust a pre-set item.size if it's a valid key in the CURRENT priceMap — a
          // size inherited from an earlier pass against a different table would
          // otherwise silently price at $0 instead of falling back to auto-calc.
          const rawPresetSize = parseInt(item.size) || 0;
          const presetSize = (rawPresetSize > 0 && priceMap[rawPresetSize.toString()] != null) ? rawPresetSize : 0;
          const chosenSize = presetSize > 0 ? presetSize : (availableSizes.find(s => s >= machineWidth) || availableSizes[0]);
          const newPrice = priceMap[chosenSize.toString()] || 0;

          const dynamicTowerItem = towerComp || TOWER_COMPONENTS.find(h => h.id === "tower-dynamic") || item;

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
          // Look up by the item's own id (main-nip-cf-dynamic for 3-layer/5-layer,
          // main-nip-mono-dynamic / main-nip-aba-dynamic for mono/ABA) so each gets its
          // own independently-editable price table instead of a hardcoded shared one.
          const mainNipComp = COMPONENTS_DATA["Main Nip"]?.find(c => c.id === item.id);
          const priceMap = mainNipComp?.prices || MAIN_NIP_PRICES;
          // priceMap has both mm keys (used here) and U#/D# keys (used by the Selection
          // page's manual dropdown) — ignore the non-numeric ones for this lookup.
          const availableSizes = Object.keys(priceMap).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
          const minSize = availableSizes.find(s => s >= machineWidth) || availableSizes[0] || 0;
          // Only trust a pre-set item.size if it's a valid key in the CURRENT priceMap —
          // see the Tower/Bubble Cage blocks above for why.
          const rawPresetSize = parseInt(item.size) || 0;
          const presetSize = (rawPresetSize > 0 && priceMap[rawPresetSize.toString()] != null) ? rawPresetSize : 0;
          const chosenSize = presetSize > 0 ? presetSize : minSize;
          const newPrice = priceMap[chosenSize.toString()] || 0;

          const dynamicMainNipItem = mainNipComp || item;

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

          let compId = "winder-surface-dynamic";
          if (isManual) compId = "winder-manual-back-to-back-dynamic";
          else if (isSingleSurfaceWinder) compId = "winder-single-surface-only-dynamic";
          else if (isAuto) compId = "winder-automatic-dynamic";

          const winderComp = COMPONENTS_DATA["Winder"]?.find(c => c.id === compId);
          const priceMap = winderComp?.prices || {};

          const availableSizes = Object.keys(priceMap).map(Number).sort((a, b) => a - b);
          // Find smallest size >= machineWidth
          const minSize = availableSizes.find(s => s >= machineWidth) || availableSizes[0] || 0;
          // Respect preset size
          const presetSize = parseInt(item.size) || 0;
          const chosenSize = presetSize > 0 ? presetSize : minSize;
          const newPrice = priceMap[chosenSize.toString()] || 0;

          const stationLabel = isSingleSurfaceWinder ? "Surface Winder (01 No.)" : "Surface Winders (02 Nos.)";

          const dynamicWinderItem = winderComp || WINDER_COMPONENTS.find(w => w.id === item.id) || item;

          let nipHP = "2 HP";
          if (chosenSize >= 1500 && chosenSize <= 2000) nipHP = "3 HP";
          else if (chosenSize > 2000) nipHP = "5 HP";

          const displaySize = (presetSize > 0) ? presetSize : ((rollerNum > 0) ? (isMonoOrAba ? (rollerNum * 25) : rollerNum) : chosenSize);
          const diff = isMonoOrAba ? 50 : ((displaySize === 1450) ? 100 : 120);
          const standardFilmWidths = [850, 950, 1000, 1250, 1350, 1500, 1750, 1850, 2000, 2250, 2500, 2750, 3000];
          const maxFilmWidth = (isMonoOrAba && modelObj?.layflatWidthMm) ? modelObj.layflatWidthMm : ((rollerNum > 0 && !standardFilmWidths.includes(displaySize)) ? (displaySize - diff) : displaySize);

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
              "Nip roller width": `${standardFilmWidths.includes(displaySize) ? (displaySize + diff) : displaySize} mm`,
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
          const cfComp = COMPONENTS_DATA["Collapsing Frame"]?.find(cf => cf.id === "cf-pbt-dynamic");
          const priceMap = cfComp?.prices || COLLAPSING_FRAME_PRICES;
          const availableSizes = Object.keys(priceMap).map(Number).sort((a, b) => a - b);


          // Find smallest size >= machineWidth
          const minSize = availableSizes.find(s => s >= machineWidth) || availableSizes[0];
          // Respect preset size
          const presetSize = parseInt(item.size) || 0;
          const chosenSize = presetSize > 0 ? presetSize : minSize;

          const newPrice = priceMap[chosenSize.toString()] || 0;
          const dynamicCFItem = cfComp || COLLAPSING_FRAME_COMPONENTS.find(cf => cf.id === "cf-pbt-dynamic") || item;

          const displaySize = (presetSize > 0) ? presetSize : ((rollerNum > 0) ? (isMonoOrAba ? (rollerNum * 25) : rollerNum) : chosenSize);
          const diff = isMonoOrAba ? 50 : ((displaySize === 1450) ? 100 : 120);
          const maxFilmWidth = (isMonoOrAba && modelObj?.layflatWidthMm) ? modelObj.layflatWidthMm : ((rollerNum > 0) ? (displaySize - diff) : chosenSize);

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
    setPresetBaseComponents(nextSelected);
    setSelected(nextSelected);
    setSelectedAddons(nextAddons);
    setCustomMode(false);
    setSelectedMachineModelLabel(modelLabel);

    if (modelObj) {
      const output = modelObj.maxOutputKgHr;
      if (output) setCustomOutput(output);

      // Ensure machineModelIndex is synchronized so currentMachineModel works.
      // Filtered fresh from preset.machineType (not the component's machineType state,
      // which won't reflect setMachineTypeState() above until the next render).
      const idx = ALL_MODELS.filter(m => m.machineType === preset.machineType).findIndex(m => m.code === modelLabel);
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

      // Removed setPresetBasePrice(0) to maintain base price for differentials

      const mergedTechDesc = resolveTechDesc({
        category,
        baseTechDesc: item.techDesc,
        metadataTechDesc: metadata?.techDesc,
        sanitize: sanitizeTechDesc,
      });
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
      // Removed setPresetBasePrice(0) to maintain base price for differentials
      return prev.filter((p) => p.id !== id);
    });
  }

  function setQty(id, qty) {
    if (qty < 1) return;
    // Removed setPresetBasePrice(0) to maintain base price for differentials
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
  }, [components, machineType, customMode, selectedMachineModelLabel, adminDataLoaded]);

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

    // Add static upgrades (like Lever Screen Changer) — prefer the live/admin-edited
    // catalog entry by id when one exists, falling back to the static definition
    // (whose supportedTypes drives the machineType filter, since admin-edited
    // copies use the standard machineTypes field instead).
    if (EXTRUDER_ADDONS && EXTRUDER_ADDONS.length > 0) {
      const liveExtruderAddonsById = new Map((addons["Extruder Addons"] || []).map(a => [a.id, a]));
      EXTRUDER_ADDONS.forEach(addon => {
        if (!addon.supportedTypes || addon.supportedTypes.includes(machineType)) {
          extAddons.push(liveExtruderAddonsById.get(addon.id) || addon);
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
      const liveBimetallicBase = (addons["Extruder Addons"] || []).find((a) => a.id === "bimetallic-upgrade") || BIMETALLIC_BASE;
      let extruderIndex = 1;
      selectedExtruders.forEach((ext) => {
        const q = ext.qty || 1;
        for (let i = 0; i < q; i++) {
          const sizeStr = String(ext.sizeMm || ext.size || ext.extruder || "45").split('/')[i] || String(ext.sizeMm || ext.size || ext.extruder || "45");

          const bimetallicItem = {
            ...liveBimetallicBase,
            id: `bimetallic-upgrade-${extruderIndex}`,
            name: `Bi-metallic Screw Barrel (Extruder ${extruderIndex})`,
            cardDesc: `Upgrade Extruder ${extruderIndex} to premium wear-resistant Bi-metallic screw and barrel.`,
            qty: 1,
            isDynamic: true,
            metadata: {
              ...liveBimetallicBase.metadata,
              size: sizeStr,
              targetExtruderId: ext.id
            }
          };
          extAddons.push(bimetallicItem);
          extruderIndex++;
        }
      });
    }

    if (extAddons.length > 0) {
      out["Extruder Addons"] = extAddons;
    }

    // --- DYNAMIC DIE ADDONS ---
    const selectedDie = (selected || []).find(s => s.category === "Die Head");
    if (selectedDie) {
      const dieSize = selectedDie.diameterMm || selectedDie.size || "";

      // Die Addons need a per-selection dynamic name/price (size baked into the
      // label below), so this can't just use out["Die Addons"] as-is like the
      // Winder/Material Handling blocks do. But it must still start from the
      // admin-edited live catalog data (already sitting in out["Die Addons"]
      // from the ADDONS_DATA pass above), not the static DIE_ADDONS import —
      // otherwise admin edits to name/cardDesc/image/techDesc never show on the
      // customer-facing page. Static DIE_ADDONS is only consulted as a
      // per-id fallback for entries the live catalog doesn't have yet.
      const liveDieAddonsById = new Map((out["Die Addons"] || []).map((a) => [a.id, a]));
      const staticIds = new Set(DIE_ADDONS.map((a) => a.id));
      const mergedDieAddons = [
        ...DIE_ADDONS.map((staticAddon) => liveDieAddonsById.get(staticAddon.id) || staticAddon),
        ...(out["Die Addons"] || []).filter((a) => !staticIds.has(a.id)),
      ];

      out["Die Addons"] = mergedDieAddons.map(addon => {
        let dynamicPrice = addon.price;
        if (machineType === "mono" && addon.monoPrices) {
          const mc = currentMachineModel?.code || "";
          for (const [key, val] of Object.entries(addon.monoPrices)) {
            if (mc.includes(key)) {
              dynamicPrice = val;
            }
          }
        }
        
        let addonName = addon.name;
        if (addon.id === "die-rotation-addon") {
           addonName = `Die Rotation System for ${dieSize} mm Die`;
        } else if (addon.id === "additional-lip-set-addon") {
           addonName = `Additional Lip Set with Inserts for ${dieSize} mm Die`;
        }

        return {
          ...addon,
          name: addonName,
          price: dynamicPrice,
          metadata: { ...addon.metadata, size: String(dieSize) }
        };
      });
    }

    // --- DYNAMIC BACK TO BACK WINDER PRICING ---
    if (out["Winder Addons"]) {
      out["Winder Addons"] = out["Winder Addons"].map(addon => {
        if (addon.monoPrices) {
          let dynamicPrice = addon.price;
          if (machineType === "mono") {
            const mc = currentMachineModel?.code || "";
            for (const [key, val] of Object.entries(addon.monoPrices)) {
              if (mc.includes(key)) {
                dynamicPrice = val;
              }
            }
          }
          return { ...addon, price: dynamicPrice };
        }
        return addon;
      });
    }

    // --- DYNAMIC MATERIAL HANDLING PRICING ---
    if (out["Material Handling"]) {
      out["Material Handling"] = out["Material Handling"].map(addon => {
        if (addon.monoPrices) {
          let dynamicPrice = addon.price;
          if (machineType === "mono" || machineType === "aba") {
            const mc = currentMachineModel?.code || "";
            for (const [key, val] of Object.entries(addon.monoPrices)) {
              if (mc.includes(key)) {
                dynamicPrice = val;
              }
            }
          }
          return { ...addon, price: dynamicPrice };
        }
        return addon;
      });
    }

    // --- DYNAMIC UP DOWN BUBBLE CAGE UPGRADE FOR 3 LAYER ---
    if (machineType === "3layer") {
      const selectedBC = (selected || []).find(s => s.category === "Bubble Cage");
      if (selectedBC) {
        const bcSize = parseInt(selectedBC.size) || 0;
        const upDownBcComponent = COMPONENTS_DATA["Bubble Cage"]?.find(c => c.id === "bc-up-down-dynamic" || c.name.includes("Up Down"));
        const upDownPrice = upDownBcComponent?.prices?.[bcSize.toString()] || 150000;
        const currentPrice = selectedBC.price || 0;
        const upgradePrice = Math.max(0, upDownPrice - currentPrice);

        out["Bubble Cage Addons"] = [{
          id: "addon-up-down-bubble-cage",
          name: "Up Down Bubble Cage",
          category: "Bubble Cage Addons",
          image: "/images/Bubble Cage/UD Bubble Cage.png",
          cardDesc: "Upgrade to motorized up-down & open-close bubble cage.",
          price: upgradePrice > 0 ? upgradePrice : 150000,
          isDynamic: false,
          techDesc: {
            "Type": "Calibration bubble guide basket arranged to provide full support. Bubble contact is through PBT for minimum drag.",
            "Actuation of arms": "Motorized Up Down & Open-Close with Linear Actuator."
          }
        }];
      }
    }

    return out;
  }, [addons, machineType, selectedAddons, selected, adminDataLoaded]);

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

      // 3. Winder Updates (station-count label + Back to Back Winder replacement)
      // Scoped to mono/ABA only — 3-layer models use their own "(0X Nos.)" plural
      // convention and their winder logic must not be touched.
      const isBackToBackSelected = selectedAddons.some(a => a.id === "winder-manual-back-to-back-dynamic");
      const isMonoOrAbaWinder = category === "winder" && (machineType === "mono" || machineType === "aba");
      if (isMonoOrAbaWinder) {
        // Station-count label: "(01 No.)" only for a genuine single-surface winder
        // with no back-to-back upgrade; "(02 No.)" for every other winder variant,
        // including a single-surface winder that's had the back-to-back addon
        // applied. Always recomputed as exactly one key — any stale "Surface
        // Winder(s) (0X No(s).)" variant (from a hardcoded per-model override, or
        // left over from a previous addon toggle) is removed first so there's never
        // more than one station-count line shown at once.
        const isSingleSurfaceBase = item.id === "winder-single-surface-only-dynamic";
        const stationLabel = (isSingleSurfaceBase && !isBackToBackSelected)
          ? "Surface Winder (01 No.)"
          : "Surface Winder (02 No.)";

        const cleanedTechDesc = { ...updatedItem.techDesc };
        Object.keys(cleanedTechDesc).forEach(k => {
          if (k.toLowerCase().includes("surface winder (") || k.toLowerCase().includes("surface winders (")) {
            delete cleanedTechDesc[k];
          }
        });
        const existingMaxWidth = updatedItem.techDesc?.["Maximum web width"];
        const stationText = existingMaxWidth
          ? `Maximum web width of ${existingMaxWidth} with ${isBackToBackSelected ? "Manual" : "Manual"} Changeover.`
          : (isBackToBackSelected ? "Maximum web width with Manual Changeover." : undefined);

        updatedItem = {
          ...updatedItem,
          techDesc: {
            ...cleanedTechDesc,
            ...(stationText ? { [stationLabel]: stationText } : { [stationLabel]: cleanedTechDesc[stationLabel] || "" }),
          }
        };

        if (isBackToBackSelected) {
          const addon = selectedAddons.find(a => a.id === "winder-manual-back-to-back-dynamic");
          if (addon) {
            const layflatW = customLayflat ? customLayflat.replace(/[^0-9]/g, '') : (currentMachineModel?.layflatWidthMm || "1250");
            const newWinderTechDesc = {
              ...updatedItem.techDesc,
              "Surface Winder (02 No.)": `Maximum web width of ${layflatW} mm with Manual Changeover.`,
              "Roll diameter": "500 mm diameter or 350 kg weight in single up Which ever reaches first. Bow roller prior to drum roller for wrinkle free winding.",
              "Surface winder drive": (machineType === "mono" || machineType === "aba") ? "02 HP AC motor with variable frequency drive." : "02 HP AC motor with variable frequency drive. Gear motor-Bon Vario, Italy or Equivalent.",
              "Tension control": "Through Torque mode.",
              "Type of winder": "Two back to back type.",
              "Length counter meter": "Provided",
              "Trim Suction Blower": "Provided"
            };
            delete newWinderTechDesc["Winder Type"];
            delete newWinderTechDesc["Type"];
            delete newWinderTechDesc["Actuation"];

            updatedItem = {
              ...updatedItem,
              name: addon.name || "Back to Back Surface Winder",
              customName: addon.customName || addon.name || "Back to Back Surface Winder",
              image: addon.image || updatedItem.image,
              techDesc: newWinderTechDesc
            };
          }
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

        const isUpDownSelected = selectedAddons.some(a => a.id === "addon-up-down-bubble-cage");
        if (isUpDownSelected) {
          const addon = selectedAddons.find(a => a.id === "addon-up-down-bubble-cage");
          updatedItem = {
            ...updatedItem,
            name: "Motorised Up Down Bubble Cage",
            customName: "Motorised Up Down Bubble Cage",
            image: addon.image || updatedItem.image,
            techDesc: {
              ...newTechDesc,
              ...addon.techDesc
            }
          };
          newTechDesc = updatedItem.techDesc;
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
      models.find((m) => m.layflatWidthMm === safeCustomer.machineWidth) ||
      null;

    return model || null;
  }

  // ---------------- WORD / PDF / JSON CONTEXT ----------------


  const computePriceSummary = React.useCallback(() => {
    // 1. Calculate Standard Components Total
    let basicTotal = 0;

    // If a preset base price is active, calculate differential
    if (presetBasePrice > 0) {
      basicTotal = presetBasePrice;

      // Subtract removed preset components
      (presetBaseComponents || []).forEach(presetComp => {
        const stillSelected = selected.find(s => s.id === presetComp.id);
        if (!stillSelected) {
          basicTotal -= (presetComp.price || 0) * (presetComp.qty || 1);
        }
      });

      // Add new components not in preset
      selected.forEach(currComp => {
        const inPreset = (presetBaseComponents || []).find(p => p.id === currComp.id);
        if (!inPreset) {
          basicTotal += (currComp.price || 0) * (currComp.qty || 1);
        } else if (inPreset.qty !== currComp.qty) {
          // If quantity changed, add the difference
          basicTotal += (currComp.price || 0) * ((currComp.qty || 1) - (inPreset.qty || 1));
        }
      });
    } else {
      basicTotal = selected.reduce(
        (sum, item) => sum + (item.price || 0) * (item.qty || 1),
        0
      );
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
      
      let isHidden = isBimetallic || isLoadcell || isGrandTotal || isDieRotation || isLeverScreenChanger;
      if (machineType === "mono" || machineType === "aba") {
        if (isDieRotation) {
          isHidden = false;
        }
      }

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
      basicTotal: isExport ? Math.ceil(basicTotal * EXPORT_PRICE_MARKUP / rate) : basicTotal,
      addonsTotal: isExport ? Math.ceil(addonsTotal * EXPORT_PRICE_MARKUP / rate) : addonsTotal,
      beforeMargin: isExport ? Math.ceil(beforeMargin * EXPORT_PRICE_MARKUP / rate) : beforeMargin,
      withMarkup: isExport ? Math.ceil(withMarkup * EXPORT_PRICE_MARKUP / rate) : withMarkup,
      afterDiscount: isExport ? Math.ceil(afterDiscount * EXPORT_PRICE_MARKUP / rate) : afterDiscount,
      totalWithAddons: isExport ? Math.ceil((afterDiscount + addonsTotal) * EXPORT_PRICE_MARKUP / rate) : (afterDiscount + addonsTotal),
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
                desc: overrides[`${item.id}-cf`] !== undefined ? overrides[`${item.id}-cf`] : cfDesc,
              },
              {
                id: `${item.id}-winder`,
                name: item.name.replace(/Secondary Nip & /i, ""),
                qty: item.qty || 1,
                desc: overrides[`${item.id}-winder`] !== undefined ? overrides[`${item.id}-winder`] : winderDesc,
              }
            ];
          } else {
            return [
              {
                id: `${item.id}-nip`,
                name: "Secondary Nip Assembly",
                qty: 1,
                desc: overrides[`${item.id}-nip`] !== undefined ? overrides[`${item.id}-nip`] : nipDesc,
              },
              {
                id: `${item.id}-winder`,
                name: item.name.replace(/Secondary Nip & /i, ""),
                qty: item.qty || 1,
                desc: overrides[`${item.id}-winder`] !== undefined ? overrides[`${item.id}-winder`] : winderDesc,
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
      if (item.id === "winder-manual-back-to-back-dynamic") return false;
      // IBC chiller cards are optional-equipment-only — never include in scope of supply
      if (item.id === "chiller-ibc-dynamic" || item.id === "chiller-ibc-water-dynamic") return false;
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
              desc: overrides[`${item.id}-cf`] !== undefined ? overrides[`${item.id}-cf`] : "if there is hauloff then hauloff will come with collapsing frame",
            },
            {
              id: `${item.id}-winder`,
              name: item.name.replace(/Secondary Nip & /i, ""),
              qty: item.qty || 1,
              desc: overrides[`${item.id}-winder`] !== undefined ? overrides[`${item.id}-winder`] : winderDesc,
            }
          ];
        } else {
          return [
            { id: `${item.id}-nip`, name: "Secondary Nip Assembly", qty: 1, desc: overrides[`${item.id}-nip`] !== undefined ? overrides[`${item.id}-nip`] : nipDesc },
            { id: `${item.id}-winder`, name: item.name.replace(/Secondary Nip & /i, ""), qty: item.qty || 1, desc: overrides[`${item.id}-winder`] !== undefined ? overrides[`${item.id}-winder`] : winderDesc }
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
      return n.includes("collapsing") || c.includes("collapsing") || c.includes("main nip") || n.includes("main nip");
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

    let computedImagePath = "/images/machines/5 layer.png";
    if (machineType === "mono") computedImagePath = "/images/machines/mono.png";
    else if (machineType === "aba") computedImagePath = "/images/machines/aba.png";
    else if (machineType === "3layer") computedImagePath = "/images/machines/3layer.png";
    else if (machineType === "5layer") computedImagePath = "/images/machines/5 layer.png";
    else if (machineType === "7layer" || machineType === "9layer") computedImagePath = "/images/machines/Multilayer.png";

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
        coverImage: computedImagePath,
      },
      machine_image: computedImagePath,
      machine_details: { ...machineDetails, machineImagePath: computedImagePath },
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

        if (machineType === "mono" || machineType === "aba") {
          // Die rotation is now a genuine, customer-chosen optional addon for
          // mono/ABA (no longer pre-included in the preset) — list it like
          // any other optional equipment instead of hiding it.
          if (a.id === "winder-manual-back-to-back-dynamic") return true;
          return !isBimetallic && !isLoadcell && !isGrandTotal && !isLeverScreenChanger;
        }

        return !isBimetallic && !isLoadcell && !isGrandTotal && !isDieRotation && !isLeverScreenChanger && a.id !== "winder-manual-back-to-back-dynamic";
      }).map((a, idx) => {
        const rawPrice = (a.price || 0) * (a.qty || 1);
        const convertedPrice = isExport ? (rawPrice * EXPORT_PRICE_MARKUP / rate) : rawPrice;
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
          machineDetails.maxOutputKgHr || safeCustomer.maxPump || "",
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

  // ---------------- EXPORT: KIOSK QR (html2pdf + KioskFlyer template) ----------------

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
        image: { type: 'png' },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
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
              presetBaseComponents,
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
          presetBaseComponents,
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
    if (typeof window === "undefined" || !router.isReady) return;
    const loadUrl = router.query.loadUrl;
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
      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, [router.isReady, router.query.loadUrl]);

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
        if (Array.isArray(r.presetBaseComponents)) setPresetBaseComponents(r.presetBaseComponents);

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

  // ---------------- EXPORT: PRO PDF (html2pdf + AdroitQuotation template) ----------------

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

      const element = container.querySelector("#adroit-quotation-root");
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
    presetBasePrice,
    setPresetBasePrice,
    presetBaseComponents,
    setPresetBaseComponents,

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
    exportProPdf,
    importJsonFile,
    resetAll,
    generateKioskQR,
    saveLeadWithBase64Pdf,
    buildWordContext,
    updateAddonPricing,
    refreshCatalog,
  };


  return (
    <ConfigContext.Provider value={value}>
      {children}
      {modalItem && (() => {
        const item = modalItem.item || modalItem;

        // Normalise techDesc into display rows, stripping any "hidden" sentinel values.
        const normalizedRows = toTechRows(item.techDesc);
        const techRows = normalizedRows.length > 0 ? normalizedRows : null;

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
