import React, { forwardRef } from "react";

// COLORS
const C = {
    RED: "#D71921",
    DARK: "#111827",
    BG_GRAY: "#F8FAFC",
    BORDER: "#CBD5E1"
};

const formatCurrency = (val) => "₹ " + Number(val || 0).toLocaleString('en-IN') + "/-";

const SafeImage = ({ src, style }) => (
    <img
        src={src || "/images/machines/three_layer.png"}
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
    const components = Array.isArray(data?.components) ? data.components : [];
    const optionals = Array.isArray(data?.optional_items) ? data.optional_items : [];

    const topItems = components.slice(0, 14);
    const extraCount = Math.max(0, components.length - 14);

    // LOGIC FIX: Check both 'company' and 'company_name' to ensure it's not empty
    let companyDisplay = "VISITOR";
    if (customer.company && customer.company.length > 1) companyDisplay = customer.company;
    else if (customer.company_name && customer.company_name.length > 1) companyDisplay = customer.company_name;

    return (
        <div ref={ref} id="kiosk-flyer-root" style={{
            width: "210mm", height: "297mm",
            background: "white", color: "#333", fontFamily: "Arial, sans-serif",
            position: "relative", overflow: "hidden", margin: 0, padding: 0
        }}>

            {/* HEADER */}
            <div style={{ height: "90px", borderBottom: `4px solid ${C.RED}`, padding: "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: "200px" }}>
                    <SafeImage src="/images/logo.jpg" style={{ height: "50px", objectFit: "contain" }} />
                </div>
                <div style={{ textAlign: "right" }}>
                    <h2 style={{ fontSize: "16px", fontWeight: "900", color: C.RED, margin: 0, textTransform: "uppercase" }}>Budgetary Offer</h2>
                    <p style={{ fontSize: "11px", fontWeight: "bold", color: "#888", margin: "5px 0 0 0" }}>{refNo} &nbsp;|&nbsp; {dateStr}</p>
                </div>
            </div>

            {/* HERO SECTION */}
            <div style={{ background: C.BG_GRAY, padding: "20px 40px", borderBottom: `1px solid ${C.BORDER}`, display: "flex", height: "220px" }}>

                <div style={{ width: "60%" }}>
                    <p style={{ fontSize: "9px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px 0" }}>PREPARED FOR</p>

                    <div style={{ borderLeft: `5px solid ${C.RED}`, paddingLeft: "15px", marginBottom: "20px" }}>
                        {/* FONT FIX: Reduced size from 26px to 18px */}
                        <h1 style={{ fontSize: "14px", fontWeight: "900", color: "#000", margin: 0, lineHeight: 1.2, textTransform: "uppercase" }}>
                            {companyDisplay}
                        </h1>
                        {customer.name && (
                            <p style={{ fontSize: "11px", fontWeight: "600", color: "#555", margin: "4px 0 0 0", textTransform: "uppercase" }}>
                                Attn: {customer.name}
                            </p>
                        )}
                        {customer.city && (
                            <p style={{ fontSize: "11px", fontWeight: "bold", color: "#888", margin: "2px 0 0 0", textTransform: "uppercase" }}>
                                {customer.city}, INDIA
                            </p>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: "30px" }}>
                        <div>
                            <span style={{ display: "block", fontSize: "9px", fontWeight: "bold", color: "#aaa" }}>MODEL</span>
                            <strong style={{ fontSize: "16px", color: C.DARK }}>{machine.modelCode || "AE-SERIES"}</strong>
                        </div>
                        <div>
                            <span style={{ display: "block", fontSize: "9px", fontWeight: "bold", color: "#aaa" }}>FAMILY</span>
                            <strong style={{ fontSize: "16px", color: C.RED }}>{machine.family || "Extrusion System"}</strong>
                        </div>
                    </div>
                </div>

                <div style={{ width: "40%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "white", padding: "5px", border: `1px solid ${C.BORDER}`, borderRadius: "5px", height: "180px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <SafeImage src={machineDetails.machineImagePath} style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }} />
                    </div>
                </div>
            </div>

            {/* BODY CONTENT */}
            <div style={{ padding: "30px 40px", flex: 1 }}>

                {/* STANDARD SCOPE */}
                <div style={{ marginBottom: "25px" }}>
                    <h3 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", borderBottom: `2px solid #333`, paddingBottom: "5px", marginBottom: "8px", color: C.DARK }}>
                        Standard Scope (Basic Machine)
                    </h3>
                    <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
                        <tbody>
                            {topItems.map((item, i) => (
                                <tr key={i} style={{ borderBottom: `1px dashed ${C.BORDER}` }}>
                                    <td style={{ padding: "6px 0", width: "25px", color: "#999", fontWeight: "bold" }}>{i + 1}</td>
                                    <td style={{ padding: "6px 5px", fontWeight: "600" }}>{item.name}</td>
                                    <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "bold" }}>{item.qty}</td>
                                </tr>
                            ))}
                            {extraCount > 0 && <tr><td colSpan={3} style={{ textAlign: "center", padding: "8px", fontSize: "10px", color: "#b45309" }}>... + {extraCount} more items ...</td></tr>}
                        </tbody>
                    </table>
                </div>

                {/* OPTIONAL ITEMS (Separate Price) */}
                {optionals.length > 0 && (
                    <div style={{ marginBottom: "10px" }}>
                        <h3 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", borderBottom: `2px solid ${C.RED}`, paddingBottom: "5px", marginBottom: "8px", color: C.RED }}>
                            Optional Equipment (Not included in Basic Price)
                        </h3>
                        <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
                            <tbody>
                                {optionals.slice(0, 6).map((item, i) => (
                                    <tr key={i} style={{ borderBottom: `1px dashed #fee2e2` }}>
                                        <td style={{ padding: "6px 0", width: "25px", color: C.RED, fontWeight: "bold" }}>+</td>
                                        <td style={{ padding: "6px 5px", fontWeight: "600", color: "#333" }}>{item.name}</td>
                                        <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "bold", fontFamily: "monospace" }}>{formatCurrency(item.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* FOOTER - ONLY MAIN PRICE */}
            <div style={{ position: "absolute", bottom: 0, width: "100%", borderTop: `2px solid ${C.BORDER}`, padding: "20px 40px 30px 40px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{ width: "55%", fontSize: "10px", color: "#64748b", lineHeight: "1.4" }}>
                    <strong>TERMS:</strong> Ex-Works Ahmedabad. Prices exclude GST & Transport. <br />
                    <strong>VALIDITY:</strong> 30 Days. <em>*Prices for optional items are extra.</em>
                </div>
                <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "10px", fontWeight: "bold", color: "#aaa", textTransform: "uppercase", display: "block" }}>Basic Machine Price</span>
                    {/* PRICING FIX: Shows 'afterDiscount' which now logic equals Basic Scope Only */}
                    <span style={{ fontSize: "36px", fontWeight: "900", color: C.RED, lineHeight: "1" }}>{pricing.final_price_text || formatCurrency(pricing.afterDiscount)}</span>
                    <span style={{ display: "block", fontSize: "9px", fontWeight: "600", color: "#94a3b8", marginTop: "4px" }}>+ Taxes (18%)</span>
                </div>
            </div>

        </div>
    );
});

KioskFlyer.displayName = "KioskFlyer";
