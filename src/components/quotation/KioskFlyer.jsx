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
            background: "white", color: "#333", fontFamily: "Arial, sans-serif",
            position: "relative", overflow: "hidden", margin: 0, padding: 0
        }}>

            {/* HEADER */}
            <div style={{ height: "65px", borderBottom: `4px solid ${C.RED}`, padding: "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: "200px" }}>
                    <SafeImage src="/images/logo.jpg" style={{ height: "35px", objectFit: "contain" }} />
                </div>
                <div style={{ textAlign: "right" }}>
                    <h2 style={{ fontSize: "14px", fontWeight: "900", color: C.RED, margin: 0, textTransform: "uppercase" }}>Budgetary Offer</h2>
                    <p style={{ fontSize: "10px", fontWeight: "bold", color: "#888", margin: "3px 0 0 0" }}>{refNo} &nbsp;|&nbsp; {dateStr}</p>
                </div>
            </div>

            {/* HERO SECTION */}
            <div style={{ background: C.BG_GRAY, padding: "12px 40px", borderBottom: `1px solid ${C.BORDER}`, display: "flex", height: "150px" }}>

                <div style={{ width: "60%" }}>
                    <p style={{ fontSize: "8px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 5px 0" }}>PREPARED FOR</p>

                    <div style={{ borderLeft: `5px solid ${C.RED}`, paddingLeft: "15px", marginBottom: "12px" }}>
                        <h1 style={{ fontSize: "13px", fontWeight: "900", color: "#000", margin: 0, lineHeight: 1.1, textTransform: "uppercase" }}>
                            {companyDisplay}
                        </h1>
                        {customer.name && (
                            <p style={{ fontSize: "10px", fontWeight: "600", color: "#555", margin: "3px 0 0 0", textTransform: "uppercase" }}>
                                Attn: {customer.name}
                            </p>
                        )}
                        {customer.city && (
                            <p style={{ fontSize: "10px", fontWeight: "bold", color: "#888", margin: "1px 0 0 0", textTransform: "uppercase" }}>
                                {customer.city}, INDIA
                            </p>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: "25px" }}>
                        <div>
                            <span style={{ display: "block", fontSize: "8px", fontWeight: "bold", color: "#aaa" }}>MODEL</span>
                            <strong style={{ fontSize: "14px", color: C.DARK }}>{machine.modelCode || "AE-SERIES"}</strong>
                        </div>
                        <div>
                            <span style={{ display: "block", fontSize: "8px", fontWeight: "bold", color: "#aaa" }}>FAMILY</span>
                            <strong style={{ fontSize: "14px", color: C.RED }}>{machine.family || "Extrusion System"}</strong>
                        </div>
                    </div>
                </div>

                <div style={{ width: "40%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "white", padding: "5px", border: `1px solid ${C.BORDER}`, borderRadius: "5px", height: "120px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <SafeImage src={machineDetails.machineImagePath} style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }} />
                    </div>
                </div>
            </div>

            {/* BODY CONTENT */}
            <div style={{ padding: "15px 40px", flex: 1 }}>

                {/* STANDARD SCOPE */}
                <div style={{ marginBottom: "15px" }}>
                    <h3 style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", borderBottom: `2px solid #333`, paddingBottom: "3px", marginBottom: "5px", color: C.DARK }}>
                        Standard Scope (Basic Machine)
                    </h3>
                    <table style={{ width: "100%", fontSize: "11.5px", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left", padding: "3px 0", color: "#666" }}>ITEM DESCRIPTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topItems.map((item, i) => (
                                <tr key={i} style={{ borderBottom: `1px dashed ${C.BORDER}` }}>
                                    <td style={{ padding: "3px 0" }}>
                                        <div style={{ display: "flex", alignItems: "flex-start" }}>
                                            <span style={{ color: "#999", marginRight: "8px", fontWeight: "bold", fontSize: "11px", marginTop: "1px" }}>{i + 1}</span>
                                            <div>
                                                {item.desc && (
                                                    <div style={{ fontSize: "11.5px", color: "#000", lineHeight: "1.1", marginTop: "1px", maxWidth: "700mm", fontStyle: "italic" }}>
                                                        {item.desc}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {extraCount > 0 && <tr><td style={{ textAlign: "center", padding: "4px", fontSize: "11px", color: "#b45309" }}>... + {extraCount} more components included ...</td></tr>}
                        </tbody>
                    </table>
                </div>

                {/* OPTIONAL ITEMS (Detailed Table) */}
                {optionals.length > 0 && (
                    <div style={{ marginBottom: "10px" }}>
                        <h3 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", paddingBottom: "4px", marginBottom: "6px", color: C.RED }}>
                            Optional Equipment (Selection Based)
                        </h3>
                        <table style={{ width: "100%", fontSize: "10.5px", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: `1px solid ${C.RED}` }}>
                                    <th style={{ textAlign: "left", padding: "4px 0", color: "#991b1b" }}>COMPONENT</th>
                                    <th style={{ textAlign: "right", padding: "4px 5px", color: "#991b1b" }}>QTY</th>
                                    <th style={{ textAlign: "right", padding: "4px 0", color: "#991b1b" }}>PRICE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {optionals.slice(0, 8).map((item, i) => (
                                    <tr key={i} style={{ borderBottom: `1px dashed #fee2e2` }}>
                                        <td style={{ padding: "5px 0", fontWeight: "600", color: "#333" }}>{item.name}</td>
                                        <td style={{ padding: "5px 5px", textAlign: "right", fontWeight: "600" }}>{item.qty || 1}</td>
                                        <td style={{ padding: "5px 0", textAlign: "right", fontWeight: "bold", fontFamily: "monospace" }}>
                                            {formatCurrency(item.price, pricing.currency)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* FOOTER - ONLY MAIN PRICE */}
            <div style={{ position: "absolute", bottom: 0, width: "100%", borderTop: `2px solid ${C.BORDER}`, padding: "15px 40px 20px 40px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{ width: "55%", fontSize: "10px", color: "#64748b", lineHeight: "1.4" }}>
                    <strong>TERMS:</strong> Ex-Works Ahmedabad. Prices exclude Transport & Insurance. <br />
                    <strong>VALIDITY:</strong> 30 Days. <em>*Optional items are extra as per selection.</em>
                </div>
                <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "10px", fontWeight: "bold", color: "#aaa", textTransform: "uppercase", display: "block" }}>Basic Machine Price ({pricing.currency || 'INR'})</span>
                    <span style={{ fontSize: "32px", fontWeight: "900", color: C.RED, lineHeight: "1" }}>
                        <span style={{ fontSize: "32px", fontWeight: "900", color: C.RED, lineHeight: "1" }}>
                            {pricing.final_price_text || formatCurrency(pricing.afterDiscount)}
                        </span>
                    </span>
                    <span style={{ display: "block", fontSize: "9px", fontWeight: "600", color: "#94a3b8", marginTop: "4px" }}>
                        {pricing.currency === 'USD' ? "*Zero Rated Export" : "+ Taxes (18%)"}
                    </span>
                </div>
            </div>

        </div>
    );
});

KioskFlyer.displayName = "KioskFlyer";
