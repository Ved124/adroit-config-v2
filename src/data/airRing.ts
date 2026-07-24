// data/airRing.ts
// Beta data for Air Rings (Mono, ABA, 3-Layer, 5-Layer)
// Updated to support dynamic category-based selection with dropdown sizes.

export type MachineType = "mono" | "aba" | "3layer" | "5layer";
export interface TechSpecMap { [label: string]: string; }

export interface AirRingComponent {
  id: string;
  name: string;
  type: "single" | "dual" | "bichannel" | "high-output" | "ibc-compatible";
  blowerPowerHP: number;
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
  scopeDesc?: string;
  shortDesc?: string;
  isDynamic?: boolean;
  pricingType?: string;
  prices?: Record<string, number>;
}

// Prices extracted from master list image
export const G_AIR_RING_PRICES: Record<string, number> = {
  "50": 0,
  "70": 0,
  "90": 0,
  "100": 0,
  "125": 0,
  "150": 0,
  "200": 0,
  "225": 0,
  "250": 0,
  "275": 0,
  "300": 350000,
  "325": 375000,
  "350": 400000,
  "375": 425000,
  "400": 450000,
  "425": 0,
  "450": 0,
  "475": 0,
  "500": 0,
  "525": 0,
  "550": 0,
  "600": 0,
  "650": 0,
  "700": 0,
  "750": 0,
};

export const AIR_RING_PRICES: Record<string, number> = {
  "50": 0,
  "70": 0,
  "90": 0,
  "100": 0,
  "125": 0,
  "150": 0,
  "200": 0,
  "225": 0,
  "250": 0,
  "275": 0,
  "300": 425000,
  "325": 475000,
  "350": 500000,
  "375": 525000,
  "400": 575000,
  "425": 0,
  "450": 600000,
  "475": 650000,
  "500": 750000,
  "525": 0,
  "550": 850000,
  "600": 950000,
  "650": 975000,
  "700": 1025000,
  "750": 1075000,
};

export const DR_AIR_RING_PRICES: Record<string, number> = {
  "50": 0,
  "70": 0,
  "90": 0,
  "100": 0,
  "125": 0,
  "150": 0,
  "200": 0,
  "225": 0,
  "250": 0,
  "275": 0,
  "300": 500000,
  "325": 600000,
  "350": 650000,
  "375": 700000,
  "400": 725000,
  "425": 800000,
  "450": 800000,
  "475": 0,
  "500": 950000,
  "525": 0,
  "550": 0,
  "600": 1000000,
  "650": 0,
  "700": 0,
  "750": 0,
};

export const AIR_RING_COMPONENTS: AirRingComponent[] = [
  {
    id: "airring-g-dynamic",
    name: "G AIRRING",
    type: "single",
    blowerPowerHP: 10,
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Airring/Airring.png",
    cardDesc: "Select Die size to add.",
    price: 0,
    isDynamic: true,
    pricingType: "size",
    prices: G_AIR_RING_PRICES,
    techDesc: {
      "Design": "Gamma Air Ring",
      "Construction": "Precision machined aluminum body.",
      "Cooling": "High efficiency lip profile.",
    },
    scopeDesc: "Air Ring Package consisting of highly efficient air ring, distributor manifold, High Pressure 3 HP Blower.",
    shortDesc: "Gamma Air Ring for optimal bubble cooling.",
  },
  {
    id: "airring-standard-dynamic",
    name: "AIRRING",
    type: "single",
    blowerPowerHP: 15,
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Airring/Airring.png",
    cardDesc: "Select Die size to add.",
    price: 0,
    isDynamic: true,
    pricingType: "size",
    prices: AIR_RING_PRICES,
    techDesc: {
      "Design": "Standard Series Air Ring",
      "Construction": "Robust aluminum alloy structure.",
      "Cooling": "Uniform air distribution for stable bubble.",
    },
    shortDesc: "Standard high performance air ring.",
  },
  {
    id: "airring-dr-dynamic",
    name: "DR AIRRING (Dual Lip)",
    type: "dual",
    blowerPowerHP: 20,
    machineTypes: ["3layer", "5layer"],
    image: "/images/Airring/Airring.png",
    cardDesc: "Select Die size to add.",
    price: 0,
    isDynamic: true,
    pricingType: "size",
    prices: DR_AIR_RING_PRICES,
    techDesc: {
      "Construcion": "Aluminum body aerodynamic type Dual air cooling ring for cooling.\nThe airing had circular casing with many entry ports 4 efficient cooling.",
      "Blower": "20 HP AC variable frequency drive.",
      "Additional details": "Differential pressure gauge and temperature gauge to record and setting the bubble. Aerodynamic shaped Air distributor."
    },
    shortDesc: "Dual lip air ring for high capacity co-extruded films.",
  },
  {
    id: "airring-dr-dynamic-aba",
    name: "DR AIRRING (Dual Lip)",
    type: "dual",
    blowerPowerHP: 7.5,
    machineTypes: ["aba"],
    image: "/images/Airring/Airring.png",
    cardDesc: "Select Die size to add.",
    price: 0,
    isDynamic: true,
    pricingType: "size",
    prices: DR_AIR_RING_PRICES,
    techDesc: {
      "Construcion": "Aluminum body aerodynamic type dual lip air cooling ring.\nThe airing had circular casing with many entry ports 4 efficient cooling.",
      "Blower": "7.5 HP with inlet air filter.",
    },
    scopeDesc: "Air Ring Package consisting of highly efficient air ring, distributor manifold, High Pressure 5 HP Blower.",
    shortDesc: "Dual lip air ring for high capacity ABA co-extruded films.",
  },
];
