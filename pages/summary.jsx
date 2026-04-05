"use client";

import { useContext, useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { ConfigContext } from "../src/ConfigContext";
import { numberToWords } from "../utils/numberToWords";
import { generateScopeDesc } from "../src/utils/generateScopeDesc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SEO from "../components/SEO";
import { AdroitQuotation } from "../src/components/quotation/AdroitQuotation";
import { AdroitQuotation2 } from "../src/components/quotation/AdroitQuotation2";
import { Modal } from '../components/ui/Modal';
import { QRCodeSVG } from 'qrcode.react';
import dynamic from "next/dynamic";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <button className="bg-gray-400 text-white px-6 py-3 rounded-xl font-bold">
        Loading PDF Engine...
      </button>
    ),
  }
);
import { MasterQuotationPDF } from '../src/components/quotation/ProfessionalPDF/MasterQuotationPDF';

// ─── FORMAT HELPERS ───────────────────────────────────────────────────────────

/** Format a number as Rs. 1,80,00,000/- */
function fmtRupees(n) {
  if (n == null || isNaN(n)) return "";
  return "Rs. " + Math.round(n).toLocaleString("en-IN") + "/-";
}

/** Number in words with Rupees prefix */
function fmtWords(n) {
  if (n == null || isNaN(n)) return "";
  if (n === 0) return "(RUPEES ZERO ONLY)";
  try {
    const w = numberToWords(Math.round(n));
    return w ? `(${w} Only)`.toUpperCase() : "";
  } catch {
    return "";
  }
}

// ─── buildMachineCode ─────────────────────────────────────────────────────────
function buildMachineCode({ machineType, currentMachineModel, selectedMachineModelLabel, selected, customLayflat, customRollerWidth }) {
  const SERIES = { mono: "AE-Unoflex", aba: "AE-Duoflex", "3layer": "AE-Innoflex", "5layer": "AE-Innoflex" };

  const presetLabel = selectedMachineModelLabel || "";
  const seriesBase = SERIES[machineType] || "AE";

  const extruders = (selected || []).filter(item =>
    item.category === "Extruder" ||
    (item.name || "").toLowerCase().includes("extruder") ||
    (item.id || "").includes("ext-")
  );

  let screwStr = "";
  if (extruders.length > 0) {
    const sizes = [];
    extruders.forEach(ext => {
      const qty = ext.qty || 1;
      let sz = ext.sizeMm;
      if (!sz) {
        const m = (ext.name || "").match(/\b(\d{2,3})\s*mm/i);
        if (m) sz = parseInt(m[1]);
      }
      if (sz) {
        for (let i = 0; i < qty; i++) sizes.push(sz);
      }
    });

    let ordered = [...sizes];
    if (ordered.length >= 3 && ordered.length % 2 !== 0) {
      const sorted = [...sizes].sort((a, b) => b - a);
      let temp = [];
      let placeLeft = false;
      for (let i = 0; i < sorted.length; i++) {
        if (i === 0) temp.push(sorted[i]);
        else {
          if (placeLeft) temp.unshift(sorted[i]);
          else temp.push(sorted[i]);
          placeLeft = !placeLeft;
        }
      }
      ordered = temp;
    }

    if (ordered.length > 0) screwStr = ordered.join("*");
  }

  const roller = (customRollerWidth || "").replace(/[^\d]/g, '');
  let code = roller || presetLabel || seriesBase;
  if (screwStr) code += `_${screwStr}`;

  return code;
}

// ─── getMachineHeading ────────────────────────────────────────────────────────
function getMachineHeading(machineType, customer, currentMachineModel) {
  const modelLabel = customer?.machineModel || "";
  let familyLabel = "";

  // 1. Detect family from model label prefix if possible
  if (modelLabel.toUpperCase().startsWith("UNOFLEX")) {
    familyLabel = "Unoflex Monolayer";
  } else if (modelLabel.toUpperCase().startsWith("DUOFLEX")) {
    familyLabel = "Duoflex ABA / AB";
  } else if (modelLabel.toUpperCase().startsWith("INNOFLEX")) {
    familyLabel = "Innoflex";
  } else {
    // 2. Fallback to machineType
    const labels = {
      mono: "Unoflex Monolayer",
      aba: "Duoflex ABA / AB",
      "3layer": "Innoflex 3 Layer",
      "5layer": "Innoflex 5 Layer"
    };
    familyLabel = labels[machineType] || "Machine";
  }

  let outputText = "";
  if (currentMachineModel && typeof currentMachineModel === "object") {
    for (const key of ["OUTPUT", "Output", "Max. Output (kg/hr)", "Max Output (kg/hr)"]) {
      if (currentMachineModel[key]) { outputText = String(currentMachineModel[key]); break; }
    }
  }

  let text = familyLabel;
  // Only append modelLabel if it's not identical to familyLabel
  if (modelLabel && !familyLabel.includes(modelLabel)) {
    text += ` — ${modelLabel}`;
  }
  if (outputText) text += ` (Output: ${outputText})`;
  return text;
}

// ─── buildProposalData ────────────────────────────────────────────────────────
/**
 * Single function that assembles all proposal data from live context.
 * Called once in useMemo — result feeds both PDF paths.
 */
