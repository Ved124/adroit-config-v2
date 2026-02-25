// pages/api/generate-docx.js
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableCell,
    TableRow,
    WidthType,
    ImageRun,
} from "docx";

async function loadImageBuffer(src) {
    if (!src) return null;
    // remote url
    if (/^https?:\/\//i.test(src)) {
        const r = await fetch(src);
        if (!r.ok) throw new Error("Failed to fetch remote image: " + src);
        const arr = await r.arrayBuffer();
        return Buffer.from(arr);
    }

    // try local filesystem (project root / public)
    const tryPaths = [
        path.resolve(src),
        path.join(process.cwd(), src),
        path.join(process.cwd(), "public", src.replace(/^\//, "")),
    ];
    for (const p of tryPaths) {
        try {
            if (fs.existsSync(p)) return fs.readFileSync(p);
        } catch (e) {
            // ignore
        }
    }
    throw new Error("Image not found: " + src);
}

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            res.status(405).end("Method not allowed");
            return;
        }

        const payload = req.body || {};
        const {
            customer = {},
            selected = [],
            selectedAddons = [],
            markup = 0,
            discount = 0,
            company = {},
            letterheadPath = "/images/letterhead-bg.png",
        } = payload;

        const COMPANY = {
            name: company.name || "Adroit Extrusion Tech Pvt. Ltd.",
            email: company.email || "info@adroitextrusion.com",
            phone1: company.phone1 || "+91 8758665507",
            website: company.website || "adroiteextrusion.com",
            address1: company.address1 || "Unit 1: Survey 822, Village Bhumapura, Ahmedabad",
            address2: company.address2 || "Unit 2: 75/A, Akshar Industrial Park, B/H. Amba Estate, Near Hathijan Circle, Vatva, GIDC, Phase-4, Ahmedabad-382445, India",
        };

        // Calculate pricing
        const basicTotal = selected.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
        const addonsTotal = selectedAddons.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
        const subtotal = basicTotal + addonsTotal;
        const withMarkup = subtotal + (subtotal * (markup || 0)) / 100;
        const finalTotal = withMarkup - (withMarkup * (discount || 0)) / 100;

        // build sections array
        const sections = [];

        // optional: add letterhead top on first section if available
        let letterheadBuf = null;
        try {
            letterheadBuf = await loadImageBuffer(letterheadPath);
        } catch (err) {
            letterheadBuf = null;
        }

        // SECTION 1: Summary + Basic table
        const tableHeaderRow = new TableRow({
            children: [
                new TableCell({ width: { size: 4000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Component", bold: true })] })] }),
                new TableCell({ width: { size: 8500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true })] })] }),
                new TableCell({ width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Quantity", bold: true })] })] }),
            ],
        });

        const basicRows = [tableHeaderRow];
        for (const it of selected) {
            basicRows.push(new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph(it.name || "-")] }),
                    new TableCell({ children: [new Paragraph(it.desc || it.cardDesc || "-")] }),
                    new TableCell({ children: [new Paragraph(String(it.qty || 1))] }),
                ],
            }));
        }

        const basicTable = new Table({
            rows: basicRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { size: 1, color: "BFBFBF" },
                bottom: { size: 1, color: "BFBFBF" },
                left: { size: 1, color: "BFBFBF" },
                right: { size: 1, color: "BFBFBF" },
                insideHorizontal: { size: 1, color: "E6E6E6" },
                insideVertical: { size: 1, color: "E6E6E6" },
            },
        });

        const firstChildren = [];

        if (letterheadBuf) {
            firstChildren.push(new Paragraph({
                children: [new ImageRun({ data: letterheadBuf, transformation: { width: 600, height: 120 } })],
            }));
        }

        firstChildren.push(new Paragraph({ text: "Scope of Supply", heading: "Heading1" }));
        firstChildren.push(basicTable);

        // Add pricing summary
        firstChildren.push(new Paragraph({ text: "" }));
        firstChildren.push(new Paragraph({
            children: [
                new TextRun({ text: "Basic Price (Ex-Works): ", bold: true }),
                new TextRun({ text: `INR ${Math.round(withMarkup).toLocaleString("en-IN")}/-` })
            ]
        }));
        firstChildren.push(new Paragraph({
            children: [
                new TextRun({ text: "Final Price After Discount: ", bold: true }),
                new TextRun({ text: `INR ${Math.round(finalTotal).toLocaleString("en-IN")}/-` })
            ]
        }));

        sections.push({ children: firstChildren });

        // SECTION 2: Optional addons table (if any)
        if (selectedAddons && selectedAddons.length > 0) {
            const addonsHeader = new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Component", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Qty", bold: true })] })] }),
                ],
            });

            const addonRows = [addonsHeader];
            for (const a of selectedAddons) {
                addonRows.push(new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph(a.name || "-")] }),
                        new TableCell({ children: [new Paragraph(a.desc || a.cardDesc || "-")] }),
                        new TableCell({ children: [new Paragraph(String(a.qty || 1))] }),
                    ],
                }));
            }

            const addonTable = new Table({
                rows: addonRows,
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                    top: { size: 1, color: "BFBFBF" },
                    bottom: { size: 1, color: "BFBFBF" },
                    left: { size: 1, color: "BFBFBF" },
                    right: { size: 1, color: "BFBFBF" },
                    insideHorizontal: { size: 1, color: "E6E6E6" },
                    insideVertical: { size: 1, color: "E6E6E6" },
                },
            });

            sections.push({ children: [new Paragraph({ text: "Optional Equipments", heading: "Heading1" }), addonTable] });
        }

        // SECTION 3+: Component detail sections
        const details = [...selected, ...selectedAddons];
        for (const item of details) {
            const children = [];
            children.push(new Paragraph({ text: item.name || "-", heading: "Heading1" }));

            if (item.image) {
                try {
                    const buf = await loadImageBuffer(item.image);
                    if (buf) {
                        children.push(new Paragraph({ children: [new ImageRun({ data: buf, transformation: { width: 350, height: 200 } })] }));
                    }
                } catch (err) {
                    console.warn("Image load failed for", item.image, err.message);
                }
            }

            children.push(new Paragraph(item.desc || item.cardDesc || "-"));
            sections.push({ children });
        }

        // SECTION (final): Terms & Warranty
        const termsText = [
            "PRICES: Prices are Un Packed, Ex-works, Ahmedabad, Gujarat basis. All Government taxes and duties are not considered. These are applicable as per rule. Prices are valid for 30 days from the date of quotation.",
            "PACKING & FORWARDING: Packing charges will be charged extra.",
            "INSURANCE: Insurance to be organized by the customer.",
            "TRANSPORTATION: Cost of the transport will be borne by the customer.",
            "DELIVERY: 04 Months from the date receipt of technically and commercially clear purchase order with minimum 30% irrevocable security deposit.",
            "PAYMENT TERMS: We require 20% as token advance, 30% after 45 days of given order and Balance payment along with all incidental charges, Taxes & Duties are to be paid before delivery. The deposit is non-interest bearing, and will be forfeited in the event of cancellation of the order.",
            "PRE-DISPATCH TESTING & TRIALS: We follow discrete testing methods. This method involves discrete testing of individual system elements like Winders, Extruders etc. to our pre-designed standards to ensure faultless running of the complete line on installation at Customer end.",
            "ERECTION & COMMISSIONING: Our service engineers will supervise erection, installation and commissioning of the machine. Customer will provide skilled and semi skilled labor for the purpose of erection & commissioning. Customer will arrange Erection Team. Customer will ensure that all utilities and power connections are ready before customer calls our service engineer. The customer will pay To & Fro Fare, Lodging, Boarding, and Transportation during period of the services provided.",
            "Thanking you,",
            "Yours truly,",
            "FOR ADROIT EXTRUSION",
            "Urveesh Jepaliya",
            "STANDARD WARRANTY TERMS:",
            "WARRANTY PERIOD: For electrical, Boughtout items & Manufacturing items : 12 months from date of commissioning against faulty material or bad workmanship and undertake to repair/replacement the defective parts within period. The defect brought to notice has to be genuine. For Third Party Products : Manufacturers warranty will be applicable.",
            "WARRANTY EXCLUDES: Parts made of rubber, plastic, glass. Bearings, wearing parts, fuses, heaters, lamps, contactors, MCB's etc. The warranty does not cover damages caused by dropping, fire, floods or other natural calamity, misuse, accident or improper installation. The life span of screw and barrel depends upon abrasive material being processed and hence cannot be specified.",
            "WARRANTY IS LIMITED to the extent of the repairs or replacement of manufacturing defects and other things or workmanship. No liability is assumed beyond such replacements.",
            "Any condition or other matters relating to this quotation not expressly stimulated will be a matter of mutual discussion and agreement at the time of accepting the order.",
            "CANCELLATION: It is understood that order once placed cannot be cancelled without payment of cancellation charges, in addition to forfeiture of the advance paid by the customer."
        ];

        const termParas = termsText.map(t => new Paragraph(t));
        sections.push({ children: [new Paragraph({ text: "Terms & Warranty", heading: "Heading1" }), ...termParas] });

        // Create Document with sections array
        const doc = new Document({ sections });

        // pack to buffer
        const buffer = await Packer.toBuffer(doc);

        // send response as download
        const fileName = `${new Date().toISOString().slice(0, 10)}_${(customer.name || "customer").replace(/\s+/g, "_")}_Quotation.docx`;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.status(200).send(buffer);

    } catch (err) {
        console.error("generate-docx error:", err);
        res.status(500).json({ error: err.message || String(err) });
    }
}
