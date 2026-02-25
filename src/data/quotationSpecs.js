// src/data/quotationSpecs.js

export const STATIC_TEXT = {
    // Page 4
    LIMITATIONS: {
        intro: "Although we can design our equipment to as high a standard as possible, there are many factors other than equipment that can significantly affect the quality of the film. As these factors are out of our control, they are not covered by our performance guarantee. These factors include but are not limited to:",
        points: [
            { title: "Resin", text: "Bad Batches, Off-spec. Resins, Changes in additives or the use of resins other than Specified can produce poor film." },
            { title: "Interfacial Instability", text: "Mismatched viscosity in adjacent layers, can be reduced by matching resins or increasing thickness of thin layers." },
            { title: "Blocking", text: "Weather effects, resins, additives and processing conditions can induce blocking, even with a tower of recommended height running the guarantee structures." },
            { title: "Gels", text: "Defective resins, dirty screws or processing conditions can cause gels." },
            { title: "Gloss and Haze", text: "Can be affected by resin, temperature profiles or inappropriate purge resins." },
            { title: "Melt fracture", text: "Due to a too narrow die gap and material properties. Processing aid may be required." },
            { title: "Curling", text: "Asymmetrical film structures will curl." },
            { title: "Film Characteristics", text: "Impact resistance, tear strength and other film qualities can be radically affected by processing conditions, resins and additives." }
        ]
    },

    // Page 7
    ITEMS_NOT_INCLUDED: [
        "Civil work, foundation bolts, and grouting materials.",
        "Electrical cabling from main supply to the control panel.",
        "Water piping from the source to the machine.",
        "Compressed air piping from the compressor to the machine.",
        "Lubricating oil and hydraulic oil.",
        "Raw materials for trial and commissioning.",
        "Accommodation, food, and local transport for service engineers during installation.",
        "Unloading and shifting of the machine at the customer's site.",
        "Any other item not specifically mentioned in the scope of supply."
    ],

    // Page 8
    WATER_QUALITY: {
        "pH Value": "7.0 to 7.5",
        "Hardness": "Less than 50 PPM",
        "Chloride": "Less than 50 PPM",
        "Turbidity": "Less than 5 PPM",
        "Total Dissolved Solids": "Less than 100 PPM"
    },

    RECOMMENDED_ENVIRONMENT: "The machine should be installed in a dust-free and ventilated environment. The ambient temperature should be between 25°C to 35°C for optimal performance. Humidity levels should be maintained below 70% to prevent moisture absorption by raw materials.",

    // Page 9
    WARRANTY_TERMS: [
        {
            title: "WARRANTY PERIOD",
            text: "All Mechanical components warranty for 1 year, All Pneumatic Parts Warranty for 1 year (Dry Air Compulsory with Air Compressor. If not Dry Air, then Warranty will not Apply), Drives Warranty for 1 year (Voltage stabilizer compulsory, If not then Warranty will not Apply) All Electrical & Electronics parts like Switch, Contactor, MCB, etc. warranty for 06 months from date of commissioning against faulty material or bad workmanship and undertake to repair/replacement the defective parts within period. The defect brought to notice has to be genuine. The cost of the new materials or repairing of the defective ones will be borne by the Seller. However, the cost of transportation and destination clearance charges etc. will be borne by the buyer.\n\n• The buyer is required to return the defective parts or equipment to seller or to the manufacturer and the cost for the same will be bear by the buyer\n\nIn case of payment terms agreed upon in the contract are not been obeyed, the warranty expires consequentially."
        },
        {
            title: "WARRANTY EXCLUDES FOLLOWING",
            text: "Parts made of rubber, plastic, glass. Bearings, wearing parts, fuses, heaters, lamps, contactors, MCB’s etc. The warranty does not cover damages caused by dropping, fire, floods or other natural calamity, misuse, accident or improper installation. The life span of screw and barrel depends upon abrasive material being processed and hence cannot be specified."
        },
        {
            title: "WARRANTY IS LIMITED",
            text: "To the extend of the repairs or replacement of manufacturing defects and other things or workmanship. No liability is assumed beyond such replacements.\n\nAny condition or other matters relating to this quotation not expressly stimulated will be a matter of mutual discussion and agreement at the time of accepting the order."
        }
    ],

    CANCELLATION_TEXT: "It is understood that order once placed cannot be cancelled for any reason whatso ever. In case of cancellation of the order, the entire amount of the advance will be forfeited.",

    COMMERCIAL_TERMS: [
        {
            title: "PRICES",
            text: "Prices are Un Packed, Ex-works, Ahmedabad, Gujarat basis. All Government taxes and duties are not considered. These are applicable as per rule. Prices are valid for 30 days from the date of quotation."
        },
        {
            title: "PACKING & FORWARDING",
            text: "Packing charges will be charged extra."
        },
        {
            title: "INSURANCE",
            text: "Transit insurance of the machine is to be cover by the buyer. In the event of any Insurance claim, the procedure would be done by the buyer."
        },
        {
            title: "TRANSPORTATION",
            text: "Cost of the transport will be borne by the customer."
        },
        {
            title: "DELIVERY",
            text: "04 Months from the date receipt of technically and commercially clear purchase order with minimum 40% irrevocable security deposit. Failure to lift the machinery against balance payment even a month after the machine will ready, then ADROIT EXTRUSION has right to sell it to another customer. In that case, you have to wait till another same machine will be ready by us. The agreed prices will change in case buyer fails to take delivery of the ordered machine within 30 days from the date of conveying readiness of the machine to the buyer."
        },
        {
            title: "PAYMENT TERMS",
            text: "We require 40% of the Total value of order as irrevocable security deposit. Balance payment along with all incidental charges, Taxes & Duties are to be paid before delivery. The advance is non-interest bearing. In the event of cancellation of the order, advance will be adjusting against order cancellation charges. Offsetting or retention of payments based on any counterclaims whatsoever of the Buyer are not admissible. Once Machine Dispatched, It cannot be Returned at any Condition."
        },
        {
            title: "JURISDICTION",
            text: "All Contract of sell Shall be Subject to Ahmadabad jurisdiction only."
        },
        {
            title: "PRE-DISPATCH TESTING & TRIALS",
            text: "We follow discrete testing methods. This method involves discrete testing of individual system elements like Winders, Extruders etc. to our pre- designed standards to ensure faultless running of the complete line on installation at Customer end. For the wet trials, the buyer is required to arrange all the input raw materials or Seller will arrange the same at buyer cost."
        },
        {
            title: "ERECTION & COMMISSIONING",
            text: "Our service engineers will supervise erection, installation and commissioning of the machine. Customer will provide skilled and semi skilled labor for the purpose of erection & commissioning. Customer will arrange Erection Team. Customer will ensure that all utilities and power connections are ready before customer calls our service engineers. The customer will pay To & Fro 2 AC Train Fare, Lodging, Boarding, and Transportation during period of the services provided."
        }
    ]
};

