import React, { forwardRef } from "react";

/* ==========================================================================
   1. UTILITIES & CONFIG
   ========================================================================== */

const CONFIG = {
    MARGIN_TOP: "145px",
    MARGIN_BOTTOM: "70px",
    MARGIN_X: "40px",

    // Visuals
    RED: "#d71921",
    DARK: "#1e293b",
    TABLE_BORDER: "#94a3b8"
};

const formatDate = (dateVal) => {
    if (!dateVal) return new Date().toLocaleDateString("en-IN", { day: '2-digit', month: '2-digit', year: 'numeric' });
    if (dateVal instanceof Date) return dateVal.toLocaleDateString("en-IN", { day: '2-digit', month: '2-digit', year: 'numeric' });
    return String(dateVal);
};

// Robust formatting
const formatCurrency = (amount) => {
    return "INR " + Number(amount || 0).toLocaleString('en-IN', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }) + "/-";
};

// Parses price text back to number if raw number is missing (Fixes "Zero" issue)
const parsePrice = (priceVal, priceText) => {
    if (priceVal && typeof priceVal === 'number') return priceVal;
    if (priceText && typeof priceText === 'string') {
        // Remove "INR", "," and "/-" to get raw number
        const clean = priceText.replace(/[^0-9.]/g, '');
        return Number(clean) || 0;
    }
    return 0;
};

function numberToWords(n) {
    const num = Number(n);
    if (isNaN(num) || num === 0) return "Zero Only";

    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

    const convertGroup = (val) => {
        let s = "";
        if (val >= 100) { s += units[Math.floor(val / 100)] + " Hundred "; val %= 100; }
        if (val >= 20) { s += tens[Math.floor(val / 10)] + " "; val %= 10; }
        if (val > 0) {
            if (val < 10) s += units[val] + " ";
            else if (val >= 10 && val < 20) s += teens[val - 10] + " ";
        }
        return s;
    }

    let str = "";
    let rem = Math.floor(Math.abs(num));
    const crore = Math.floor(rem / 10000000); rem %= 10000000;
    const lakh = Math.floor(rem / 100000); rem %= 100000;
    const thousand = Math.floor(rem / 1000); rem %= 1000;

    if (crore > 0) str += convertGroup(crore) + "Crore ";
    if (lakh > 0) str += convertGroup(lakh) + "Lakh ";
    if (thousand > 0) str += convertGroup(thousand) + "Thousand ";
    if (rem > 0) str += convertGroup(rem);

    return str.trim() + " Only";
}

// Data Parser for Tables
const resolveSpecs = (item) => {
    const specs = [];
    // 1. Direct TechDesc
    if (item.techDesc && typeof item.techDesc === 'object' && !Array.isArray(item.techDesc)) {
        Object.entries(item.techDesc).forEach(([label, value]) => {
            if (value && String(value).trim()) {
                specs.push({ label: label.replace(/_/g, ' '), value: String(value) });
            }
        });
    } else if (Array.isArray(item.techDesc)) {
        item.techDesc.forEach(x => { if (x.label && x.value) specs.push({ label: x.label, value: x.value }); });
    }
    // 2. Fallback
    if (specs.length === 0) {
        specs.push({ label: "Details", value: item.desc || item.cardDesc || "Standard Config" });
    }
    return specs;
};

