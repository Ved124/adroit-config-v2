"use client";

import { useContext, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ConfigContext } from "../src/ConfigContext";
import { numberToWords } from "../utils/numberToWords";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SEO from "../components/SEO";
import { AdroitQuotation } from "../src/components/quotation/AdroitQuotation";
import { useRef } from "react";
import { Modal } from '../components/ui/Modal';
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

/** Format a number as ₹ 1,80,00,000/- */
function fmtRupees(n) {
  if (n == null || isNaN(n)) return "";
  return "Rs. " + Math.round(n).toLocaleString("en-IN") + "/-";
}

/** Number in words with Rupees prefix */
function fmtWords(n) {
  if (n == null || isNaN(n)) return "";
  if (n === 0) return "(RUPEES ZERO ONLY)"; // Or based on wording library if it handles 0
  try {
    const w = numberToWords(Math.round(n));
    return w ? `(${w} Only)`.toUpperCase() : "";
  } catch {
    return "";
  }
}

// ─── buildMachineCode ─────────────────────────────────────────────────────────
/**
 * Build the model code string shown on the cover + scope page.
 *
 * For preset models: use the raw CSV/model label (e.g. "AE-2370_50*65*75*65*50")
 *   → selectedMachineModelLabel is already the exact label (e.g. "AE-2370")
 *   → currentMachineModel may have screw info in fields like SCREWS / screwSizes /
 *     or we extract it from the extruders in selected[]
 *
 * Final format:  "AE-2370  (50/65/75/65/50 mm Screws,  Layflat: 2000 mm)"
 * Or for custom: "Custom 3-Layer  (Screws: 65/75/65 mm,  Layflat: 2100 mm)"
 */
function buildMachineCode({ machineType, currentMachineModel, selectedMachineModelLabel, selected, customLayflat }) {
  const SERIES = { mono: "AE-Unoflex", aba: "AE-Duoflex", "3layer": "AE-Innoflex", "5layer": "AE-Innoflex" };

  // 1. Base label from preset or family
  const presetLabel = selectedMachineModelLabel || "";
  const baseCode = presetLabel || SERIES[machineType] || "AE";

  // 2. Screw sizes — extract from selected extruders
  //    Each extruder item has sizeMm field (number) OR we parse from name
  const extruders = (selected || []).filter(item =>
    item.category === "Extruder" ||
    (item.name || "").toLowerCase().includes("extruder") ||
    (item.id || "").includes("ext-")
  );

  let screwStr = "";
  if (extruders.length > 0) {
    // Build list of sizes, repeating by qty
    const sizes = [];
    extruders.forEach(ext => {
      const qty = ext.qty || 1;
      // sizeMm field first, then parse from name
      let sz = ext.sizeMm;
      if (!sz) {
        const m = (ext.name || "").match(/\b(\d{2,3})\s*mm/i);
        if (m) sz = parseInt(m[1]);
      }
      if (sz) {
        for (let i = 0; i < qty; i++) sizes.push(sz);
      }
    });
    if (sizes.length > 0) {
      screwStr = sizes.join("*");
    }
  }

  // 3. Layflat width — from customLayflat input or machine model
  const m = currentMachineModel || {};
  const layflat = customLayflat?.trim() ||
    m["Layflat Width (mm)"] || m["Lay Flat Width"] || m["WIDTH"] || m["Width"] || "";

  // 4. Compose final code
  // Format: "2370_50*65*75*65*50" when layflat is set (matching image 1)
  // Falls back to "AE-Innoflex_50*65*75*65*50" when no layflat entered
  let code;
  if (layflat) {
    // Use raw layflat number as prefix (strip non-numeric suffix for clean look)
    const layflatNum = layflat.replace(/[^\d]/g, '') || layflat;
    code = layflatNum;
    if (screwStr) code += `_${screwStr}`;
  } else {
    code = baseCode;
    if (screwStr) code += `_${screwStr}`;
  }

  return code;
}

