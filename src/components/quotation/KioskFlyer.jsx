import React, { forwardRef } from "react";

// COLORS - Modernized Professional Palette
const C = {
    RED: "#dc2626",       // Sharp, modern red
    DARK: "#0f172a",      // Deep slate for text
    SLATE: "#334155",     // Medium slate for secondary text
    MUTED: "#64748b",     // Muted slate for numbers/labels
    BG_GRAY: "#f8fafc",   // Clean light gray background
    BORDER: "#e2e8f0",    // Soft border color
    RED_BG: "#fef2f2"     // Very subtle red tint for optional section
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

    // Data Logic
    const scope = Array.isArray(data?.scope) ? data.scope : [];
    const optionals = Array.isArray(data?.optional_items)
        ? data.optional_items.filter(o => o && o.id !== "grand-total-line" && o.id !== "die-rotation-addon")
        : [];

    const topItems = scope.slice(0, 20);

    // Ensure company name is valid
    let companyDisplay = "VISITOR";
    if (customer.company && customer.company.length > 1) companyDisplay = customer.company;
    else if (customer.company_name && customer.company_name.length > 1) companyDisplay = customer.company_name;

    return (
        <div ref={ref} id="kiosk-flyer-root" style={{
            width: "210mm", height: "296mm",
            background: "white",
            color: C.DARK, 
            fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
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

            {/* CONTENT LAYER — Max space utilization */}
            <div style={{
                position: "absolute",
                top: "38mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm",
                zIndex: 1,
                display: "flex",
                flexDirection: "column"
            }}>

                {/* HERO SECTION - Professional Callout Box */}
                <div style={{ 
                    background: "rgba(248, 250, 252, 0.9)", // slightly transparent slate-50
                    borderLeft: `4px solid ${C.RED}`,
                    padding: "12px 18px", 
                    display: "flex", 
                    marginBottom: "15px", 
                    alignItems: "center", 
                    flexShrink: 0,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", marginBottom: "12px" }}>
                            <div>
                                <p style={{ fontSize: "7px", fontWeight: "700", color: C.MUTED, letterSpacing: "0.05em", textTransform: "uppercase", margin: 0, lineHeight: 1 }}>Prepared For</p>
                                <h1 style={{ fontSize: "20px", fontWeight: "900", color: C.DARK, margin: 0, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1 }}>{companyDisplay}</h1>
                            </div>
                            <div style={{ flexShrink: 0 }}>
                                <span style={{ display: "block", fontSize: "7px", fontWeight: "600", color: C.MUTED, textTransform: "uppercase", lineHeight: 1, marginBottom: 0 }}>Ref No.</span>
                                <strong style={{ fontSize: "11px", color: C.DARK, fontWeight: "700", lineHeight: 1 }}>{quotation.refNo || "DRAFT"}</strong>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "25px", alignItems: "center" }}>
                            <div>
                                <span style={{ display: "block", fontSize: "7px", fontWeight: "600", color: C.MUTED, textTransform: "uppercase", lineHeight: 1, marginBottom: 0 }}>Model</span>
                                <strong style={{ fontSize: "11px", color: C.DARK, fontWeight: "700", lineHeight: 1 }}>{machine.modelCode || "AE-SERIES"}</strong>
                            </div>
                            <div>
                                <span style={{ display: "block", fontSize: "7px", fontWeight: "600", color: C.MUTED, textTransform: "uppercase", lineHeight: 1, marginBottom: 0 }}>Family</span>
                                <strong style={{ fontSize: "11px", color: C.RED, fontWeight: "700", lineHeight: 1 }}>{(machine.family || "Extrusion").replace(/Unoflex |Duoflex |Innoflex /gi, "")}</strong>
                            </div>
                            <div>
                                <span style={{ display: "block", fontSize: "7px", fontWeight: "600", color: C.MUTED, textTransform: "uppercase", lineHeight: 1, marginBottom: 0 }}>Date</span>
                                <strong style={{ fontSize: "11px", color: C.DARK, fontWeight: "700", lineHeight: 1 }}>{quotation.date || new Date().toLocaleDateString("en-GB")}</strong>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: "120px", height: "90px", background: "white", padding: "6px", border: `1px solid ${C.BORDER}`, borderRadius: "6px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                        <SafeImage src={machineDetails.machineImagePath} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                </div>

                {/* BODY CONTENT — clean typography and solid borders */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, paddingBottom: "4px", overflow: "hidden" }}>
                    {(() => {
                        const sosLimit = 14;
                        const sosItems = topItems.slice(0, sosLimit);
                        const addonItems = optionals; 
                        
                        // Assume SOS items take 2 lines on average due to text wrapping
                        const estimatedLines = (sosItems.length * 1.8) + (addonItems.length > 0 ? addonItems.length + 1 : 0);
                        const scale = estimatedLines > 30 ? Math.max(0.6, 1 - (estimatedLines - 30) * 0.02) : 1;
                        
                        const fSizeSOS = `${11 * scale}px`;
                        const fSizeAddons = `${10 * scale}px`; 
                        const padSOS = `${4 * scale}px 0`;
                        const padAddon = `${4 * scale}px 8px`;
                        const gap = `${8 * scale}px`;

                        return (
                            <>
                                <div style={{ flexShrink: 0 }}>
                                    <h3 style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1.5px solid ${C.DARK}`, paddingBottom: "4px", marginBottom: "8px", color: C.DARK }}>
                                        Standard Scope (Basic Machine)
                                    </h3>
                                    <table style={{ width: "100%", fontSize: fSizeSOS, borderCollapse: "collapse" }}>
                                        <tbody>
                                            {sosItems.map((item, i) => (
                                                <tr key={i}>
                                                    <td style={{ padding: padSOS, verticalAlign: "top" }}>
                                                        <div style={{ display: "flex", gap: "10px" }}>
                                                            <span style={{ color: C.RED, fontWeight: "800", fontSize: "9px", minWidth: "18px", paddingTop: "2px" }}>
                                                                {String(i + 1).padStart(2, '0')}.
                                                            </span>
                                                            <div style={{ color: C.DARK, lineHeight: "1.4", flex: 1, fontWeight: "450" }}>
                                                                {item.desc}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {scope.length > sosLimit && <tr><td style={{ textAlign: "center", padding: "8px", fontSize: "10px", color: C.MUTED, fontStyle: "italic" }}>... additional components included in the standard specification ...</td></tr>}
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ height: gap, flexShrink: 0 }} />

                                {addonItems.length > 0 && (
                                    <div style={{ flexShrink: 0, paddingTop: "5px" }}>
                                        <h3 style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", paddingBottom: "4px", marginBottom: "0", color: C.RED, borderBottom: `1.5px solid ${C.RED}` }}>
                                            Optional Equipment (Selection Based)
                                        </h3>
                                        <table style={{ width: "100%", fontSize: fSizeAddons, borderCollapse: "collapse" }}>
                                            <thead>
                                                <tr style={{ backgroundColor: C.RED_BG }}>
                                                    <th style={{ textAlign: "left", padding: padAddon, color: C.RED, fontSize: "8.5px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" }}>Component</th>
                                                    <th style={{ textAlign: "right", padding: padAddon, color: C.RED, fontSize: "8.5px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase", width: "40px" }}>Qty</th>
                                                    <th style={{ textAlign: "right", padding: padAddon, color: C.RED, fontSize: "8.5px", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase", width: "120px" }}>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {addonItems.map((item, i) => (
                                                    <tr key={i} style={{ borderBottom: `1px solid ${C.BORDER}` }}>
                                                        <td style={{ padding: padAddon, fontWeight: "500", color: C.DARK }}>{item.name}</td>
                                                        <td style={{ padding: padAddon, textAlign: "right" }}>{item.qty || 1}</td>
                                                        <td style={{ padding: padAddon, textAlign: "right", fontWeight: "600", color: C.DARK, whiteSpace: "nowrap" }}>{formatCurrency(item.price, pricing.currency)}</td>
                                                    </tr>
                                                ))}
                                                <tr style={{ backgroundColor: C.RED_BG }}>
                                                    <td colSpan="2" style={{ padding: "10px", textAlign: "right", fontWeight: "800", color: C.RED, fontSize: "10px", letterSpacing: "0.05em", textTransform: "uppercase" }}>TOTAL OPTIONAL PRICE:</td>
                                                    <td style={{ padding: "10px", textAlign: "right", fontWeight: "900", color: C.RED, fontSize: "15px", whiteSpace: "nowrap" }}>
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

                {/* FOOTER — Clean, bold bottom line */}
                <div style={{
                    marginTop: "auto",
                    borderTop: `1.5px solid ${C.DARK}`,
                    paddingTop: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                }}>
                    <div style={{ fontSize: "9.5px", color: C.MUTED, maxWidth: "60%", lineHeight: 1.6 }}>
                        <strong style={{ color: C.DARK, fontWeight: "800" }}>TERMS:</strong> Ex-Works Ahmedabad. Taxes extra as applicable. <br />
                        <strong style={{ color: C.DARK, fontWeight: "800" }}>OFFER:</strong> Budgetary Proposal. Validity: 30 Days.
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "9px", fontWeight: "800", color: C.MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Basic Machine Price ({pricing.currency || 'INR'})</span>
                        <div style={{ fontSize: "28px", fontWeight: "950", color: C.RED, lineHeight: 1, marginTop: "2px", letterSpacing: "-0.03em" }}>
                            {pricing.final_price_text || formatCurrency(pricing.afterDiscount)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

KioskFlyer.displayName = "KioskFlyer";