function buildProposalData({
  customer, machineType, currentMachineModel, selectedMachineModelLabel,
  selected, selectedAddons, customOutput, customLayflat, customRollerWidth,
  withMarkup, afterDiscount, addonsTotal, discount, markup,
  machineModelIndex, customMode, scopeOverrides,
  // Add UI persistence flags
  quoteTemplate, showPricingFields,
  presetBasePrice,
}) {
  const SERIES = { mono: "Unoflex", aba: "Duoflex", "3layer": "Innoflex", "5layer": "Innoflex" };
  const TYPE_NAMES = {
    mono: "MONOLAYER BLOWN FILM LINE",
    aba: "ABA / AB CO-EXTRUSION BLOWN FILM LINE",
    "3layer": "THREE LAYER CO-EXTRUSION BLOWN FILM LINE",
    "5layer": "FIVE LAYER CO-EXTRUSION BLOWN FILM LINE",
  };
  const PRODUCTS = {
    mono: "High Quality Monolayer Film",
    aba: "High Quality ABA Co-Extrusion Film",
    "3layer": "High Quality Three Layer Co-Extruded Film",
    "5layer": "High Quality Five Layer Co-Extruded Film",
  };

  const m = currentMachineModel || {};
  let displaySeries = SERIES[machineType] || "AE Machine";
  let displayType = TYPE_NAMES[machineType] || "";
  let displayProduct = PRODUCTS[machineType] || "High Quality Blown Film";

  // Auto-correct branding if model label implies a different series
  const modelCap = (selectedMachineModelLabel || "").toUpperCase();
  if (modelCap.includes("UNOFLEX")) {
    displaySeries = "Unoflex";
    displayType = TYPE_NAMES.mono;
  } else if (modelCap.includes("DUOFLEX")) {
    displaySeries = "Duoflex";
    displayType = TYPE_NAMES.aba;
  } else if (modelCap.includes("INNOFLEX")) {
    displaySeries = "Innoflex";
    displayType = TYPE_NAMES["3layer"];
    displayProduct = PRODUCTS["3layer"];
  }

  // Also sync displayProduct if brand was changed
  if (modelCap.includes("UNOFLEX")) displayProduct = PRODUCTS.mono;
  if (modelCap.includes("DUOFLEX")) displayProduct = PRODUCTS.aba;
  const machineCode = buildMachineCode({
    machineType, currentMachineModel, selectedMachineModelLabel, selected, customLayflat, customRollerWidth,
  });

  const maxOutput = customOutput?.trim() ||
    m["Max. Output (kg/hr)"] || m["OUTPUT"] || m["Output"] || m["Max Output (kg/hr)"] || "";
  const layflatWidth = customLayflat?.trim() ||
    m["Layflat Width (mm)"] || m["Lay Flat Width"] || m["WIDTH"] || m["Width"] || m["layflat"] || "";
  const dieSize = m["Die Size"] || m["DIE"] || m["Die"] || "";
  const thicknessRange = m["Thichness Range (micron)"] || m["Thickness Range (micron)"] || m["THICKNESS"] || "20 – 150 micron";

  function autoScopeDesc(item) {
    const desc = item.shortDesc || item.cardDesc || "";
    // User requested to remove quantity prefix as it's often redundant or unwanted in this view
    return desc || item.name || "";
  }

  const basicPriceStr = fmtRupees(withMarkup);
  const basicPriceWords = fmtWords(withMarkup);
  const discPriceStr = (discount > 0) ? fmtRupees(afterDiscount) : "";
  const discPriceWords = (discount > 0) ? fmtWords(afterDiscount) : "";
  const finalPriceStr = (discount > 0) ? fmtRupees(afterDiscount) : basicPriceStr;
  const finalPriceWords = (discount > 0) ? fmtWords(afterDiscount) : basicPriceWords;

  const selectedAddonsSafe = selectedAddons || [];
  const winderTowerAddonsRaw = selectedAddonsSafe.filter(item => {
    if (!item || !item.name) return false;
    const n = item.name.toLowerCase();
    const c = (item.category || "").toLowerCase();
    const isTrim = n.includes("trim");
    const isControl = n.includes("panel") || c.includes("panel") || n.includes("control") || c.includes("control");
    return (n.includes("winder") || c.includes("winder") || n.includes("tower") || c.includes("tower")) && !isTrim && !isControl;
  });
  const realAddonsRaw = selectedAddonsSafe.filter(item => {
    if (!item || !item.name) return false;
    const n = item.name.toLowerCase();
    const c = (item.category || "").toLowerCase();
    const isWinderTower = n.includes("winder") || c.includes("winder") || n.includes("tower") || c.includes("tower");
    const isTrim = n.includes("trim");
    return !isWinderTower || isTrim;
  });

  const optItems = realAddonsRaw
    .map(item => ({
      id: item.id || "",
      name: item.customName || item.name || "",
      qty: item.qty || 1,
      image: item.image || "",
      shortDesc: item.shortDesc || item.cardDesc || "",
      techDesc: item.techDesc || {},
      price: item.price != null
        ? fmtRupees(item.price * (item.qty || 1))
        : "",
      rawPrice: (item.price || 0) * (item.qty || 1),
    }));

  const addonsTotalStr = addonsTotal != null ? fmtRupees(addonsTotal) : "";

  // Build dynamic component scope items with overrides
  const overrides = scopeOverrides || {};
  let hasExtruder = false;

  const selectedScopeItems = (selected || [])
    .filter(item => item && item.name)
    .map(item => {
      const c = (item.category || "").toLowerCase();
      // Deduplicate extruders — generateScopeDesc groups them all into one line
      const isExtruder = c.includes("extruder") || (item.name || "").toLowerCase().includes("extruder") || (item.id || "").includes("ext-");
      if (isExtruder) {
        if (hasExtruder) return null;
        hasExtruder = true;
      }

      // Deduplicate Control Panels as they are now injected statically
      const isControl = c.includes("panel") || (item.name || "").toLowerCase().includes("panel") || c.includes("control") || (item.name || "").toLowerCase().includes("control");
      if (isControl) return null;

      // Hide internal components whose text is merged into parent items
      if (c.includes("collapsing frame") || c.includes("filter")) {
        return null;
      }

      const key = item.id || item.name;
      const customDesc = overrides[key];
      const autoDesc = generateScopeDesc(item, selected, currentMachineModel);
      const finalDesc = customDesc !== undefined ? customDesc : autoDesc;

      return {
        id: item.id || "",
        name: isExtruder ? "Extruders" : (item.name || ""),
        qty: isExtruder ? 1 : (item.qty || 1),
        image: item.image || "", shortDesc: finalDesc,
        scopeDesc: autoScopeDesc({ ...item, name: isExtruder ? "Extruders" : item.name, shortDesc: finalDesc }),
        techDesc: item.techDesc || {},
        _autoDesc: autoDesc
      };
    })
    .filter(Boolean);

  const winderTowerScopeItems = winderTowerAddonsRaw.map(item => {
    const key = item.id || item.name;
    const customDesc = overrides[key];
    const autoDesc = generateScopeDesc(item, selected, currentMachineModel) || item.shortDesc || item.cardDesc;
    const finalDesc = customDesc !== undefined ? customDesc : autoDesc;

    return {
      id: item.id || "",
      name: item.name || "",
      qty: item.qty || 1,
      image: item.image || "",
      shortDesc: finalDesc,
      techDesc: item.techDesc || {},
      _autoDesc: autoDesc
    };
  });

  const annexureComponents = (selected || [])
    .filter(item => item && item.name)
    .map(item => {
      const c = (item.category || "").toLowerCase();
      // Only exclude inner-utility items 
      if (c.includes("collapsing frame") || c.includes("filter")) {
        return null;
      }
      
      // EXCLUDE ADDONS: Addons are typically items with a price > 0 in the configurator,
      // but some main components (like large extruders) also have prices.
      // We explicitly preserve core machine components in the technical annexure.
      const isCore = c.includes("extruder") || c.includes("die") || c.includes("ring") || 
                     c.includes("haul") || c.includes("winder") || c.includes("tower") ||
                     (item.name || "").toLowerCase().includes("extruder");
      
      const isAddon = (item.price > 0 || c.includes("addon") || c.includes("optional")) && !isCore;
      if (isAddon) return null;

      return {
        id: item.id || "",
        name: item.name || "",
        qty: item.qty || 1,
        image: item.image || "",
        shortDesc: item.shortDesc || item.cardDesc || "",
        techDesc: item.techDesc || {},
      };
    })
    .concat(winderTowerScopeItems)
    .filter(Boolean);

  const hasSelectedTower = [...selectedScopeItems, ...winderTowerAddonsRaw].some(item => {
    const n = (item.name || "").toLowerCase();
    const c = (item.category || "").toLowerCase();
    return n.includes("tower") || c.includes("tower");
  });

  // ── Static items  ───────────────────────────────────────────────────────────
  const staticItems = [
    {
      id: "auto_idler", name: "Idler Rollers", qty: 1, image: "",
      shortDesc: "Aluminum Idler rollers as per layout drawing.",
      scopeDesc: autoScopeDesc({ name: "Idler Rollers", shortDesc: "Aluminum Idler rollers as per layout drawing." }),
      techDesc: {},
      _autoDesc: "Aluminum Idler rollers as per layout drawing."
    },
    {
      id: "auto_secnip", name: "Secondary Nip", qty: 1, image: "",
      shortDesc: "One Secondary nip with edge slitting assembly and edge trimming assembly.",
      scopeDesc: autoScopeDesc({ name: "Secondary Nip", shortDesc: "One Secondary nip with edge slitting assembly and edge trimming assembly." }),
      techDesc: {},
      _autoDesc: "One Secondary nip with edge slitting assembly and edge trimming assembly."
    },
    !hasSelectedTower && {
      id: "auto_tower", name: "Tower Structure", qty: 1, image: "",
      shortDesc: "Tower Structure to support and mount Bubble stabilizing Basket, Collapsing Frame, Oscillating Haul Off, Secondary Nip, Web aligner, Corona Treater etc.",
      scopeDesc: autoScopeDesc({ name: "Tower Structure", shortDesc: "Tower Structure to support and mount Bubble stabilizing Basket, Collapsing Frame, Oscillating Haul Off, Secondary Nip, Web aligner, Corona Treater etc." }),
      techDesc: {},
      _autoDesc: "Tower Structure to support and mount Bubble stabilizing Basket, Collapsing Frame, Oscillating Haul Off, Secondary Nip, Web aligner, Corona Treater etc."
    },
    {
      id: "auto_control", name: "Control Panel", qty: 1, image: "",
      shortDesc: "Complete extrusion controls on main panel with Cold start protection and with Touch Panel.",
      scopeDesc: autoScopeDesc({ name: "Control Panel", shortDesc: "Complete extrusion controls on main panel with Cold start protection and with Touch Panel." }),
      techDesc: {},
      _autoDesc: "Complete extrusion controls on main panel with Cold start protection and with Touch Panel."
    }
  ].filter(Boolean);

  // Extra free-form rows from the editable blank rows in the scope editor
  const MIN_SCOPE_ROWS = 11;
  const numExtra = Math.max(0, MIN_SCOPE_ROWS - (selectedScopeItems.length + winderTowerScopeItems.length + staticItems.length));
  const extraScopeItems = Array.from({ length: numExtra }, (_, i) => {
    const desc = (overrides[`_extra_${i}`] || "").trim();
    return {
      id: `_extra_${i}`, name: "", qty: desc ? 1 : "",
      image: "", shortDesc: desc, scopeDesc: desc, techDesc: {}, _isExtra: true,
    };
  }).filter(item => item.shortDesc !== "");

  const finalScope = getSortedScope([...selectedScopeItems, ...winderTowerScopeItems, ...staticItems])
    .concat(extraScopeItems)
    .map((item, i) => ({
      ...item,
      sr: i + 1,
      description: item.scopeDesc || item.shortDesc || item.name || '',
    }));

  // Refine SORT_ORDER index logic to put panel/control at the absolute bottom
  function getSortedScope(items) {
    const SORT_ORDER = [
      "extruder", "die", "air ring", "basket", "cage", "haul", "idler", "nip",
      "winder", "tower", "panel", "control"
    ];
    return [...items].sort((a, b) => {
      function getIdx(item) {
        const n = String(item.name || "").toLowerCase();
        const d = String(item.shortDesc || "").toLowerCase();
        for (let i = 0; i < SORT_ORDER.length; i++) {
          if (n.includes(SORT_ORDER[i]) || d.includes(SORT_ORDER[i])) return i;
        }
        return 99;
      }
      return getIdx(a) - getIdx(b);
    });
  }

  return {
    customer: {
      name: customer?.name || "", company: customer?.company || "",
      phone: customer?.phone || "", email: customer?.email || "",
      address: customer?.address || "", city: customer?.city || "",
      state: customer?.state || "", gst: customer?.gst || "",
    },
    quotation: {
      refNo: customer?.quotationRef || customer?.ref || "DRAFT",
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }),
    },
    machine: {
      type: machineType || "3layer",
      series: displaySeries,
      fullName: displayType,
      code: machineCode,
      title_line: `${displayType} ${machineCode}`,
      layflat_width: layflatWidth || "",
      coverImage: `/images/machines/${machineType || "3layer"}.png`,
    },
    indicative_performance: {
      product: displayProduct,
      max_output: maxOutput,
      layflat_width: layflatWidth,
      die_size: dieSize,
      thickness_range: thicknessRange,
      thickness_variation: "+/- 8% above 40 micron and +/- 10% upto 40 micron, or +/- 4 micron whichever is higher, over 90% film periphery.",
      raw_materials: "LDPE, LLDPE, HDPE, mLLDPE, etc.",
    },

    components: finalScope,
    annexure_components: annexureComponents,
    optional_items: optItems,
    scope: finalScope,

    pricing: {
      basicPrice: basicPriceStr,
      basicPriceWords: basicPriceWords,
      discountedPrice: discPriceStr,
      discountedWords: discPriceWords,
      finalPrice: finalPriceStr,
      finalPriceWords: finalPriceWords,
      addonsTotal: addonsTotalStr,
      show_price: !!(withMarkup > 0),
      basic_price_inr: withMarkup > 0 ? Math.round(withMarkup) : null,
      basic_price_words: basicPriceWords ? basicPriceWords.replace(/^\(/, '').replace(/\)$/, '') : '',
      final_price_inr: Math.round(discount > 0 ? afterDiscount : withMarkup) || null,
      final_price_words: finalPriceWords ? finalPriceWords.replace(/^\(/, '').replace(/\)$/, '') : '',
    },

    power_loads: (() => {
      const POWER_MAP = [
        { pattern: /35\s*mm/i, category: "Extruder", heating: 9.0, motive: 7.5 },
        { pattern: /40\s*mm/i, category: "Extruder", heating: 10.0, motive: 11.0 },
        { pattern: /45\s*mm/i, category: "Extruder", heating: 12.0, motive: 15.0 },
        { pattern: /50\s*mm/i, category: "Extruder", heating: 14.0, motive: 22.5 },
        { pattern: /55\s*mm/i, category: "Extruder", heating: 15.0, motive: 30.0 },
        { pattern: /60\s*mm/i, category: "Extruder", heating: 15.0, motive: 30.0 },
        { pattern: /65\s*mm/i, category: "Extruder", heating: 18.4, motive: 45.0 },
        { pattern: /75\s*mm/i, category: "Extruder", heating: 22.4, motive: 75.0 },
        { pattern: /90\s*mm/i, category: "Extruder", heating: 24.2, motive: 93.0 },
        { pattern: /100\s*mm/i, category: "Extruder", heating: 31.5, motive: 45.0 },
        { pattern: /haul.?off/i, heating: "", motive: 0 },
        { pattern: /winder/i, heating: "", motive: 11 },
      ];

      function processItem(item, loads) {
        const name = (item.name || "").trim();
        const cat = (item.category || "").trim();
        const qty = item.qty || 1;

        if (cat === "Extruder" || /extruder/i.test(name)) {
          const match = POWER_MAP.find(p => p.category === "Extruder" && p.pattern.test(name));
          loads.push({ name: name.toUpperCase(), qty, heating: match ? match.heating : "", motive: match ? match.motive : "" });
          return;
        }
        if (cat === "Air Ring" || /air\s*ring/i.test(name)) {
          const hpMatch = name.match(/(\d+)\s*hp/i);
          const motiveKw = hpMatch ? (parseFloat(hpMatch[1]) * 0.746).toFixed(1) : "";
          loads.push({ name: name.toUpperCase(), qty, heating: "", motive: motiveKw });
          return;
        }
        if (cat === "Die Head" || /\bdie\b/i.test(name)) {
          loads.push({ name: name.toUpperCase(), qty, heating: 38.30, motive: "" });
          loads.push({ name: "SCREEN CHANGER", qty, heating: 8.60, motive: "" });
          return;
        }
        const rule = POWER_MAP.find(p => !p.category && p.pattern.test(name));
        if (rule) loads.push({ name: name.toUpperCase(), qty, heating: rule.heating, motive: rule.motive });
      }

      const loads = [];
      (selected || []).forEach(item => processItem(item, loads));
      (selectedAddons || []).forEach(item => processItem(item, loads));
      return loads;
    })(),

    _restore: {
      schema: "adroit_v2",
      customer,
      machineType,
      selected,
      selectedAddons,
      markup_percent: markup,
      discount_percent: discount,
      machineModelIndex,
      selectedMachineModelLabel,
      customMode,
      customOutput,
      customLayflat,
      scopeOverrides,
      quotationRef: customer?.quotationRef || customer?.ref,
      // UI flags for perfect restoration
      quoteTemplate, showPricingFields,
      customRollerWidth,
      presetBasePrice,
    }
  };
}

