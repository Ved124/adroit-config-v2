"use client";

import { useContext, useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { ConfigContext } from "../src/ConfigContext";
import { numberToWords } from "../utils/numberToWords";
import { generateScopeDesc, generateWinder, generateSecondaryNip } from "../src/utils/generateScopeDesc";
import { EXPORT_PRICE_MARKUP } from "../src/lib/pricing";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SEO from "../components/SEO";
import { AdroitQuotation } from "../src/components/quotation/AdroitQuotation";
import { AdroitQuotation2 } from "../src/components/quotation/AdroitQuotation2";
import { Modal } from '../components/ui/Modal';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '../components/ui/Toast';

// Module-level cache for heavy client-side libraries to avoid ChunkLoadErrors in Next.js dev server hot-reloads
let html2canvasModule = null;
let jsPDFModule = null;

// ─── FORMAT HELPERS ───────────────────────────────────────────────────────────

/** Format a price based on currency (INR/USD) */
function fmtPrice(n, currency = "INR") {
  if (n == null || isNaN(n)) return "";
  if (currency === "USD") {
    // Show USD as whole numbers (already rounded up in logic)
    return "$ " + Math.round(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  return "Rs. " + Math.round(n).toLocaleString("en-IN") + "/-";
}

/** Number in words with Currency prefix */
function fmtWords(n, currency = "INR") {
  if (n == null || isNaN(n)) return "";
  if (n === 0) return currency === "USD" ? "(ZERO DOLLARS ONLY)" : "(INR ZERO ONLY)";
  try {
    const system = currency === "USD" ? "US" : "IN";
    const w = numberToWords(Math.round(n), system);
    if (!w) return "";
    if (currency === "USD") {
      return `(${w} Dollars Only)`.toUpperCase();
    }
    return `(INR ${w} Only)`.toUpperCase();
  } catch {
    return "";
  }
}

/** Normalize a saved phone number into a WhatsApp-dialable digit string
 * (no leading +). Handles bare Indian mobiles, an accidental leading trunk
 * 0, and already-international numbers — same rules as the exhibition
 * send-out tooling, kept in sync so a number that works there works here. */
function normalizeWhatsAppPhone(raw) {
  const trimmed = String(raw || "").trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 10) return "91" + digits;
  if (digits.length === 11 && digits.startsWith("0")) return "91" + digits.slice(1);
  if (trimmed.startsWith("+")) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length >= 11 && digits.length <= 15) return digits;
  return null;
}

const CATALOGUE_QR_URL = "https://ae-qr.vercel.app";

function buildWhatsAppMessage({ name, model, pdfUrl }) {
  return `Hi ${name || "there"}, thank you for your interest in the Adroit Extrusion ${model || "machine"}.

As discussed, here is your quotation:
📄 ${pdfUrl || "(attach the downloaded PDF manually)"}

You can also explore our full product range, catalogue, and machinery videos here:
🌐 ${CATALOGUE_QR_URL}

Any questions, just reply here.

Regards,
Adroit Extrusion`;
}

// ─── buildMachineCode ─────────────────────────────────────────────────────────
function buildMachineCode({ machineType, currentMachineModel, selectedMachineModelLabel, selected, customLayflat, customRollerWidth }) {
  const SERIES = { mono: "Monolayer", aba: "ABA", "3layer": "3 Layer", "5layer": "3 Layer" };

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
      let sz = ext.sizeMm || ext.size || ext.extruder;
      if (sz) sz = parseInt(sz);
      if (!sz) {
        const m = (ext.customName || ext.name || "").match(/\b(\d{2,3})\s*mm/i);
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
  
  if (machineType === "mono" || machineType === "aba") {
    if (roller) {
      code = `${roller}"`;
    }
    if (screwStr) {
      code += `_${screwStr}mm`;
    }
  } else {
    if (screwStr) code += `_${screwStr}`;
  }

  return code;
}

// ─── getMachineHeading ────────────────────────────────────────────────────────
function getMachineHeading(machineType, customer, currentMachineModel) {
  const modelLabel = customer?.machineModel || "";
  let familyLabel = "";

  // 1. Detect family from model label prefix if possible
  if (modelLabel.toUpperCase().startsWith("UNOFLEX")) {
    familyLabel = "Monolayer";
  } else if (modelLabel.toUpperCase().startsWith("DUOFLEX")) {
    familyLabel = "ABA";
  } else if (modelLabel.toUpperCase().startsWith("INNOFLEX")) {
    familyLabel = "3 Layer";
  } else {
    // 2. Fallback to machineType
    const labels = {
      mono: "Monolayer",
      aba: "ABA",
      "3layer": "3 Layer",
      "5layer": "5 Layer"
    };
    familyLabel = labels[machineType] || "Machine";
  }

  let outputText = "";
  if (currentMachineModel && currentMachineModel.maxOutputKgHr) {
    outputText = String(currentMachineModel.maxOutputKgHr);
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
  customer = {}, machineType = "3layer", currentMachineModel = {}, selectedMachineModelLabel = "",
  selected = [], selectedAddons = [], customOutput = "", customLayflat = "", customRollerWidth = "",
  withMarkup = 0, afterDiscount = 0, addonsTotal = 0, discount = 0, markup = 0,
  machineModelIndex = null, customMode = false, scopeOverrides = {},
  // Add UI persistence flags
  quoteTemplate = process.env.NODE_ENV === "development" ? "v2" : "classic", showPricingFields = false,
  showMarkupField = false, showDiscountField = false, showPrices = false,
  showAddonPricing = false,
  conversionRate = 94,
  presetBasePrice = 0,
  currency = "INR",
  rate = 1,
  quotationDate = null,
} = {}) {
  if (machineType === "mono") {
    selected = (selected || []).filter(item => {
      if (!item) return false;
      const n = (item.name || "").toLowerCase();
      const c = (item.category || "").toLowerCase();
      return !(n.includes("tower") || c.includes("tower") || n.includes("platform") || c.includes("platform"));
    });
    selectedAddons = (selectedAddons || []).filter(item => {
      if (!item) return false;
      const n = (item.name || "").toLowerCase();
      const c = (item.category || "").toLowerCase();
      return !(n.includes("tower") || c.includes("tower") || n.includes("platform") || c.includes("platform"));
    });
  }

  const SERIES = { mono: "Monolayer", aba: "ABA", "3layer": "3 Layer", "5layer": "5 Layer" };
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
    displaySeries = "Monolayer";
    displayType = TYPE_NAMES.mono;
  } else if (modelCap.includes("DUOFLEX")) {
    displaySeries = "ABA";
    displayType = TYPE_NAMES.aba;
  } else if (modelCap.includes("INNOFLEX")) {
    displaySeries = "3 Layer";
    displayType = TYPE_NAMES["3layer"];
    displayProduct = PRODUCTS["3layer"];
  }

  // Also sync displayProduct if brand was changed
  if (modelCap.includes("UNOFLEX")) displayProduct = PRODUCTS.mono;
  if (modelCap.includes("DUOFLEX")) displayProduct = PRODUCTS.aba;
  const machineCode = buildMachineCode({
    machineType, currentMachineModel, selectedMachineModelLabel, selected, customLayflat, customRollerWidth,
  });

  const maxOutput = customOutput?.trim() || m.maxOutputKgHr || "";
  const layflatWidth = customLayflat?.trim() || m.layflatWidthMm || "";
  const dieSize = m.dieSizeHmLd || "";
  const thicknessRange = m.thicknessRange || "20 – 150 micron";
  const thicknessVariation = m.thicknessVariation || "+/- 8% above 40 micron and +/- 10% upto 40 micron, or +/- 4 micron whichever is higher, over 90% film periphery.";

  function autoScopeDesc(item) {
    const desc = item.shortDesc || item.cardDesc || "";
    // User requested to remove quantity prefix as it's often redundant or unwanted in this view
    return desc || item.name || "";
  }

  const basicPriceStr = fmtPrice(withMarkup, currency);
  const basicPriceWords = fmtWords(withMarkup, currency);
  const discPriceStr = (discount > 0) ? fmtPrice(afterDiscount, currency) : "";
  const discPriceWords = (discount > 0) ? fmtWords(afterDiscount, currency) : "";
  const finalPriceStr = (discount > 0) ? fmtPrice(afterDiscount, currency) : basicPriceStr;
  const finalPriceWords = (discount > 0) ? fmtWords(afterDiscount, currency) : basicPriceWords;

  const selectedAddonsSafe = selectedAddons || [];
  const winderTowerAddonsRaw = selectedAddonsSafe.filter(item => {
    if (!item || !item.name) return false;
    if (item.id === "winder-manual-back-to-back-dynamic") return false;
    if (item.id === "addon-air-shaft-dynamic") return false;
    // IBC chiller cards are optional-equipment-only — never include in scope of supply or detailed desc
    if (item.id === "chiller-ibc-dynamic" || item.id === "chiller-ibc-water-dynamic") return false;
    const n = item.name.toLowerCase();
    const c = (item.category || "").toLowerCase();
    const isTrim = n.includes("trim");
    const isControl = n.includes("panel") || c.includes("panel") || n.includes("control") || c.includes("control");
    return (n.includes("winder") || c.includes("winder") || n.includes("tower") || c.includes("tower") || n.includes("ibc") || c.includes("ibc")) && !isTrim && !isControl && item.id !== "addon-loadcell-tension";
  });
  const realAddonsRaw = selectedAddonsSafe.filter(item => {
    if (!item || !item.name) return false;
    const isGrandTotal = item.id === "grand-total-line";
    if (isGrandTotal) return false;

    // Die rotation is pre-included (price 0) on a couple of 3-layer presets
    // (e.g. INNOFLEX-1370 DR) — not a genuine optional extra there, so keep
    // it out of the Optional Equipment table for those. For mono/ABA it's
    // now a genuine customer-chosen addon with a real price, so list it.
    if (item.id === "die-rotation-addon" && machineType !== "mono" && machineType !== "aba") return false;

    const isMixer = item.id === "mixer-dynamic" || item.id === "mixer-dryer-dynamic";
    if (machineType === "material-handling" && isMixer) {
      return false;
    }

    return true;
  });

  // Compute grand total for the pricing block (machine final + addons)
  const machineFinal = discount > 0 ? afterDiscount : withMarkup;
  const grandTotalAmount = machineFinal + (addonsTotal || 0);
  // Only include if the user explicitly added the grand-total-line item
  const grandTotalLineItem = selectedAddonsSafe.find(a => a.id === "grand-total-line");
  const grandTotalForPdf = grandTotalLineItem ? grandTotalAmount : null;

  // Bi-metallic upgrades are added as one dynamic addon per extruder
  // (bimetallic-upgrade-1, -2, -3...) so each extruder's screw size can price
  // independently, but the customer only needs to see one combined line item.
  const bimetallicAddons = realAddonsRaw.filter(item => (item.id || "").startsWith("bimetallic-upgrade-"));
  const nonBimetallicAddons = realAddonsRaw.filter(item => !(item.id || "").startsWith("bimetallic-upgrade-"));
  const mergedBimetallic = bimetallicAddons.length > 0 ? [{
    ...bimetallicAddons[0],
    id: "bimetallic-upgrade-combined",
    // qty stays 1 — price below is already the sum across all extruders
    // (each extruder's screw size can price independently), so multiplying
    // by a qty > 1 downstream would inflate the total.
    name: `Bi-metallic Screw Barrel Upgrade (${bimetallicAddons.length} Extruders)`,
    customName: `Bi-metallic Screw Barrel Upgrade (${bimetallicAddons.length} Extruders)`,
    qty: 1,
    price: bimetallicAddons.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0),
  }] : [];
  const optItemsSource = [...nonBimetallicAddons, ...mergedBimetallic];

  const optItems = optItemsSource
    .map(item => ({
      id: item.id || "",
      name: item.customName || item.name || "",
      qty: item.qty || 1,
      image: item.image || "",
      shortDesc: item.shortDesc || item.cardDesc || "",
      techDesc: fillTechDesc(item, item.techDesc, currentMachineModel),
      price: item.price != null
        ? (() => {
          const base = (item.price * (item.qty || 1));
          const m = item.markup || 0;
          const d = item.discount || 0;
          const adjusted = base * (1 + m / 100) * (1 - d / 100);
          return fmtPrice(currency === 'USD' ? (adjusted * EXPORT_PRICE_MARKUP / rate) : adjusted, currency);
        })()
        : "",
      rawPrice: (item.price || 0) * (item.qty || 1),
      isIncluded: item.isIncluded,
    }));

  const addonsTotalStr = addonsTotal != null ? fmtPrice(addonsTotal, currency) : "";

  // Build dynamic component scope items with overrides
  const overrides = scopeOverrides || {};
  let hasExtruder = false;

  function fillTechDesc(item, techDesc, machineModel = null) {
    if (!techDesc) return {};
    const filled = { ...techDesc };

    // Remove explicitly hidden properties
    for (const key in filled) {
      if (filled[key] === "hidden") {
        delete filled[key];
      }
    }

    const nameLc = (item.name || "").toLowerCase();
    const isWinder = nameLc.includes("winder") || (item.category || "").toLowerCase().includes("winder");


    // Extract size from item name or size property
    let size = item.size || item.currentSize || "";
    if (!size) {
      const match = nameLc.match(/(\d+)\s*mm/i);
      if (match) size = match[1];
    }

    const layflatW = customLayflat ? customLayflat.replace(/[^0-9]/g, '') : (machineModel?.layflatWidthMm || "1250");

    // Dynamically replace "TBD" with the extracted size if available, and [W] with layflat width
    Object.keys(filled).forEach(k => {
      if (typeof filled[k] === 'string') {
        if (size) {
          filled[k] = filled[k].replace(/TBD/g, size);
        }
        if (filled[k].includes('[W]')) {
          filled[k] = filled[k].replace(/\[W\]/g, layflatW);
        }
      }
    });
    // Prefer user input roller width if applicable
    const displayWidth = customRollerWidth || (size ? `${size} mm` : "");

    // --- BIMETALLIC LOGIC FOR TECH DESC ---
    const isExtruder = (item.category || "").toLowerCase() === "extruder" || nameLc.includes("extruder") || (item.id || "").includes("ext-");
    if (isExtruder) {
      const hasBimetallic = (selectedAddons || []).some(a => a.id.startsWith("bimetallic-upgrade-") && a.metadata?.targetExtruderId === item.id);
      if (hasBimetallic) {
        // Find the material key (Material or material)
        const materialKey = Object.keys(filled).find(k => k.toLowerCase() === "material");
        if (materialKey) {
          filled[materialKey] = "Bi-metallic screw and barrel";
        } else {
          filled["Material"] = "Bi-metallic screw and barrel";
        }
      }
    }

    // --- IBC LOGIC FOR DIES ---
    const isDie = (item.category || "").toLowerCase().includes("die") || nameLc.includes("die");
    if (isDie) {
      const hasIbcAddon = (selectedAddons || []).some(a => (a.id || "").toLowerCase().includes("ibc") || (a.name || "").toLowerCase().includes("ibc"));
      if (hasIbcAddon) {
        const ibcKey = Object.keys(filled).find(k => k.toLowerCase().includes("ibc provision"));
        if (!ibcKey) {
          filled["IBC Provision"] = "Die with IBC provision.";
        }
      }
    }

    // --- TENSION CONTROL LOGIC FOR WINDERS ---
    if (isWinder) {
      const hasLoadcell = (selectedAddons || []).some(a => a.id === "addon-loadcell-tension");
      const isIBC = !!currentMachineModel?.isIbc ||
        (selectedMachineModelLabel || "").toLowerCase().includes("ibc");

      // Rule: IBC gets Loadcell by default. Non-IBC gets Loadcell only if addon is selected.
      const tensionVal = (isIBC || hasLoadcell) ? "Through loadcell." : "Through torque.";

      const tensionKeys = Object.keys(filled).filter(k => k.toLowerCase().includes("tension control"));
      if (tensionKeys.length > 0) {
        tensionKeys.forEach(tk => {
          filled[tk] = tensionVal;
        });
      } else {
        // Fallback: Add it if not present
        filled["Tension control"] = tensionVal;
      }
    }

    // --- MACHINE MODEL OVERRIDES (from src/data/models.ts) ---
    if (machineModel) {
      // 1. Winder specific overrides
      if (isWinder) {
        if (machineModel.rollCapacity) {
          const rollKey = Object.keys(filled).find(k => k.toLowerCase().includes("roll diameter") || k.toLowerCase().includes("capacity"));
          if (rollKey) {
            const cap = machineModel.rollCapacity;
            if (cap.includes("/")) {
              const [kg, mm] = cap.split("/").map(s => s.trim());
              filled[rollKey] = `${mm} diameter or ${kg} weight in single up which ever reaches first. Bow roller prior to drum roller for wrinkle free winding.`;
            } else {
              filled[rollKey] = cap;
            }
          }
        }
        if (machineModel.winderDrive) {
          const driveKey = Object.keys(filled).find(k => k.toLowerCase().includes("winder drive"));
          if (driveKey) {
            filled[driveKey] = `${machineModel.winderDrive} AC motor with variable frequency drive.`;
          }
        }
      }

      // 2. Haul-off / Nip specific overrides
      const isHaulOff = nameLc.includes("haul") || (item.category || "").toLowerCase().includes("haul");
      if (isHaulOff || isWinder) { // Winders often have nip specs too
        if (machineModel.mainNipDrive) {
          const nipDriveKey = Object.keys(filled).find(k => k.toLowerCase().includes("nip roller drive"));
          if (nipDriveKey) {
            filled[nipDriveKey] = `${machineModel.mainNipDrive} AC motor with variable frequency drive.`;
          }
        }
      }

      // 3. General overrides (Line speed, Output)
      if (machineModel.mainNipLineSpeed) {
        const speedKey = Object.keys(filled).find(k => k.toLowerCase().includes("line speed"));
        if (speedKey) {
          filled[speedKey] = machineModel.mainNipLineSpeed;
        }
      }
      if (machineModel.maxOutputKgHr) {
        const outputKey = Object.keys(filled).find(k => k.toLowerCase().includes("output"));
        if (outputKey) {
          filled[outputKey] = machineModel.maxOutputKgHr;
        }
      }
      if (machineModel.thicknessRange) {
        const thickKey = Object.keys(filled).find(k => k.toLowerCase().includes("thickness") && !k.toLowerCase().includes("variation"));
        if (thickKey) {
          filled[thickKey] = machineModel.thicknessRange;
        }
      }
      if (machineModel.thicknessVariation) {
        const varKey = Object.keys(filled).find(k => k.toLowerCase().includes("variation"));
        if (varKey) {
          filled[varKey] = machineModel.thicknessVariation;
        }
      }
    }

    Object.keys(filled).forEach(key => {
      if (filled[key] === "TBD") {
        const kLc = key.toLowerCase();
        if (kLc.includes("nip") && kLc.includes("width")) {
          filled[key] = displayWidth;
        } else if (kLc.includes("surface winder")) {
          filled[key] = `${displayWidth}${displayWidth.includes("mm") ? "" : " mm"} film width.`;
        } else if (kLc.includes("film width")) {
          filled[key] = displayWidth;
        }
      }
    });

    if (isExtruder) {
      const order = [
        "Screw Diameter",
        "L/D ratio",
        "Screw Speed",
        "Type",
        "Barrel",
        "Material",
        "Heating System",
        "No. of Zones",
        "Hopper",
        "Main Drive",
        "Transmission System",
        "Gearbox",
        "Screen changer"
      ];
      
      const sorted = {};
      order.forEach(desiredKey => {
        const matchingKey = Object.keys(filled).find(k => k.toLowerCase() === desiredKey.toLowerCase());
        if (matchingKey) {
          sorted[matchingKey] = filled[matchingKey];
          delete filled[matchingKey];
        }
      });
      // Append any unmapped keys
      Object.keys(filled).forEach(k => {
        sorted[k] = filled[k];
      });
      return sorted;
    }

    return filled;
  }

  const selectedScopeItems = (selected || [])
    .filter(item => item && item.name)
    .flatMap(item => {
      const c = (item.category || "").toLowerCase();
      const nameLc = (item.name || "").toLowerCase();
      const isExtruder = c.includes("extruder") || nameLc.includes("extruder") || (item.id || "").includes("ext-");

      // Deduplicate Control Panels as they are now injected statically
      const isControl = c.includes("panel") || nameLc.includes("panel") || c.includes("control") || nameLc.includes("control");
      if (isControl) return [];

      // Hide internal components whose text is merged into parent items
      // Only hide collapsing frame if a combined winder or haul-off exists
      if (c.includes("collapsing frame") || c.includes("filter")) {
        if (c.includes("filter")) return [];

        const hasCombinedWinderOrHaulOff = (selected || []).some(s => {
          if (!s) return false;
          const sC = (s.category || "").toLowerCase();
          const sN = (s.name || "").toLowerCase();
          const isHO = sC.includes("haul") || sN.includes("haul");
          const isCombinedW = sC.includes("winder") && (sN.includes("secondary") || sN.includes("nip"));
          return isHO || isCombinedW;
        });
        if (hasCombinedWinderOrHaulOff) {
          return [];
        }
      }

      // 3-layer/5-layer only: when a Haul-Off is present, generateHaulOff() already
      // bakes the full "...Collapsing frame with Segmented PBT Roller, side guides,
      // Main Nip with X HP AC Drive." text into its own scope line (matches real
      // quotation wording). A separate standalone "Main Nip" category component in
      // the same preset would otherwise repeat that exact text as a redundant row.
      if ((machineType === "3layer" || machineType === "5layer") && c.includes("main nip")) {
        const hasHaulOffSibling = (selected || []).some(s => {
          if (!s) return false;
          const sC = (s.category || "").toLowerCase();
          const sN = (s.name || "").toLowerCase();
          return sC.includes("haul") || sN.includes("haul");
        });
        if (hasHaulOffSibling) {
          return [];
        }
      }

      const key = item.id || item.name;
      const customDesc = overrides[key];

      // Check for combined Winder + Secondary Nip
      const isCombinedWinder = c.includes("winder") && (nameLc.includes("secondary") || nameLc.includes("nip"));

      if (isCombinedWinder && !customDesc) {
        // Produce TWO items for SOS
        const nipDesc = generateSecondaryNip(item, currentMachineModel);
        const winderDesc = generateWinder(item, currentMachineModel, { includeNipPrefix: false, selectedAddons });

        const techDescFilled = fillTechDesc(item, item.techDesc, currentMachineModel);
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
              image: item.image,
              category: "Collapsing Frame",
              shortDesc: overrides[`${item.id}-cf`] !== undefined ? overrides[`${item.id}-cf`] : cfDesc,
              scopeDesc: overrides[`${item.id}-cf`] !== undefined ? overrides[`${item.id}-cf`] : cfDesc,
              techDesc: techDescFilled,
              _autoDesc: cfDesc,
            },
            {
              id: `${item.id}-winder`,
              name: item.name.replace(/Secondary Nip & /i, ""),
              qty: item.qty || 1,
              image: item.image,
              shortDesc: overrides[`${item.id}-winder`] !== undefined ? overrides[`${item.id}-winder`] : winderDesc,
              scopeDesc: overrides[`${item.id}-winder`] !== undefined ? overrides[`${item.id}-winder`] : winderDesc,
              techDesc: techDescFilled,
              _autoDesc: winderDesc,
            }
          ];
        } else {
          return [
            {
              id: `${item.id}-nip`,
              name: "Secondary Nip Assembly",
              qty: 1,
              image: item.image,
              shortDesc: overrides[`${item.id}-nip`] !== undefined ? overrides[`${item.id}-nip`] : nipDesc,
              scopeDesc: overrides[`${item.id}-nip`] !== undefined ? overrides[`${item.id}-nip`] : nipDesc,
              techDesc: techDescFilled,
              _autoDesc: nipDesc,
            },
            {
              id: `${item.id}-winder`,
              name: item.name.replace(/Secondary Nip & /i, ""),
              qty: item.qty || 1,
              image: item.image,
              shortDesc: overrides[`${item.id}-winder`] !== undefined ? overrides[`${item.id}-winder`] : winderDesc,
              scopeDesc: overrides[`${item.id}-winder`] !== undefined ? overrides[`${item.id}-winder`] : winderDesc,
              techDesc: techDescFilled,
              _autoDesc: winderDesc,
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
        image: item.image || "",
        shortDesc: finalDesc,
        scopeDesc: autoScopeDesc({ ...item, name: isExtruder ? "Extruders" : item.name, shortDesc: finalDesc }),
        techDesc: fillTechDesc(item, item.techDesc, currentMachineModel),
        _autoDesc: autoDesc
      }];
    });

  const winderTowerScopeItems = winderTowerAddonsRaw.flatMap(item => {
    const key = item.id || item.name;
    const customDesc = overrides[key];
    const nameLc = (item.name || "").toLowerCase();
    const isWinder = (item.category || "").toLowerCase().includes("winder") || nameLc.includes("winder");
    const isCombinedWinder = isWinder && (nameLc.includes("secondary") || nameLc.includes("main") || nameLc.includes("nip"));

    if (isCombinedWinder && !customDesc && !item.scopeDesc) {
      const nipDesc = generateSecondaryNip(item, currentMachineModel);
      const winderDesc = generateWinder(item, currentMachineModel, { includeNipPrefix: false, selectedAddons });

      const techDescFilled = fillTechDesc(item, item.techDesc, currentMachineModel);
      if (machineType === "aba" || machineType === "mono") {
        return [
          {
            id: `${item.id}-cf`,
            name: "Collapsing Frame",
            qty: 1,
            image: item.image,
            category: "Collapsing Frame",
            shortDesc: overrides[`${item.id}-cf`] !== undefined ? overrides[`${item.id}-cf`] : "if there is hauloff then hauloff will come with collapsing frame",
            scopeDesc: overrides[`${item.id}-cf`] !== undefined ? overrides[`${item.id}-cf`] : "if there is hauloff then hauloff will come with collapsing frame",
            techDesc: {
              "Construction": "PBT roller frame mounted before haul-off for layflat formation.",
              "Material": "PBT rollers for scratch-free handling.",
              "Adjustment": "Manual width adjustment with locking system."
            },
            _autoDesc: "if there is hauloff then hauloff will come with collapsing frame",
          },
          {
            id: `${item.id}-winder`,
            name: (item.name || "").replace(/Secondary Nip & /i, ""),
            qty: item.qty || 1,
            image: item.image,
            shortDesc: overrides[`${item.id}-winder`] !== undefined ? overrides[`${item.id}-winder`] : winderDesc,
            scopeDesc: overrides[`${item.id}-winder`] !== undefined ? overrides[`${item.id}-winder`] : winderDesc,
            techDesc: techDescFilled,
            _autoDesc: winderDesc,
          }
        ];
      } else {
        return [
          {
            id: `${item.id}-nip`,
            name: "Secondary Nip Assembly",
            qty: 1,
            image: item.image,
            shortDesc: overrides[`${item.id}-nip`] !== undefined ? overrides[`${item.id}-nip`] : nipDesc,
            scopeDesc: overrides[`${item.id}-nip`] !== undefined ? overrides[`${item.id}-nip`] : nipDesc,
            techDesc: techDescFilled,
            _autoDesc: nipDesc,
          },
          {
            id: `${item.id}-winder`,
            name: (item.name || "").replace(/Secondary Nip & /i, ""),
            qty: item.qty || 1,
            image: item.image,
            shortDesc: overrides[`${item.id}-winder`] !== undefined ? overrides[`${item.id}-winder`] : winderDesc,
            scopeDesc: overrides[`${item.id}-winder`] !== undefined ? overrides[`${item.id}-winder`] : winderDesc,
            techDesc: techDescFilled,
            _autoDesc: winderDesc,
          }
        ];
      }
    }

    const autoDesc = generateScopeDesc(item, selected, currentMachineModel, selectedAddons) || item.shortDesc || item.cardDesc;
    const finalDesc = customDesc !== undefined ? customDesc : autoDesc;

    const isExtruderNow = (item.category || "").toLowerCase().includes("extruder") || (item.name || "").toLowerCase().includes("extruder");
    const qtySuffix = (isExtruderNow && item.qty > 0) ? ` (${String(item.qty).padStart(2, '0')} NOS.)` : "";

    const c = (item.category || "").toLowerCase();
    const isAirRing = c.includes("air ring") || c.includes("airring");
    const overrideImage = (isAirRing && (machineType === "mono" || machineType === "aba")) 
      ? "/images/Airring/Airring_mono_aba.jpeg" 
      : (item.image || "");

    return {
      id: item.id || "",
      name: (item.name || "") + qtySuffix,
      qty: item.qty || 1,
      category: item.category || "",
      image: overrideImage,
      shortDesc: (finalDesc || "") + qtySuffix,
      techDesc: fillTechDesc(item, item.techDesc, currentMachineModel),
      _autoDesc: autoDesc
    };
  });

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

  const auto_cf_obj = (machineType === "aba" || machineType === "mono") && !hasSelectedCF && !hasHaulOffItem ? {
    id: "auto_cf", name: "Main Nip and Collapsing Frame", qty: 1, image: "/images/MainNip/MainNip.png",
    category: "Collapsing Frame",
    shortDesc: "Main Nip with AC Drive. Side mounted PBT rollers to collapse the layflat bubble.",
    scopeDesc: "Main Nip with AC Drive. Side mounted PBT rollers to collapse the layflat bubble.",
    techDesc: {
      "Main Nip Rollers": "2 Nos. nip rollers mounted in bearings: one chrome plated roller and one rubber coated roller, pneumatically loaded.",
      "Drive": "AC Motor with Variable Frequency Drive (VFD).",
      "Construction": "PBT roller frame mounted before haul-off for layflat formation.",
      "Material": "PBT rollers for scratch-free handling.",
      "Adjustment": "Manual width adjustment with locking system."
    },
    _autoDesc: "Main Nip with AC Drive. Side mounted PBT rollers to collapse the layflat bubble."
  } : null;
  const groupedSelected = [];
  const extruderMap = new Map();

  (selected || []).forEach(item => {
    if ((item?.category || "").toLowerCase().includes("extruder")) {
      const sizeKey = item.size || item.sizeMm || item.id;
      if (!extruderMap.has(sizeKey)) {
        extruderMap.set(sizeKey, { ...item, name: "Extruder", qty: item.qty || 1 });
      } else {
        const existing = extruderMap.get(sizeKey);
        existing.qty += (item.qty || 1);
      }
    } else {
      groupedSelected.push(item);
    }
  });

  const groupedExtruders = Array.from(extruderMap.values());
  groupedSelected.unshift(...groupedExtruders);

  const annexureComponents = groupedSelected
    .filter(item => item && item.name)
    .map(item => {
      const c = (item?.category || "").toLowerCase();
      // Only exclude inner-utility items 
      if (c.includes("filter") || item.hideFromAnnexure) {
        return null;
      }

      // EXCLUDE ADDONS: Addons are typically items with a price > 0 in the configurator,
      // but some main components (like large extruders) also have prices.
      // We explicitly preserve core machine components in the technical annexure.
      const isCore = c.includes("extruder") || c.includes("die") || c.includes("ring") ||
        c.includes("haul") || c.includes("nip") || c.includes("winder") || c.includes("tower") ||
        c.includes("cage") || c.includes("basket") || c.includes("ibc") ||
        c.includes("trim") ||
        (item.name || "").toLowerCase().includes("extruder") ||
        (item.name || "").toLowerCase().includes("ibc");

      const isAddon = ((item?.price || 0) > 0 || c.includes("addon") || c.includes("optional")) && !isCore;
      if (isAddon) return null;

      const isExtruderNow = (item.category || "").toLowerCase().includes("extruder") || (item.name || "").toLowerCase().includes("extruder");
      const qtySuffix = (isExtruderNow && item.qty > 0) ? ` (${String(item.qty).padStart(2, '0')} NOS.)` : "";

      const isAirRing = c.includes("air ring") || c.includes("airring");
      const overrideImage = (isAirRing && (machineType === "mono" || machineType === "aba")) 
        ? "/images/Airring/Airring_mono_aba.jpeg" 
        : (item.image || "");

      return {
        id: item.id || "",
        name: (item.customName || item.name || "") + qtySuffix,
        qty: item.qty || 1,
        category: item.category || "",
        image: overrideImage,
        shortDesc: (item.shortDesc || item.cardDesc || "") + qtySuffix,
        techDesc: fillTechDesc(item, item.techDesc, currentMachineModel),
      };
    })
    .concat(winderTowerScopeItems)
    .concat(auto_cf_obj ? [auto_cf_obj] : [])
    .filter(Boolean);

  // Sort annexure components as well
  let sortedAnnexure = getSortedScope(annexureComponents, "annexure").filter(item => {
    return Object.keys(item.techDesc || {}).length > 0;
  });

  // For ALL models Annexure: Combine Main Nip + Collapsing Frame and remove Nip from Winder (only if no haul-off)
  const hauloffIdxAnnex = sortedAnnexure.findIndex(i => i && ((i.category || "").toLowerCase().includes("haul") || (i.name || "").toLowerCase().includes("haul")));

  if (hauloffIdxAnnex === -1) {
    const mainNipIdxAnnex = sortedAnnexure.findIndex(i => i && ((i.category || "").toLowerCase().includes("main nip") || (i.name || "").toLowerCase().includes("main nip")));
    const cfIdxAnnex = sortedAnnexure.findIndex(i => {
      if (!i) return false;
      const cat = (i.category || "").toLowerCase();
      const n = (i.name || "").toLowerCase();
      return (cat.includes("collapsing") || n.includes("collapsing")) && !cat.includes("main nip") && !n.includes("main nip");
    });

    if (mainNipIdxAnnex !== -1 && cfIdxAnnex !== -1) {
      const mnItem = sortedAnnexure[mainNipIdxAnnex];
      const cfItem = sortedAnnexure[cfIdxAnnex];
      sortedAnnexure[cfIdxAnnex] = {
        ...cfItem,
        name: "Main Nip and Collapsing Frame",
        techDesc: { ...cfItem.techDesc, ...mnItem.techDesc },
        image2: mnItem.image || "/images/MainNip/MainNipMultiL.png"
      };
      sortedAnnexure.splice(mainNipIdxAnnex, 1);
    } else if (cfIdxAnnex !== -1) {
      sortedAnnexure[cfIdxAnnex].name = "Main Nip and Collapsing Frame";
      sortedAnnexure[cfIdxAnnex].image = "/images/MainNip/MainNip.png";
    }

    sortedAnnexure.forEach(w => {
      if (w && ((w.category || "").toLowerCase().includes("winder") || (w.name || "").toLowerCase().includes("winder"))) {
        if (w.techDesc) {
          const newTech = { ...w.techDesc };
          Object.keys(newTech).forEach(k => {
            if (k.toLowerCase().includes("nip")) delete newTech[k];
          });
          w.techDesc = newTech;
        }
      }
    });
  }

  if (machineType === "mono") {
    const mnCfIdx = sortedAnnexure.findIndex(item => item && item.name === "Main Nip and Collapsing Frame");
    if (mnCfIdx !== -1 && sortedAnnexure[mnCfIdx].techDesc) {
      const newTechDesc = { ...sortedAnnexure[mnCfIdx].techDesc };
      delete newTechDesc["Construction"];
      delete newTechDesc["Material"];
      delete newTechDesc["Adjustment"];
      delete newTechDesc["Width Capability"];
      sortedAnnexure[mnCfIdx].techDesc = newTechDesc;
    }
  }

  const hasSelectedTower = [...selectedScopeItems, ...winderTowerAddonsRaw].some(item => {
    const n = (item.name || "").toLowerCase();
    const c = (item.category || "").toLowerCase();
    return n.includes("tower") || c.includes("tower");
  });

  const hasSelectedCF_scope = [...selectedScopeItems, ...winderTowerScopeItems].some(item => {
    const n = (item.name || "").toLowerCase();
    const c = (item.category || "").toLowerCase();
    return n.includes("collapsing") || c.includes("collapsing");
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
    machineType !== "aba" && machineType !== "mono" && !hasSelectedTower && {
      id: "auto_tower", name: "Tower Structure", qty: 1, image: "",
      shortDesc: "Tower Structure to support and mount Bubble stabilizing Basket, Collapsing Frame, Oscillating Haul Off, Secondary Nip, Web aligner, Corona Treater etc.",
      scopeDesc: autoScopeDesc({ name: "Tower Structure", shortDesc: "Tower Structure to support and mount Bubble stabilizing Basket, Collapsing Frame, Oscillating Haul Off, Secondary Nip, Web aligner, Corona Treater etc." }),
      techDesc: {},
      _autoDesc: "Tower Structure to support and mount Bubble stabilizing Basket, Collapsing Frame, Oscillating Haul Off, Secondary Nip, Web aligner, Corona Treater etc."
    },
    auto_cf_obj,
    {
      id: "auto_control", name: "Extrusion Control Line", qty: 1, image: "",
      shortDesc: (machineType === "aba" || machineType === "mono") ? "Complete extrusion controls on main panel." : "Complete extrusion controls on main panel with Cold start protection and with Touch Panel.",
      scopeDesc: autoScopeDesc({ name: "Extrusion Control Line", shortDesc: (machineType === "aba" || machineType === "mono") ? "Complete extrusion controls on main panel." : "Complete extrusion controls on main panel with Cold start protection and with Touch Panel." }),
      techDesc: {},
      _autoDesc: (machineType === "aba" || machineType === "mono") ? "Complete extrusion controls on main panel." : "Complete extrusion controls on main panel with Cold start protection and with Touch Panel."
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

  // Add a dedicated manual extra row that is always available if needed
  const manualExtra = {
    id: "manual_extra",
    name: "Additional Item",
    qty: (overrides["manual_extra"] || "").trim() ? 1 : "",
    image: "",
    shortDesc: (overrides["manual_extra"] || "").trim(),
    scopeDesc: (overrides["manual_extra"] || "").trim(),
    techDesc: {},
    _isExtra: true,
  };

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

  // For 3-layer and 5-layer: keep haul-off and collapsing frame as SEPARATE SOS entries.
  // Collapsing frame only appears if die rotation is selected (controlled by selected items).
  // Do NOT merge them - just sort them in the right order.
  const isMultiLayer = machineType === "3layer" || machineType === "5layer";

  if (!isMultiLayer && hauloffIdx !== -1 && collapsingIdx !== -1) {
    const cfItem = preCombineScope[collapsingIdx];
    const hoItem = preCombineScope[hauloffIdx];

    preCombineScope[hauloffIdx] = {
      ...hoItem,
      name: "Haul-Off and Collapsing Frame",
      shortDesc: `${cfItem.shortDesc}\n${hoItem.shortDesc}`,
      scopeDesc: `${cfItem.scopeDesc || cfItem.shortDesc}\n${hoItem.scopeDesc || hoItem.shortDesc}`,
      techDesc: { ...cfItem.techDesc, ...hoItem.techDesc }
    };
    preCombineScope.splice(collapsingIdx, 1);
  }

  // For ALL models: combine Main Nip + Collapsing Frame into one labelled entry.
  // Haul-off (if present) stays as its own separate entry.
  // We apply this everywhere as requested.
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
      return isCollapsing && !isMainNip;
    });

    if (mainNipIdx !== -1) {
      const mnItem = preCombineScope[mainNipIdx];
      if (cfIdx3L !== -1) {
        // Merge a separate collapsing frame item into the main nip entry
        const cfItem3L = preCombineScope[cfIdx3L];
        preCombineScope[mainNipIdx] = {
          ...mnItem,
          name: "Main Nip and Collapsing Frame",
          shortDesc: mnItem.shortDesc || "",
          scopeDesc: mnItem.scopeDesc || mnItem.shortDesc || "",
          techDesc: { ...cfItem3L.techDesc, ...mnItem.techDesc }
        };
        preCombineScope.splice(cfIdx3L, 1);
      } else {
        // No separate collapsing frame item — just rename the Main Nip entry
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

  const finalScope = getSortedScope(preCombineScope, "sos")
    .concat(extraScopeItems)
    .concat(manualExtra.shortDesc ? [manualExtra] : [])
    .filter(item => item.scopeDesc !== "hidden" && item.shortDesc !== "hidden" && item.name !== "hidden")
    .map((item, i) => ({
      ...item,
      sr: i + 1,
      description: item.scopeDesc || item.shortDesc || item.name || '',
      desc: item.scopeDesc || item.shortDesc || item.name || '',
    }));

  // Sort scope items with mode-aware ordering for 3-layer/5-layer machines.
  // Mode "sos": scope of supply list  |  Mode "annexure": detailed component descriptions.
  function getSortedScope(items, mode = "sos") {
    const is3or5Layer = machineType === "3layer" || machineType === "5layer";

    const getSortOrder = (item) => {
      if (!item) return 99;
      const n = String(item.name || "").toLowerCase();
      const c = String(item.category || "").toLowerCase();
      const combined = n + " " + c;

      if (is3or5Layer && mode === "sos") {
        // Restore original 3/5-layer SOS order
        if (n.includes("extruder")) return 1;
        if (n.includes("control") || n.includes("panel") || combined.includes("extrusion control")) return 2;
        if (n.includes("die")) return 3;
        if (combined.includes("air ring") || combined.includes("airring")) return 4;
        if (combined.includes("ibc")) return 4.5;
        if (combined.includes("bubble cage") || combined.includes("cage") || combined.includes("basket")) return 5;
        if (combined.includes("haul-off") || combined.includes("hauloff") || (combined.includes("haul") && combined.includes("off"))) return 6;
        if (combined.includes("main nip") || combined.includes("collapsing frame") || combined.includes("collapsing")) return 7;
        if (combined.includes("idler")) return 8;
        if (combined.includes("secondary nip")) return 9;
        if (combined.includes("winder")) return 10;
        if (n.includes("tower") || n.includes("platform")) return 100;
        return 90;
      }

      // Detailed Description (Annexure) & Default Order (Mono/ABA)
      // 1. Extruders
      if (n.includes("extruder")) return 1;
      // 2. Dies
      if (n.includes("die")) return 2;
      // 3. Air Rings
      if (combined.includes("air ring") || combined.includes("airring") || combined.includes("ibc")) return 3;
      // 4. Bubble Cage
      if (combined.includes("bubble cage") || combined.includes("cage") || combined.includes("basket")) return 4;
      // 5. Main Nip and Collapsing Frame
      if (combined.includes("main nip") || combined.includes("collapsing frame") || combined.includes("collapsing")) return 5;
      // 6. Haul-Off
      if (combined.includes("haul-off") || combined.includes("hauloff") || (combined.includes("haul") && combined.includes("off"))) return 6;
      // 7. Winder
      if (combined.includes("winder")) return 7;
      // 8. Tower
      if (n.includes("tower") || n.includes("platform")) return 8;
      // 9. Panel
      if (n.includes("control") || n.includes("panel") || combined.includes("extrusion control")) return 9;

      // Others
      if (combined.includes("secondary nip")) return 90;
      if (combined.includes("idler")) return 91;

      return 100;
    };

    return [...items].sort((a, b) => {
      const orderA = getSortOrder(a);
      const orderB = getSortOrder(b);
      if (orderA !== orderB) return orderA - orderB;
      return (a.name || "").localeCompare(b.name || "");
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
      refNo: (() => {
        const rawRef = customer?.quotationRef || customer?.ref;
        if (rawRef && !rawRef.startsWith("AET/") && rawRef !== "Loading...") {
          return rawRef;
        }
        if (machineType === "material-handling") {
          const region = customer?.region || "DOM";
          return `AE/${region}/MIX/01`;
        }
        return `AE/${customer?.region || 'DOM'}/${(customRollerWidth || '').replace(/[^\d]/g, '') || '0000'}/01`;
      })(),
      date: quotationDate || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }),
    },
    machine: (() => {
      const baseMachine = {
        type: machineType || "3layer",
        family: m.family || displaySeries,
        series: displaySeries,
        fullName: displayType,
        code: machineCode,
        title_line: `${displayType} ${machineCode}`,
        layflat_width: layflatWidth || "",
        coverImage: (() => {
          if (machineType === "material-handling") {
            const mixerAddon = (selectedAddons || []).find(a => a.id === "mixer-dynamic" || a.id === "mixer-dryer-dynamic");
            return mixerAddon?.image || "/images/Acessories/Vertical Granule Mixer with Dryer.JPG";
          }
          if (machineType === "mono") return "/images/machines/mono.png";
          if (machineType === "aba") return "/images/machines/aba.png";
          if (machineType === "3layer") return "/images/machines/Multilayer.png";
          if (machineType === "5layer") return "/images/machines/Multilayer.png";
          return `/images/machines/Multilayer.png`;
        })(),
      };

      if (machineType === "material-handling") {
        const allMixerAddons = (selectedAddons || []).filter(a => a.id === "mixer-dynamic" || a.id === "mixer-dryer-dynamic");

        // Generate a model code for each selected mixer, join with " | "
        const allCodes = allMixerAddons.map(a => {
          const isMD = a.id === "mixer-dryer-dynamic";
          const sz = a.size || a.metadata?.size || "";
          const prefix = isMD ? "VMD" : "VM";
          return sz ? `${prefix}-${sz}` : prefix;
        });
        const mixerCode = allCodes.join(" | ");

        // Build display name: if both types selected, show "VERTICAL GRANULE MIXER", else specific name
        const hasWithDryer = allMixerAddons.some(a => a.id === "mixer-dryer-dynamic");
        const hasWithoutDryer = allMixerAddons.some(a => a.id === "mixer-dynamic");
        const mixerName = (hasWithDryer && hasWithoutDryer)
          ? "VERTICAL GRANULE MIXER"
          : hasWithDryer
            ? "VERTICAL GRANULE MIXER WITH DRYER"
            : "VERTICAL GRANULE MIXER";

        return {
          ...baseMachine,
          fullName: mixerName,
          code: mixerCode,
          title_line: `${mixerName} | ${mixerCode}`,
        };
      }

      return baseMachine;
    })(),
    indicative_performance: (() => {
      if (machineType === "material-handling") {
        const mixerAddons = (selectedAddons || []).filter(a => a.id === "mixer-dynamic" || a.id === "mixer-dryer-dynamic");
        const capacityList = mixerAddons.map(a => {
          const sz = a.size || a.metadata?.size || "";
          const isMD = a.id === "mixer-dryer-dynamic";
          return sz ? `${sz} kg ${isMD ? "(with Dryer)" : "(Mixer)"}` : (a.customName || a.name || "");
        }).join(", ");
        return {
          product: "Plastic Granules / Master Batch",
          max_output: capacityList || "—",
          layflat_width: "—",
          die_size: "—",
          thickness_range: "—",
          thickness_variation: "—",
          raw_materials: "LDPE, LLDPE, HDPE, mLLDPE, etc.",
        };
      }
      return {
        product: displayProduct,
        max_output: maxOutput,
        layflat_width: layflatWidth,
        die_size: dieSize,
        thickness_range: thicknessRange,
        thickness_variation: thicknessVariation,
        raw_materials: (machineType === "mono" || machineType === "aba") ? "LDPE, LLDPE, HDPE, etc." : "LDPE, LLDPE, HDPE, mLLDPE, etc.",
      };
    })(),

    components: finalScope,
    annexure_components: sortedAnnexure,
    optional_items: optItems,
    scope: finalScope,
    material_handling_mixers: (() => {
      const mixerAddons = (selectedAddons || []).filter(a => a.id === "mixer-dynamic" || a.id === "mixer-dryer-dynamic");
      return mixerAddons.map(a => ({
        id: a.id || "",
        name: a.customName || a.name || "",
        qty: a.qty || 1,
        image: a.image || "",
        metadata: a.metadata || {},
        price: a.price || 0,
        size: a.size || a.metadata?.size || "",
      }));
    })(),
    material_handling_mixer: (() => {
      const a = (selectedAddons || []).find(a => a.id === "mixer-dynamic" || a.id === "mixer-dryer-dynamic");
      return a ? {
        id: a.id || "",
        name: a.customName || a.name || "",
        qty: a.qty || 1,
        image: a.image || "",
        shortDesc: a.shortDesc || a.cardDesc || "",
        techDesc: a.techDesc || {},
        metadata: a.metadata || {},
        price: a.price || 0,
        size: a.size || a.metadata?.size || "",
      } : null;
    })(),

    pricing: {
      basicPrice: basicPriceStr,
      basicPriceWords: basicPriceWords,
      discountedPrice: discPriceStr,
      discountedWords: discPriceWords,
      finalPrice: finalPriceStr,
      finalPriceWords: finalPriceWords,
      discountAmount: Number(discount) || 0,
      addonsTotal: addonsTotalStr,
      show_price: !!(withMarkup > 0),
      basic_price_inr: withMarkup > 0 ? Math.round(withMarkup) : null,
      basic_price_words: basicPriceWords ? basicPriceWords.replace(/^\(/, '').replace(/\)$/, '') : '',
      final_price_inr: Math.round(discount > 0 ? afterDiscount : withMarkup) || null,
      final_price_words: finalPriceWords ? finalPriceWords.replace(/^\(/, '').replace(/\)$/, '') : '',
      currency: currency,
      rate: rate,
      grandTotal: grandTotalForPdf,       // null if user hasn't clicked "Add to Proposal"
      grandTotalName: grandTotalLineItem?.name || "Total Price (Machine + Optional Equipment)",
      grandTotalWords: grandTotalForPdf ? fmtWords(grandTotalForPdf, currency) : "",
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

    electricals: {
      totalConnectedLoad: m?.totalConnectedLoadKw || m?.totalConnectedLoad || null,
      tower_desc: machineType === "aba"
        ? "Tower structure with idler rollers to support and mount bubble cage, collapsing frame,\nHauloff etc. Beams will be provided at Bubble Cage for lifting the die parts."
        : undefined,
    },

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
      customRollerWidth,
      scopeOverrides,
      conversionRate,
      quoteTemplate,
      showPricingFields,
      showMarkupField,
      showDiscountField,
      showPrices,
      showAddonPricing,
      presetBasePrice,
      quotationDate: quotationDate || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }),
    }
  };
}

