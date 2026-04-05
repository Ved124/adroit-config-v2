import React, { forwardRef, memo } from "react";

// ─── ADROIT BRAND TOKENS ───────────────────────────────────────────────────────
const NAVY    = "#003087";   // Adroit primary deep royal blue
const NAVY2   = "#1a4080";   // table header navy
const GOLD    = "#C8941A";   // Adroit accent gold
const INK     = "#1a1a2e";   // near-black body text (slightly blue-black)
const DIM     = "#5a6a7a";   // secondary / muted text
const BDR     = "#d1d9e0";   // border colour
const RED     = "#b91c1c";   // warning / discount highlight
const LIGHT   = "#f0f4fb";   // alternating row tint
const GREEN   = "#166534";   // price highlight green
const F       = `"Calibri","Arial",sans-serif`;

const PAGE_W  = 794;   // A4 px at 96dpi
const PAGE_H  = 1123;
const PAD_X   = 38;    // horizontal content padding
const PAD_TOP = 8;     // content top pad after header
const FOOTER_H = 54;   // footer height reservation

// ─── SHARED TABLE CELL STYLES ─────────────────────────────────────────────────
const TD = {
  padding: "6px 10px",
  border: `1px solid ${BDR}`,
  verticalAlign: "top",
  fontFamily: F,
  fontSize: "9pt",
  color: INK,
  lineHeight: "1.45",
};
const TH = {
  ...TD,
  backgroundColor: NAVY2,
  color: "#fff",
  fontWeight: "bold",
  fontSize: "9pt",
  padding: "7px 10px",
};

