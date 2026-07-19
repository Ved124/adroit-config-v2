// data/dies.ts
// Dynamic master die cards — one per die family.
// Each card uses isDynamic: true and sizeDetails map for per-size specs.

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface SizeDetail {
  name: string;
  techDesc: TechSpecMap;
  shortDesc?: string;
}

export interface DieComponent {
  id: string;
  name: string;
  isDynamic: true;
  pricingType: "size";
  dieFamily: "mono" | "aba" | "3layer" | "3layer-ibc";
  machineTypes: MachineType[];
  image: string;
  cardDesc: string;
  price: number;
  prices: Record<string, number>;
  sizeDetails: Record<string, SizeDetail>;
  shortDesc?: string;
}

const MONO_TECH_BASE: TechSpecMap = {
  "Material of Construction": "Hardened high strength alloy steel.",
  "Surface Treatment": "Electroless Nickel / chrome plated & highly polished melt paths.",
  "Die setting": "Die adjusting bolts will be provided.",
  "Distribution": "Spiral distribution.",
  "Heating System": "Ceramic band heaters",
};

const ABA_TECH_BASE: TechSpecMap = {
  "Material of Construction": "Hardened high strength alloy steel.",
  "Surface Treatment": "Hard chrome plated & highly polished melt paths.",
  "Die setting": "Die adjusting bolts will be provided.",
  "Distribution": "Spiral distribution.",
  "Heating System": "Ceramic band heaters",
};

const THREE_LAYER_TECH_BASE: TechSpecMap = {
  "Material of Construction": "Hardened high strength alloy steel.",
  "Surface Treatment": "Electroless Chrome plated and highly polished melt paths.",
  "Die setting": "Die adjusting bolts will be provided.",
  "Distribution": "Spiral distribution.",
  "Heating System": "Ceramic band heaters (AUM or Heatsun).",
};