// ─── downloadJson ─────────────────────────────────────────────────────────────

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
    saveLeadWithBase64Pdf,
    customOutput, setCustomOutput,
    customLayflat, setCustomLayflat,
    customRollerWidth, setCustomRollerWidth,
    buildWordContext,
    conversionRate, setConversionRate,
    quoteTemplate, setQuoteTemplate,
    showPricingFields, setShowPricingFields,
    showMarkupField, setShowMarkupField,
    showDiscountField, setShowDiscountField,
    showAddonPricing, setShowAddonPricing,
    quotationDate, setQuotationDate,
    scopeOverrides, setScopeOverrides,
    updateAddonPricing,
    addAddon,
    removeAddon,
    resetAll,
  } = useContext(ConfigContext);

  const [isClient, setIsClient] = useState(false);

  const imageGroupedSelected = useMemo(() => {
    const grouped = [];
    const extruderMap = new Map();
    (selected || []).forEach(item => {
      if ((item?.category || "").toLowerCase().includes("extruder")) {
        const sizeKey = item.size || item.sizeMm || item.id;
        if (!extruderMap.has(sizeKey)) {
          extruderMap.set(sizeKey, { ...item, name: "Extruder", qty: item.qty || 1 });
        } else {
          const existing = extruderMap.get(sizeKey);
          existing.qty += (item.qty || 1);
        }
      } else {
        grouped.push(item);
      }
    });
    const groupedExtruders = Array.from(extruderMap.values());
    grouped.unshift(...groupedExtruders);
    return grouped;
  }, [selected]);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      if (!html2canvasModule) {
        import("html2canvas").then((mod) => {
          html2canvasModule = mod.default;
        }).catch(() => { });
      }
      if (!jsPDFModule) {
        import("jspdf").then((mod) => {
          jsPDFModule = mod.jsPDF || mod.default;
        }).catch(() => { });
      }
    }
  }, []);
  const [qrUrl, setQrUrl] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [waSend, setWaSend] = useState(null); // { waPhone, phoneDisplay, message } once a proposal PDF is ready to send
  const toast = useToast();


  // Custom Add-on Inputs
  const [customAddonName, setCustomAddonName] = useState("");
  const [customAddonPrice, setCustomAddonPrice] = useState("");
  const [customAddonQty, setCustomAddonQty] = useState(1);

  const handleAddCustomAddon = () => {
    if (!customAddonName || !customAddonPrice) {
      alert("Please enter both name and price.");
      return;
    }
    const price = parseFloat(customAddonPrice);
    if (isNaN(price)) {
      alert("Please enter a valid number for price.");
      return;
    }

    addAddon("Optional Equipment", {
      id: `custom-${Date.now()}`,
      name: customAddonName,
      price: price,
      qty: customAddonQty,
      isCustom: true,
      cardDesc: "Custom item added by sales representative.",
      image: ""
    });

    setCustomAddonName("");
    setCustomAddonPrice("");
    setCustomAddonQty(1);
  };

  const handleQuotationRefChange = (e) => {
    const value = e.target.value;
    setCustomer(prev => ({ ...prev, quotationRef: value, ref: value }));
  };

  const { withMarkup, afterDiscount, addonsTotal, isPackagePrice, currency, rate } = computePriceSummary();
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
      showMarkupField, showDiscountField, showPrices,
      showAddonPricing,
      conversionRate,
      presetBasePrice: computePriceSummary().isPackagePrice ? computePriceSummary().basicTotal : 0, // Fallback if context not direct
      currency,
      rate,
      quotationDate,
    });
  }, [
    isClient, customer, machineType, currentMachineModel, selectedMachineModelLabel,
    selected, selectedAddons, customOutput, customLayflat, customRollerWidth,
    withMarkup, afterDiscount, addonsTotal, discount, markup,
    machineModelIndex, customMode, scopeOverrides,
    quoteTemplate, showPricingFields, showMarkupField, showDiscountField, showPrices,
    showAddonPricing, quotationDate,
    conversionRate,
    currency, rate,
  ]);

  // Define optItems for local UI rendering (mirror logic in buildProposalData)
  const realAddonsRaw = (selectedAddons || []).filter(item => {
    if (!item || !item.name) return false;
    const n = item.name.toLowerCase();
    const c = (item.category || "").toLowerCase();
    const isWinderTower = n.includes("winder") || c.includes("winder") || n.includes("tower") || c.includes("tower");
    const isTrim = n.includes("trim");
    const isBimetallic = item.id?.startsWith("bimetallic-upgrade-") || item.category === "Extruder Addons" || n.includes("bi-metallic");
    const isLoadcell = item.id === "addon-loadcell-tension";
    const isGrandTotal = item.id === "grand-total-line"; // shown separately below table
    const isDieRotation = item.id === "die-rotation-addon";
    const isMixer = item.id === "mixer-dynamic" || item.id === "mixer-dryer-dynamic";

    if (machineType === "material-handling" && isMixer) {
      return false;
    }

    if (machineType === "mono" || machineType === "aba") {
      // Die rotation is now a genuine, customer-chosen optional addon for
      // mono/ABA — list it like any other optional equipment instead of
      // hiding it (it's no longer pre-included in the preset).
      if (isGrandTotal) return false;
      return true;
    }

    return (!isWinderTower || isTrim) && !isBimetallic && !isLoadcell && !isGrandTotal && !isDieRotation;
  });

  const optItems = realAddonsRaw.map(item => {
    // Ensure item.price is a number (if it's a string like "Rs. 1,00,000/-" we try to strip it, but ideally it should be numeric)
    let rawP = typeof item.price === "string"
      ? parseFloat(item.price.replace(/[^\d.]/g, ''))
      : (item.price || 0);

    // Safety check for NaN
    if (isNaN(rawP)) rawP = 0;

    const base = rawP * (item.qty || 1);
    const m = item.markup || 0;
    const d = item.discount || 0;
    const adjusted = base * (1 + m / 100) * (1 - d / 100);
    const displayVal = currency === 'USD' ? (adjusted * EXPORT_PRICE_MARKUP / rate) : adjusted;

    return {
      ...item,
      id: item.id || "",
      name: item.customName || item.name || "",
      qty: item.qty || 1,
      rawPrice: base,
      price: item.price != null ? fmtPrice(displayVal, currency) : "—"
    };
  });

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
                {fmtPrice(withMarkup, currency) || "0"}
              </div>
              <div className="text-xs text-slate-400 italic mt-1">{fmtWords(withMarkup, currency)}</div>
            </div>
            {addonsTotal > 0 && (
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Optional Add-ons Total</div>
                <div className="text-xl font-semibold text-amber-500">
                  {fmtPrice(addonsTotal, currency)}
                </div>
                <div className="text-xs text-slate-400 italic mt-1">{fmtWords(addonsTotal, currency)}</div>
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
              {customer?.region === 'EXP' && (
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Exchange Rate (₹/$)</label>
                  <input
                    type="number" step="0.01"
                    value={conversionRate ?? ""}
                    onChange={e => setConversionRate(e.target.value === "" ? 94 : parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 94"
                    className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                  <p className="text-xs text-slate-400 mt-1">Base rate for USD conversion</p>
                </div>
              )}
            </div>
          </div>

          {/* Final Price */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 mb-4">
            <div className="text-xs text-emerald-600 uppercase tracking-wide font-semibold mb-1">
              {discount > 0 ? "Final Price (After Discount)" : "Final Price"}
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              {fmtPrice(discount > 0 ? afterDiscount : withMarkup, currency) || "0"}
            </div>
            <div className="text-xs text-emerald-500 italic mt-1">
              {fmtWords(discount > 0 ? afterDiscount : withMarkup, currency)}
            </div>
          </div>

          {/* Input fields */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-slate-600 whitespace-nowrap">Quotation Ref No.:</span>
              <input
                type="text"
                value={proposalData?.quotation?.refNo || ""}
                onChange={handleQuotationRefChange}
                className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono font-bold"
                placeholder="e.g. AE/DOM/1350/01"
              />
              <span className="text-slate-500">
                Date: {proposalData?.quotation?.date || new Date().toLocaleDateString("en-IN")}
              </span>
            </div>

            {machineType !== "material-handling" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Target Output (kg/hr)</label>
                  <input
                    type="text"
                    value={customOutput || ""}
                    onChange={e => setCustomOutput(e.target.value)}
                    placeholder={
                      currentMachineModel?.maxOutputKgHr ||
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
            )}

            {machineType !== "material-handling" && (
              <p className="text-sm text-slate-600 mt-4">{machineHeading || "Configured machine"}</p>
            )}

            {machineType !== "material-handling" && proposalData?.machine?.code && (
              <p className="text-xs text-slate-400 font-mono">
                Proposal model code: <strong className="text-slate-600">{proposalData.machine.code}</strong>
              </p>
            )}
          </div>

          {/* ── SCOPE OF SUPPLY EDITOR ─────────────────────────────────── */}
          {machineType !== "material-handling" && (
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

                      if (["auto_idler", "auto_secnip", "auto_tower", "auto_control"].includes(item.id)) {
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

                    {/* Always append a manual extra row for the editor if it's not already in proposalData.scope */}
                    {!proposalData?.scope?.some(x => x.id === "manual_extra") && (
                      <tr key="manual_extra" className={proposalData?.scope?.length % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="py-2 px-3 text-center font-bold text-slate-300 align-top">
                          {(proposalData?.scope?.length || 0) + 1}
                        </td>
                        <td className="py-1 px-2 align-top">
                          <textarea
                            rows={3}
                            value={scopeOverrides["manual_extra"] || ""}
                            onChange={e => setScopeOverrides(prev => ({ ...prev, "manual_extra": e.target.value }))}
                            placeholder="Type additional scope item description..."
                            className="w-full rounded-lg border border-dashed border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white resize-y leading-relaxed placeholder-slate-300"
                            style={{ minHeight: "52px" }}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Export buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:justify-end mt-2">
            <button
              onClick={() => generateKioskQR(setQrUrl)}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <span>📱 Budgetary Quotation (QR)</span>
            </button>

            <button onClick={() => setShowPdfPreview(true)} className="w-full sm:w-auto btn-primary">
              Download Proposal
            </button>

            <button
              onClick={() => {
                if (window.confirm("Are you sure? This will clear all current selections and start a fresh quotation.")) {
                  resetAll();
                  router.push("/customer");
                }
              }}
              className="w-full sm:w-auto border-2 border-red-500 text-red-500 hover:bg-red-50 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>🔄 Start New Configuration</span>
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
            {qrUrl && qrUrl.includes("vercel-storage.com") ? (
              <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded">
                Works on any mobile data or WiFi connection — no special network needed
              </div>
            ) : (
              <div className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded">
                Ensure phone is connected to <strong>Exhibition WiFi</strong>
              </div>
            )}
            <button onClick={() => setQrUrl(null)} className="mt-6 text-indigo-600 font-bold">Close</button>
          </div>
        </Modal>

        {/* ── SEND VIA WHATSAPP MODAL ──────────────────────────────────────── */}
        <Modal open={!!waSend} onClose={() => setWaSend(null)} title="Send Proposal via WhatsApp">
          <div className="flex flex-col p-6">
            <a
              href={waSend ? `https://wa.me/${waSend.waPhone}?text=${encodeURIComponent(waSend.message)}` : "#"}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl mb-3"
            >
              📱 Open WhatsApp Chat with {customer?.name || "Customer"}
            </a>
            <p className="text-xs text-gray-500 mb-4 text-center">
              If that doesn't open a chat, copy the message below and paste it manually — click a box to select all, then Ctrl+C (Cmd+C on Mac).
            </p>

            <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Customer's number</label>
            <input
              readOnly
              value={waSend?.phoneDisplay || ""}
              onClick={(e) => e.target.select()}
              className="w-full font-mono font-bold text-sm border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-50"
            />

            <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Message</label>
            <textarea
              readOnly
              rows={7}
              value={waSend?.message || ""}
              onClick={(e) => e.target.select()}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 mb-2 bg-gray-50 leading-relaxed"
            />
            <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded mb-4">
              The proposal PDF just downloaded to your device — attach that file in the chat before sending.
            </p>

            <button onClick={() => setWaSend(null)} className="text-indigo-600 font-bold self-center">Close</button>
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
                {machineType === "material-handling"
                  ? (() => {
                    const mixerAddons = (selectedAddons || []).filter(a => a.id === "mixer-dynamic" || a.id === "mixer-dryer-dynamic");
                    if (mixerAddons.length === 0) {
                      return <tr><td colSpan={2} className="px-3 py-3 text-center text-slate-400">No mixer selected.</td></tr>;
                    }
                    return mixerAddons.map((a, i) => (
                      <tr key={a.id + i} className="border-t border-slate-100">
                        <td className="px-3 py-2 align-top text-slate-900">{a.customName || a.name}</td>
                        <td className="px-3 py-2 align-top text-right text-slate-900">{a.qty || 1}</td>
                      </tr>
                    ));
                  })()
                  : selected.length === 0
                    ? <tr><td colSpan={2} className="px-3 py-3 text-center text-slate-400">No basic components selected.</td></tr>
                    : selected.map((item, idx) => (
                      <tr key={item.id || idx} className="border-t border-slate-100">
                        <td className="px-3 py-2 align-top text-slate-900">{item.name}</td>
                        <td className="px-3 py-2 align-top text-right text-slate-900">{item.qty || 1}</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </section>

        {/* ── OPTIONAL EQUIPMENTS TABLE ─────────────────────────────────── */}
        {machineType !== "material-handling" && (
          <section className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-brand-blue">Optional Equipments</h3>
              <button
                onClick={() => setShowAddonPricing(!showAddonPricing)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${showAddonPricing
                  ? " text-amber-700 shadow-inner"
                  : " text-slate-200 hover:bg-slate-100"
                  }`}
              >
                {showAddonPricing ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                {/* {showAddonPricing ? "Hide Internal Pricing" : "View Internal Pricing"} */}
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Component</th>
                    <th className="px-3 py-2 text-right font-semibold w-16 text-slate-700">Qty</th>
                    {showAddonPricing && (
                      <>
                        <th className="px-3 py-2 text-center font-semibold w-24 text-slate-700 bg-amber-50/50">Markup %</th>
                        <th className="px-3 py-2 text-center font-semibold w-24 text-slate-700 bg-amber-50/50">Disc %</th>
                      </>
                    )}
                    <th className="px-3 py-2 text-right font-semibold w-32 text-slate-700">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {optItems.length === 0 && (
                    <tr><td colSpan={showAddonPricing ? 5 : 3} className="px-3 py-3 text-center text-slate-400">No optional equipments selected.</td></tr>
                  )}

                  {optItems.map((addon, idx) => (
                    <tr key={addon.id || idx} className="border-t border-slate-100 group">
                      <td className="px-3 py-2 align-top text-slate-900 group-hover:text-brand-blue transition-colors flex items-center gap-2">
                        <button
                          onClick={() => removeAddon(addon.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                          title="Remove item"
                        >
                          ×
                        </button>
                        <span>{addon.customName || addon.name}</span>
                      </td>
                      <td className="px-3 py-2 align-top text-right text-slate-900 font-medium">{addon.qty || 1}</td>
                      {showAddonPricing && (
                        <>
                          <td className="px-2 py-1 align-middle bg-amber-50/20">
                            <input
                              type="number"
                              value={addon.markup || 0}
                              onChange={(e) => updateAddonPricing(addon.id, { markup: parseFloat(e.target.value) || 0, discount: addon.discount || 0 })}
                              className="w-full text-center py-1 rounded bg-white border border-amber-200 text-brand-blue font-bold focus:ring-1 focus:ring-amber-400 outline-none"
                            />
                          </td>
                          <td className="px-2 py-1 align-middle bg-amber-50/20">
                            <input
                              type="number"
                              value={addon.discount || 0}
                              onChange={(e) => updateAddonPricing(addon.id, { markup: addon.markup || 0, discount: parseFloat(e.target.value) || 0 })}
                              className="w-full text-center py-1 rounded bg-white border border-amber-200 text-rose-500 font-bold focus:ring-1 focus:ring-amber-400 outline-none"
                            />
                          </td>
                        </>
                      )}
                      <td className="px-3 py-2 align-top text-right text-slate-700 font-mono font-semibold whitespace-nowrap">
                        {addon.isIncluded ? "Included" : (addon.price || "—")}
                      </td>
                    </tr>
                  ))}

                  {/* Add Custom Item Row - ALWAYS VISIBLE */}
                  <tr className="border-t border-brand-blue/20 bg-brand-blue/5">
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        placeholder="Add custom item name..."
                        value={customAddonName}
                        onChange={(e) => setCustomAddonName(e.target.value)}
                        className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs focus:ring-1 focus:ring-brand-blue outline-none"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={customAddonQty}
                        onChange={(e) => setCustomAddonQty(parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs text-right focus:ring-1 focus:ring-brand-blue outline-none"
                      />
                    </td>
                    {showAddonPricing && (
                      <>
                        <td className="bg-amber-50/10"></td>
                        <td className="bg-amber-50/10"></td>
                      </>
                    )}
                    <td className="px-2 py-2 flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Price"
                        value={customAddonPrice}
                        onChange={(e) => setCustomAddonPrice(e.target.value)}
                        className="flex-1 px-2 py-1.5 rounded border border-slate-200 text-xs text-right focus:ring-1 focus:ring-brand-blue outline-none"
                      />
                      <button
                        onClick={handleAddCustomAddon}
                        className="w-8 h-8 rounded-lg bg-brand-blue text-white flex items-center justify-center font-bold hover:bg-brand-dark transition-colors shadow-sm"
                        title="Add Custom Item"
                      >
                        +
                      </button>
                    </td>
                  </tr>

                  {optItems.length > 0 && addonsTotal != null && (
                    <tr className="border-t-2 border-slate-300 bg-slate-50">
                      <td colSpan={showAddonPricing ? 4 : 2} className="px-3 py-2 text-right font-bold text-slate-700">
                        Total {currency === 'USD' ? 'USD ($)' : 'INR (₹)'}
                      </td>
                      <td className="px-3 py-2 text-right font-extrabold text-emerald-600 text-sm whitespace-nowrap">
                        {fmtPrice(addonsTotal, currency)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ── GRAND TOTAL BAR ──────────────────────────────────────── */}
            {machineType !== "material-handling" && (() => {
              const machineFinal = discount > 0 ? afterDiscount : withMarkup;
              const grandTotal = machineFinal + (addonsTotal || 0);
              const existingLine = (selectedAddons || []).find(a => a.id === "grand-total-line");
              const alreadyAdded = !!existingLine;
              // Detect price drift so user can refresh
              const isStale = alreadyAdded && existingLine.price !== grandTotal;

              const handleGrandTotalBtn = () => {
                if (alreadyAdded && !isStale) {
                  // Toggle off — user explicitly removing
                  removeAddon("grand-total-line");
                } else {
                  // Add fresh OR refresh stale — addAddon handles replace internally (isDynamic)
                  addAddon("Optional Equipment", {
                    id: "grand-total-line",
                    name: "Total Price (Machine + Optional Equipment)",
                    price: grandTotal,
                    qty: 1,
                    isCustom: true,
                    isDynamic: true,
                    cardDesc: "Combined grand total: machine final price plus all optional equipment.",
                    image: "",
                  });
                }
              };

              return (
                <div className="mt-3 flex items-center gap-3 rounded-xl border-2 border-brand-blue/20 bg-gradient-to-r from-brand-blue/5 to-indigo-50 px-4 py-3">
                  <div className="flex-1">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-blue/60 mb-0.5">
                      Grand Total &nbsp;=&nbsp; Machine Final Price + Optional Addons
                    </div>
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-xl font-extrabold text-brand-blue">
                        {fmtPrice(grandTotal, currency)}
                      </span>
                      <span className="text-xs text-slate-400 italic">
                        {fmtWords(grandTotal, currency)}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {fmtPrice(machineFinal, currency)} (machine)&nbsp;+&nbsp;{fmtPrice(addonsTotal || 0, currency)} (optional)
                    </div>
                  </div>
                  <button
                    onClick={handleGrandTotalBtn}
                    title={
                      isStale ? "Price changed — click to refresh in proposal"
                        : alreadyAdded ? "Click to remove from proposal"
                          : "Add grand total to proposal"
                    }
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold shadow transition-all duration-200 ${isStale
                      ? "bg-amber-100 text-amber-700 border-2 border-amber-400 hover:bg-amber-200"
                      : alreadyAdded
                        ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                        : "bg-brand-blue text-white hover:bg-brand-dark shadow-brand-blue/30"
                      }`}
                  >
                    <span className="text-base leading-none">
                      {isStale ? "↻" : alreadyAdded ? "✓" : "+"}
                    </span>
                    <span>
                      {isStale ? "Refresh" : alreadyAdded ? "Added" : "Add to Proposal"}
                    </span>
                  </button>
                </div>
              );
            })()}
          </section>
        )}

        {/* ── SELECTED IMAGES ───────────────────────────────────────────── */}
        <section className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-brand-blue">Selected Images</h3>
            <div className="text-xs text-slate-500">{[...imageGroupedSelected, ...selectedAddons].filter(i => i.id !== "grand-total-line").length} items</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...imageGroupedSelected, ...selectedAddons].filter(i => i.id !== "grand-total-line").map((item, idx) => {
              // Fallback for stale local storage items that lost their image path
              const fallbackImage = (name) => {
                const n = (name || "").toLowerCase();
                if (n.includes("extruder")) {
                  if (machineType === "aba") return "/images/Extruder/Extruder ABA.png";
                  if (machineType === "3layer" || machineType === "5layer") return "/images/Extruder/Extruder.png";
                  return "/images/Extruder/Extruder Mono.png";
                }
                if (n.includes("die") && n.includes("3 layer")) return "/images/Die/Die.png";
                if (n.includes("die") && n.includes("aba")) return "/images/Die/DieABA.png";
                if (n.includes("die")) return "/images/Die/DieMono.png";
                return "";
              };
              const finalImage = item.image || fallbackImage(item.name);

              return (
              <div key={`${item.id || idx}-img`} className="rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
                <div 
                  className="h-40 bg-slate-50 flex items-center justify-center relative cursor-pointer"
                  onClick={() => finalImage ? setPreviewImage(finalImage) : null}
                >
                  {finalImage ? (
                    <>
                      <img
                        src={finalImage}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = 'flex';
                          }
                        }}
                      />
                      <div style={{ display: 'none' }} className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                        No image
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400">No image</span>
                  )}
                </div>
                <div className="px-3 py-2 text-center text-xs">
                  <div className="font-semibold text-slate-900">
                    {item.customName || item.name}
                  </div>
                  <div className="text-slate-500">Qty: {item.qty || 1}</div>
                </div>
              </div>
            )})}
          </div>
        </section>
      </main>

      {/* ── IMAGE PREVIEW OVERLAY ───────────────────────────────────────────── */}
      {previewImage && (
        <div 
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            zIndex: 10000, backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div style={{ position: "absolute", top: 20, right: 20 }}>
            <button 
              onClick={() => setPreviewImage(null)}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
            >
              ✕ Close
            </button>
          </div>
          <img 
            src={previewImage} 
            alt="Preview" 
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

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
              {[{ k: "classic", label: "📄 Adroit Classic" }, { k: "v2", label: "✨ New Style" }]
                .filter(opt => opt.k !== "v2" || process.env.NODE_ENV === "development")
                .map(({ k, label }) => (
                  <button key={k} disabled={isDownloadingPdf} onClick={() => setQuoteTemplate(k)}
                    style={{ backgroundColor: quoteTemplate === k ? "#2563eb" : "transparent", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 12px", fontWeight: quoteTemplate === k ? 700 : 400, cursor: isDownloadingPdf ? "not-allowed" : "pointer", opacity: isDownloadingPdf ? 0.5 : 1, transition: "background 0.2s" }}
                  >{label}</button>
                ))}
            </div>
            <button
              disabled={isDownloadingPdf}
              onClick={async () => {
                // Guard against double-clicks / re-entry while a download is already in progress
                if (isDownloadingPdf) return;
                setIsDownloadingPdf(true);
                const loadingToast = toast.push({ title: "Generating PDF...", description: "Preparing pages...", variant: "loading", persist: true });

                try {
                  const el = quotationRef.current;
                  if (!el) { throw new Error("Ref error"); }
                  const allImgs = Array.from(el.querySelectorAll("img"));
                  await Promise.all(allImgs.map(img =>
                    img.complete ? Promise.resolve()
                      : new Promise(res => { img.onload = res; img.onerror = res; })
                  ));
                  await new Promise(r => setTimeout(r, 200));
                  const html2canvas = html2canvasModule || (await import("html2canvas")).default;
                  const jsPDF = jsPDFModule || (await import("jspdf")).default;
                  const PAGE_W_PX = 794, PAGE_H_PX = 1123;
                  const A4_W_MM = 210, A4_H_MM = 297;
                  const pageDivs = Array.from(el.children || []).filter(
                    c => c.style && (c.style.pageBreakAfter || c.style.breakAfter)
                  );
                  const pageList = pageDivs.length > 0 ? pageDivs : [el];
                  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
                  for (let i = 0; i < pageList.length; i++) {
                    toast.update(loadingToast, { description: `Rendering page ${i + 1} of ${pageList.length}...` });
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

                  toast.update(loadingToast, { description: "Saving lead..." });
                  // Save lead in the background — failure here shouldn't block the download itself
                  let uploadedPdfUrl = null;
                  try {
                    const base64Pdf = pdf.output("datauristring");
                    const saveResult = await saveLeadWithBase64Pdf(base64Pdf);
                    uploadedPdfUrl = saveResult?.url || null;
                  } catch (e) {
                    console.error("Failed to save lead", e);
                  }

                  pdf.save(`Proposal for ${customer.company}_${customer?.quotationRef || "Draft"}.pdf`);
                  toast.dismiss(loadingToast);
                  toast.push({ title: "Downloaded ✓", description: "Proposal PDF saved.", variant: "success" });
                  setShowPdfPreview(false);

                  // Offer to send the same proposal straight to the customer's
                  // WhatsApp — only makes sense if we actually have both a
                  // number to send to and a hosted link to send them.
                  const waPhone = normalizeWhatsAppPhone(customer?.phone);
                  if (waPhone && uploadedPdfUrl) {
                    setWaSend({
                      waPhone,
                      phoneDisplay: "+" + waPhone,
                      message: buildWhatsAppMessage({
                        name: customer?.name,
                        model: selectedMachineModelLabel || machineType,
                        pdfUrl: uploadedPdfUrl,
                      }),
                    });
                  }
                } catch (err) {
                  console.error("PDF download failed", err);
                  toast.dismiss(loadingToast);
                  toast.push({ title: "Download failed", description: err.message || "Please try again.", variant: "error" });
                } finally {
                  setIsDownloadingPdf(false);
                }
              }}
              style={{ backgroundColor: isDownloadingPdf ? "#1d4ed8" : "#2563eb", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 20px", fontWeight: 700, cursor: isDownloadingPdf ? "not-allowed" : "pointer", fontSize: "14px", opacity: isDownloadingPdf ? 0.8 : 1, display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              {isDownloadingPdf && (
                <span style={{
                  width: 14, height: 14, borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff",
                  display: "inline-block", animation: "spin 0.8s linear infinite",
                }} />
              )}
              {isDownloadingPdf ? "Generating PDF..." : "⬇ Download PDF"}
            </button>
            <button disabled={isDownloadingPdf} onClick={() => setShowPdfPreview(false)}
              style={{ backgroundColor: "#475569", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: isDownloadingPdf ? "not-allowed" : "pointer", opacity: isDownloadingPdf ? 0.5 : 1 }}
            >✕ Close</button>
            <style jsx>{`
              @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
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
