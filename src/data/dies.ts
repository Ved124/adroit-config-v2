// data/dies.ts
// Beta component data ONLY for blown film dies (mono, ABA / AB, 3-layer).
// Prices are placeholders (0). Adjust prices, model lists and images as needed.

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface DieComponent {
  id: string;
  name: string;
  dieFamily: "mono" | "aba" | "3layer" | "5layer";
  diameterMm: number;
  lipsDesc: string;           // e.g. "50/100" or "400 mm, 2.3 mm lip gap"
  machineTypes: MachineType[];
  usedInModels?: string[];    // e.g. ["UNOFLEX-750", "AE-1350"]
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
  shortDesc?: string;
}

// MONO: based roughly on "Die Size (HM / LD)" from Unoflex CSV
// ABA: based on Duoflex ABA die sizes
// 3-layer: based on Innoflex 3 Layer CSV (225 / 275 / 300 / 325 / 375 / 450 / 525 / 575)

export const DIE_COMPONENTS: DieComponent[] = [
  // ---------------- MONOLAYER DIES ----------------
  {
    id: "die-mono-50-100",
    name: "Mono Die 50 / 100",
    dieFamily: "mono",
    diameterMm: 50,
    lipsDesc: "50 / 100 (HM / LD)",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-450"],
    image: "/images/Die/Die.JPG",
    cardDesc: "Monolayer die 50 / 100 for narrow web film up to ~450 mm layflat.",
    price: 0,
    techDesc: {
      "Application": "Monolayer blown film for narrow web general purpose film.",
      "Die Size": "50 / 100 (HM / LD configuration).",
      "Construction":
        "Hardened alloy steel body with polished melt flow paths.",
      "Surface Treatment":
        "Electroless nickel plated internal flow passages for corrosion resistance.",
      "Lip Gap": "Adjustable lips with typical gap 0.8–1.2 mm.",
      "Heating": "Band heaters with independent temperature zones.",
      "Heating Zones": "2–3 zones depending on configuration.",
      "Thermocouples": "Multiple TC points for uniform die temperature.",
    },
    shortDesc: "Compact monolayer die for producing narrow web blown films."
  },

  {
    id: "die-mono-90-175",
    name: "Mono Die 90 / 175",
    dieFamily: "mono",
    diameterMm: 90,
    lipsDesc: "90 / 175 (HM / LD)",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-750_900"],
    image: "/images/Die/Die.JPG",
    cardDesc: "Monolayer die 90 / 175 for 750–900 mm layflat widths.",
    price: 0,
    techDesc: {
      "Application": "Monolayer shopping bag and liner film.",
      "Die Size": "90 / 175 (HM / LD).",
      "Material of Construction": "Hardened high-strength alloy steel.",
      "Surface Treatment":
        "Electroless nickel plating, highly polished die lips.",
      "Lip Design": "Adjustable circular lips with fine-thread bolts.",
      "Heating System": "Ceramic band heaters with PID temperature control.",
      "Heating Zones": "3–4 zones around die body and lips.",
      "Distribution": "Spiral flow distribution for uniform gauge.",
    },
    shortDesc: "Mid-size monolayer die for medium-width blown film applications."
  },

  {
    id: "die-mono-150-275",
    name: "Mono Die 150 / 275",
    dieFamily: "mono",
    diameterMm: 150,
    lipsDesc: "150 / 275 (HM / LD)",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-1000_1250"],
    image: "/images/Die/Die.JPG",
    cardDesc: "Monolayer die 150 / 275 for mid-width film 1000–1250 mm.",
    price: 0,
    techDesc: {
      "Application": "General packaging film, liners and surface printing film.",
      "Die Size": "150 / 275 (HM / LD).",
      "Material of Construction": "Hardened alloy steel with nitrided surfaces.",
      "Surface Treatment":
        "Electroless nickel plated with mirror finished flow paths.",
      "Lip Gap": "Typical gap 1.0–1.5 mm, adjustable.",
      "Heating System": "Band heaters with separate zones for body and lips.",
      "Heating Zones": "4–5 zones.",
      "Distribution": "Spiral distribution with balanced flow channels.",
    },
    shortDesc: "Versatile monolayer die for a wide range of blown film applications."
  },

  {
    id: "die-mono-200-325",
    name: "Mono Die 200 / 325",
    dieFamily: "mono",
    diameterMm: 200,
    lipsDesc: "200 / 325 (HM / LD)",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-1250_1500"],
    image: "/images/Die/Die.JPG",
    cardDesc: "Monolayer die 200 / 325 for 1250–1500 mm layflat film.",
    price: 0,
    techDesc: {
      "Application": "Medium to wide web monolayer films.",
      "Die Size": "200 / 325 (HM / LD).",
      "Design": "Center fed spiral die with balanced flow passages.",
      "Lip Design": "Adjustable lip bolts around circumference.",
      "Heating System": "High capacity ceramic heaters on body and lips.",
      "Heating Zones": "4–6 zones with individual temperature control.",
    },
    shortDesc: "Large monolayer die for wider blown film production."
  },

  {
    id: "die-mono-300-475",
    name: "Mono Die 300 / 475",
    dieFamily: "mono",
    diameterMm: 300,
    lipsDesc: "300 / 475 (HM / LD)",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-2000"],
    image: "/images/Die/Die.JPG",
    cardDesc: "Monolayer die 300 / 475 for 2000 mm layflat film.",
    price: 0,
    techDesc: {
      "Application": "Heavy duty liner and shrink film.",
      "Die Size": "300 / 475 (HM / LD).",
      "Material of Construction": "High strength alloy steel.",
      "Surface Treatment": "Nickel plated and highly polished.",
      "Distribution": "Spiral type distribution for uniform gauge.",
      "Heating System": "Ceramic band heaters with PID control.",
      "Heating Zones": "Multiple zones along body and lips.",
    },
    shortDesc: "High capacity monolayer die for large blown film applications."
  },

  {
    id: "die-mono-400-600",
    name: "Mono Die 400 / 600",
    dieFamily: "mono",
    diameterMm: 400,
    lipsDesc: "400 / 600 (HM / LD)",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-2500"],
    image: "/images/Die/Die.JPG",
    cardDesc: "Large mono die 400 / 600 for 2500 mm layflat widths.",
    price: 0,
    techDesc: {
      "Application": "Construction film, agricultural cover and wide width liners.",
      "Die Size": "400 / 600 (HM / LD).",
      "Lip Gap": "Approx. 2.0–2.5 mm adjustable.",
      "Distribution": "Spiral distribution ensuring even melt flow.",
      "Heating System": "High capacity heaters with multi-zone control.",
    },
    shortDesc: "Spiral die head that provides even melt distribution and consistent film thickness."
  },

  {
    id: "die-mono-450-700",
    name: "Mono Die 450 / 700",
    dieFamily: "mono",
    diameterMm: 450,
    lipsDesc: "450 / 700 (HM / LD)",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-3000"],
    image: "/images/Die/Die.JPG",
    cardDesc: "Largest mono die 450 / 700 for 3000 mm layflat.",
    price: 0,
    techDesc: {
      "Application": "Very wide width film, greenhouse and silo covers.",
      "Die Size": "450 / 700 (HM / LD).",
      "Design": "Heavy duty spiral die with stiffening ribs.",
      "Heating": "Segmented band heaters for uniform temperature.",
      "Heating Zones": "6+ zones with PID controllers.",
    },
    shortDesc: "Spiral die head that provides even melt distribution and consistent film thickness.",
  },

  // ---------------- ABA / AB DIES (DUOFLEX) ----------------
  {
    id: "die-aba-70-150",
    name: "ABA / AB Die 70 / 150",
    dieFamily: "aba",
    diameterMm: 70,
    lipsDesc: "70 / 150 (HM / LD)",
    machineTypes: ["aba"],
    usedInModels: ["DUOFLEX-750"],
    image: "/images/Die/Die.JPG",
    cardDesc: "ABA / AB die 70 / 150 for Duoflex 750.",
    price: 0,
    techDesc: {
      "Application": "Duoflex ABA / AB machine, layflat up to 750 mm.",
      "Die Size": "70 / 150 (HM / LD).",
      "Construction": "Co-extrusion spiral die for 2 or 3 layer structures.",
      "Layer Structure": "A/B or A/B/A depending on feedblock selection.",
      "Surface Finish": "Highly polished, nickel plated flow channels.",
      "Heating System": "Band heaters with individual zones.",
      "Heating Zones": "3–4 zones.",
    },
    shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
  },

  {
    id: "die-aba-125-250",
    name: "ABA / AB Die 125 / 250",
    dieFamily: "aba",
    diameterMm: 125,
    lipsDesc: "125 / 250 (HM / LD)",
    machineTypes: ["aba"],
    usedInModels: ["DUOFLEX-1000"],
    image: "/images/Die/Die.JPG",
    cardDesc: "ABA / AB die 125 / 250 for mid-width Duoflex.",
    price: 0,
    techDesc: {
      "Application": "Medium width ABA / AB film for lamination and packaging.",
      "Die Size": "125 / 250 (HM / LD).",
      "Layer Capability": "Suitable for AB and ABA structures.",
      "Heating": "Ceramic heaters on body and lips.",
      "Distribution": "Spiral distribution for balanced layer thickness.",
    },
    shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
  },

  {
    id: "die-aba-150-300",
    name: "ABA / AB Die 150 / 300",
    dieFamily: "aba",
    diameterMm: 150,
    lipsDesc: "150 / 300 (HM / LD)",
    machineTypes: ["aba"],
    usedInModels: ["DUOFLEX-1250"],
    image: "/images/Die/Die.JPG",
    cardDesc: "ABA / AB die 150 / 300 for 1250 mm layflat.",
    price: 0,
    techDesc: {
      "Application": "High dart FFS film, lamination and surface printing film.",
      "Die Size": "150 / 300 (HM / LD).",
      "Layer Structure": "A/B/A with outer and core layer balance.",
      "Heating System": "Band heaters with individual temperature control.",
    },
    shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
  },

  {
    id: "die-aba-225-375",
    name: "ABA / AB Die 225 / 375",
    dieFamily: "aba",
    diameterMm: 225,
    lipsDesc: "225 / 375 (HM / LD)",
    machineTypes: ["aba"],
    usedInModels: ["DUOFLEX-1750"],
    image: "/images/Die/Die.JPG",
    cardDesc: "Large ABA / AB die 225 / 375 for 1750 mm layflat.",
    price: 0,
    techDesc: {
      "Application": "Wider web ABA film such as stretch hood, shrink film etc.",
      "Die Size": "225 / 375 (HM / LD).",
      "Design": "Large diameter spiral die for higher output.",
      "Heating System": "Segmented heaters with multi-zone control.",
    },
    shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
  },

  // ---------------- 3-LAYER DIES (INNOFLEX) ----------------
  {
    id: "die-3layer-225",
    name: "Three Layer Die 225 mm",
    dieFamily: "3layer",
    diameterMm: 225,
    lipsDesc: "225 mm, 3-layer spiral die",
    machineTypes: ["3layer"],
    usedInModels: ["AE-1125"],
    image: "/images/Die/Die.JPG",
    cardDesc: "3-layer spiral die 225 mm for AE-1125.",
    price: 0,
    techDesc: {
      "Material of Construction": "Hardened high strength alloy steel.",
      "Surface Treatment":
        "Electroless nickel plated and highly polished melt paths.",
      "Die Size": "225 mm diameter, 3-layer construction.",
      "Distribution": "Spiral distribution for three layer structure.",
      "Heating Zones": "4 zones with independent temperature control.",
      "Heating System": "Ceramic band heaters (AUM or equivalent).",
      "Layer Structure": "Typical A/B/A structure for high performance films.",
    },
    shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
  },

  {
    id: "die-3layer-275",
    name: "Three Layer Die 275 mm",
    dieFamily: "3layer",
    diameterMm: 275,
    lipsDesc: "275 mm, 3-layer spiral die",
    machineTypes: ["3layer"],
    usedInModels: ["AE-1350A"],
    image: "/images/Die/Die.JPG",
    cardDesc: "3-layer spiral die 275 mm for AE-1350.",
    price: 0,
    techDesc: {
      "Material of Construction": "Hardened alloy steel.",
      "Die Size": "275 mm diameter, 3-layer.",
      "Distribution": "Spiral flow distribution with balanced channels.",
      "Heating Zones": "4–5 zones.",
      "Heating System": "Ceramic band heaters.",
      "Application": "Lamination and liquid packaging films.",
    },
    shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
  },

  {
    id: "die-3layer-300",
    name: "Three Layer Die 300 mm",
    dieFamily: "3layer",
    diameterMm: 300,
    lipsDesc: "300 mm, 3-layer spiral die",
    machineTypes: ["3layer"],
    usedInModels: ["AE-1350B"],
    image: "/images/Die/Die.JPG",
    cardDesc: "3-layer spiral die 300 mm for 1250 mm layflat.",
    price: 0,
    techDesc: {
      "Die Size": "300 mm diameter, three layer spiral die.",
      "Distribution": "Spiral distribution for uniform layer thickness.",
      "Heating": "Band heaters with multi-zone controller.",
      "Application": "High dart FFS film, lamination film.",
    },
    shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
  },

  {
    id: "die-3layer-325",
    name: "Three Layer Die 325 mm",
    dieFamily: "3layer",
    diameterMm: 325,
    lipsDesc: "325 mm, 3-layer spiral die",
    machineTypes: ["3layer"],
    usedInModels: ["AE-1625"],
    image: "/images/Die/Die.JPG",
    cardDesc: "3-layer spiral die 325 mm for 1500 mm layflat.",
    price: 0,
    techDesc: {
      "Die Size": "325 mm diameter, three layer.",
      "Heating System": "Band heaters with individual zones.",
      "Application": "High output 3-layer films for packaging applications.",
    },
    shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
  },

  {
    id: "die-3layer-375",
    name: "Three Layer Die 375 mm",
    dieFamily: "3layer",
    diameterMm: 375,
    lipsDesc: "375 mm, 3-layer spiral die",
    machineTypes: ["3layer"],
    usedInModels: ["AE-1870"],
    image: "/images/Die/Die.JPG",
    cardDesc: "3-layer spiral die 375 mm for 1750 mm layflat.",
    price: 0,
    techDesc: {
      "Die Size": "375 mm, 3-layer spiral distribution.",
      "Heating System": "Ceramic band heaters with PID temperature control.",
      "Application": "Medium–wide web films, lamination and heavy duty FFS.",
    },
    shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
  },

  {
    id: "die-3layer-400",
    name: "Three Layer Die 400 mm",
    dieFamily: "3layer",
    diameterMm: 400,
    lipsDesc: "400 mm, 3-layer spiral die",
    machineTypes: ["3layer"],
    usedInModels: ["AE-1870"],
    image: "/images/Die/Die.JPG",
    cardDesc: "3-layer spiral die 400 mm for 1850 mm layflat.",
    price: 0,
    techDesc: {
      "Die Size": "400 mm, 3-layer spiral distribution.",
      "Heating System": "Ceramic band heaters with PID temperature control.",
      "Application": "Medium–wide web films, lamination and heavy duty FFS.",
    },
    shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
  },

  {
    id: "die-3layer-450",
    name: "Three Layer Die 450 mm",
    dieFamily: "3layer",
    diameterMm: 450,
    lipsDesc: "450 mm, 3-layer spiral die",
    machineTypes: ["3layer"],
    usedInModels: ["AE-2125"],
    image: "/images/Die/Die.JPG",
    cardDesc: "3-layer die 450 mm for 2000 mm layflat.",
    price: 0,
    techDesc: {
      "Die Size": "450 mm diameter, three layer.",
      "Application": "High output packaging and stretch hood films.",
      "Heating": "Segmented ceramic band heaters.",
    },
    shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
  },

  {
    id: "die-3layer-525",
    name: "Three Layer Die 525 mm",
    dieFamily: "3layer",
    diameterMm: 525,
    lipsDesc: "525 mm, 3-layer spiral die",
    machineTypes: ["3layer"],
    usedInModels: ["AE-2370"],
    image: "/images/Die/Die.JPG",
    cardDesc: "3-layer die 525 mm for 2250 mm layflat.",
    price: 0,
    techDesc: {
      "Die Size": "525 mm, 3-layer.",
      "Application": "Wider web industrial and stretch films.",
      "Distribution": "Spiral flow distribution.",
    },
    shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
  },

  {
    id: "die-3layer-575",
    name: "Three Layer Die 575 mm",
    dieFamily: "3layer",
    diameterMm: 575,
    lipsDesc: "575 mm, 3-layer spiral die",
    machineTypes: ["3layer", "5layer"], // can be reused for future 5-layer
    usedInModels: ["AE-2625"],
    image: "/images/Die/Die.JPG",
    cardDesc: "Largest 3-layer die 575 mm for 2500 mm layflat.",
    price: 0,
    techDesc: {
      "Die Size": "575 mm, three layer spiral die.",
      "Application":
        "Very high output lines for heavy-duty and agricultural films.",
      "Heating": "High capacity heaters with multi-zone control.",
    },
    shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
  },
];
