import React, { forwardRef } from "react";

// --- CONFIG ---
const C = {
    RED: "#d71921",
    DARK: "#0F172A",      // Darker Navy for high contrast text
    GRAY_HEADER: "#1e293b",
    BG_GRAY: "#f1f5f9",
    BORDER: "#cbd5e1",
};

const formatCurrency = (amount) => {
    if (!amount) return "₹ 0/-";
    return "₹ " + Number(amount).toLocaleString('en-IN', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }) + "/-";
};

// Safe Image to prevent crashes
const SafeImage = ({ src, className, style }) => (
    <img
        src={src || "/images/machines/three_layer.png"}
        className={className}
        style={style}
        alt="machine"
        crossOrigin="anonymous"
        onError={(e) => { e.target.style.opacity = 0; }}
    />
);

// --- PAGINATION LOGIC (Fits 18 items cleanly on Page 1) ---
const splitItemsForLayout = (items) => {
    const PAGE_1_MAX = 18;
    const PAGE_N_MAX = 25;

    if (items.length <= PAGE_1_MAX) return [items];

    const pages = [];
    pages.push(items.slice(0, PAGE_1_MAX));

    let remaining = items.slice(PAGE_1_MAX);
    while (remaining.length > 0) {
        pages.push(remaining.slice(0, PAGE_N_MAX));
        remaining = remaining.slice(PAGE_N_MAX);
    }
    return pages;
};

