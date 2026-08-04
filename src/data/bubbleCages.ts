// data/bubbleCages.ts
// Beta component data for Bubble Cage units.

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface BubbleCageComponent {
  id: string;
  name: string;
  variant: "manual" | "motorized" | "pneumatic";
  segments: number;           // 4 / 6 / 9 etc.
  rows?: number;              // when applicable (e.g. 4 row)
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

export const MANUAL_BC_PRICES: Record<string, number> = {
  "550": 15000,
  "850": 25000,
  "1000": 35000,
  "1250": 55000,
  "1350": 70000,
  "1500": 85000,
  "1750": 125000,
  "1850": 150000,
  "2000": 175000,
  "2250": 225000,
  "2500": 300000,
  "2750": 350000,
  "3000": 500000,
};

export const OPEN_CLOSE_BC_PRICES: Record<string, number> = {
  "550": 125000,
  "850": 150000,
  "1000": 175000,
  "1250": 250000,
  "1350": 250000,
  "1500": 275000,
  "1750": 300000,
  "1850": 350000,
  "2000": 450000,
  "2250": 550000,
  "2500": 650000,
  "2750": 750000,
  "3000": 850000,
};

export const UP_DOWN_BC_PRICES: Record<string, number> = {
  "550": 250000,
  "850": 300000,
  "1000": 350000,
  "1250": 450000,
  "1500": 550000,
  "1750": 650000,
  "1850": 700000,
  "2000": 750000,
  "2250": 850000,
  "2500": 950000,
  "2750": 1050000,
  "3000": 1150000,
};

// Mono + ABA specific tiers for the Manual Bubble Cage, kept separate from
// MANUAL_BC_PRICES (which stays the live table for 3-layer/5-layer) so updating
// mono/ABA pricing can't accidentally reprice a 3-layer model that happens to
// sit at the same mm tier (e.g. INNOFLEX-1120 at 1000mm, INNOFLEX-1620 at
// 1500mm). Tiers above 1750mm are carried over unchanged from MANUAL_BC_PRICES
// so UNOFLEX-110 (2800mm -> 2750 tier) keeps its existing price.
export const MONO_ABA_MANUAL_BC_PRICES: Record<string, number> = {
  "500": 40000,
  "600": 50000,
  "750": 70000,
  "900": 80000,
  "1000": 100000,
  "1200": 140000,
  "1250": 140000, // UNOFLEX-50/50-65MM, DUOFLEX-50/50-65/55 — same as 1200mm tier
  "1500": 175000,
  "1750": 200000,
  "1850": 150000,
  "2000": 175000,
  "2250": 225000,
  "2500": 300000,
  "2750": 350000,
  "3000": 500000,
};

export const BUBBLE_CAGE_COMPONENTS: BubbleCageComponent[] = [
  // ---------- DYNAMIC BUBBLE CAGES ----------
  {
    id: "bc-manual-dynamic",
    name: "Manual Bubble Cage",
    variant: "manual",
    segments: 6,
    machineTypes: ["mono", "3layer", "5layer"],
    image: "/images/Bubble Cage/Manual Cage.png",
    cardDesc: "Select size to add manual bubble cage.",
    price: 0,
    isDynamic: true,
      pricingType: "size",
      prices: MANUAL_BC_PRICES,
    techDesc: {
      "Type": "Calibration bubble guide basket with 4 arms arranged to provide full support. Bubble contact is through PBT for minimum drag.",
      "Actuation of arms": "Manual open-close operation.",
      "Bubble width range": "750 to 1250 mm"
    },
    shortDesc: "Universal manual bubble cage with adjustable diameter."
  },
  {
    id: "bc-manual-dynamic-aba",
    name: "Manual Bubble Cage",
    variant: "manual",
    segments: 6,
    machineTypes: ["aba"],
    image: "/images/Bubble Cage/Manual Cage.png",
    cardDesc: "Select size to add manual bubble cage.",
    price: 0,
    isDynamic: true,
      pricingType: "size",
      prices: MANUAL_BC_PRICES,
    techDesc: {
      "Type": "Arms to support the bubble.",
    },
    shortDesc: "Universal manual bubble cage with adjustable diameter for ABA."
  },
  {
    id: "bc-open-close-dynamic",
    name: "Motorised Bubble Cage",
    variant: "motorized",
    segments: 6,
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Bubble Cage/OC Bubble Cage.png",
    cardDesc: "Select size to add motorized open-close bubble cage.",
    price: 0,
    isDynamic: true,
      pricingType: "size",
      prices: OPEN_CLOSE_BC_PRICES,
    techDesc: {
      "Type": "Calibration bubble guide basket arranged to provide full support. Bubble contact is through Silicon Sleeve rollers for minimum drag.",
      "Actuation of arms": "Motorized Open-Close operation.",
      "Film width range": "800 to 1600 mm"
    },
    shortDesc: "Motorized open-close bubble cage for precision control."
  },
  {
    id: "bc-up-down-dynamic",
    name: "Motorised Bubble Cage",
    variant: "motorized",
    segments: 6,
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Bubble Cage/UD Bubble Cage.png",
    cardDesc: "Select size to add motorized up-down & open-close bubble cage.",
    price: 0,
    isDynamic: true,
      pricingType: "size",
      prices: UP_DOWN_BC_PRICES,
    techDesc: {
      "Type": "Calibration bubble guide basket arranged to provide full support. Bubble contact is through PBT for minimum drag.",
      "Actuation of arms": "Motorized Up Down & Open-Close with Liner Actuator.",
      "Bubble width range": "1300 to 2250 mm"
    },
    shortDesc: "Full motorized bubble cage with vertical and radial adjustment."
  },
];
