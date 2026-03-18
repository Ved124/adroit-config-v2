"use client";

import { useContext, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { ConfigContext } from "../src/ConfigContext";
import { numberToWords } from "../utils/numberToWords";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SEO from "../components/SEO";
import { AdroitQuotation } from "../src/components/quotation/AdroitQuotation";
import { useRef } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '../components/ui/Modal';


function getSmallDesc(item) {
  if (!item) return "-";
  if (item.shortDesc) return item.shortDesc;
  if (item.desc) return item.desc;

  // If we have a techDesc array, show the first line
  if (Array.isArray(item.techDesc) && item.techDesc.length > 0) {
    const first = item.techDesc[0];
    if (typeof first === "string") return first;
    if (first && first.label && first.value) {
      return `${first.label}: ${first.value}`;
    }
  }

  return "-";
}

function getMachineHeading(machineType, customer, currentMachineModel) {
  let familyLabel = "Machine";
  switch (machineType) {
    case "mono":
      familyLabel = "Unoflex Monolayer";
      break;
    case "aba":
      familyLabel = "Duoflex ABA / AB";
      break;
    case "3layer":
      familyLabel = "Innoflex 3 Layer";
      break;
    case "5layer":
      familyLabel = "Innoflex 5 Layer";
      break;
  }

  const modelLabel = customer?.machineModel || "";
  let outputText = "";

  if (currentMachineModel && typeof currentMachineModel === "object") {
    const candidates = [
      "OUTPUT",
      "Output",
      "Max. Output (kg/hr)",
      "Max Output (kg/hr)",
    ];
    for (const key of candidates) {
      if (currentMachineModel[key]) {
        outputText = String(currentMachineModel[key]);
        break;
      }
    }
  }

  let text = familyLabel;
  if (modelLabel) text += ` – ${modelLabel}`;
  if (outputText) text += ` (Output: ${outputText})`;

  return text;
}




export default function SummaryPage() {
  const router = useRouter();
  const quotationRef = useRef(null);
  const {
    customer,
    setCustomer,
    selected,
    selectedAddons,
    discount,
    setDiscount,
    markup,
    setMarkup,
    showPrices,
    setShowPrices,
    computePriceSummary,
    exportJsonOnly,
    exportPdfOnly,
    exportProPdf,
    exportWordOnly,
    machineType,
    currentMachineModel,
    generateKioskQR,
    customOutput,
    setCustomOutput,
  } = useContext(ConfigContext);
  const [showMarkupField, setShowMarkupField] = useState(false);
  const [showDiscountField, setShowDiscountField] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);


  const handleQuotationRefChange = (e) => {
    const value = e.target.value;
    setCustomer((prev) => ({
      ...prev,
      quotationRef: value,
      ref: value,
    }));
  };

  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);

  // client-side helper
  async function downloadDocxFromServer(payload) {
    try {
      const r = await fetch("/api/generate-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const txt = await r.text();
        throw new Error(`Server error ${r.status}: ${txt}`);
      }
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${new Date().toISOString().slice(0, 10)}_Quotation.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download proposal:", err);
      alert("Failed to download proposal: " + (err.message || err));
    }
  }
  // Usage: call downloadDocxFromServer({ customer, selected, selectedAddons, markup, discount, company })



  const {
    basicTotal,
    addonsTotal,
    beforeMargin,
    withMarkup,
    afterDiscount,
  } = computePriceSummary();

  const basicRounded = Math.round(withMarkup || 0);
  const finalRounded = Math.round(afterDiscount || 0);

  const basicInWords =
    basicRounded > 0
      ? `Rupees ${numberToWords(basicRounded)} only`
      : "-";

  const finalInWords =
    finalRounded > 0
      ? `Rupees ${numberToWords(finalRounded)} only`
      : "-";



  const price = useMemo(
    () => computePriceSummary(),
    [selected, selectedAddons, discount, markup, computePriceSummary]
  );

  const machineHeading = getMachineHeading(
    machineType,
    customer,
    currentMachineModel
  );

  return (
    <div className="min-h-screen bg-brand-light pt-28">
      <SEO title="Final Quotation" />
      {/* Navbar is global */}

      <main className="max-w-5xl mx-auto py-12 px-6">
        {/* CUSTOMER DETAILS */}
        <section className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-brand-blue">
            Customer Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-slate-700">
            <div>
              <span className="text-slate-500">Name: </span>
              {customer?.name || "-"}
            </div>
            <div>
              <span className="text-slate-500">Company: </span>
              {customer?.company || "-"}
            </div>
            <div>
              <span className="text-slate-500">Phone: </span>
              {customer?.phone || "-"}
            </div>
            <div>
              <span className="text-slate-500">Email: </span>
              {customer?.email || "-"}
            </div>
            <div className="md:col-span-2">
              <span className="text-slate-500">Address: </span>
              {customer?.address || "-"}
            </div>
            <div>
              <span className="text-slate-500">City: </span>
              {customer?.city || "-"}
            </div>
            <div>
              <span className="text-slate-500">State / Country: </span>
              {customer?.state || ""} {customer?.country || ""}
            </div>
          </div>
        </section>

        {/* QUOTATION SUMMARY */}
        <section className="glass-card p-8 mb-8">
          <h1 className="text-2xl font-bold text-brand-blue mb-6">Quotation Summary</h1>

          {/* Pricing Grid
          <div className="mt-5">
            <button className="p-2  rounded-full" onClick={() => setShowMarkupField(!showMarkupField)}>
              {showMarkupField ? <FaEyeSlash /> : <FaEye />}
            </button>
            {showMarkupField && (
              <div className="flex items-center gap-3 mt-3">
                <label className="text-xs text-slate-400">Markup (%)</label>
                <input
                  type="number"
                  className="bg-slate px-2 py-1 rounded text-sm w-20"
                  value={markup}
                  onChange={(e) => setMarkup(Number(e.target.value))}
                />
              </div>
            )}
          </div> */}

          {/* ------ BASIC PRICE EX-WORKS ------ */}
          <div className="mt-4">
            <div className="text-xs text-slate-400">BASIC PRICE EX-WORKS</div>
            <div className="text-xl font-semibold text-emerald-400">
              ₹{withMarkup.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-slate-400 italic">
              ({numberToWords(Math.round(withMarkup))} only)
            </div>
          </div>



          {/* ------ DISCOUNT ------ */}
          {/* <div className="mt-5">
            <button className="p-2 text-red rounded-full" onClick={() => setShowDiscountField(!showDiscountField)}>
              {showDiscountField ? <FaEyeSlash /> : <FaEye />}
            </button>
            {showDiscountField && (
              <div className="flex items-center gap-3 mt-3">
                <label className="text-xs text-slate-400">Discount (%)</label>
                <input
                  type="number"
                  className="bg-white px-2 py-1 rounded text-sm w-20"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          {/* ------- FINAL PRICE AFTER DISCOUNT -------- 
          <div className="mt-6 border-t border-slate-800 pt-4">
            <div className="text-xs text-slate-400">FINAL PRICE AFTER DISCOUNT</div>
            <div className="text-xl font-semibold text-emerald-400">
              ₹{afterDiscount.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-slate-400 italic">
              ({numberToWords(Math.round(afterDiscount))} only)
            </div>
          </div> */}

          {/* Quotation Reference */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-slate-600">Quotation Ref No.:</span>
              <input
                type="text"
                value={customer?.quotationRef || customer?.ref || ""}
                onChange={handleQuotationRefChange}
                className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="e.g. AET/DOM/25/1123/001"
              />
              <span className="ml-3 text-slate-500">
                Date: {new Date().toLocaleDateString("en-IN")}
              </span>
            </div>

            {/* NEW: Output Input */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex-1">
                <label className="text-xs text-slate-400">Target Output (Kg/hr)</label>
                <input
                  type="text"
                  value={customOutput || ""}
                  onChange={(e) => setCustomOutput(e.target.value)}
                  placeholder="e.g. 350 Kg/Hr"
                  className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            <p className="text-sm text-slate-600 mt-2">
              {machineHeading || "Configured machine"}
            </p>
          </div>

          {/* Export Actions */}
          <div className="flex flex-wrap gap-4 justify-end">
            <button
              onClick={() => generateKioskQR(setQrUrl)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"
            >
              <span>📱 Send to Phone (QR)</span>
            </button>

            {/* <button onClick={() => downloadDocxFromServer({ customer, selected, selectedAddons, markup, discount })} className="btn-primary bg-slate-800 hover:bg-black">
              Generate Word (.docx)
            </button> */}
            <button onClick={() => setShowPdfPreview(true)} className="btn-primary">
              Download Official PDF
            </button>
          </div>
        </section>

        {/* QR MODAL */}
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

        {/* SCOPE OF SUPPLY - BASIC COMPONENTS */}
        <section className="glass-card p-6 mb-8">
          <h3 className="text-sm font-semibold mb-4 text-brand-blue">
            Basic Machine Components
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Component
                  </th>
                  <th className="px-3 py-2 text-right font-semibold w-16 text-slate-700">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {selected.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-3 py-3 text-center text-slate-400"
                    >
                      No basic components selected.
                    </td>
                  </tr>
                ) : (
                  selected.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      className="border-t border-slate-100"
                    >
                      <td className="px-3 py-2 align-top text-slate-900">
                        {item.name}
                      </td>
                      <td className="px-3 py-2 align-top text-right text-slate-900">
                        {item.qty || 1}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* OPTIONAL EQUIPMENTS */}
        <section className="glass-card p-6 mb-8">
          <h3 className="text-sm font-semibold mb-4 text-brand-blue">
            Optional Equipments
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Component
                  </th>
                  <th className="px-3 py-2 text-right font-semibold w-16 text-slate-700">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedAddons.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-3 py-3 text-center text-slate-400"
                    >
                      No optional equipments selected.
                    </td>
                  </tr>
                ) : (
                  selectedAddons.map((addon, idx) => (
                    <tr
                      key={addon.id || idx}
                      className="border-t border-slate-100"
                    >
                      <td className="px-3 py-2 align-top text-slate-900">
                        {addon.name}
                      </td>
                      <td className="px-3 py-2 align-top text-right text-slate-900">
                        {addon.qty || 1}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* SELECTED IMAGES */}
        <section className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-brand-blue">
              Selected Images
            </h3>
            <div className="text-xs text-slate-500">
              {selected.length + selectedAddons.length} items
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...selected, ...selectedAddons].map((item, idx) => (
              <div
                key={`${item.id || idx}-img`}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-slate-50 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">
                      No image
                    </span>
                  )}
                </div>
                <div className="px-3 py-2 text-center text-xs">
                  <div className="font-semibold text-slate-900">
                    {item.name}
                  </div>
                  <div className="text-slate-500">
                    Qty: {item.qty || 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* AdroitQuotation — ALWAYS mounted so quotationRef.current is never null */}
      {/* visibility:hidden hides it; switching to visible when preview is open  */}
      <div
        style={{
          position: "fixed", top: 0, left: 0,
          width: "100vw", height: "100vh",
          zIndex: showPdfPreview ? 9999 : -1,
          visibility: showPdfPreview ? "visible" : "hidden",
          backgroundColor: showPdfPreview ? "rgba(0,0,0,0.55)" : "transparent",
          overflowY: showPdfPreview ? "auto" : "hidden",
          display: "flex", flexDirection: "column", alignItems: "center",
          pointerEvents: showPdfPreview ? "auto" : "none",
        }}
      >
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
                if (!el) { alert("Ref error - ref is null"); return; }

                // Wait for all images to fully load (letterhead is base64 so instant,
                // but component images from /images/ need time)
                const allImgs = Array.from(el.querySelectorAll("img"));
                await Promise.all(allImgs.map(img =>
                  img.complete ? Promise.resolve() :
                    new Promise(res => { img.onload = res; img.onerror = res; })
                ));

                // Small settle delay for layout
                await new Promise(r => setTimeout(r, 200));

                const html2canvas = (await import("html2canvas")).default;
                const { jsPDF } = await import("jspdf");

                // Each page div is 794x1123px
                const PAGE_W_PX = 794;
                const PAGE_H_PX = 1123;
                const A4_W_MM = 210;
                const A4_H_MM = 297;
                const SCALE = 2;

                // Get all page divs (they have pageBreakAfter style)
                const pageDivs = Array.from(el.children[0]?.children || []).filter(
                  c => c.style && (c.style.pageBreakAfter || c.style.breakAfter)
                );
                // Fallback: treat the whole root as one page
                const pageList = pageDivs.length > 0 ? pageDivs : [el];

                const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

                for (let i = 0; i < pageList.length; i++) {
                  const pageEl = pageList[i];

                  // Get element's position relative to viewport
                  const rect = pageEl.getBoundingClientRect();

                  const canvas = await html2canvas(pageEl, {
                    scale: SCALE,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: "#ffffff",
                    logging: false,
                    width: PAGE_W_PX,
                    height: PAGE_H_PX,
                    windowWidth: PAGE_W_PX,
                    windowHeight: PAGE_H_PX,
                    x: 0,
                    y: 0,
                  });

                  const imgData = canvas.toDataURL("image/jpeg", 0.95);
                  if (i > 0) pdf.addPage();
                  pdf.addImage(imgData, "JPEG", 0, 0, A4_W_MM, A4_H_MM);
                }

                pdf.save(`Quotation_${customer?.quotationRef || "Draft"}.pdf`);
                setShowPdfPreview(false);
                if (window.confirm("Save the data?")) exportJsonOnly();
              }}
              style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 20px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}
            >⬇ Download PDF</button>
            <button onClick={() => setShowPdfPreview(false)}
              style={{ backgroundColor: "#475569", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "14px" }}
            >✕ Close</button>
          </div>
        )}
        <div style={{ marginTop: "16px", marginBottom: "40px" }}>
          <AdroitQuotation
            ref={quotationRef}
            data={{
              customer,
              machine: {
                type: machineType,
                code: currentMachineModel?.code || "",
                model: currentMachineModel?.label || currentMachineModel?.code || "",
              },
              quotation: {
                refNo: customer?.quotationRef || customer?.ref || "",
                date: new Date().toISOString().slice(0, 10),
              },
              components: selected,
              optional_items: selectedAddons,
              indicative_performance: {
                product: (
                  machineType === "mono" ? "High Quality Monolayer Film"
                    : machineType === "aba" ? "High Quality ABA Co-Extrusion Film"
                      : machineType === "5layer" ? "High Quality 5 Layer Co-Extrusion Film"
                        : "High Quality Innoflex 3 Layer Film"
                ),
                max_output: customOutput || currentMachineModel?.["Max. Output (kg/hr)"] || "",
                layflat_width: currentMachineModel?.["Lay Flat Width"] || currentMachineModel?.layflat || "",
                die_size: currentMachineModel?.["Die Size"] || "",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}