// ─── getMachineHeading ────────────────────────────────────────────────────────
function getMachineHeading(machineType, customer, currentMachineModel) {
  const labels = { mono: "Unoflex Monolayer", aba: "Duoflex ABA / AB", "3layer": "Innoflex 3 Layer", "5layer": "Innoflex 5 Layer" };
  const familyLabel = labels[machineType] || "Machine";
  const modelLabel = customer?.machineModel || "";
  let outputText = "";
  if (currentMachineModel && typeof currentMachineModel === "object") {
    for (const key of ["OUTPUT", "Output", "Max. Output (kg/hr)", "Max Output (kg/hr)"]) {
      if (currentMachineModel[key]) { outputText = String(currentMachineModel[key]); break; }
    }
  }
  let text = familyLabel;
  if (modelLabel) text += ` – ${modelLabel}`;
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
  selected, selectedAddons, customOutput, customLayflat,
  withMarkup, afterDiscount, addonsTotal, discount,
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

  // Machine code with screw sizes
  const machineCode = buildMachineCode({
    machineType, currentMachineModel, selectedMachineModelLabel, selected, customLayflat,
  });

  // Performance fields
  const maxOutput = customOutput?.trim() ||
    m["Max. Output (kg/hr)"] || m["OUTPUT"] || m["Output"] || m["Max Output (kg/hr)"] || "";
  const layflatWidth = customLayflat?.trim() ||
    m["Layflat Width (mm)"] || m["Lay Flat Width"] || m["WIDTH"] || m["Width"] || m["layflat"] || "";
  const dieSize = m["Die Size"] || m["DIE"] || m["Die"] || "";
  const thicknessRange = m["Thichness Range (micron)"] || m["Thickness Range (micron)"] || m["THICKNESS"] || "20 – 150 micron";

  // Auto scope desc — "Two nos. [name] — [shortDesc]"
  function autoScopeDesc(item) {
    const qty = item.qty || 1;
    const qtyWord = qty === 1 ? "One no." : `${qty} nos.`;
    const desc = item.shortDesc || item.cardDesc || "";
    return desc ? `${qtyWord} ${item.name} — ${desc}` : `${qtyWord} ${item.name}`;
  }

  // Price strings — basic scope only (no addons)
  const basicPriceStr = fmtRupees(withMarkup);
  const basicPriceWords = fmtWords(withMarkup);
  // Discounted price only if discount > 0
  const discPriceStr = (discount > 0) ? fmtRupees(afterDiscount) : "";
  const discPriceWords = (discount > 0) ? fmtWords(afterDiscount) : "";
  // Final price — same as basic when no discount; discounted value when discount > 0
  const finalPriceStr = (discount > 0) ? fmtRupees(afterDiscount) : basicPriceStr;
  const finalPriceWords = (discount > 0) ? fmtWords(afterDiscount) : basicPriceWords;

  // Optional items with per-item price + total
  const optItems = (selectedAddons || [])
    .filter(item => item && item.name)
    .map(item => ({
      id: item.id || "",
      name: item.name || "",
      qty: item.qty || 1,
      image: item.image || "",
      shortDesc: item.shortDesc || item.cardDesc || "",
      techDesc: item.techDesc || {},
      // Individual line price shown in table: price × qty as formatted string
      price: item.price != null
        ? fmtRupees(item.price * (item.qty || 1))
        : "",
      rawPrice: (item.price || 0) * (item.qty || 1),
    }));

  const addonsTotalStr = addonsTotal != null ? fmtRupees(addonsTotal) : "";

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
      series: SERIES[machineType] || "",
      fullName: TYPE_NAMES[machineType] || "",
      code: machineCode,
      layflat_width: layflatWidth || "",
      coverImage: `/images/machines/${machineType || "3layer"}.png`,
    },
    indicative_performance: {
      product: PRODUCTS[machineType] || "High Quality Blown Film",
      max_output: maxOutput,
      layflat_width: layflatWidth,
      die_size: dieSize,
      thickness_range: thicknessRange,
      thickness_variation: "+/- 8% above 40 micron and +/- 10% upto 40 micron, or +/- 4 micron whichever is higher, over 90% film periphery.",
      raw_materials: "LDPE, LLDPE, HDPE, mLLDPE, etc.",
    },
    // Basic scope — components only, each with auto scopeDesc
    components: (selected || [])
      .filter(item => item && item.name)
      .map(item => ({
        id: item.id || "", name: item.name || "", qty: item.qty || 1,
        image: item.image || "", shortDesc: item.shortDesc || item.cardDesc || "",
        scopeDesc: autoScopeDesc(item), techDesc: item.techDesc || {},
      })),
    // Optional addons with price per line
    optional_items: optItems,

    // Pricing block — formatted strings for AdroitQuotation + numeric for MasterQuotationPDF
    pricing: {
      // Formatted strings (AdroitQuotation / legacy preview)
      basicPrice: basicPriceStr,
      basicPriceWords: basicPriceWords,
      discountedPrice: discPriceStr,
      discountedWords: discPriceWords,
      // Final price — always present, mirrors UI "Final Price" display
      finalPrice: finalPriceStr,
      finalPriceWords: finalPriceWords,
      addonsTotal: addonsTotalStr,
      // Numeric fields for MasterQuotationPDF (basic_price_inr, final_price_inr)
      show_price: !!(withMarkup > 0),
      basic_price_inr: withMarkup > 0 ? Math.round(withMarkup) : null,
      basic_price_words: basicPriceWords ? basicPriceWords.replace(/^\(/, '').replace(/\)$/, '') : '',
      final_price_inr: Math.round(discount > 0 ? afterDiscount : withMarkup) || null,
      final_price_words: finalPriceWords ? finalPriceWords.replace(/^\(/, '').replace(/\)$/, '') : '',
    },
  };
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
    generateKioskQR,
    customOutput, setCustomOutput,
    customLayflat, setCustomLayflat,
    buildWordContext,
  } = useContext(ConfigContext);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  const [qrUrl, setQrUrl] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showPricingFields, setShowPricingFields] = useState(false);

  const handleQuotationRefChange = (e) => {
    const value = e.target.value;
    setCustomer(prev => ({ ...prev, quotationRef: value, ref: value }));
  };

  // Compute prices — used both in UI and in buildProposalData
  const { withMarkup, afterDiscount, addonsTotal } = computePriceSummary();

  const machineHeading = getMachineHeading(machineType, customer, currentMachineModel);

  // Single source of truth — both preview and PDF download use this
  const proposalData = useMemo(() => {
    if (!isClient) return null;
    return buildProposalData({
      customer, machineType, currentMachineModel, selectedMachineModelLabel,
      selected, selectedAddons, customOutput, customLayflat,
      withMarkup, afterDiscount, addonsTotal, discount,
    });
  }, [
    isClient, customer, machineType, currentMachineModel, selectedMachineModelLabel,
    selected, selectedAddons, customOutput, customLayflat,
    withMarkup, afterDiscount, addonsTotal, discount,
  ]);

  return (
    <div className="min-h-screen bg-brand-light pt-28">
      <SEO title="Final Quotation" />

      <main className="max-w-5xl mx-auto py-12 px-6">

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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-brand-blue">Quotation Summary</h1>
            {/* Sales-only toggle — discreet, 50% transparent */}
            <button
              onClick={() => setShowPricingFields(v => !v)}
              title={showPricingFields ? "Hide pricing controls" : "Show pricing controls"}
              style={{ opacity: 0.5 }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {showPricingFields
                ? <FaEye size={16} />
                : <FaEyeSlash size={16} />}
            </button>
          </div>

          {/* Pricing display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Basic Price (Components Only)</div>
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

          {/* Markup & Discount inputs — sales-team only, hidden by default */}
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
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Markup (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  step="0.1"
                  value={markup ?? ""}
                  onChange={e => setMarkup(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 20"
                  className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <p className="text-xs text-slate-400 mt-1">Applied on top of component base cost</p>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={discount ?? ""}
                  onChange={e => setDiscount(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 5"
                  className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <p className="text-xs text-slate-400 mt-1">Deducted from the marked-up price</p>
              </div>
            </div>
          </div>

          {/* Final Price — always visible, same level as Basic Price */}
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
            {/* Ref + date */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-slate-600 whitespace-nowrap">Quotation Ref No.:</span>
              <input
                type="text"
                value={customer?.quotationRef || customer?.ref || ""}
                onChange={handleQuotationRefChange}
                className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="e.g. AET/DOM/25/1123/001"
              />
              <span className="text-slate-500">
                Date: {new Date().toLocaleDateString("en-IN")}
              </span>
            </div>

            {/* Output + Layflat */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Target Output (kg/hr)
                </label>
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
                {!customOutput && (currentMachineModel?.["Max. Output (kg/hr)"] || currentMachineModel?.["OUTPUT"]) && (
                  <p className="text-xs text-slate-400 mt-1">
                    From model: {currentMachineModel?.["Max. Output (kg/hr)"] || currentMachineModel?.["OUTPUT"]} — type to override
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Max. Layflat Width (mm)
                </label>
                <input
                  type="text"
                  value={customLayflat || ""}
                  onChange={e => setCustomLayflat(e.target.value)}
                  placeholder={
                    currentMachineModel?.["Layflat Width (mm)"] ||
                    currentMachineModel?.["Lay Flat Width"] ||
                    currentMachineModel?.["WIDTH"] ||
                    "e.g. 2100 mm"
                  }
                  className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                {!customLayflat && (
                  currentMachineModel?.["Layflat Width (mm)"] ||
                  currentMachineModel?.["Lay Flat Width"] ||
                  currentMachineModel?.["WIDTH"]
                ) && (
                    <p className="text-xs text-slate-400 mt-1">
                      From model: {
                        currentMachineModel?.["Layflat Width (mm)"] ||
                        currentMachineModel?.["Lay Flat Width"] ||
                        currentMachineModel?.["WIDTH"]
                      } — type to override
                    </p>
                  )}
              </div>
            </div>

            {/* Machine heading */}
            <p className="text-sm text-slate-600">{machineHeading || "Configured machine"}</p>

            {/* Live preview of model code that will appear on proposal */}
            {proposalData?.machine?.code && (
              <p className="text-xs text-slate-400 font-mono">
                Proposal model code: <strong className="text-slate-600">{proposalData.machine.code}</strong>
              </p>
            )}
          </div>

          {/* Export buttons */}
          <div className="flex flex-wrap gap-4 justify-end">
            <button
              onClick={() => generateKioskQR(setQrUrl)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"
            >
              <span>📱 Budgetary Quotation (QR)</span>
            </button>

            <button onClick={() => setShowPdfPreview(true)} className="btn-primary">
              Download Proposal
            </button>

            {/* {isClient && proposalData && (
              <PDFDownloadLink
                key={proposalData.quotation.refNo + selected.length}
                document={<MasterQuotationPDF data={proposalData} />}
                fileName={`Quotation_${customer?.company || "Draft"}.pdf`}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
              >
                {({ loading, error }) => {
                  if (error) { console.error("PDF Error:", error); return "Error Building PDF"; }
                  return loading ? "Rendering PDF…" : "Download Official PDF";
                }}
              </PDFDownloadLink>
            )}

            {!isClient && (
              <button className="bg-gray-400 text-white px-6 py-3 rounded-xl font-bold opacity-50 cursor-not-allowed">
                Initializing PDF…
              </button>
            )} */}
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
                        <td className="px-3 py-2 align-top text-slate-900">{addon.name}</td>
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
                  <div className="font-semibold text-slate-900">{item.name}</div>
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
            gap: "16px", padding: "12px 24px", flexShrink: 0,
          }}>
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>
              Preview — confirm then download
            </span>
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
                pdf.save(`Quotation_${customer?.quotationRef || "Draft"}.pdf`);
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
          <AdroitQuotation ref={quotationRef} data={proposalData} />
        </div>
      </div>
    </div>
  );
}