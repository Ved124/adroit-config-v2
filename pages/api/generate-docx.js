export const config = { api: { bodyParser: { sizeLimit: "4mb" } } };

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

    const {
        Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        ImageRun, Header, Footer, AlignmentType, BorderStyle, WidthType,
        ShadingType, VerticalAlign,
    } = await import("docx");
    const fs = await import("fs");
    const path = await import("path");

    // ── Constants ──────────────────────────────────────────────────────────────
    const CW = 9906;
    const RED = "C0392B";
    const DARK = "1A1A2E";
    const WHITE = "FFFFFF";
    const LGRAY = "F5F5F5";
    const BDR = "CCCCCC";
    const TXT = "1A1A1A";
    const MUT = "555555";
    const FONT = "Arial";

    // ── Helpers ────────────────────────────────────────────────────────────────
    const bdr = (color, sz = 4) => ({ style: BorderStyle.SINGLE, size: sz, color });
    const B_STD = { top: bdr(BDR), bottom: bdr(BDR), left: bdr(BDR), right: bdr(BDR) };
    const B_NIL = { top: { style: BorderStyle.NIL }, bottom: { style: BorderStyle.NIL }, left: { style: BorderStyle.NIL }, right: { style: BorderStyle.NIL } };

    const r = (text, o = {}) => new TextRun({
        text: String(text == null ? "" : text),
        font: FONT, size: o.sz || 20, bold: !!o.b, italics: !!o.i,
        color: o.c || TXT, underline: o.u ? {} : undefined,
    });

    const ep = (sb, sa) => new Paragraph({ children: [r("")], spacing: { before: sb || 0, after: sa || 80 } });

    const p = (runs, o = {}) => new Paragraph({
        alignment: o.align || AlignmentType.LEFT,
        spacing: { before: o.sb || 0, after: o.sa || 0 },
        border: o.border,
        children: (Array.isArray(runs) ? runs : [runs]).map(x => typeof x === "string" ? r(x) : x),
    });

    const tc = (content, w, o = {}) => {
        let children;
        if (Array.isArray(content)) {
            children = content;
        } else {
            children = [new Paragraph({
                alignment: o.align || AlignmentType.LEFT,
                spacing: { before: o.psb || 40, after: o.psa || 40 },
                children: [r(content, { sz: o.sz, b: o.b, c: o.c, i: o.i })],
            })];
        }
        return new TableCell({
            borders: o.nb ? B_NIL : B_STD,
            margins: { top: o.mt || 60, bottom: o.mb || 60, left: o.ml || 120, right: o.mr || 120 },
            width: { size: w, type: WidthType.DXA },
            shading: o.fill ? { fill: o.fill, type: ShadingType.CLEAR } : undefined,
            columnSpan: o.span || 1,
            verticalAlign: o.va || VerticalAlign.CENTER,
            children,
        });
    };

    const darkBanner = (text) => new Table({
        width: { size: CW, type: WidthType.DXA }, columnWidths: [CW],
        rows: [new TableRow({ children: [tc(text, CW, { fill: DARK, b: true, c: WHITE, sz: 22, mt: 80, mb: 80, ml: 120 })] })]
    });

    const sectionHead = (text) => p([r(text, { b: true, sz: 22 })], {
        sb: 120, sa: 60, border: { bottom: bdr(MUT, 4) },
    });

    const centreHead = (text) => p([r(text, { b: true, sz: 20 })], {
        align: AlignmentType.CENTER, sb: 80, sa: 60,
        border: { bottom: bdr(MUT, 4) },
    });

    const perfHead = (text) => p([r(text, { b: true, sz: 20, c: RED })], {
        sb: 0, sa: 60,
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RED, space: 2 } },
    });

    // Number to words
    function toWords(n) {
        const num = Math.round(parseFloat(n) || 0);
        if (!num) return "ZERO ONLY";
        const u = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"];
        const t = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];
        const tn = ["TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"];
        const seg = v => {
            let s = ""; if (v >= 100) { s += u[Math.floor(v / 100)] + " HUNDRED "; v %= 100; }
            if (v >= 20) { s += t[Math.floor(v / 10)] + " "; v %= 10; } if (v > 0) s += (v < 10 ? u[v] : tn[v - 10]) + " "; return s;
        };
        let v = Math.abs(num), s = "";
        const cr = Math.floor(v / 10000000); v %= 10000000;
        const lk = Math.floor(v / 100000); v %= 100000;
        const th = Math.floor(v / 1000); v %= 1000;
        if (cr) s += seg(cr) + "CRORE "; if (lk) s += seg(lk) + "LAKH ";
        if (th) s += seg(th) + "THOUSAND "; if (v) s += seg(v);
        return s.trim() + " ONLY";
    }

    function fmtDate(raw) {
        const d = raw ? new Date(raw) : new Date();
        if (isNaN(d)) return String(raw || "");
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    }

    function normTech(td) {
        if (!td) return [];
        if (Array.isArray(td)) return td.map(x => typeof x === "string" ? { label: x, value: "" } : { label: x.label || x.k || "", value: String(x.value || x.v || "") });
        if (typeof td === "object") return Object.entries(td).map(([k, v]) => ({ label: k, value: String(v) }));
        return [];
    }

    const PUB = path.join(process.cwd(), "public");
    function loadImg(rel) {
        if (!rel) return null;
        try {
            const full = path.join(PUB, rel.replace(/^\//, ""));
            return fs.existsSync(full) ? fs.readFileSync(full) : null;
        } catch { return null; }
    }
    const itype = src => /\.png$/i.test(src || "") ? "png" : "jpeg";

    // ── Header ─────────────────────────────────────────────────────────────────
    function buildHeader() {
        const lhData = loadImg("images/letterhead.png");
        if (lhData) {
            return new Header({ children: [p([new ImageRun({ data: lhData, transformation: { width: 595, height: 76 }, type: "png" })], { sa: 0 })] });
        }
        return new Header({ children: [p([r("ADROIT EXTRUSION TECH PVT. LTD.", { b: true, sz: 24, c: RED })], { border: { bottom: bdr(BDR, 4) }, sa: 40 })] });
    }

    // ── Footer ─────────────────────────────────────────────────────────────────
    function buildFooter() {
        return new Footer({
            children: [
                new Paragraph({
                    spacing: { before: 20, after: 0 }, border: { top: bdr(BDR, 4) },
                    children: [r("Unit 1: ", { sz: 14, b: true, c: MUT }), r("Survey 822, Village Bhumapura, Ahmedabad - Mahemdavad Road, Dist. Kheda, Gujarat - 387130, India.", { sz: 14, c: MUT })],
                }),
                p([r("Unit 2: ", { sz: 14, b: true, c: MUT }), r("75/A, Akshar Industrial Park, B/H Amba Estate, Nr. Hathijan Circle, Vatva GIDC Phase-4, Ahmedabad - 382445, India.", { sz: 14, c: MUT })], { sa: 0 }),
                p([r("Mobile: +919925143048 / +918758665507     Email: info@adroitextrusion.com   Website: www.adroitextrusion.com", { sz: 14, c: MUT })], { sa: 0 }),
            ]
        });
    }

    // ── P1: Cover ──────────────────────────────────────────────────────────────
    function buildCover(data) {
        const cust = data.customer || {};
        const mach = data.machine || {};
        const typeMap = { mono: "BLOWN FILM LINE", aba: "ABA CO EXTRUSION BLOWN FILM LINE", "3layer": "THREE LAYER CO EXTRUSION BLOWN FILM LINE", "5layer": "FIVE LAYER CO EXTRUSION BLOWN FILM LINE" };
        const layerText = typeMap[mach.type] || "THREE LAYER CO EXTRUSION BLOWN FILM LINE";
        const model = mach.model || mach.code || "";
        const co = (cust.company || "VALUED CUSTOMER").toUpperCase();
        const city = (cust.city || "").toUpperCase();
        const machImgData = mach.image ? loadImg(mach.image) : null;
        const els = [ep(200, 160)];
        if (machImgData) {
            els.push(p([new ImageRun({ data: machImgData, transformation: { width: 480, height: 340 }, type: itype(mach.image) })], { align: AlignmentType.CENTER, sa: 200 }));
        } else {
            els.push(ep(0, 200));
        }
        els.push(p([r("PROPOSAL OF", { b: true, sz: 28 })], { align: AlignmentType.CENTER, sa: 0 }));
        els.push(new Paragraph({
            alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 },
            children: [r("AE ", { b: true, sz: 28 }), r("Innoflex", { b: true, i: true, sz: 28, c: RED }), r(` ${layerText} ${model}`, { b: true, sz: 28 })],
        }));
        els.push(p([r("FOR", { b: true, sz: 28 })], { align: AlignmentType.CENTER, sb: 0, sa: 0 }));
        els.push(p([r(`M/s. ${co}${city ? ", " + city : ""}`, { b: true, sz: 28 })], { align: AlignmentType.CENTER, sb: 0, sa: 80 }));
        els.push(new Paragraph({ children: [{ type: "pageBreak" }] }));
        return els;
    }

    // ── P2: Scope of Supply ────────────────────────────────────────────────────
    function buildScope(data) {
        const cust = data.customer || {};
        const items = data.components || [];
        const refNo = cust.quotationRef || cust.ref || "";
        const date = fmtDate(data.quotation && data.quotation.date);
        const nRows = Math.max(items.length + 2, 12);

        const refBlock = new Table({
            width: { size: CW, type: WidthType.DXA }, columnWidths: [CW],
            rows: [new TableRow({
                children: [new TableCell({
                    borders: B_NIL, width: { size: CW, type: WidthType.DXA },
                    children: [
                        p([r("Ref. No. ", { b: true }), r(refNo, { b: true })], { align: AlignmentType.RIGHT, sa: 0 }),
                        p([r("Date: ", { b: true }), r(date, { b: true })], { align: AlignmentType.RIGHT, sa: 0 }),
                    ],
                })]
            })],
        });

        const COL1 = 1200, COL2 = CW - COL1;
        const dataRows = [];
        for (let i = 0; i < nRows; i++) {
            const item = items[i];
            const fill = i % 2 === 0 ? WHITE : LGRAY;
            dataRows.push(new TableRow({
                children: [
                    tc(item ? String(i + 1) : "", COL1, { fill, b: true, align: AlignmentType.CENTER }),
                    tc(item ? (item.name || "") : "", COL2, { fill }),
                ]
            }));
        }

        const scopeTable = new Table({
            width: { size: CW, type: WidthType.DXA }, columnWidths: [COL1, COL2],
            rows: [
                new TableRow({
                    tableHeader: true, children: [
                        tc("ITEM #", COL1, { fill: "808080", b: true, c: WHITE, align: AlignmentType.CENTER }),
                        tc("ITEM DESCRIPTION", COL2, { fill: "808080", b: true, c: WHITE }),
                    ]
                }),
                ...dataRows,
            ],
        });

        return [
            ep(0, 120), refBlock, ep(40, 40),
            p([r("(ADROIT EXTRUSION SCOPE OF SUPPLY)", { b: true, sz: 20 })], { align: AlignmentType.CENTER, sb: 60, sa: 60 }),
            ep(0, 40), scopeTable, ep(0, 80),
            p([r("* Price validity 30 days from proposal date.", { i: true, sz: 16, c: MUT })], { sa: 0 }),
            new Paragraph({ children: [{ type: "pageBreak" }] }),
        ];
    }

    // ── P3: Pricing + Optional + Not Included ─────────────────────────────────
    function buildPricingOptional(data) {
        const pr = data.pricing || {};
        const opts = data.optional_items || [];
        // Only use basic price (no addon prices)
        const inrVal = Math.round(pr.inrValue || 0);
        const els = [];

        if (inrVal > 0) {
            const fmtINR = `INR ${inrVal.toLocaleString("en-IN")}.00`;
            els.push(new Paragraph({
                spacing: { before: 40, after: 20 },
                children: [r("\u2756 ", { b: true, sz: 22 }), r("BASIC PRICE EX-WORKS, UNPACKED \u2026\u2026\u2026\u2026\u2026\u2026. ", { b: true, sz: 22 }), r(fmtINR, { b: true, sz: 22 })],
            }));
            els.push(p([r(`(INR ${toWords(inrVal)})`, { sz: 20 })], { sb: 0, sa: 200 }));
        }

        if (opts.length > 0) {
            els.push(centreHead("OPTIONAL EQUIPMENTS"));
            els.push(ep(0, 80));
            const COL = [800, 7106, 2000];
            const optRows = opts.map((item, i) => {
                const fill = i % 2 === 0 ? WHITE : LGRAY;
                return new TableRow({
                    children: [
                        tc(String(i + 1), COL[0], { fill, b: true, align: AlignmentType.CENTER }),
                        tc(item.name || "", COL[1], { fill }),
                        tc("", COL[2], { fill, align: AlignmentType.RIGHT }), // No price
                    ]
                });
            });
            for (let i = opts.length; i < opts.length + 2; i++) {
                const fill = i % 2 === 0 ? WHITE : LGRAY;
                optRows.push(new TableRow({ children: [tc("", COL[0], { fill }), tc("", COL[1], { fill }), tc("", COL[2], { fill })] }));
            }
            els.push(new Table({
                width: { size: CW, type: WidthType.DXA }, columnWidths: COL,
                rows: [
                    new TableRow({
                        tableHeader: true, children: [
                            tc("SR. NO", COL[0], { fill: DARK, b: true, c: WHITE, align: AlignmentType.CENTER }),
                            tc("DESCRIPTION", COL[1], { fill: DARK, b: true, c: WHITE, align: AlignmentType.CENTER }),
                            tc("PRICE", COL[2], { fill: DARK, b: true, c: WHITE, align: AlignmentType.RIGHT }),
                        ]
                    }),
                    ...optRows,
                ],
            }));
            els.push(ep(0, 120));
        }

        // Items Not Included
        els.push(centreHead("ITEMS NOT INCLUDED IN QUOTATION"));
        els.push(ep(0, 60));
        const bulletItems = [
            { text: "Electrical accessories", subs: ["Main source of electrical power or generator with stabilizer or UPS if needed by you.", "Cables from Main supply to distribution panel and to machine panels.", "Earthing to all equipments to be provided by you. (Recommended 3 pits)"] },
            { text: "Finished roll handling system", subs: ["Unloading from winders."] },
            { text: "Installation of equipment", subs: ["Customer to arrange contractor or team of mechanical/structural/electrical team to work under supervision of engineers."] },
            { text: "All interconnecting piping for water & air to the equipments.", subs: [] },
        ];
        bulletItems.forEach(item => {
            els.push(p([r("\u2022  " + item.text)], { sb: 0, sa: 20 }));
            (item.subs || []).forEach((sub, si) => els.push(p([r(`     ${si + 1}. ${sub}`)], { sb: 0, sa: 20 })));
        });
        els.push(new Paragraph({ children: [{ type: "pageBreak" }] }));
        return els;
    }

    // ── P4: Indicative Performance ─────────────────────────────────────────────
    function buildPerformance(data) {
        const perf = data.indicative_performance || {};
        const rows = [
            ["Product to be made", perf.product || "High Quality Three Layer Film"],
            ["Max Throughput", perf.max_output || "200 KG / HR"],
            ["Thickness Variation", "+/- 8% above 40 and +/- 10% upto 40 or +/- 4 micron whichever is higher."],
            ["Raw Materials", perf.raw_materials || "LDPE, LLDPE, HDPE, mLLDPE etc."],
            ["Thickness Range", perf.thickness_range || "20 – 150 micron"],
            ["Lay flat Width", perf.layflat_width || "1350 MM maximum process able width."],
        ];
        const SCOL = [3200, CW - 3200];
        const specRows = rows.map((row, i) => new TableRow({
            children: [
                tc(row[0], SCOL[0], { fill: i % 2 === 0 ? LGRAY : WHITE }),
                tc(row[1], SCOL[1], { fill: i % 2 === 0 ? WHITE : LGRAY }),
            ]
        }));

        const els = [
            centreHead("INDICATIVE PERFORMANCE"),
            new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: SCOL, rows: specRows }),
            ep(0, 120),
            p([r("Provided that the temperature of air at the air ring will not be more than 10 – 12° C and 2.5 BUR+ Widths only. Ambient temperature and relative humidity within normal range.")], { sa: 80 }),
            p([r("NOTES:", { b: true, u: true })], { sb: 60, sa: 60 }),
        ];
        [
            "The Output indicated above are based on ambient Condition around 35 deg. C, and relative humidity around 40% range. Temp. at Air ring around 10-12 deg. C.",
            "Film output, Gauge Variation and Film Quality are dependent on polymer grades, Layflat width, Thickness, Nip height, Die Size and other processing and operating parameters, etc.",
            "Adequate quantity of PPA to be added to remove melt fracture in the film.",
            "Gels – Defective resins, dirty screws or processing conditions can cause gels.",
            "Gloss and Haze – Can be affected by resin, temperature profiles.",
        ].forEach(note => els.push(p([r("\u2022  " + note)], { sb: 0, sa: 40 })));
        els.push(new Paragraph({ children: [{ type: "pageBreak" }] }));
        return els;
    }

    // ── Component pages ────────────────────────────────────────────────────────
    function buildComponentPage(item, idx) {
        const tech = normTech(item.techDesc);
        const imgData = item.image ? loadImg(item.image) : null;
        const SCOL = [3000, CW - 3000];

        const titleTable = new Table({
            width: { size: CW, type: WidthType.DXA }, columnWidths: [600, 8506, 800],
            rows: [new TableRow({
                children: [
                    tc(String(idx + 1), 600, { fill: RED, b: true, c: WHITE, sz: 24, align: AlignmentType.CENTER, mt: 60, mb: 60, ml: 80, mr: 80 }),
                    new TableCell({
                        borders: B_STD, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                        width: { size: 8506, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
                        children: [
                            p([r((item.name || "").toUpperCase(), { b: true, sz: 22 })], { sa: 0 }),
                            p([r(item.category || "", { sz: 18, c: MUT })], { sb: 0, sa: 0 }),
                        ],
                    }),
                    new TableCell({
                        borders: B_STD, margins: { top: 60, bottom: 60, left: 40, right: 40 },
                        width: { size: 800, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
                        shading: { fill: LGRAY, type: ShadingType.CLEAR },
                        children: [
                            p([r("QTY:", { b: true, sz: 18 })], { align: AlignmentType.CENTER, sa: 0 }),
                            p([r(String(item.qty || 1), { b: true, sz: 20 })], { align: AlignmentType.CENTER, sb: 0, sa: 0 }),
                        ],
                    }),
                ]
            })]
        });

        const imageTable = new Table({
            width: { size: CW, type: WidthType.DXA }, columnWidths: [CW],
            rows: [new TableRow({
                children: [new TableCell({
                    borders: B_STD, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                    width: { size: CW, type: WidthType.DXA },
                    children: [
                        imgData
                            ? p([new ImageRun({ data: imgData, transformation: { width: 320, height: 220 }, type: itype(item.image) })], { align: AlignmentType.CENTER, sb: 40, sa: 40 })
                            : p([r("[Image]", { sz: 18, i: true, c: MUT })], { align: AlignmentType.CENTER, sb: 80, sa: 80 }),
                    ],
                })]
            })],
        });

        const specTable = new Table({
            width: { size: CW, type: WidthType.DXA }, columnWidths: SCOL,
            rows: [
                new TableRow({ children: [new TableCell({ borders: B_STD, columnSpan: 2, width: { size: CW, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 120, right: 120 }, children: [p([r("TECHNICAL SPECIFICATIONS", { b: true, sz: 20, c: WHITE })], { sa: 0 })] })] }),
                new TableRow({
                    children: [
                        tc("CATEGORY", SCOL[0], { fill: DARK, b: true, c: WHITE }),
                        tc(item.category || "", SCOL[1], { fill: DARK, b: true, c: WHITE }),
                    ]
                }),
                ...tech.map((row, i) => new TableRow({
                    children: [
                        tc(row.label, SCOL[0], { fill: i % 2 === 0 ? LGRAY : WHITE }),
                        tc(row.value, SCOL[1], { fill: i % 2 === 0 ? WHITE : LGRAY }),
                    ]
                })),
            ],
        });

        return [titleTable, ep(60, 60), imageTable, ep(60, 60), specTable, new Paragraph({ children: [{ type: "pageBreak" }] })];
    }

    // ── Utilities & Performance ────────────────────────────────────────────────
    function buildUtilities(data) {
        const perf = data.indicative_performance || {};
        const utilRows = [
            ["POWER", "415 V \u00B15%, 50 Hz, 3-Phase + Neutral + Earthing (Stabilized)."],
            ["WATER", "Soft Water (Boiler Grade). Temp 20-25\u00B0C. Pressure 2.5 Bar (Closed Loop)."],
            ["AIR", "Dry Compressed Air @ 6 Bar Pressure (Moisture Free)."],
        ];
        const utilTable = new Table({
            width: { size: CW, type: WidthType.DXA }, columnWidths: [1800, CW - 1800],
            rows: utilRows.map(([lbl, val]) => new TableRow({
                children: [
                    tc(lbl, 1800, { fill: LGRAY, b: true }),
                    tc(val, CW - 1800),
                ]
            })),
        });
        const perfLines = [
            ["Target Product", perf.product || "\u2014"],
            ["Max Capacity", perf.max_output || "\u2014"],
            ["Lay Flat Width", perf.layflat_width || "\u2014"],
            ["Die Size", perf.die_size || "\u2014"],
        ];
        if (perf.thickness_range) perfLines.push(["Thickness Range", perf.thickness_range]);
        if (perf.raw_materials) perfLines.push(["Raw Materials", perf.raw_materials]);
        perfLines.push(["Condition", "Guaranteed output requires continuous 24h operation, Prime Grade Raw Material, ambient temperature below 45\u00B0C."]);

        const perfBox = new Table({
            width: { size: CW, type: WidthType.DXA }, columnWidths: [CW],
            rows: [new TableRow({
                children: [new TableCell({
                    borders: B_STD, width: { size: CW, type: WidthType.DXA },
                    margins: { top: 80, bottom: 80, left: 160, right: 160 },
                    shading: { fill: "EBF5FB", type: ShadingType.CLEAR },
                    children: perfLines.map(([k, v]) => p([r(k + ": ", { b: true }), r(v)], { sa: 40 })),
                })]
            })],
        });
        const exclBox = new Table({
            width: { size: CW, type: WidthType.DXA }, columnWidths: [CW],
            rows: [new TableRow({
                children: [new TableCell({
                    borders: B_STD, width: { size: CW, type: WidthType.DXA },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    shading: { fill: "FEF9E7", type: ShadingType.CLEAR },
                    children: [p([r("EXCLUSIONS: ", { b: true, c: RED }), r("Civil foundation & flooring. Main cabling from transformer to panel. Earthing (3 pits). Interconnecting water & air piping. First fill of Lubricants. Unloading Crane & Labor.")])],
                })]
            })],
        });
        return [darkBanner("UTILITY REQUIREMENTS & PERFORMANCE"), ep(0, 80), utilTable, ep(0, 120), perfHead("INDICATIVE PERFORMANCE"), ep(0, 40), perfBox, ep(0, 120), exclBox, new Paragraph({ children: [{ type: "pageBreak" }] })];
    }

    // ── Terms ──────────────────────────────────────────────────────────────────
    function buildTerms() {
        return [
            darkBanner("COMMERCIAL TERMS & CONDITIONS"), ep(0, 80),
            ...([
                ["1. PRICES", "Prices are Un Packed, Ex-works, Ahmedabad, Gujarat basis. All Government taxes and duties are not considered. These are applicable as per rule. Prices are valid for 30 days from the date of quotation."],
                ["2. PACKING & FORWARDING", "Packing charges will be charged extra."],
                ["3. INSURANCE", "Transit insurance of the machine is to be covered by the buyer. In event of any claim, procedure done by buyer."],
                ["4. TRANSPORTATION", "Cost of transport is borne by the customer."],
                ["5. DELIVERY", "04 Months from date of receipt of technically/commercially clear PO + Minimum 40% irrevocable security deposit. Failure to lift machine within 30 days of readiness allows Adroit to divert to other customers."],
                ["6. PAYMENT", "40% Advance (Irrevocable). Balance payment + Taxes + Duties before delivery. Advance is non-interest bearing. Once machine dispatched, it cannot be returned under any condition."],
            ]).flatMap(([title, body]) => [sectionHead(title), p([r(body)], { sa: 100 })]),
            new Paragraph({ children: [{ type: "pageBreak" }] }),
        ];
    }

    // ── Warranty ───────────────────────────────────────────────────────────────
    function buildWarranty() {
        return [
            darkBanner("WARRANTY POLICY"), ep(0, 80),
            sectionHead("7. ERECTION & COMMISSIONING"),
            p([r("Our service engineers will supervise erection & commissioning. Customer must provide Skilled & Unskilled Labor. Airfare (To & Fro), Local Transport, Boarding & Lodging provided by Customer.")], { sa: 100 }),
            sectionHead("8. STANDARD WARRANTY"),
            p([r("WARRANTY PERIOD: 12 Months from date of commissioning against faulty material or bad workmanship (Mechanical).")], { sa: 40 }),
            p([r("Electrical items/Bought-outs: As per OEM warranty (6-12 Months).")], { sa: 40 }),
            p([r("EXCLUDES: Rubber, Plastic, Glass, Fuses, Heaters, Lamps. Damage due to accident/misuse not covered.")], { sa: 100 }),
            sectionHead("9. CANCELLATION"),
            p([r("Order once placed cannot be cancelled. In case of cancellation, entire advance amount is forfeited.")], { sa: 100 }),
            sectionHead("10. JURISDICTION"),
            p([r("Contract subject to Ahmedabad (Gujarat) jurisdiction only.")], { sa: 300 }),
            p([r("Sincerely,")], { align: AlignmentType.RIGHT, sa: 120 }),
            p([r("FOR ADROIT EXTRUSION", { b: true })], { align: AlignmentType.RIGHT, border: { top: { style: BorderStyle.SINGLE, size: 4, color: BDR, space: 2 } } }),
        ];
    }

    // ── Assemble ───────────────────────────────────────────────────────────────
    try {
        const data = req.body;
        const children = [
            ...buildCover(data),
            ...buildScope(data),
            ...buildPricingOptional(data),
            ...buildPerformance(data),
            ...(data.components || []).flatMap((item, i) => buildComponentPage(item, i)),
            ...buildUtilities(data),
            ...buildTerms(),
            ...buildWarranty(),
        ];

        const doc = new Document({
            styles: { default: { document: { run: { font: FONT, size: 20, color: TXT } } } },
            sections: [{
                properties: {
                    page: {
                        size: { width: 11906, height: 16838 },
                        margin: { top: 1000, right: 1000, bottom: 1400, left: 1000 },
                    },
                },
                headers: { default: buildHeader() },
                footers: { default: buildFooter() },
                children,
            }],
        });

        const buf = await Packer.toBuffer(doc);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.setHeader("Content-Disposition", "attachment; filename=Adroit_Proposal.docx");
        res.send(buf);
    } catch (err) {
        console.error("generate-docx error:", err);
        res.status(500).json({ error: err.message });
    }
}