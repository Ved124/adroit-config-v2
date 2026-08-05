// src/data/tower.ts
// Tower / Platform components

export type MachineType = "mono" | "aba" | "3layer" | "5layer";
export interface TechSpecMap {
  [label: string]: string;
}

export interface TowerComponent {
  id: string;
  name: string;
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  isDynamic?: boolean;
  pricingType?: string;
  prices?: Record<string, number>;
  techDesc: TechSpecMap;
  scopeDesc?: string;
}

export const TOWER_PRICES: Record<string, number> = {
  // Mono/ABA sizes, re-keyed from the mm tier below by each model's machineWidth
  // (layflatWidthMm), same convention as MAIN_NIP_PRICES / PANEL_DYNAMIC_PRICES.
  "U20": 1000000,  // UNOFLEX-20 (450mm -> 1000 tier)
  "U24": 1000000,  // UNOFLEX-24 (550mm -> 1000 tier)
  "U32": 1000000,  // UNOFLEX-32 (750mm -> 1000 tier)
  "U40": 1000000,  // UNOFLEX-40 / UNOFLEX-40-55MM (1000mm tier)
  "U50": 1000000,  // UNOFLEX-50 / UNOFLEX-50-65MM (1250mm tier, same price as 1000 tier)
  "U72": 1500000,  // UNOFLEX-72 (1800mm -> 1850 tier)
  "U110": 3500000, // UNOFLEX-110 (2800mm, beyond table range -> largest tier)
  "D20": 1000000,  // DUOFLEX-20 (450mm -> 1000 tier)
  "D24": 1000000,  // DUOFLEX-24 (550mm -> 1000 tier)
  "D32": 1000000,  // DUOFLEX-32 (750mm -> 1000 tier)
  "D36": 1000000,  // DUOFLEX-36 (850mm -> 1000 tier)
  "D40": 1000000,  // DUOFLEX-40 (950mm -> 1000 tier)
  "D50": 1000000,  // DUOFLEX-50 / DUOFLEX-50-65/55 (1250mm tier)
  "1000": 1000000,
  "1250": 1000000,
  "1350": 1150000,
  "1500": 1300000,
  "1750": 1400000,
  "1850": 1500000,
  "2000": 1800000,
  "2250": 2200000,
  "2500": 2500000,
  "2750": 3500000,
  "3000": 3500000,
};

// Mono + ABA specific tiers, kept separate from TOWER_PRICES (which stays the
// live table for 3-layer/5-layer) so updating mono/ABA pricing can't accidentally
// reprice a 3-layer model that happens to sit at the same mm tier (e.g.
// INNOFLEX-1120 at 1000mm, INNOFLEX-1620 at 1500mm). Tiers above 1750mm are
// carried over unchanged from TOWER_PRICES so UNOFLEX-110 (2800mm -> 3000 tier)
// keeps its existing price.
export const MONO_ABA_TOWER_PRICES: Record<string, number> = {
  "500": 85000,
  "600": 100000,
  "750": 125000,
  "900": 170000,
  "1000": 200000,
  "1200": 300000,
  "1250": 300000, // UNOFLEX-50/50-65MM, DUOFLEX-50/50-65/55 — same as 1200mm tier
  "1500": 375000,
  "1750": 450000,
  "1850": 1500000,
  "2000": 1800000,
  "2250": 2200000,
  "2500": 2500000,
  "2750": 3500000,
  "3000": 3500000,
};

const TOWER_TECH_DESC: TechSpecMap = {
  "Structure": "Knock-down type tower structure.",
  "Platforms": "3-walk around platforms.",
  "Staircase": "Staircase with hand rails.",
  "Safety": "Hand rails and kick plates according to European safety standards.",
  "Idler rollers": "Set of idler aluminium rollers as per nip size.",
};

export const TOWER_COMPONENTS: TowerComponent[] = [
  {
    id: "tower-dynamic",
    name: "Tower",
    isDynamic: true,
    pricingType: "size",
    prices: TOWER_PRICES,
    // Mono/ABA use their own dedicated components (tower-mono-dynamic /
    // tower-aba-dynamic) below so their pricing is editable independently in
    // Machine Manager without affecting 3-layer/5-layer.
    machineTypes: ["3layer", "5layer"],
    usedInModels: [],
    image: "/images/tower.png",
    cardDesc: "Heavy duty MS structure with service platform and safety rails.",
    price: 1000000,
    techDesc: TOWER_TECH_DESC,
  },
  {
    id: "tower-mono-dynamic",
    name: "Tower",
    isDynamic: true,
    pricingType: "size",
    prices: { ...MONO_ABA_TOWER_PRICES },
    machineTypes: ["mono"],
    usedInModels: [],
    image: "/images/tower.png",
    cardDesc: "Heavy duty MS structure with service platform and safety rails.",
    price: 1000000,
    techDesc: TOWER_TECH_DESC,
  },
  {
    id: "tower-aba-dynamic",
    name: "Tower",
    isDynamic: true,
    pricingType: "size",
    prices: { ...MONO_ABA_TOWER_PRICES },
    machineTypes: ["aba"],
    usedInModels: [],
    image: "/images/tower.png",
    cardDesc: "Heavy duty MS structure with service platform and safety rails.",
    price: 1000000,
    techDesc: TOWER_TECH_DESC,
  },
];
