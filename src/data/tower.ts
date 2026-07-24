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
  "2750": 3000000,
  "3000": 3500000,
};

export const TOWER_COMPONENTS: TowerComponent[] = [
  {
    id: "tower-dynamic",
    name: "Tower",
    isDynamic: true,
    pricingType: "size",
    prices: TOWER_PRICES,
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    usedInModels: [],
    image: "/images/tower.png",
    cardDesc: "Heavy duty MS structure with service platform and safety rails.",
    price: 1000000,
    techDesc: {
      "Structure": "Knock-down type tower structure.",
      "Platforms": "3-walk around platforms.",
      "Staircase": "Staircase with hand rails.",
      "Safety": "Hand rails and kick plates according to European safety standards.",
      "Idler rollers": "Set of idler aluminium rollers as per nip size.",
    },
  },
];