export const DIE_COMPONENTS: DieComponent[] = [

  // ─────────────────── MONO DIE ───────────────────
  {
    id: "die-mono-dynamic",
    name: "Monolayer Die",
    isDynamic: true,
    pricingType: "size",
    dieFamily: "mono",
    machineTypes: ["mono"],
    image: "/images/Die/DieMono.png",
    cardDesc: "Select die size. Specs and price update automatically.",
    price: 0,
    prices: {
      "50": 0,
      "90": 0,
      "100": 0,
      "150": 0,
      "200": 0,
      "250": 0,
      "300": 900000,
      "400": 1400000,
      "450": 1800000,
      "600": 2500000,
    },
    sizeDetails: {
      "50": {
        name: "Monolayer Die 50 mm",
        techDesc: {
          ...MONO_TECH_BASE,
          "Die Size": "50 mm diameter.",
          "Application": "Narrow web film up to ~450 mm layflat.",
          "Lip Gap": "Adjustable, typical gap 0.8–1.2 mm.",
          "Heating Zones": "2–3 zones.",
        },
        shortDesc: "Compact monolayer die for narrow web blown films.",
      },
      "90": {
        name: "Monolayer Die 90 mm",
        techDesc: {
          ...MONO_TECH_BASE,
          "Die Size": "90 mm diameter.",
          "Application": "Monolayer shopping bag and liner film, 750–900 mm layflat.",
          "Lip Design": "Adjustable circular lips with fine-thread bolts.",
          "Heating Zones": "3–4 zones.",
        },
        shortDesc: "Mid-size monolayer die for medium-width blown film applications.",
      },
      "100": {
        name: "Monolayer Die 100 mm",
        techDesc: {
          ...MONO_TECH_BASE,
          "Die Size": "100 mm diameter.",
          "Heating Zones": "02 Nos.",
        },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "150": {
        name: "Monolayer Die 150 mm",
        techDesc: {
          ...MONO_TECH_BASE,
          "Die Size": "150 mm diameter.",
          "Application": "General packaging film, liners and surface printing film — 1000–1250 mm layflat.",
          "Lip Gap": "Typical gap 1.0–1.5 mm, adjustable.",
          "Heating Zones": "4–5 zones.",
        },
        shortDesc: "Versatile monolayer die for a wide range of blown film applications.",
      },
      "200": {
        name: "Monolayer Die 200 mm",
        techDesc: {
          ...MONO_TECH_BASE,
          "Die Size": "200 mm diameter.",
          "Application": "Medium to wide web monolayer films — 1250–1500 mm layflat.",
          "Heating Zones": "4–6 zones with individual temperature control.",
        },
        shortDesc: "Large monolayer die for wider blown film production.",
      },
      "250": {
        name: "Monolayer Die 250 mm",
        techDesc: {
          ...MONO_TECH_BASE,
          "Die Size": "250 mm diameter.",
          "Heating Zones": "02 Nos.",
        },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "300": {
        name: "Monolayer Die 300 mm",
        techDesc: {
          ...MONO_TECH_BASE,
          "Die Size": "300 mm diameter.",
          "Application": "Heavy duty liner and shrink film — 2000 mm layflat.",
          "Heating Zones": "Multiple zones along body and lips.",
        },
        shortDesc: "High capacity monolayer die for large blown film applications.",
      },
      "400": {
        name: "Monolayer Die 400 mm",
        techDesc: {
          ...MONO_TECH_BASE,
          "Die Size": "400 mm diameter.",
          "Application": "Construction film, agricultural cover and wide width liners — 2500 mm layflat.",
          "Lip Gap": "Approx. 2.0–2.5 mm adjustable.",
          "Heating Zones": "03 Nos.",
        },
        shortDesc: "Spiral die head for even melt distribution and consistent film thickness.",
      },
      "450": {
        name: "Monolayer Die 450 mm",
        techDesc: {
          ...MONO_TECH_BASE,
          "Die Size": "450 mm diameter.",
          "Application": "Very wide width film, greenhouse and silo covers — 3000 mm layflat.",
          "Heating Zones": "6+ zones with PID controllers.",
        },
        shortDesc: "Heavy-duty spiral die for maximum-width blown film applications.",
      },
      "600": {
        name: "Monolayer Die 600 mm",
        techDesc: {
          ...MONO_TECH_BASE,
          "Die Size": "600 mm diameter.",
          "Heating Zones": "04 Nos.",
        },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
    },
  },

  // ─────────────────── ABA DIE ───────────────────
  {
    id: "die-aba-dynamic",
    name: "ABA / AB Die",
    isDynamic: true,
    pricingType: "size",
    dieFamily: "aba",
    machineTypes: ["aba"],
    image: "/images/Die/DieABA.png",
    cardDesc: "Select die size for ABA co-extrusion. Specs and price update automatically.",
    price: 0,
    prices: {
      "70": 0,
      "75": 0,
      "100": 0,
      "125": 0,
      "150": 0,
      "200": 0,
      "225": 0,
      "300": 900000,
      "350": 0,
      "600": 2500000,
    },
    sizeDetails: {
      "70": {
        name: "ABA / AB Die 70 mm",
        techDesc: {
          ...ABA_TECH_BASE,
          "Die Size": "70 mm.",
          "Heating Zones": "03 Nos.",
        },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "75": {
        name: "ABA Die 75 mm",
        techDesc: {
          ...ABA_TECH_BASE,
          "Die Size": "75 mm.",
          "Heating Zones": "02 Nos.",
        },
        shortDesc: "ABA die head.",
      },
      "100": {
        name: "ABA Die 100 mm",
        techDesc: {
          ...ABA_TECH_BASE,
          "Die Size": "100 mm.",
          "Heating Zones": "03 Nos.",
        },
        shortDesc: "Basic ABA die head.",
      },
      "125": {
        name: "ABA / AB Die 125 mm",
        techDesc: {
          ...ABA_TECH_BASE,
          "Die Size": "125 mm.",
          "Heating Zones": "03 Nos.",
        },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "150": {
        name: "ABA Die 150 mm",
        techDesc: {
          ...ABA_TECH_BASE,
          "Die Size": "150 mm.",
          "Heating Zones": "03 Nos.",
        },
        shortDesc: "Basic ABA die head.",
      },
      "200": {
        name: "ABA Die 200 mm",
        techDesc: {
          ...ABA_TECH_BASE,
          "Die Size": "200 mm.",
          "Heating Zones": "03 Nos.",
        },
        shortDesc: "Basic ABA die head.",
      },
      "225": {
        name: "ABA / AB Die 225 mm",
        techDesc: {
          ...ABA_TECH_BASE,
          "Die Size": "225 mm.",
          "Heating Zones": "03 Nos.",
        },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "300": {
        name: "ABA Die 300 mm",
        techDesc: {
          ...ABA_TECH_BASE,
          "Die Size": "300 mm.",
          "Heating Zones": "03 Nos.",
        },
        shortDesc: "ABA die head.",
      },
      "350": {
        name: "ABA / AB Die 350 mm",
        techDesc: {
          ...ABA_TECH_BASE,
          "Die Size": "350 mm.",
          "Heating Zones": "04 Nos.",
        },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "600": {
        name: "ABA Die 600 mm",
        techDesc: {
          ...ABA_TECH_BASE,
          "Die Size": "600 mm.",
          "Heating Zones": "03 Nos.",
        },
        shortDesc: "Large ABA die head.",
      },
    },
  },

  // ─────────────────── THREE LAYER DIE (Standard) ───────────────────
  {
    id: "die-3layer-dynamic",
    name: "Three Layer Die",
    isDynamic: true,
    pricingType: "size",
    dieFamily: "3layer",
    machineTypes: ["3layer"],
    image: "/images/Die/Die.png",
    cardDesc: "Select die size for 3-layer co-extrusion. Specs and price update automatically.",
    price: 0,
    prices: {
      "225": 0,
      "275": 0,
      "300": 900000,
      "325": 1100000,
      "350": 1150000,
      "375": 1200000,
      "400": 1400000,
      "425": 1600000,
      "450": 1800000,
      "500": 2000000,
      "525": 2100000,
      "550": 2200000,
      "600": 2500000,
      "650": 2800000,
      "700": 3400000,
      "750": 3600000,
    },
    sizeDetails: {
      "225": {
        name: "Three Layer Die 225 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "225 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "04 Nos." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "275": {
        name: "Three Layer Die 275 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "275 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "04 Nos." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "300": {
        name: "Three Layer Die 300 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "300 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "04 Nos." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "325": {
        name: "Three Layer Die 325 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "325 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "04 Nos." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "350": {
        name: "Three Layer Die 350 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "350 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "04 Nos." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "375": {
        name: "Three Layer Die 375 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "375 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "04 Nos." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "400": {
        name: "Three Layer Die 400 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "400 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "04 Nos." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "425": {
        name: "Three Layer Die 425 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "425 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "4 zones with independent temperature control." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "450": {
        name: "Three Layer Die 450 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "450 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "4 zones with independent temperature control." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "500": {
        name: "Three Layer Die 500 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "500 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "4 zones with independent temperature control." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "525": {
        name: "Three Layer Die 525 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "525 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "4 zones with independent temperature control." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "550": {
        name: "Three Layer Die 550 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "550 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "4 zones with independent temperature control." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "600": {
        name: "Three Layer Die 600 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "600 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "4 zones with independent temperature control." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "650": {
        name: "Three Layer Die 650 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "650 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "4 zones with independent temperature control." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "700": {
        name: "Three Layer Die 700 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "700 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "05 Nos.", "Heating System": "Ceramic band heaters (Hitco or equivalent)." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "750": {
        name: "Three Layer Die 750 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "750 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "05 Nos.", "Heating System": "Ceramic band heaters (Hitco or equivalent)." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
    },
  },

  // ─────────────────── THREE LAYER IBC DIE ───────────────────
  {
    id: "die-3layer-ibc-dynamic",
    name: "Three Layer IBC Die",
    isDynamic: true,
    pricingType: "size",
    dieFamily: "3layer-ibc",
    machineTypes: ["3layer"],
    image: "/images/Die/Die.png",
    cardDesc: "Select die size for 3-layer IBC co-extrusion. Internal Bubble Cooling provision included.",
    price: 0,
    prices: {
      "300": 1800000,
      "325": 1800000,
      "350": 1900000,
      "375": 2000000,
      "400": 2100000,
      "425": 2300000,
      "450": 2500000,
      "500": 3000000,
      "550": 3200000,
      "600": 3500000,
    },
    sizeDetails: {
      "300": {
        name: "Three Layer IBC Die 300 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "300 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "04 Nos.", "IBC Provision": "Die with IBC provision." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "325": {
        name: "Three Layer IBC Die 325 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "325 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "04 Nos.", "IBC Provision": "Die with IBC provision." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "350": {
        name: "Three Layer IBC Die 350 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "350 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "04 Nos.", "IBC Provision": "Die with IBC provision." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "375": {
        name: "Three Layer IBC Die 375 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "375 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "04 Nos.", "IBC Provision": "Die with IBC provision." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "400": {
        name: "Three Layer IBC Die 400 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "400 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "04 Nos.", "IBC Provision": "Die with IBC provision." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "425": {
        name: "Three Layer IBC Die 425 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "425 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "4 zones with independent temperature control.", "IBC Provision": "Die with IBC provision." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "450": {
        name: "Three Layer IBC Die 450 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "450 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "4 zones with independent temperature control.", "IBC Provision": "Die with IBC provision." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "500": {
        name: "Three Layer IBC Die 500 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "500 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "4 zones with independent temperature control.", "IBC Provision": "Die with IBC provision." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "550": {
        name: "Three Layer IBC Die 550 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "550 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "4 zones with independent temperature control.", "IBC Provision": "Die with IBC provision." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
      "600": {
        name: "Three Layer IBC Die 600 mm",
        techDesc: { ...THREE_LAYER_TECH_BASE, "Die Size": "600 mm diameter with lips of 2.3 mm gap.", "Heating Zones": "4 zones with independent temperature control.", "IBC Provision": "Die with IBC provision." },
        shortDesc: "Die head that provides even melt distribution and consistent film thickness.",
      },
    },
  },
];