// ─── downloadJson ─────────────────────────────────────────────────────────────
function downloadJson(data) {
  if (!data) { alert("No proposal data yet — fill in customer details first."); return; }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const company = data?.customer?.company || "Draft";
  const ref = data?.quotation?.refNo || "NoRef";
  a.href = url;
  a.download = `Proposal_${company}_${ref}.json`.replace(/[/\\?%*:|"<>]/g, "-");
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ─── PAGE COMPONENT ───────────────────────────────────────────────────────────
export default function SummaryPage() {
  const router = useRouter();
  const quotationRef = useRef(null);

  const {
    customer, setCustomer,
    selected, selectedAddons,
    discount, setDiscount,
    markup, setMarkup,
    showPrices, setShowPrices,
    computePriceSummary,
    machineType, currentMachineModel, selectedMachineModelLabel,
    machineModelIndex, customMode,
    generateKioskQR,
    customOutput, setCustomOutput,
    customLayflat, setCustomLayflat,
    customRollerWidth, setCustomRollerWidth,
    buildWordContext,
  } = useContext(ConfigContext);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  const [qrUrl, setQrUrl] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Handled by Context for perfect JSON restoration
  const { quoteTemplate, setQuoteTemplate, showPricingFields, setShowPricingFields } = useContext(ConfigContext);

  const { scopeOverrides, setScopeOverrides } = useContext(ConfigContext);

  const handleQuotationRefChange = (e) => {
    const value = e.target.value;
    setCustomer(prev => ({ ...prev, quotationRef: value, ref: value }));
  };

  const { withMarkup, afterDiscount, addonsTotal, isPackagePrice } = computePriceSummary();
  const machineHeading = getMachineHeading(machineType, customer, currentMachineModel);

  // Single source of truth — both preview and PDF download use this
  const proposalData = useMemo(() => {
    if (!isClient) return null;
    return buildProposalData({
      customer, machineType, currentMachineModel, selectedMachineModelLabel,
      selected, selectedAddons, customOutput, customLayflat, customRollerWidth,
      withMarkup, afterDiscount, addonsTotal, discount, markup,
      machineModelIndex, customMode, scopeOverrides,
      // Pass UI states
      quoteTemplate, showPricingFields,
      presetBasePrice: computePriceSummary().isPackagePrice ? computePriceSummary().basicTotal : 0, // Fallback if context not direct
    });
  }, [
    isClient, customer, machineType, currentMachineModel, selectedMachineModelLabel,
    selected, selectedAddons, customOutput, customLayflat, customRollerWidth,
    withMarkup, afterDiscount, addonsTotal, discount, markup,
    machineModelIndex, customMode, scopeOverrides,
    quoteTemplate, showPricingFields,
  ]);

  return (
    <div className="min-h-screen bg-brand-light pt-24 sm:pt-28">
      <SEO title="Final Quotation" />

      <main className="max-w-5xl mx-auto py-6 sm:py-12 px-4 sm:px-6">

        {/* ── CUSTOMER DETAILS ─────────────────────────────────────────── */}
        <section className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-brand-blue">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-slate-700">
            <div><span className="text-slate-500">Name: </span>{customer?.name || "-"}</div>
            <div><span className="text-slate-500">Company: </span>{customer?.company || "-"}</div>
            <div><span className="text-slate-500">Phone: </span>{customer?.phone || "-"}</div>
            <div><span className="text-slate-500">Email: </span>{customer?.email || "-"}</div>
            <div className="md:col-span-2"><span className="text-slate-500">Address: </span>{customer?.address || "-"}</div>
            <div><span className="text-slate-500">City: </span>{customer?.city || "-"}</div>
            <div><span className="text-slate-500">State / Country: </span>{customer?.state || ""} {customer?.country || ""}</div>
          </div>
        </section>

        {/* ── QUOTATION SUMMARY ─────────────────────────────────────────── */}
        <section className="glass-card p-8 mb-8">
          <div className="flex items-center justify-between mb-5 gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-blue">Quotation Summary</h1>
            <button
              onClick={() => setShowPricingFields(v => !v)}
              title={showPricingFields ? "Hide pricing controls" : "Show pricing controls"}
              style={{ opacity: 0.5 }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {showPricingFields ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
            </button>
          </div>

          {/* Pricing display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">
                {isPackagePrice ? "Fixed Package Base Price" : "Basic Price (Components Only)"}
              </div>
              <div className="text-xl font-semibold text-emerald-500">
                {fmtRupees(withMarkup) || "₹ 0"}
              </div>
              <div className="text-xs text-slate-400 italic mt-1">{fmtWords(withMarkup)}</div>
            </div>
            {addonsTotal > 0 && (
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Optional Add-ons Total</div>
                <div className="text-xl font-semibold text-amber-500">
                  {fmtRupees(addonsTotal)}
                </div>
                <div className="text-xs text-slate-400 italic mt-1">{fmtWords(addonsTotal)}</div>
              </div>
            )}
          </div>

          {/* Markup & Discount inputs — hidden by default */}
          <div
            style={{
              opacity: showPricingFields ? 1 : 0,
              pointerEvents: showPricingFields ? "auto" : "none",
              maxHeight: showPricingFields ? "200px" : "0px",
              overflow: "hidden",
              transition: "opacity 0.25s ease, max-height 0.3s ease",
            }}
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Markup (%)</label>
                <input
                  type="number" min="0" max="200" step="0.1"
                  value={markup ?? ""}
                  onChange={e => setMarkup(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 20"
                  className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <p className="text-xs text-slate-400 mt-1">Applied on top of component base cost</p>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Discount (%)</label>
                <input
                  type="number" min="0" max="100" step="0.1"
                  value={discount ?? ""}
                  onChange={e => setDiscount(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 5"
                  className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <p className="text-xs text-slate-400 mt-1">Deducted from the marked-up price</p>
              </div>
            </div>
          </div>

          {/* Final Price */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 mb-4">
            <div className="text-xs text-emerald-600 uppercase tracking-wide font-semibold mb-1">
              {discount > 0 ? "Final Price (After Discount)" : "Final Price"}
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              {fmtRupees(discount > 0 ? afterDiscount : withMarkup) || "Rs. 0/-"}
            </div>
            <div className="text-xs text-emerald-500 italic mt-1">
              {fmtWords(discount > 0 ? afterDiscount : withMarkup)}
            </div>
          </div>

          {/* Input fields */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-slate-600 whitespace-nowrap">Quotation Ref No.:</span>
              <input
                type="text"
                value={
                  // If user has already typed a custom ref, or we have a saved non-default one, use it.
                  // Otherwise, show the dynamic AE/[REG]/[ROLLER]/01 format.
                  (customer?.quotationRef && !customer.quotationRef.startsWith("AET/") && customer.quotationRef !== "Loading...")
                    ? customer.quotationRef 
                    : (customer?.ref && !customer.ref.startsWith("AET/"))
                      ? customer.ref
                      : `AE/${customer?.region || 'DOM'}/${(customRollerWidth || '').replace(/[^\d]/g, '') || '0000'}/01`
                }
                onChange={handleQuotationRefChange}
                className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono font-bold"
                placeholder="e.g. AE/DOM/1350/01"
              />
              <span className="text-slate-500">
                Date: {new Date().toLocaleDateString("en-IN")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Target Output (kg/hr)</label>
                <input
                  type="text"
                  value={customOutput || ""}
                  onChange={e => setCustomOutput(e.target.value)}
                  placeholder={
                    currentMachineModel?.["Max. Output (kg/hr)"] ||
                    currentMachineModel?.["OUTPUT"] ||
                    "e.g. 350 kg/hr"
                  }
                  className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Max. Roller Width ({machineType === 'mono' || machineType === 'aba' ? 'inch' : 'mm'})
                </label>
                <input
                  type="text"
                  value={customRollerWidth || ""}
                  onChange={e => {
                    const val = e.target.value;
                    setCustomRollerWidth(val);
                    const num = parseInt(val.replace(/[^\d]/g, ''), 10);
                    if (!isNaN(num)) {
                      if (machineType === 'mono' || machineType === 'aba') {
                         setCustomLayflat(`${num * 25} mm`);
                      } else {
                         setCustomLayflat(`${num - 125} mm`);
                      }
                      // Also sync the Ref if it follows the AE/REG/ROLLER/ pattern
                      setCustomer(prev => {
                        const currentRef = prev.quotationRef || prev.ref || "";
                        if (!currentRef || currentRef.startsWith("AE/") || currentRef.startsWith("AET/")) {
                           const region = prev.region || "DOM";
                           let prefix = "";
                           if (machineType === "mono") prefix = "U";
                           else if (machineType === "aba") prefix = "D";
                           const newRef = `AE/${region}/${prefix}${num}/01`;
                           return { ...prev, quotationRef: newRef, ref: newRef };
                        }
                        return prev;
                      });
                    }
                  }}
                  placeholder="e.g. 1350 mm"
                  className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Max. Layflat Width (mm)</label>
                <input
                  type="text"
                  value={customLayflat || ""}
                  onChange={e => setCustomLayflat(e.target.value)}
                  placeholder="e.g. 1225 mm"
                  className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            <p className="text-sm text-slate-600">{machineHeading || "Configured machine"}</p>

            {proposalData?.machine?.code && (
              <p className="text-xs text-slate-400 font-mono">
                Proposal model code: <strong className="text-slate-600">{proposalData.machine.code}</strong>
              </p>
            )}
          </div>

          {/* ── SCOPE OF SUPPLY EDITOR ─────────────────────────────────── */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-brand-blue">Scope of Supply</h3>
              <span className="text-xs text-slate-400">Auto-generated • edit to override</span>
            </div>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-brand-blue text-white">
                    <th className="w-12 py-2 px-3 text-center font-semibold text-xs tracking-wide">ITEM #</th>
                    <th className="py-2 px-3 text-left font-semibold text-xs tracking-wide">ITEM DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {(proposalData?.scope || []).map((item, i) => {
                    const key = item.id || item.name;

                    if (item.id === "auto_idler" || item.id === "auto_secnip") {
                      return (
                        <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                          <td className="py-2 px-3 text-center font-bold text-slate-400 align-top">
                            {i + 1}
                          </td>
                          <td className="py-2 px-3 text-xs text-slate-600 align-top italic">
                            {item._autoDesc}
                            <span className="ml-2 text-slate-300 not-italic">(static)</span>
                          </td>
                        </tr>
                      );
                    }

                    if (item._isExtra) {
                      const val = scopeOverrides[key] !== undefined ? scopeOverrides[key] : "";
                      return (
                        <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                          <td className="py-2 px-3 text-center font-bold text-slate-300 align-top">
                            {i + 1}
                          </td>
                          <td className="py-1 px-2 align-top">
                            <textarea
                              rows={3}
                              value={val}
                              onChange={e => setScopeOverrides(prev => ({ ...prev, [key]: e.target.value }))}
                              placeholder="Type additional scope item description..."
                              className="w-full rounded-lg border border-dashed border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white resize-y leading-relaxed placeholder-slate-300"
                              style={{ minHeight: "52px" }}
                            />
                          </td>
                        </tr>
                      );
                    }

                    const currentVal = scopeOverrides[key] !== undefined
                      ? scopeOverrides[key]
                      : (item._autoDesc || "");
                    const hasOverride = scopeOverrides[key] !== undefined;

                    return (
                      <tr key={key || i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="py-2 px-3 text-center font-bold text-brand-blue align-top">
                          {i + 1}
                        </td>
                        <td className="py-1 px-2 align-top">
                          <div className="text-xs font-semibold text-slate-500 mb-0.5">{item.name}</div>
                          <textarea
                            rows={3}
                            value={currentVal}
                            onChange={e => setScopeOverrides(prev => ({ ...prev, [key]: e.target.value }))}
                            placeholder={item._autoDesc || "Type description for proposal..."}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-y leading-relaxed"
                            style={{ minHeight: "52px" }}
                          />
                          {hasOverride && (
                            <button
                              onClick={() => setScopeOverrides(prev => {
                                const next = { ...prev };
                                delete next[key];
                                return next;
                              })}
                              className="text-xs text-slate-400 hover:text-red-400 mt-0.5 transition-colors"
                            >
                              ↩ Reset to default
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:justify-end mt-2">
            <button
              onClick={() => downloadJson(proposalData)}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <span>Download Json file</span>
            </button>

            <button
              onClick={() => generateKioskQR(setQrUrl)}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <span>📱 Budgetary Quotation (QR)</span>
            </button>

            <button onClick={() => setShowPdfPreview(true)} className="w-full sm:w-auto btn-primary">
              Download Proposal
            </button>
          </div>
        </section>

        {/* ── QR MODAL ──────────────────────────────────────────────────── */}
        <Modal open={!!qrUrl} onClose={() => setQrUrl(null)} title="Scan to Download">
          <div className="flex flex-col items-center p-6 text-center">
            <div className="bg-white p-4 rounded-xl shadow-xl mb-4 border border-gray-200">
              {qrUrl && <QRCodeSVG value={qrUrl} size={250} />}
            </div>
            <p className="text-sm text-gray-500 mb-2 break-all max-w-sm">{qrUrl}</p>
            <div className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded">
              Ensure phone is connected to <strong>Exhibition WiFi</strong>
            </div>
            <button onClick={() => setQrUrl(null)} className="mt-6 text-indigo-600 font-bold">Close</button>
          </div>
        </Modal>

        {/* ── BASIC COMPONENTS TABLE ────────────────────────────────────── */}
        <section className="glass-card p-6 mb-8">
          <h3 className="text-sm font-semibold mb-4 text-brand-blue">Basic Machine Components</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Component</th>
                  <th className="px-3 py-2 text-right font-semibold w-16 text-slate-700">Qty</th>
                </tr>
              </thead>
              <tbody>
                {selected.length === 0 ? (
                  <tr><td colSpan={2} className="px-3 py-3 text-center text-slate-400">No basic components selected.</td></tr>
                ) : (
                  selected.map((item, idx) => (
                    <tr key={item.id || idx} className="border-t border-slate-100">
                      <td className="px-3 py-2 align-top text-slate-900">{item.name}</td>
                      <td className="px-3 py-2 align-top text-right text-slate-900">{item.qty || 1}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── OPTIONAL EQUIPMENTS TABLE ─────────────────────────────────── */}
        <section className="glass-card p-6 mb-8">
          <h3 className="text-sm font-semibold mb-4 text-brand-blue">Optional Equipments</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Component</th>
                  <th className="px-3 py-2 text-right font-semibold w-16 text-slate-700">Qty</th>
                  <th className="px-3 py-2 text-right font-semibold w-28 text-slate-700">Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedAddons.length === 0 ? (
                  <tr><td colSpan={3} className="px-3 py-3 text-center text-slate-400">No optional equipments selected.</td></tr>
                ) : (
                  <>
                    {selectedAddons.map((addon, idx) => (
                      <tr key={addon.id || idx} className="border-t border-slate-100">
                        <td className="px-3 py-2 align-top text-slate-900">
                          {addon.customName || addon.name}
                        </td>
                        <td className="px-3 py-2 align-top text-right text-slate-900">{addon.qty || 1}</td>
                        <td className="px-3 py-2 align-top text-right text-slate-500">
                          {addon.price != null
                            ? `₹${(addon.price * (addon.qty || 1)).toLocaleString("en-IN")}`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                    {addonsTotal != null && (
                      <tr className="border-t-2 border-slate-300 bg-slate-50">
                        <td colSpan={2} className="px-3 py-2 text-right font-semibold text-slate-700">Total Rs.</td>
                        <td className="px-3 py-2 text-right font-semibold text-emerald-600">
                          ₹{addonsTotal.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SELECTED IMAGES ───────────────────────────────────────────── */}
        <section className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-brand-blue">Selected Images</h3>
            <div className="text-xs text-slate-500">{selected.length + selectedAddons.length} items</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...selected, ...selectedAddons].map((item, idx) => (
              <div key={`${item.id || idx}-img`} className="rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-slate-50 flex items-center justify-center">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                    : <span className="text-xs text-slate-400">No image</span>
                  }
                </div>
                <div className="px-3 py-2 text-center text-xs">
                  <div className="font-semibold text-slate-900">
                    {item.customName || item.name}
                  </div>
                  <div className="text-slate-500">Qty: {item.qty || 1}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── PDF PREVIEW OVERLAY ───────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        zIndex: showPdfPreview ? 9999 : -1,
        visibility: showPdfPreview ? "visible" : "hidden",
        backgroundColor: showPdfPreview ? "rgba(0,0,0,0.55)" : "transparent",
        overflowY: showPdfPreview ? "auto" : "hidden",
        display: "flex", flexDirection: "column", alignItems: "center",
        pointerEvents: showPdfPreview ? "auto" : "none",
      }}>
        {showPdfPreview && (
          <div style={{
            position: "sticky", top: 0, zIndex: 10000,
            backgroundColor: "#1e293b", width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "16px", padding: "12px 24px", flexShrink: 0, flexWrap: "wrap",
          }}>
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>
              Preview — confirm then download
            </span>
            {/* Template toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#334155", borderRadius: "8px", padding: "3px" }}>
              {[{ k: "classic", label: "📄 Adroit Classic" }, { k: "v2", label: "✨ New Style" }].map(({ k, label }) => (
                <button key={k} onClick={() => setQuoteTemplate(k)}
                  style={{ backgroundColor: quoteTemplate === k ? "#2563eb" : "transparent", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 12px", fontWeight: quoteTemplate === k ? 700 : 400, cursor: "pointer", fontSize: "12px", transition: "background 0.2s" }}
                >{label}</button>
              ))}
            </div>
            <button
              onClick={async () => {
                const el = quotationRef.current;
                if (!el) { alert("Ref error"); return; }
                const allImgs = Array.from(el.querySelectorAll("img"));
                await Promise.all(allImgs.map(img =>
                  img.complete ? Promise.resolve()
                    : new Promise(res => { img.onload = res; img.onerror = res; })
                ));
                await new Promise(r => setTimeout(r, 200));
                const html2canvas = (await import("html2canvas")).default;
                const { jsPDF } = await import("jspdf");
                const PAGE_W_PX = 794, PAGE_H_PX = 1123;
                const A4_W_MM = 210, A4_H_MM = 297;
                const pageDivs = Array.from(el.children || []).filter(
                  c => c.style && (c.style.pageBreakAfter || c.style.breakAfter)
                );
                const pageList = pageDivs.length > 0 ? pageDivs : [el];
                const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
                for (let i = 0; i < pageList.length; i++) {
                  const canvas = await html2canvas(pageList[i], {
                    scale: 2, useCORS: true, allowTaint: true,
                    backgroundColor: "#ffffff", logging: false,
                    width: PAGE_W_PX, height: PAGE_H_PX,
                    windowWidth: PAGE_W_PX, windowHeight: PAGE_H_PX,
                    x: 0, y: 0,
                  });
                  const imgData = canvas.toDataURL("image/jpeg", 0.95);
                  if (i > 0) pdf.addPage();
                  pdf.addImage(imgData, "JPEG", 0, 0, A4_W_MM, A4_H_MM);
                }
                pdf.save(`Proposal for ${customer.company}_${customer?.quotationRef || "Draft"}.pdf`);
                setShowPdfPreview(false);
              }}
              style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 20px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}
            >⬇ Download PDF</button>
            <button onClick={() => setShowPdfPreview(false)}
              style={{ backgroundColor: "#475569", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "14px" }}
            >✕ Close</button>
          </div>
        )}
        <div style={{ marginTop: "16px", marginBottom: "40px" }}>
          {quoteTemplate === "classic"
            ? <AdroitQuotation ref={quotationRef} data={proposalData} />
            : <AdroitQuotation2 ref={quotationRef} data={proposalData} />
          }
        </div>
      </div>
    </div>
  );
}