export const KioskFlyer = forwardRef(({ data }, ref) => {
    const { customer = {}, machine = {}, pricing = {}, quotation = {} } = data;
    const machineDetails = data.machine_details || data.machineDetails || {};

    const d = new Date();
    const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    const refNo = quotation.ref_no || `K/QT-${d.getTime().toString().slice(-6)}`;

    const allItems = [...(data.components || []), ...(data.optional_items || [])];
    const pages = splitItemsForLayout(allItems);

    const companyName = customer.company || customer.company_name || "VALUED VISITOR";
    const machineImg = machineDetails.machineImagePath || machineDetails.image || "/images/machines/three_layer.png";

    // Font Styles - "Helvetica" is the gold standard for crisp PDF rendering
    const BASE_STYLE = {
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        lineHeight: "1.4",
        color: "#222"
    };

    return (
        <div ref={ref} id="kiosk-flyer-root">
            {pages.map((chunk, pageIndex) => {
                const isFirst = pageIndex === 0;
                const isLast = pageIndex === pages.length - 1;
                const isMultiPage = pages.length > 1;

                return (
                    <div key={pageIndex} className="bg-white print-page" style={{
                        width: "210mm",
                        height: "296.5mm",
                        position: "relative",
                        background: "white",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        pageBreakAfter: "always",
                        boxSizing: "border-box",
                        ...BASE_STYLE
                    }}>

                        {/* --- HEADER --- */}
                        <div style={{ height: "70px", padding: "0 35px", borderBottom: `4px solid ${C.RED}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ width: "180px" }}>
                                <SafeImage src="/images/logo.jpg" style={{ height: "40px", objectFit: "contain" }} />
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "14px", fontWeight: "800", color: C.RED, textTransform: "uppercase", letterSpacing: "1px" }}>Budgetary Offer</div>
                                <div style={{ fontSize: "10px", color: "#64748b", fontWeight: "600", fontFamily: "Arial" }}>{refNo} | {dateStr}</div>
                            </div>
                        </div>

                        {/* --- HERO SECTION (Only Page 1) --- */}
                        {isFirst ? (
                            <div style={{
                                height: "150px",
                                padding: "20px 35px",
                                background: C.BG_GRAY,
                                borderBottom: `1px solid ${C.BORDER}`,
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "20px"
                            }}>
                                {/* Client */}
                                <div style={{ width: "55%", paddingTop: "5px" }}>
                                    <p style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "5px" }}>PREPARED FOR</p>
                                    <div style={{ borderLeft: `4px solid ${C.RED}`, paddingLeft: "15px" }}>
                                        <h1 style={{ fontSize: "22px", fontWeight: "900", textTransform: "uppercase", margin: 0, lineHeight: "1.1", color: C.DARK }}>
                                            {companyName}
                                        </h1>
                                        {customer.city && <p style={{ fontSize: "10px", fontWeight: "700", color: "#475569", margin: "4px 0 0 0", textTransform: "uppercase" }}>{customer.city}, INDIA</p>}
                                    </div>
                                </div>

                                {/* Machine Details & Image */}
                                <div style={{ width: "45%", display: "flex", justifyContent: "flex-end", gap: "15px", height: "100%", alignItems: "center" }}>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "9px", fontWeight: "700", textTransform: "uppercase", color: "#94a3b8" }}>Model</div>
                                        <div style={{ fontSize: "14px", fontWeight: "800", color: C.DARK }}>{machine.modelCode || "AE-SERIES"}</div>
                                        <div style={{ fontSize: "11px", fontWeight: "700", color: C.RED, textTransform: "uppercase" }}>{machine.family}</div>
                                    </div>
                                    <div style={{ height: "110px", width: "130px", background: "white", padding: "4px", borderRadius: "4px", border: `1px solid ${C.BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <SafeImage src={machineImg} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ height: "30px", background: C.BG_GRAY, borderBottom: `1px solid ${C.BORDER}` }}></div>
                        )}

                        {/* --- SCOPE TABLE --- */}
                        <div style={{ flex: 1, padding: "20px 35px", display: "flex", flexDirection: "column" }}>

                            <div style={{
                                background: C.GRAY_HEADER,
                                color: "white",
                                padding: "6px 12px",
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px",
                                borderTopLeftRadius: "3px", borderTopRightRadius: "3px"
                            }}>
                                <span>Equipment Configuration</span>
                                {isMultiPage && <span style={{ opacity: 0.7 }}>Page {pageIndex + 1}</span>}
                            </div>

                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", borderLeft: `1px solid ${C.BORDER}`, borderRight: `1px solid ${C.BORDER}` }}>
                                <thead>
                                    <tr style={{ background: "#f8f9fa", borderBottom: `1px solid ${C.BORDER}`, color: "#475569" }}>
                                        <th style={{ textAlign: "center", padding: "8px", width: "30px", fontWeight: "800", borderRight: `1px solid ${C.BORDER}` }}>#</th>
                                        <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: "800" }}>DESCRIPTION</th>
                                        <th style={{ textAlign: "center", padding: "8px", width: "60px", fontWeight: "800", borderLeft: `1px solid ${C.BORDER}` }}>QTY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chunk.map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: `1px dashed ${C.BORDER}`, background: "white" }}>
                                            <td style={{ textAlign: "center", padding: "8px 6px", fontWeight: "600", color: "#94a3b8", borderRight: `1px solid ${C.BORDER}`, fontSize: "9px" }}>
                                                {(isFirst ? 0 : 18) + (pageIndex > 1 ? (pageIndex - 1) * 24 : 0) + idx + 1}
                                            </td>
                                            <td style={{ padding: "8px 12px", fontWeight: "600", color: C.DARK }}>
                                                {item.name}
                                            </td>
                                            <td style={{ textAlign: "center", padding: "8px 6px", fontWeight: "700", color: "#333", borderLeft: `1px solid ${C.BORDER}` }}>
                                                {item.qty}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ height: "2px", background: C.GRAY_HEADER, opacity: 0.2 }}></div>

                            {/* Bottom Space Filler for visual balance */}
                            <div style={{ flex: 1, minHeight: "20px" }}></div>
                        </div>

                        {/* --- FOOTER (Prices on Last Page Only) --- */}
                        {isLast ? (
                            <div style={{ height: "130px", padding: "0 35px" }}>

                                <div style={{ borderTop: `2px solid ${C.RED}`, paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                    {/* Terms */}
                                    <div style={{ width: "60%" }}>
                                        <p style={{ fontSize: "9px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "4px", letterSpacing: "1px" }}>Standard Terms</p>
                                        <div style={{ fontSize: "9px", color: "#334155", lineHeight: "1.5" }}>
                                            1. <strong>Pricing:</strong> Ex-Works Ahmedabad (GST, P&F, Transport Extra).<br />
                                            2. <strong>Delivery:</strong> 10-14 Weeks from clear order. <br />
                                            3. <strong>Valid For:</strong> 30 Days.
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "2px" }}>Ex-Works Total</p>
                                        <div style={{ fontSize: "32px", fontWeight: "800", color: C.RED, fontFamily: "Arial, sans-serif", letterSpacing: "-0.5px" }}>
                                            {pricing.final_price_text || formatCurrency(pricing.afterDiscount)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ height: "30px", padding: "0 35px", borderTop: `1px dashed ${C.BORDER}` }}></div>
                        )}

                        {/* --- BOTTOM BAR --- */}
                        <div style={{
                            height: "30px",
                            background: "#f8f9fa",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 35px",
                            borderTop: "1px solid #e2e8f0"
                        }}>
                            <span style={{ fontSize: "8px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Adroit Extrusion</span>
                            <span style={{ fontSize: "8px", fontWeight: "700", color: C.RED }}>www.adroitextrusion.com</span>
                        </div>

                    </div>
                );
            })}
        </div>
    );
});

KioskFlyer.displayName = "KioskFlyer";