export const MODEL_SPECS = {
    // MONOLAYER MODELS
    "UNOFLEX-450": {
        performance: {
            "Product": "HM-HDPE / LDPE / LLDPE Film",
            "Max Pumping Capacity": "35 kg/hr",
            "Max Output": "30 kg/hr",
            "Thickness Variation": "+/- 8% above 40 µ and +/- 10% upto 40 µ",
            "Raw Materials": "LDPE / LLDPE / HDPE / CaCO3",
            "Thickness Range": "15 – 50 µ",
            "Layflat Width": "450 mm",
        },
        extruder1: {
            title: "EXTRUDER 35 MM",
            specs: {
                "Screw Diameter": "35 mm",
                "L/D Ratio": "30:1",
                "Drive": "7.5 kW",
                "Heating Zones": "4 Zones",
                "Heating Load": "4.1 kW",
            }
        },
        die: {
            title: "MONOLAYER DIE",
            specs: {
                "Die Size": "50 / 100 mm",
                "Die Type": "Spiral Mandrel",
                "Heating Zones": "2 Zones",
                "Heating Load": "5.1 kW",
            }
        },
        downstream: {
            bubbleCage: {
                title: "BUBBLE CAGE",
                specs: { "Type": "Iris Type", "Adjustment": "Manual" }
            },
            hauloff: {
                title: "HAULOFF",
                specs: { "Roller Width": "500 mm", "Line Speed": "10 - 50 MPM", "Motor": "0.75 kW" }
            },
            winder: {
                title: "WINDER",
                specs: { "Type": "Surface Winder", "Roller Width": "500 mm", "Max Dia": "800 mm" }
            }
        },
        utilities: {
            electrical: [
                { name: "Extruder Motor", qty: 1, heat: 0, motive: 7.5 },
                { name: "Extruder Heating", qty: 1, heat: 4.1, motive: 0 },
                { name: "Die Heating", qty: 1, heat: 5.1, motive: 0 },
                { name: "Blower", qty: 1, heat: 0, motive: 1.0 },
                { name: "Take up", qty: 1, heat: 0, motive: 0.75 },
                { name: "Winder", qty: 1, heat: 0, motive: 0.75 },
            ],
            water: { requirement: "60 LPM", pressure: "3-4 Bar" },
            air: { pressure: "6 Bar", consumption: "10 CFM" }
        }
    },

    // Add other models similarly...
    // For now, we'll use a fallback for unknown models
    "DEFAULT": {
        performance: {
            "Product": "Multi-Layer Film",
            "Max Pumping Capacity": "—",
            "Max Output": "—",
            "Thickness Variation": "+/- 8%",
            "Raw Materials": "LDPE / LLDPE",
            "Thickness Range": "—",
            "Layflat Width": "—",
        },
        extruder1: {
            title: "EXTRUDER",
            specs: { "Screw Diameter": "—", "L/D Ratio": "30:1" }
        },
        die: {
            title: "DIE",
            specs: { "Size": "—" }
        },
        downstream: {
            bubbleCage: { title: "BUBBLE CAGE", specs: { "Type": "—" } },
            hauloff: { title: "HAULOFF", specs: { "Width": "—" } },
            winder: { title: "WINDER", specs: { "Type": "—" } }
        },
        utilities: {
            electrical: [],
            water: { requirement: "—", pressure: "—" },
            air: { pressure: "—", consumption: "—" }
        }
    }
};
