import React, { forwardRef } from "react";

// COLORS
const C = {
    RED: "#D71921",
    DARK: "#111827",
    BG_GRAY: "#F8FAFC",
    BORDER: "#CBD5E1"
};

const formatCurrency = (val, currency = "INR") => {
    if (typeof val === "string") return val;
    if (currency === "USD") {
        return "$ " + Math.round(val || 0).toLocaleString('en-US');
    }
    return "₹ " + Math.round(val || 0).toLocaleString('en-IN') + "/-";
};

const SafeImage = ({ src, style }) => (
    <img
        src={src || "/images/machines/3layer.png"}
        style={{ ...style, display: "block" }}
        alt="" crossOrigin="anonymous" onError={(e) => { e.target.style.opacity = 0; }}
    />
);

export const KioskFlyer = forwardRef(({ data }, ref) => {
    const { customer = {}, machine = {}, pricing = {}, quotation = {} } = data || {};
    const machineDetails = data?.machine_details || data?.machineDetails || {};

    const refNo = quotation.ref_no || "KIOSK-DRAFT";
    const dateStr = new Date().toLocaleDateString("en-IN");

    // Data Logic
    const scope = Array.isArray(data?.scope) ? data.scope : [];
    const optionals = Array.isArray(data?.optional_items) ? data.optional_items : [];

    const topItems = scope.slice(0, 20);
    const extraCount = Math.max(0, scope.length - 20);

    // LOGIC FIX: Check both 'company' and 'company_name' to ensure it's not empty
    let companyDisplay = "VISITOR";
    if (customer.company && customer.company.length > 1) companyDisplay = customer.company;
    else if (customer.company_name && customer.company_name.length > 1) companyDisplay = customer.company_name;

    return (
        <div ref={ref} id="kiosk-flyer-root" style={{
            width: "210mm", height: "296mm",
            background: "white",
            color: "#333", fontFamily: "Arial, sans-serif",
            position: "relative", overflow: "hidden", margin: 0, padding: 0
        }}>
            {/* Letterhead Background Layer */}
            <img
                src="/images/letterhead.png"
                style={{
                    position: "absolute",
                    top: 0, left: 0,
                    width: "100%", height: "100%",
                    zIndex: 0,
                    objectFit: "fill"
                }}
                alt=""
                crossOrigin="anonymous"
            />

            {/* CONTENT LAYER — absolutely positioned between letterhead header (top:38mm) and footer (bottom:28mm) */}
            <div style={{
                position: "absolute",
                top: "38mm",
                bottom: "42mm",
                left: "15mm",
                right: "15mm",
                zIndex: 1,
                display: "flex",
                flexDirection: "column"
            }}>

                {/* HERO SECTION (Condensed) */}
                <div style={{ background: "rgba(255, 255, 255, 0.4)", padding: "8px 15px", display: "flex", marginBottom: "20px", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "10px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase", margin: "0 0 2px 0" }}>PREPARED FOR</p>
                        <h1 style={{ fontSize: "15px", fontWeight: "900", color: "#000", margin: 0, textTransform: "uppercase" }}>{companyDisplay}</h1>
                        <div style={{ display: "flex", gap: "15px", marginTop: "5px" }}>
                            <div>
                                <span style={{ display: "block", fontSize: "10px", fontWeight: "bold", color: "#aaa" }}>MODEL</span>
                                <strong style={{ fontSize: "15px", color: C.DARK }}>{machine.modelCode || "AE-SERIES"}</strong>
                            </div>
                            <div>
                                <span style={{ display: "block", fontSize: "10px", fontWeight: "bold", color: "#aaa" }}>FAMILY</span>
                                <strong style={{ fontSize: "15px", color: C.RED }}>{machine.family || "Extrusion"}</strong>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: "130px", height: "100px", background: "white", borderRadius: "4px", padding: "2px", border: `1px solid ${C.BORDER}` }}>
                        <SafeImage src={machineDetails.machineImagePath} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                </div>

                {/* BODY CONTENT — increased paddingBottom to 85px to ensure no overlap with absolute footer */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, paddingBottom: "85px", overflow: "hidden" }}>
                    {/* STANDARD SCOPE */}
                    {(() => {
                        const sosLimit = 14;
                        const addonsLimit = 9;
                        const sosItems = topItems.slice(0, sosLimit);
                        const addonItems = optionals.slice(0, addonsLimit);
                        const totalLines = sosItems.length + (addonItems.length > 0 ? addonItems.length + 1 : 0); // +1 for header

                        // Dynamic Scaling Logic: Shrink font and padding if total lines exceed 18
                        const scale = totalLines > 18 ? Math.max(0.7, 1 - (totalLines - 18) * 0.03) : 1;
                        
                        const fSizeSOS = `${12 * scale}px`;
                        const fSizeAddons = `${9.5 * scale}px`;
                        const pad = `${4 * scale}px 0`;
                        const gap = `${15 * scale}px`;

                        return (
                            <>
                                <div style={{ flexShrink: 0 }}>
                                    <h3 style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", borderBottom: `1.5px solid #333`, paddingBottom: "2px", marginBottom: "8px", color: C.DARK }}>
                                        Standard Scope (Basic Machine)
                                    </h3>
                                    <table style={{ width: "100%", fontSize: fSizeSOS, borderCollapse: "collapse" }}>
                                        <tbody>
                                            {sosItems.map((item, i) => (
                                                <tr key={i} style={{ borderBottom: `1px dashed ${C.BORDER}` }}>
                                                    <td style={{ padding: pad, verticalAlign: "top" }}>
                                                        <div style={{ display: "flex" }}>
                                                            <span style={{ color: "#999", width: "18px", fontWeight: "bold", fontSize: "10px" }}>{i + 1}</span>
                                                            <div style={{ color: "#000", lineHeight: "1.2", fontStyle: "italic", flex: 1 }}>
                                                                {item.desc}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {scope.length > sosLimit && <tr><td style={{ textAlign: "center", padding: "4px", fontSize: "9px", color: "#b45309" }}>... + more components included in the basic machine ...</td></tr>}
                                        </tbody>
                                    </table>
                                </div>

                                {/* GAP between sections */}
                                <div style={{ height: gap, flexShrink: 0 }} />

                                {/* OPTIONAL ITEMS */}
                                {addonItems.length > 0 && (
                                    <div style={{ flexShrink: 0, paddingTop: "5px" }}>
                                        <h3 style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", paddingBottom: "2px", marginBottom: "8px", color: C.RED }}>
                                            Optional Equipment (Selection Based)
                                        </h3>
                                        <table style={{ width: "100%", fontSize: fSizeAddons, borderCollapse: "collapse" }}>
                                            <thead>
                                                <tr style={{ borderBottom: `1.5px solid ${C.RED}` }}>
                                                    <th style={{ textAlign: "left", padding: "3px 0", color: "#991b1b" }}>COMPONENT</th>
                                                    <th style={{ textAlign: "right", padding: "3px 5px", color: "#991b1b", width: "35px" }}>QTY</th>
                                                    <th style={{ textAlign: "right", padding: "3px 0", color: "#991b1b", width: "110px" }}>PRICE</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {addonItems.map((item, i) => (
                                                    <tr key={i} style={{ borderBottom: `1px dashed #fee2e2` }}>
                                                        <td style={{ padding: pad, fontWeight: "600", color: "#333" }}>{item.name}</td>
                                                        <td style={{ padding: pad, textAlign: "right", paddingRight: "5px" }}>{item.qty || 1}</td>
                                                        <td style={{ padding: pad, textAlign: "right", fontWeight: "bold", whiteSpace: "nowrap" }}>{formatCurrency(item.price, pricing.currency)}</td>
                                                    </tr>
                                                ))}
                                                <tr style={{ background: "linear-gradient(90deg, #fff 0%, #fff5f5 100%)", borderTop: `1px solid ${C.RED}` }}>
                                                    <td colSpan="2" style={{ padding: "8px 5px", textAlign: "right", fontWeight: "900", color: C.RED, fontSize: "10px" }}>TOTAL OPTIONAL PRICE:</td>
                                                    <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "900", color: C.RED, fontSize: "11px", whiteSpace: "nowrap" }}>
                                                        {formatCurrency(optionals.reduce((sum, it) => sum + (it.price || 0), 0), pricing.currency)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>


                {/* FOOTER — absolutely fixed to bottom of content layer, never overlaps body */}
                <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: "15mm",
                    right: "15mm",
                    borderTop: `1.5px solid ${C.BORDER}`,
                    paddingTop: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    background: "white"
                }}>
                    <div style={{ fontSize: "8.5px", color: "#64748b", maxWidth: "60%", lineHeight: 1.4 }}>
                        <strong>TERMS:</strong> Ex-Works Ahmedabad. Taxes extra as applicable. <br />
                        <strong>OFFER:</strong> Budgetary Proposal. Validity: 30 Days.
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "8px", fontWeight: "bold", color: "#aaa", textTransform: "uppercase" }}>Basic Machine Price ({pricing.currency || 'INR'})</span>
                        <div style={{ fontSize: "24px", fontWeight: "900", color: C.RED, lineHeight: 1 }}>
                            {pricing.final_price_text || formatCurrency(pricing.afterDiscount)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

KioskFlyer.displayName = "KioskFlyer";