// ═══════════════════════════════════════════════════════════════════════════════
// HEADER — Logo left | Company name + gold squares + ISO right | gold/navy bands
// ═══════════════════════════════════════════════════════════════════════════════
function Header2() {
  const goldSquares = Array.from({ length: 14 }).map((_, i) => (
    <span
      key={i}
      style={{
        display: "inline-block",
        width: "8px",
        height: "8px",
        backgroundColor: GOLD,
        margin: "0 1.5px",
        borderRadius: "1px",
        verticalAlign: "middle",
      }}
    />
  ));

  return (
    <div style={{ borderBottom: `3px solid ${NAVY}` }}>
      {/* Main header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 38px 8px 38px",
        }}
      >
        {/* Left — Adroit logo */}
        <img
          src="/images/logo.jpg"
          alt="Adroit Extrusion"
          style={{ height: "62px", objectFit: "contain" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />

        {/* Right — company info block */}
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "18pt",
              fontWeight: "900",
              color: NAVY,
              fontFamily: F,
              letterSpacing: "1.5px",
              lineHeight: "1.05",
            }}
          >
            ADROIT EXTRUSION
          </div>
          <div style={{ margin: "4px 0 3px 0", textAlign: "right" }}>
            {goldSquares}
          </div>
          <div
            style={{
              fontSize: "8pt",
              color: GOLD,
              fontFamily: F,
              fontWeight: "bold",
              letterSpacing: "0.4px",
            }}
          >
            AN ISO 9001:2015 CERTIFIED COMPANY &nbsp;|&nbsp; CE MARK
          </div>
          <div
            style={{
              fontSize: "7.5pt",
              color: DIM,
              fontFamily: F,
              fontStyle: "italic",
              marginTop: "1px",
            }}
          >
            Explorers of Innovation
          </div>
        </div>
      </div>

      {/* Gold accent band */}
      <div style={{ height: "3px", backgroundColor: GOLD }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER — two-line address | page number
// ═══════════════════════════════════════════════════════════════════════════════
function Footer2({ pageNum, total }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: `2px solid ${NAVY}`,
        padding: "5px 38px 7px 38px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          fontSize: "6.5pt",
          color: DIM,
          fontFamily: F,
          lineHeight: "1.55",
        }}
      >
        <div>
          <b style={{ color: NAVY }}>Unit 1:</b> Survey 822, Village Bhumapura,
          Ahmedabad–Mahemdavad Road, Dist. Kheda, Gujarat – 387130
          &nbsp;&nbsp;
          <b style={{ color: NAVY }}>Unit 2:</b> 75/A, Akshar Industrial Park,
          B/H Amba Estate, Vatva GIDC Phase-4, Ahmedabad – 382445
        </div>
        <div>
          Cell: +91 99251 43048 / 87586 65507 &nbsp;|&nbsp;
          info@adroitextrusion.com &nbsp;|&nbsp; www.adroitextrusion.com
        </div>
      </div>
      {pageNum && total && (
        <div
          style={{
            fontSize: "8.5pt",
            fontWeight: "bold",
            color: NAVY,
            fontFamily: F,
            whiteSpace: "nowrap",
            paddingTop: "2px",
            flexShrink: 0,
            marginLeft: "16px",
          }}
        >
          Page {pageNum} of {total}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════
function Page2({ children, pageNum, total }) {
  return (
    <div
      style={{
        width: `${PAGE_W}px`,
        minHeight: `${PAGE_H}px`,
        height: `${PAGE_H}px`,
        backgroundColor: "#fff",
        boxSizing: "border-box",
        margin: "0 auto",
        breakAfter: "page",
        pageBreakAfter: "always",
        position: "relative",
        fontFamily: F,
        overflow: "hidden",
      }}
    >
      <Header2 />
      <div
        style={{
          padding: `${PAD_TOP}px ${PAD_X}px ${FOOTER_H + 10}px ${PAD_X}px`,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
      <Footer2 pageNum={pageNum} total={total} />
    </div>
  );
}

// ─── ANNEXURE TITLE BAR ───────────────────────────────────────────────────────
function AnnexTitle({ num, label }) {
  return (
    <div
      style={{
        backgroundColor: NAVY,
        color: "#fff",
        padding: "7px 12px",
        fontSize: "10.5pt",
        fontWeight: "bold",
        fontFamily: F,
        letterSpacing: "0.3px",
        marginBottom: "10px",
        borderRadius: "1px",
      }}
    >
      {num ? `Annexure – ${num}` : ""}
      {label ? `  (${label})` : ""}
    </div>
  );
}

// ─── SECTION SUB BAR ──────────────────────────────────────────────────────────
function SecBar({ children }) {
  return (
    <div
      style={{
        backgroundColor: NAVY2,
        color: "#fff",
        padding: "5px 10px",
        fontSize: "9pt",
        fontWeight: "bold",
        fontFamily: F,
        marginBottom: "6px",
        marginTop: "10px",
        borderRadius: "1px",
      }}
    >
      {children}
    </div>
  );
}

// ─── 2-COLUMN SPEC TABLE ──────────────────────────────────────────────────────
function SpecTable({ rows }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "9pt",
        fontFamily: F,
        marginBottom: "8px",
      }}
    >
      <thead>
        <tr>
          <th style={{ ...TH, width: "37%", textAlign: "left" }}>Subject</th>
          <th style={{ ...TH, textAlign: "left" }}>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([s, d], i) => (
          <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : LIGHT }}>
            <td style={{ ...TD, fontWeight: "600", color: NAVY }}>{s}</td>
            <td style={TD}>{d}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — COVER
// ═══════════════════════════════════════════════════════════════════════════════
function CoverPage({ customer, machine, quotation, annexIndex, pageNum, total }) {
  const c = customer || {};
  const m = machine || {};
  const q = quotation || {};

  return (
    <Page2 pageNum={pageNum} total={total}>
      {/* Ref & Date bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: `2px solid ${NAVY}`,
          paddingBottom: "6px",
          marginBottom: "14px",
          marginTop: "6px",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "10pt", fontFamily: F, color: NAVY }}>
          Ref.: {q.refNo || "DRAFT"}
        </div>
        <div style={{ fontWeight: "bold", fontSize: "10pt", fontFamily: F, color: DIM }}>
          Date: {q.date || ""}
        </div>
      </div>

      {/* Customer address block */}
      <div
        style={{
          border: `1.5px solid ${INK}`,
          padding: "12px 16px",
          marginBottom: "14px",
        }}
      >
        <div style={{ fontSize: "9.5pt", fontFamily: F, color: INK }}>To,</div>
        <div
          style={{
            fontSize: "13pt",
            fontWeight: "bold",
            color: NAVY,
            fontFamily: F,
            marginTop: "3px",
          }}
        >
          M/s. {c.company || c.name || ""}
        </div>
        {c.address && (
          <div style={{ fontSize: "9.5pt", fontFamily: F, color: INK, marginTop: "4px" }}>
            {c.address}
          </div>
        )}
        {(c.city || c.state) && (
          <div style={{ fontSize: "9.5pt", fontFamily: F, color: INK }}>
            {[c.city, c.state].filter(Boolean).join(", ")}
          </div>
        )}
        {c.phone && (
          <div style={{ fontSize: "9.5pt", fontFamily: F, color: INK, marginTop: "4px" }}>
            <b>Mobile:</b> {c.phone}
          </div>
        )}
        {c.email && (
          <div style={{ fontSize: "9.5pt", fontFamily: F, color: INK }}>
            <b>Email:</b> {c.email}
          </div>
        )}
      </div>

      {/* Salutation */}
      <div style={{ fontSize: "9.5pt", fontFamily: F, color: INK, marginBottom: "8px" }}>
        <b>Dear Sir / Ma'am,</b>
      </div>

      {/* Subject line */}
      <div style={{ fontSize: "10pt", fontFamily: F, color: INK, marginBottom: "14px", lineHeight: "1.6" }}>
        <b>Sub: Techno-Commercial Price Offer</b>
        <div style={{ paddingLeft: "18px", fontWeight: "bold", color: NAVY, marginTop: "2px" }}>
          (Premium Model: {m.code || ""} – {m.fullName || ""})
        </div>
      </div>

      {/* Body text */}
      <div
        style={{
          fontSize: "9.5pt",
          fontFamily: F,
          color: INK,
          lineHeight: "1.7",
          marginBottom: "18px",
          textAlign: "justify",
        }}
      >
        With reference to your esteemed inquiry, we are pleased to submit our best techno-commercial
        offer for the <b>{m.fullName || "Blown Film Line"}</b>. Kindly refer to the Annexure-wise
        index below for detailed technical and commercial information:
      </div>

      {/* Annexure index table */}
      <div style={{ border: `1.5px solid ${INK}` }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "9.5pt",
            fontFamily: F,
          }}
        >
          <thead>
            <tr>
              <th style={{ ...TH, width: "22%", textAlign: "left" }}>Annexure</th>
              <th style={{ ...TH, textAlign: "left" }}>Description</th>
              <th style={{ ...TH, width: "12%", textAlign: "center" }}>Page No.</th>
            </tr>
          </thead>
          <tbody>
            {annexIndex.map((row, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : LIGHT }}>
                <td style={{ ...TD, fontWeight: "bold", color: NAVY }}>
                  Annexure – {row.num}
                </td>
                <td style={TD}>{row.label}</td>
                <td style={{ ...TD, textAlign: "center", fontWeight: "bold" }}>
                  {row.page}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page2>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — ANNEXURE 1: GENERAL SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
function GeneralSpecsPage({ machine, perf, components, pageNum, total }) {
  const m = machine || {};
  const p = perf || {};

  const extruders = (components || []).filter((c) => /extruder/i.test(c.name));
  const die       = (components || []).find((c) => /\bdie\b/i.test(c.name));
  const airRing   = (components || []).find((c) => /air\s*ring/i.test(c.name));
  const cage      = (components || []).find((c) => /cage|basket/i.test(c.name));
  const haulOff   = (components || []).find((c) => /haul.?off/i.test(c.name));
  const winder    = (components || []).find((c) => /winder/i.test(c.name));

  const typeLabel = {
    mono:    "Monolayer Single Screw Blown Film Line",
    aba:     "ABA / AB Co-Extrusion Blown Film Line",
    "3layer":"Three Layer Co-Extrusion Blown Film Line",
    "5layer":"Five Layer Co-Extrusion Blown Film Line",
  };

  const specRows = [
    ["Machine Make",    "Adroit Extrusion Technologies Pvt. Ltd., Halol, Gujarat, India"],
    ["Machine Model",   m.code || "—"],
    ["Machine Type",    typeLabel[m.type] || m.fullName || "—"],
    ["No. of Extruders",extruders.length > 0
      ? extruders.map((e) => `${e.name} (Qty: ${e.qty || 1})`).join(" + ")
      : "—"],
    ["Die",             die ? die.name : (p.die_size || "—")],
    ["Air Ring",        airRing ? airRing.name : "—"],
    ["Bubble Cage / Calibration Basket", cage ? cage.name : "—"],
    ["Haul-Off",        haulOff ? haulOff.name : "—"],
    ["Winder",          winder ? winder.name : "—"],
    ["Max. Layflat Width",     p.layflat_width ? `${p.layflat_width} mm` : "—"],
    ["Max. Output",            p.max_output ? `${p.max_output} kg/hr (Indicative at standard conditions)` : "—"],
    ["Film Thickness Range",   p.thickness_range || "20 – 150 Micron"],
    ["Thickness Variation",    p.thickness_variation || "+/- 8% above 40 micron; +/- 10% upto 40 micron; or +/- 4 micron — whichever is higher"],
    ["Raw Material",           p.raw_materials || "LDPE, LLDPE, HDPE, mLLDPE — as per standard test conditions"],
    ["Product",                p.product || "High Quality Blown Film"],
  ];

  const notes = [
    "Output figures are based on standard test conditions: 75% LLDPE + 25% LDPE blend.",
    "Bubble Stability Ratio (BUR) of 2.5 or higher is recommended for stated outputs.",
    "Air ring temperature must not exceed 10–12°C above ambient for rated cooling efficiency.",
    "Actual output may vary based on resin grade, machine settings, ambient conditions and operator skill.",
    "Performance guarantee does not apply if issues arise from resin quality, resin incompatibility, gels, melt fracture, blocking, or interfacial instability.",
    "All utilities (power, water, compressed air) must be within specified parameters.",
    "Gauge variation figures are for standard conditions only — not under every resin/speed combination.",
    "Adroit reserves the right to modify specifications for product improvement without prior notice.",
  ];
  const redFrom = 4;

  return (
    <Page2 pageNum={pageNum} total={total}>
      <AnnexTitle num={1} label="General Specifications, Machine Output & Gauge Variation" />
      <SpecTable rows={specRows} />
      <SecBar>Important Notes — Terms & Conditions to Obtain the Above Mentioned Output</SecBar>
      {notes.map((n, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "5px",
            fontSize: "8.5pt",
            fontFamily: F,
            lineHeight: "1.5",
            color: i >= redFrom ? RED : INK,
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              flexShrink: 0,
              color: i >= redFrom ? RED : NAVY,
              minWidth: "14px",
            }}
          >
            {i + 1}.
          </span>
          <span>{n}</span>
        </div>
      ))}
    </Page2>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — ANNEXURE 2: SCOPE OF SUPPLY
// ═══════════════════════════════════════════════════════════════════════════════
// Compact cell styles for scope table — keeps all rows inside one A4 page
const TD_SCOPE = {
  padding: "4px 8px",
  border: `1px solid ${BDR}`,
  verticalAlign: "top",
  fontFamily: F,
  fontSize: "8.5pt",
  color: INK,
  lineHeight: "1.4",
};
const TH_SCOPE = {
  ...TD_SCOPE,
  backgroundColor: NAVY2,
  color: "#fff",
  fontWeight: "bold",
  fontSize: "8.5pt",
  padding: "5px 8px",
};

function ScopePage2({ components, electricals, pageNum, total }) {
  const elec = electricals || {};
  const rows = [
    ...(components || []).map((item, i) => ({
      sr: item.sr || (i + 1),
      subject: item.name || "",
      description: item.description || item.shortDesc || item.cardDesc || "",
      qty: item.qty !== undefined ? item.qty : 1,
      _isExtra: item._isExtra,
    })),
  ];

  // Render exact rows provided by summary.jsx without hardcoded injections
  
  return (
    <Page2 pageNum={pageNum} total={total}>
      <AnnexTitle num={2} label="Standard Scope of Supply" />
      {/* overflow:hidden ensures content never bleeds past this A4 page */}
      <div style={{ overflow: "hidden" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "8.5pt",
            fontFamily: F,
            marginBottom: "6px",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: "5%" }} />
            <col style={{ width: "28%" }} />
            <col style={{ width: "67%" }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ ...TH_SCOPE, textAlign: "center" }}>Sr.</th>
              <th style={{ ...TH_SCOPE, textAlign: "left" }}>Subject</th>
              <th style={{ ...TH_SCOPE, textAlign: "left" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : LIGHT }}>
                <td style={{ ...TD_SCOPE, textAlign: "center" }}>{r.sr}</td>
                <td style={{ ...TD_SCOPE, fontWeight: "600", color: NAVY }}>
                  {r.subject}
                </td>
                <td style={{
                  ...TD_SCOPE,
                  // empty extra rows get vertical breathing room
                  padding: r._isExtra && !r.description ? "10px 8px" : TD_SCOPE.padding,
                }}>
                  {r.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page2>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 4 — ANNEXURE 3: PRICE
// ═══════════════════════════════════════════════════════════════════════════════
function PricingPage({ pricing, optionalItems, pageNum, total }) {
  const p    = pricing || {};
  const opts = (optionalItems || []).filter((o) => o && o.name);
  const clean = (s) =>
    s ? String(s).replace(/^Rs\.\s*/, "").replace(/\/-$/, "").trim() : "";

  const commercialRows = [
    ["Validity",           "30 days from date of issue of this quotation."],
    ["Taxes",              "GST, TCS, and all applicable statutory levies will be charged extra at prevailing rates."],
    ["Packing & Insurance","Packing charges and transit insurance will be borne by the customer."],
    ["Freight",            "Transportation from our works to buyer's site is at customer's cost."],
    ["Delivery",           "4 (Four) months from receipt of technically & commercially clear Purchase Order with advance."],
    ["Payment Terms",      "40% irrevocable security deposit with order. Balance payment + all charges before dispatch. Advance is non-interest bearing."],
    ["Jurisdiction",       "Ahmedabad, Gujarat jurisdiction only."],
  ];

  return (
    <Page2 pageNum={pageNum} total={total}>
      <AnnexTitle num={3} label="Price" />

      {/* Basic machine price */}
      <SecBar>Basic Machine Price</SecBar>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "9pt",
          fontFamily: F,
          marginBottom: "14px",
        }}
      >
        <thead>
          <tr>
            <th style={{ ...TH, textAlign: "left" }}>Description</th>
            <th style={{ ...TH, width: "38%", textAlign: "left" }}>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...TD, fontWeight: "600", color: NAVY }}>
              Basic Ex-Works Ahmedabad Price (INR)
            </td>
            <td
              style={{
                ...TD,
                fontWeight: "bold",
                fontSize: "11pt",
                color: GREEN,
              }}
            >
              {p.basicPrice || "—"}
            </td>
          </tr>
          {p.basicPriceWords && (
            <tr style={{ backgroundColor: LIGHT }}>
              <td style={{ ...TD, fontStyle: "italic", color: DIM }}>
                Amount in Words
              </td>
              <td style={{ ...TD, fontStyle: "italic", color: DIM }}>
                {p.basicPriceWords}
              </td>
            </tr>
          )}
          {p.finalPrice && p.finalPrice !== p.basicPrice && (
            <>
              <tr>
                <td style={{ ...TD, fontWeight: "600", color: RED }}>
                  Final Price After Discount (INR)
                </td>
                <td
                  style={{
                    ...TD,
                    fontWeight: "bold",
                    fontSize: "11pt",
                    color: RED,
                  }}
                >
                  {p.finalPrice}
                </td>
              </tr>
              {p.finalPriceWords && (
                <tr style={{ backgroundColor: "#fff5f5" }}>
                  <td style={{ ...TD, fontStyle: "italic", color: RED }}>
                    Amount in Words
                  </td>
                  <td style={{ ...TD, fontStyle: "italic", color: RED }}>
                    {p.finalPriceWords}
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>

      {/* Optional attachments */}
      <SecBar>Optional Attachments</SecBar>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "9pt",
          fontFamily: F,
          marginBottom: "14px",
        }}
      >
        <thead>
          <tr>
            <th style={{ ...TH, width: "8%",  textAlign: "center" }}>Sr. No</th>
            <th style={{ ...TH,               textAlign: "left"   }}>Description</th>
            <th style={{ ...TH, width: "28%", textAlign: "right"  }}>Price (INR)</th>
          </tr>
        </thead>
        <tbody>
          {opts.length === 0 && (
            <tr>
              <td
                colSpan={3}
                style={{ ...TD, textAlign: "center", color: DIM, fontStyle: "italic" }}
              >
                No optional equipment selected.
              </td>
            </tr>
          )}
          {opts.map((item, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : LIGHT }}>
              <td style={{ ...TD, textAlign: "center" }}>{i + 1}</td>
              <td style={TD}>{item.name}</td>
              <td style={{ ...TD, textAlign: "right" }}>
                {clean(item.price) || "—"}
              </td>
            </tr>
          ))}
          <tr style={{ backgroundColor: "#eef3ff" }}>
            <td
              colSpan={2}
              style={{ ...TD, textAlign: "right", fontWeight: "bold", color: NAVY }}
            >
              Total Rs.
            </td>
            <td
              style={{
                ...TD,
                textAlign: "right",
                fontWeight: "bold",
                color: GREEN,
                fontSize: "10pt",
              }}
            >
              {clean(p.addonsTotal) || "0"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Commercial terms */}
      <SecBar>Payment, Delivery & Commercial Notes</SecBar>
      {commercialRows.map(([label, text], i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "5px",
            fontSize: "9pt",
            fontFamily: F,
            color: INK,
            lineHeight: "1.55",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              color: NAVY,
              flexShrink: 0,
              minWidth: "118px",
            }}
          >
            {label}:
          </span>
          <span>{text}</span>
        </div>
      ))}
    </Page2>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANNEXURE 4 — PER-COMPONENT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function ComponentPage2({ item, pageNum, total }) {
  const td = Object.entries(item.techDesc || {});
  return (
    <Page2 pageNum={pageNum} total={total}>
      <AnnexTitle num={4} label={item.name} />

      {/* Reference image */}
      {item.image && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxHeight: "290px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f7f9fc",
              border: `1px solid ${BDR}`,
              padding: "10px",
              overflow: "hidden",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{ maxHeight: "268px", maxWidth: "100%", objectFit: "contain" }}
              onError={(e) => {
                try { e.target.parentNode.style.display = "none"; } catch {}
              }}
            />
          </div>
          <div
            style={{
              marginTop: "5px",
              fontSize: "7.5pt",
              fontFamily: F,
              fontWeight: "bold",
              color: DIM,
              textAlign: "center",
            }}
          >
            Above image is for reference only. Actual supply will be as per contract agreed upon.
          </div>
        </div>
      )}

      {td.length > 0 && <SpecTable rows={td} />}
    </Page2>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANNEXURE 5 — TERMS & CONDITIONS
// ═══════════════════════════════════════════════════════════════════════════════
const TC_PARTS = [
  {
    part: 1,
    clauses: [
      ["PRICES",           "Prices are Un-Packed, Ex-Works, Ahmedabad, Gujarat basis. All Government taxes, duties, and levies are not included and will be charged extra as per prevailing rules. Prices are valid for 30 days from the date of quotation."],
      ["PACKING & FORWARDING", "Packing charges will be charged extra as applicable at the time of dispatch."],
      ["INSURANCE",        "Transit insurance of the machine is to be covered by the buyer. In the event of any claim, all claim procedures will be handled by the buyer."],
      ["TRANSPORTATION",   "Cost of transportation from our works to buyer's site will be borne entirely by the customer."],
      ["DELIVERY",         "04 Months from the date of receipt of technically and commercially clear Purchase Order with minimum 40% irrevocable security deposit. Failure to lift the machinery against balance payment within one month of machine readiness will entitle ADROIT EXTRUSION to sell it to another customer."],
    ],
  },
  {
    part: 2,
    clauses: [
      ["PAYMENT TERMS",    "We require 40% of the total order value as an irrevocable security deposit. The balance payment, along with all incidental charges, Taxes & Duties, is to be paid before delivery. The advance is non-interest bearing. In the event of cancellation, the advance will be adjusted against order cancellation charges. Once the machine is dispatched, it cannot be returned under any condition."],
      ["JURISDICTION",     "All contracts of sale shall be subject to Ahmedabad jurisdiction only."],
      ["PRE-DISPATCH TESTING", "We follow discrete testing of individual system elements (Winders, Extruders, etc.) against pre-designed standards to ensure faultless running at the customer's site. For wet trials, the buyer must arrange all input raw materials, or the Seller will arrange the same at buyer's cost."],
      ["ERECTION & COMMISSIONING", "Our service engineers will supervise erection, installation, and commissioning of the machine. The customer must provide skilled and semi-skilled labour. All utilities and power connections must be ready before calling our engineers. The customer will pay To & Fro 2AC Train Fare, Lodging, Boarding, and local Transportation during the period of services."],
    ],
  },
];

function TermsPage2({ startPage, total }) {
  let clauseCount = 0;
  const ClauseBlock = ({ title, body, num }) => (
    <div style={{ marginBottom: "10px" }}>
      <div
        style={{
          fontSize: "9.5pt",
          fontWeight: "bold",
          color: NAVY,
          fontFamily: F,
          marginBottom: "2px",
        }}
      >
        {num}. {title}
      </div>
      <div
        style={{
          fontSize: "8.5pt",
          fontFamily: F,
          color: INK,
          lineHeight: "1.6",
          paddingLeft: "16px",
        }}
      >
        {body}
      </div>
    </div>
  );

  return (
    <>
      {TC_PARTS.map((part, pi) => {
        return (
          <Page2 key={pi} pageNum={startPage + pi} total={total}>
            <AnnexTitle
              num={5}
              label={`Terms & Conditions — Part ${part.part}`}
            />
            {part.clauses.map(([title, body]) => {
              clauseCount++;
              return (
                <ClauseBlock
                  key={clauseCount}
                  num={clauseCount}
                  title={title}
                  body={body}
                />
              );
            })}
            {pi === TC_PARTS.length - 1 && (
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    marginTop: "24px",
                    fontSize: "9.5pt",
                    fontFamily: F,
                    lineHeight: "2",
                    color: INK,
                    position: "relative"
                  }}
                >
                  <div>Thanking you,</div>
                  <div>Yours truly,</div>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      color: NAVY,
                      position: "relative",
                      zIndex: 2
                    }}
                  >
                    FOR ADROIT EXTRUSION
                  </div>
                </div>

                {/* Signature and Stamp Container */}
                <div style={{ position: "relative", height: "60px", marginTop: "-10px" }}>
                    {/* Signature - overlaps bottom of FOR ADROIT EXTRUSION slightly */}
                    <img 
                      src="/images/Usign.png" 
                      alt="Signature" 
                      style={{ 
                        position: "absolute", 
                        left: "20px", 
                        top: "-15px", 
                        height: "80px", 
                        zIndex: 1 
                      }} 
                    />
                    
                    {/* Stamp - to the right of the signature */}
                    <img 
                      src="/images/adroit stamp.png" 
                      alt="Stamp" 
                      style={{ 
                        position: "absolute", 
                        left: "220px", 
                        top: "-25px", 
                        height: "100px", 
                        zIndex: 1 
                      }} 
                    />
                </div>

                <div
                  style={{
                    fontSize: "11pt",
                    fontFamily: F,
                    color: NAVY,
                    fontWeight: "bold",
                    position: "relative",
                    zIndex: 2
                  }}
                >
                  Urveesh Jepaliya
                </div>
                <div style={{ fontSize: "8.5pt", fontFamily: F, color: DIM }}>
                  Director
                </div>
              </div>
            )}
          </Page2>
        );
      })}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WARRANTY PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function WarrantyPage2({ pageNum, total }) {
  const wRows = [
    ["All Mechanical Components",                          "1 Year",        "From date of commissioning"],
    ["Pneumatic Parts",                                    "1 Year",        "Dry Air is compulsory. Warranty void if dry air not used."],
    ["AC Drives / VFDs",                                   "1 Year",        "Voltage Stabilizer is compulsory. Warranty void if not provided."],
    ["Electrical & Electronic Parts\n(Switches, Contactors, MCBs, etc.)", "6 Months", "Against faulty material or bad workmanship from date of commissioning"],
    ["Heaters",                                            "3 Months",      "Heater kits are chargeable separately."],
    ["Screw & Barrel",                                     "Not Specified", "Life depends on abrasive material processed — cannot be guaranteed."],
  ];

  const exclusions = [
    "Parts made of rubber, plastic, or glass",
    "Bearings and other wearing parts",
    "Fuses, heaters, lamps, contactors, MCBs",
    "Damages caused by fire, floods, natural calamity, accident, misuse, or improper installation",
    "Defects arising from resin quality, raw material, or incorrect machine operation",
  ];

  return (
    <Page2 pageNum={pageNum} total={total}>
      <AnnexTitle num={5} label="Terms & Conditions — Part 3 (Warranty)" />

      <SecBar>Standard Warranty Period</SecBar>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "9pt",
          fontFamily: F,
          marginBottom: "12px",
        }}
      >
        <thead>
          <tr>
            <th style={{ ...TH, textAlign: "left" }}>Component / System</th>
            <th style={{ ...TH, width: "14%", textAlign: "center" }}>
              Warranty Period
            </th>
            <th style={{ ...TH, width: "38%", textAlign: "left" }}>
              Notes / Conditions
            </th>
          </tr>
        </thead>
        <tbody>
          {wRows.map(([comp, period, notes], i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : LIGHT }}>
              <td style={{ ...TD, whiteSpace: "pre-line" }}>{comp}</td>
              <td style={{ ...TD, textAlign: "center", fontWeight: "bold", color: NAVY }}>
                {period}
              </td>
              <td style={{ ...TD, color: DIM }}>{notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SecBar>Warranty Does NOT Include</SecBar>
      {exclusions.map((exc, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "4px",
            fontSize: "8.5pt",
            fontFamily: F,
            color: INK,
            lineHeight: "1.5",
          }}
        >
          <span style={{ color: GOLD, flexShrink: 0, fontSize: "10pt", lineHeight: "1.2" }}>◆</span>
          <span>{exc}</span>
        </div>
      ))}

      <div
        style={{
          marginTop: "10px",
          fontSize: "8.5pt",
          fontFamily: F,
          color: INK,
          lineHeight: "1.65",
          padding: "8px 10px",
          border: `1px solid ${BDR}`,
          backgroundColor: LIGHT,
          borderRadius: "1px",
        }}
      >
        <b style={{ color: NAVY }}>Limitation:</b> WARRANTY IS LIMITED to the
        extent of repairs or replacement of manufacturing defects in material and
        workmanship. No liability is assumed beyond such replacements. Where
        payment terms are not adhered to, the warranty expires consequentially.
        The buyer is required to return defective parts to the seller;
        transportation cost will be borne by the buyer.
      </div>

      <SecBar>Cancellation</SecBar>
      <div
        style={{
          fontSize: "8.5pt",
          fontFamily: F,
          color: INK,
          lineHeight: "1.6",
        }}
      >
        An order once placed cannot be cancelled for any reason whatsoever. In
        the event of cancellation, the entire advance amount will be forfeited.
      </div>

      <SecBar>Jurisdiction</SecBar>
      <div style={{ fontSize: "8.5pt", fontFamily: F, color: INK }}>
        All contracts of sale shall be subject to{" "}
        <b>Ahmedabad</b> jurisdiction only.
      </div>
    </Page2>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export const AdroitQuotation2 = memo(
  forwardRef(function AdroitQuotation2({ data }, ref) {
    if (!data || Object.keys(data).length === 0) {
      return (
        <div
          ref={ref}
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#999",
            fontFamily: F,
          }}
        >
          No proposal data. Please configure a machine first.
        </div>
      );
    }

    const customer    = data.customer || {};
    const machine     = data.machine || {};
    const quot        = data.quotation || {};
    const perf        = data.indicative_performance || {};
    const components  = data.components || [];
    const optItems    = data.optional_items || [];
    const pricing     = data.pricing || {};
    const electricals = data.electricals || {};

    // Page count: Cover(1) + Specs(1) + Scope(1) + Pricing(1) + Components(N) + T&C 1+2+Warranty(3)
    const total      = 7 + components.length;
    const annex4Page = 5;
    const annex5Page = annex4Page + components.length;

    const annexIndex = [
      { num: 1, label: "General Specifications, Machine Output & Gauge Variation", page: 2 },
      { num: 2, label: "Standard Scope of Supply",                                  page: 3 },
      { num: 3, label: "Price",                                                      page: 4 },
      { num: 4, label: "Technical Specifications (One Page Per Component)",          page: annex4Page },
      { num: 5, label: "Terms & Conditions + Warranty",                              page: annex5Page },
    ];

    return (
      <div
        ref={ref}
        id="adroit-quotation-2-root"
        style={{ backgroundColor: "#fff", padding: 0, margin: 0, display: "block" }}
      >
        <CoverPage
          customer={customer}
          machine={machine}
          quotation={quot}
          annexIndex={annexIndex}
          pageNum={1}
          total={total}
        />
        <GeneralSpecsPage
          machine={machine}
          perf={perf}
          components={components}
          pageNum={2}
          total={total}
        />
        <ScopePage2
          components={components}
          electricals={electricals}
          pageNum={3}
          total={total}
        />
        <PricingPage
          pricing={pricing}
          optionalItems={optItems}
          pageNum={4}
          total={total}
        />
        {components.map((item, i) => (
          <ComponentPage2
            key={item.id || i}
            item={item}
            pageNum={annex4Page + i}
            total={total}
          />
        ))}
        <TermsPage2 startPage={annex5Page} total={total} />
        <WarrantyPage2 pageNum={annex5Page + 2} total={total} />
      </div>
    );
  })
);

export default AdroitQuotation2;