// Safe Image
const SafeImage = ({ src, className, style }) => (
    <img
        src={src || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="}
        className={className}
        style={{ ...style, objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
        onError={(e) => { e.target.style.opacity = 0; }}
        crossOrigin="anonymous"
        alt=""
    />
);

/* ==========================================================================
   2. PAGE LAYOUT
   ========================================================================== */

const A4_STYLE = {
    width: "210mm",
    height: "296.5mm",
    backgroundColor: "white",
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
    pageBreakAfter: "always",
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: '11pt', // INCREASED BASE FONT
    color: "#333",
    lineHeight: "1.4",
    boxSizing: "border-box"
};

const PageContainer = ({ children, pageNum }) => (
    <div style={A4_STYLE} className="print-page relative bg-white">
        {/* BACKGROUND: Letterhead */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <img src="/images/letterhead.png" style={{ width: "100%", height: "100%" }} alt="" onError={(e) => e.target.style.display = 'none'} />
        </div>

        {/* CONTENT AREA */}
        <div style={{
            position: "absolute",
            top: CONFIG.MARGIN_TOP,
            bottom: CONFIG.MARGIN_BOTTOM,
            left: CONFIG.MARGIN_X,
            right: CONFIG.MARGIN_X,
            zIndex: 10,
            display: "flex",
            flexDirection: "column"
        }}>
            {children}
        </div>

        {/* Page Number */}
        <div className="absolute bottom-[35px] right-[40px] text-[10px] font-bold text-gray-500 z-20">
            Page {pageNum}
        </div>
    </div>
);


/* ==========================================================================
   3. PAGES
   ========================================================================== */

/* --- 1. COVER PAGE --- */
const CoverPage = ({ customer, machine, img }) => (
    <PageContainer pageNum="1">
        <div className="flex flex-col h-full justify-center text-center -mt-8">

            <div className="mb-10">
                <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-[4px] border-b-2 border-gray-300 inline-block pb-2 mb-3">COMMERCIAL PROPOSAL</h3>
                <h1 className="text-[44px] font-black uppercase text-[#111] leading-none tracking-tight">
                    AE {machine.model?.replace(/.*–\s*/, "") || "INNOFLEX"}
                </h1>
                <p className="text-[18px] font-bold text-[#d71921] uppercase tracking-wide mt-2">
                    {machine.family || "Extrusion System"}
                </p>
            </div>

            <div className="flex justify-center mb-12 h-[340px]">
                <div className="bg-white/40 p-1 border border-gray-100 rounded">
                    <SafeImage src={img} className="max-h-full max-w-full object-contain drop-shadow-xl" />
                </div>
            </div>

            <div className="text-left w-[85%] mx-auto pl-6 border-l-[6px] border-[#d71921] bg-[#f9fafb] py-4 rounded-r">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">PREPARED FOR</span>
                <h2 className="text-[26px] font-black uppercase text-[#111] leading-none mb-1">
                    {customer.company || "VALUED CUSTOMER"}
                </h2>
                <p className="text-[12px] font-bold text-gray-600 uppercase">
                    {customer.city ? `${customer.city}, INDIA` : "-"}
                </p>
            </div>

        </div>
    </PageContainer>
);

/* --- 2. ANNEXURE 1: SCOPE --- */
const ScopePage = ({ refNo, date, items, pricing }) => {

    // Fallback if price is just text or number
    const finalVal = parsePrice(pricing.final_price_number, pricing.final_price_text);
    const wordPrice = numberToWords(finalVal);

    return (
        <PageContainer pageNum="2">
            {/* META HEADER */}
            <div className="flex justify-between items-center text-[12px] font-bold text-gray-600 border-b-2 border-gray-200 pb-2 mb-6">
                <span>REF: <span className="text-black text-[13px]">{refNo}</span></span>
                <span>DATE: <span className="text-black text-[13px]">{date}</span></span>
            </div>

            {/* TABLE TITLE */}
            <div className="bg-[#1e293b] text-white py-2 px-4 font-bold text-[12px] uppercase tracking-wide rounded-t-sm shadow-sm">
                Annexure-1: Scope of Supply
            </div>

            {/* TABLE */}
            <div className="border border-gray-300 rounded-b-sm overflow-hidden flex-1 mb-6 bg-white">
                <table className="w-full text-[11px] border-collapse">
                    <thead className="bg-gray-100 text-black border-b-2 border-gray-300">
                        <tr>
                            <th className="py-3 px-3 border-r border-gray-300 w-12 text-center font-bold">SR</th>
                            <th className="py-3 px-4 border-r border-gray-300 text-left font-bold">ITEM DESCRIPTION</th>
                            <th className="py-3 px-3 w-16 text-center font-bold">QTY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.slice(0, 18).map((item, i) => (
                            <tr key={i} className="border-b border-gray-200 even:bg-[#fcfcfc] hover:bg-red-50/20">
                                <td className="py-3 px-3 text-center border-r border-gray-300 font-bold text-gray-500">{i + 1}</td>
                                <td className="py-3 px-4 text-left border-r border-gray-300 font-bold text-gray-800">{item.name}</td>
                                <td className="py-3 px-3 text-center font-bold text-black">{item.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PRICE BLOCK */}
            <div className="mt-auto border-[2px] border-[#d71921] p-4 bg-white shadow-md rounded">
                <div className="flex justify-between items-center text-[12px] font-bold text-gray-600 mb-2">
                    <span>BASIC PRICE EX-WORKS (UNPACKED)</span>
                    <span className="font-mono text-[14px] text-black">{pricing.basic_price_text}</span>
                </div>

                <div className="h-px bg-red-100 mb-3"></div>

                <div className="flex justify-between items-center bg-[#fff0f1] p-3 -mx-2 rounded border border-[#fecaca]">
                    <span className="text-[14px] font-black text-[#d71921] uppercase">FINAL AGREED PRICE</span>
                    <span className="text-[22px] font-black text-[#d71921] font-sans tracking-tight">{pricing.final_price_text}</span>
                </div>

                <div className="text-right mt-2 text-[11px] font-bold text-gray-500 italic uppercase">
                    ({wordPrice})
                </div>
            </div>
            <p className="text-[9px] mt-2 text-gray-400 italic"> * Price validity 30 days from proposal date.</p>

        </PageContainer>
    );
};

/* --- 3. ANNEXURE 2: OPTIONS (If any) --- */
const OptionalsPage = ({ items, pageNum }) => (
    <PageContainer pageNum={pageNum}>
        <div className="mt-4">
            <div className="bg-[#333] text-white py-2 px-4 font-bold text-[12px] uppercase tracking-wide rounded-t-sm shadow-sm">
                Annexure-2: Optional Equipments List
            </div>

            <div className="border border-gray-300 rounded-b-sm overflow-hidden bg-white">
                <table className="w-full text-[11px] border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-300 text-gray-800">
                        <tr>
                            <th className="py-3 px-3 border-r border-gray-300 w-12 text-center font-bold">SR</th>
                            <th className="py-3 px-4 border-r border-gray-300 text-left font-bold">OPTIONAL EQUIPMENT</th>
                            <th className="py-3 px-3 text-right font-bold w-[140px]">PRICE (ADDITIONAL)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((opt, i) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-[#fafafa]">
                                <td className="py-3 px-3 text-center border-r border-gray-300 font-bold text-gray-500">{i + 1}</td>
                                <td className="py-3 px-4 text-left border-r border-gray-300 font-bold text-[#111] uppercase">{opt.name}</td>
                                <td className="py-3 px-3 text-right font-mono font-bold text-[#444]">
                                    {formatCurrency(opt.price)}
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && <tr><td colSpan={3} className="p-8 text-center italic text-gray-400">None selected.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    </PageContainer>
);

/* --- 4. COMPONENT SPECS (Larger Font & Better Table) --- */
const TechSheets = ({ items, pageStart }) => {
    return items.map((item, idx) => {
        const specs = resolveSpecs(item);

        return (
            <PageContainer key={`ts-${idx}`} pageNum={pageStart + idx}>

                {/* ITEM HEADER */}
                <div className="flex items-center gap-4 mb-8 pb-3 border-b-[3px] border-[#d71921]">
                    <div className="bg-[#d71921] text-white w-[36px] h-[36px] flex items-center justify-center font-bold text-[14px] rounded shadow-sm">
                        {idx + 1}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-[20px] font-black uppercase text-[#111] leading-none tracking-tight">{item.name}</h3>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 block">{item.category}</span>
                    </div>
                    <span className="text-[11px] font-bold border-2 border-gray-200 bg-gray-50 px-4 py-1.5 rounded text-gray-800 shadow-sm">
                        QTY: {item.qty}
                    </span>
                </div>

                <div className="flex flex-col gap-8 h-full">

                    {/* IMAGE */}
                    <div className="w-full h-[240px] bg-white border border-gray-200 rounded p-4 flex items-center justify-center relative shadow-sm">
                        {item.image ? (
                            <SafeImage src={item.image} className="max-h-full max-w-full object-contain z-10" />
                        ) : (
                            <div className="text-[12px] text-gray-300 font-bold border border-dashed border-gray-300 p-6 rounded">DRAWING PENDING</div>
                        )}
                    </div>

                    {/* SPECS TABLE */}
                    <div className="flex-1 border border-gray-300 rounded-sm bg-white overflow-hidden shadow-sm">
                        <div className="bg-[#333] text-white py-2 px-4 font-bold text-[12px] uppercase tracking-wide">
                            Technical Specifications
                        </div>
                        <table className="w-full text-[11px] border-collapse">
                            <tbody>
                                <tr className="border-b border-gray-200 bg-[#f9fafb]">
                                    <td className="w-[35%] py-3 px-4 font-bold text-gray-700 border-r border-gray-300 uppercase">CATEGORY</td>
                                    <td className="py-3 px-4 font-medium uppercase text-black">{item.category}</td>
                                </tr>
                                {specs.map((row, r) => (
                                    <tr key={r} className="border-b border-gray-200 last:border-0 hover:bg-[#fff9f9]">
                                        <td className="py-3 px-4 bg-[#fcfcfc] font-bold text-gray-600 border-r border-gray-300 capitalize align-top tracking-tight">
                                            {row.label}
                                        </td>
                                        <td className="py-3 px-4 text-[#111] font-medium align-top leading-snug">
                                            {row.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </PageContainer>
        );
    });
};

/* --- 5. TERMS AND UTILITIES (Readable Big Fonts) --- */
const StaticSection = ({ performance, pageStart }) => {
    return (
        <>
            {/* --- UTILITIES --- */}
            <PageContainer pageNum={pageStart}>
                <div className="bg-[#d71921] text-white py-2 px-4 font-bold text-[13px] uppercase mb-6 shadow-sm rounded-t-sm">
                    UTILITY REQUIREMENTS & PERFORMANCE
                </div>

                <div className="mb-8 border border-gray-300 rounded overflow-hidden shadow-sm">
                    <table className="w-full text-[11px]">
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="p-3 w-[25%] bg-[#f9fafb] font-bold border-r border-gray-200">POWER</td>
                                <td className="p-3">415 V ±5%, 50 Hz, 3-Phase + Neutral + Earthing (Stabilized).</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="p-3 bg-[#f9fafb] font-bold border-r border-gray-200">WATER</td>
                                <td className="p-3">Soft Water (Boiler Grade). Temp 20-25°C. Pressure 2.5 Bar (Closed Loop).</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="p-3 bg-[#f9fafb] font-bold border-r border-gray-200">AIR</td>
                                <td className="p-3">Dry Compressed Air @ 6 Bar Pressure (Moisture Free).</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="border border-blue-200 bg-blue-50/50 p-5 rounded text-[11px] leading-6 text-gray-800 text-justify mb-8 shadow-sm">
                    <h4 className="font-bold text-[#1e40af] mb-2 uppercase border-b border-blue-200 pb-1">Indicative Performance</h4>
                    <p className="mb-2"><strong>Target Product:</strong> {performance.product || "Three Layer Blown Film"}</p>
                    <p className="mb-2"><strong>Max Capacity:</strong> {performance.max_pumping_capacity || "As per screw size"}</p>
                    <p><strong>Condition:</strong> The guaranteed output requires continuous 24h operation, use of Prime Grade Raw Material (Density/MFI as specified) with standard additives, and ambient temperature below 45°C. High humidity ({">"}70%) reduces cooling efficiency.</p>
                </div>

                <div className="border border-red-200 bg-red-50 p-4 rounded text-[11px] text-red-900 leading-relaxed">
                    <strong>EXCLUSIONS:</strong> Civil foundation & flooring. Main cabling from transformer to panel. Earthing (3 pits). Interconnecting water & air piping. First fill of Lubricants (Gear oil/Hydraulic oil). Unloading Crane & Labor.
                </div>
            </PageContainer>

            {/* --- TERMS PAGE 1 --- */}
            <PageContainer pageNum={pageStart + 1}>
                <div className="text-center py-2.5 mb-8 bg-[#1e293b] text-white rounded-sm shadow-md">
                    <h3 className="font-bold text-[13px] uppercase tracking-[2px]">Commercial Terms & Conditions</h3>
                </div>

                <div className="text-[11px] leading-6 text-justify text-[#111] space-y-6">
                    <div>
                        <strong className="block border-b-2 border-gray-300 mb-2 uppercase text-black font-black">1. Prices</strong>
                        Prices are Un Packed, Ex-works, Ahmedabad, Gujarat basis. All Government taxes and duties are not considered. These are applicable as per rule. Prices are valid for 30 days from the date of quotation.
                    </div>
                    <div>
                        <strong className="block border-b-2 border-gray-300 mb-2 uppercase text-black font-black">2. Packing & Forwarding</strong>
                        Packing charges will be charged extra.
                    </div>
                    <div>
                        <strong className="block border-b-2 border-gray-300 mb-2 uppercase text-black font-black">3. Insurance</strong>
                        Transit insurance of the machine is to be covered by the buyer. In event of any claim, procedure done by buyer.
                    </div>
                    <div>
                        <strong className="block border-b-2 border-gray-300 mb-2 uppercase text-black font-black">4. Transportation</strong>
                        Cost of transport is borne by the customer.
                    </div>
                    <div>
                        <strong className="block border-b-2 border-gray-300 mb-2 uppercase text-black font-black">5. Delivery</strong>
                        04 Months from date of receipt of technically/commercially clear PO + Minimum 40% irrevocable security deposit. Failure to lift machine within 30 days of readiness allows Adroit to divert to other customers.
                    </div>
                    <div>
                        <strong className="block border-b-2 border-gray-300 mb-2 uppercase text-black font-black">6. Payment</strong>
                        40% Advance (Irrevocable). Balance payment + Taxes + Duties before delivery. Advance is non-interest bearing.
                    </div>
                </div>
            </PageContainer>

            {/* --- TERMS PAGE 2 (Warranty & Sign) --- */}
            <PageContainer pageNum={pageStart + 2} lastPage={true}>
                <div className="text-center py-2.5 mb-8 bg-[#1e293b] text-white rounded-sm shadow-md">
                    <h3 className="font-bold text-[13px] uppercase tracking-[2px]">Warranty Policy</h3>
                </div>

                <div className="text-[11px] leading-6 text-justify text-[#111] space-y-6 h-[50%]">
                    <div>
                        <strong className="block border-b-2 border-gray-300 mb-2 uppercase text-black font-black">7. Erection & Commissioning</strong>
                        Our service engineers will supervise erection & commissioning. Customer must provide Skilled & Unskilled Labor. Airfare (To & Fro), Local Transport, Boarding & Lodging provided by Customer.
                    </div>
                    <div>
                        <strong className="block border-b-2 border-gray-300 mb-2 uppercase text-black font-black">8. Standard Warranty</strong>
                        WARRANTY PERIOD: 12 Months from date of commissioning against faulty material or bad workmanship (Mechanical). <br />
                        Electrical items/Bought-outs: As per OEM warranty (6-12 Months). <br />
                        EXCLUDES: Rubber, Plastic, Glass, Fuses, Heaters, Lamps. Damage due to accident/misuse not covered.
                    </div>
                    <div>
                        <strong className="block border-b-2 border-gray-300 mb-2 uppercase text-black font-black">9. Cancellation</strong>
                        Order once placed cannot be cancelled. In case of cancellation, entire advance amount is forfeited.
                    </div>
                    <div>
                        <strong className="block border-b-2 border-gray-300 mb-2 uppercase text-black font-black">10. Jurisdiction</strong>
                        Contract subject to Ahmedabad (Gujarat) jurisdiction only.
                    </div>
                </div>

                <div className="flex justify-end mt-12 pr-4">
                    <div className="w-[200px] text-center p-4 border border-gray-200 bg-gray-50 rounded shadow-sm">
                        <p className="text-left text-[11px] font-bold text-gray-500 mb-10">Sincerely,</p>
                        <p className="text-left text-[12px] font-black uppercase mb-4">FOR ADROIT EXTRUSION</p>
                        <div className="border-t-2 border-black pt-2 mt-12">
                            {/* <p className="font-black text-[12px] uppercase">URVEESH JEPALIYA</p> */}
                            {/* <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Business Development</p> */}
                        </div>
                    </div>
                </div>
            </PageContainer>
        </>
    );
};

/* ==========================================================================
   4. MAIN EXPORT WRAPPER
   ========================================================================== */

export const AdroitQuotation = forwardRef(({ data }, ref) => {
    const d = data || {};
    const customer = d.customer || {};
    const machine = d.machine || {};
    const pricing = d.pricing || {};
    const quotation = d.quotation || {};
    const perf = d.indicative_performance || {};

    const mainItems = d.components || [];
    const optionalItems = d.optional_items || [];
    const allSpecs = [...mainItems, ...optionalItems];

    const coverImg = d.machine_details?.machineImagePath || d.machine_details?.image || "/images/machines/three_layer.png";

    // Safe Lookup for Ref No
    const finalRef = quotation.ref_no || customer.quotationRef || "DRAFT";
    const finalDate = formatDate(quotation.date || new Date());

    let pg = 1;
    const scopePg = 2;
    const optPg = optionalItems.length > 0 ? 3 : null;
    const techStartPg = optionalItems.length > 0 ? 4 : 3;

    return (
        <div ref={ref} id="quotation-template-container" className="bg-white">
            <CoverPage
                customer={customer}
                machine={machine}
                img={coverImg}
            />
            <ScopePage
                refNo={finalRef}
                date={finalDate}
                items={mainItems}
                pricing={pricing}
            />

            {optionalItems.length > 0 && (
                <OptionalsPage items={optionalItems} pageNum={optPg} />
            )}

            <TechSheets items={allSpecs} pageStart={techStartPg} />

            <StaticSection
                performance={perf}
                pageStart={techStartPg + allSpecs.length}
            />
        </div>
    );
});

AdroitQuotation.displayName = "AdroitQuotation";