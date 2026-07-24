// data/mainNip.ts
// Component data for Main Nip and Collapsing Frame

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface MainNipComponent {
  id: string;
  name: string;
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
  scopeDesc?: string;
  isDynamic?: boolean;
  pricingType?: string;
  prices?: Record<string, number>;
}

// Pricing for Main Nip + Collapsing Frame units (all lines).
// mm-keyed entries are looked up directly from each model's machineWidth (layflatWidthMm)
// by the dynamic-sizing logic in ConfigContext.jsx, uniformly across every machine type.
// U#/D# entries are the same real prices re-keyed to each mono/ABA model's own code, for
// the manual size dropdown on the Selection page (so a rep sees "U20"/"D26" instead of a
// raw mm number) — e.g. U20 = the price for UNOFLEX-20's machineWidth (450mm -> 500 tier).
export const MAIN_NIP_PRICES: Record<string, number> = {
  // Mono model sizes (re-keyed from the mm tier below, matching each model's machineWidth)
  "U20": 180000,   // UNOFLEX-20 (450mm -> 500 tier)
  "U24": 210000,   // UNOFLEX-24 (550mm -> 600 tier)
  "U32": 260000,   // UNOFLEX-32 (750mm -> 800 tier)
  "U40": 350000,   // UNOFLEX-40 / UNOFLEX-40-55MM (1000mm tier)
  "U50": 420000,   // UNOFLEX-50 / UNOFLEX-50-65MM (1250mm tier)
  "U72": 660000,   // UNOFLEX-72 (1800mm -> 1850 tier)
  "U110": 1400000, // UNOFLEX-110 (2800mm -> 3000 tier)
  // ABA model sizes (re-keyed the same way)
  "D20": 180000,   // DUOFLEX-20 (450mm -> 500 tier)
  "D24": 210000,   // DUOFLEX-24 (550mm -> 600 tier)
  "D32": 260000,   // DUOFLEX-32 (750mm -> 800 tier)
  "D36": 300000,   // DUOFLEX-36 (850mm -> 900 tier)
  "D40": 350000,   // DUOFLEX-40 (950mm -> 1000 tier)
  "D50": 420000,   // DUOFLEX-50 / DUOFLEX-50-65/55 (1250mm tier)
  // mm-keyed sizes (used directly for automatic preset sizing, all machine types)
  "500": 180000,
  "600": 210000,
  "800": 260000,
  "900": 300000,
  "1000": 350000,
  "1250": 420000,
  "1350": 460000,
  "1500": 520000,
  "1750": 600000,
  "1850": 660000,
  "2000": 750000,
  "2250": 900000,
  "2500": 1050000,
  "2750": 1200000,
  "3000": 1400000,
};

export const MAIN_NIP_COMPONENTS: MainNipComponent[] = [
  {
    id: "main-nip-cf-dynamic",
    name: "Main Nip & Collapsing Frame",
    isDynamic: true,
    pricingType: "size",
    prices: MAIN_NIP_PRICES,
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    usedInModels: [],
    image: "/images/MainNip/MainNip.png",
    cardDesc: "Select size and technical specifications will update automatically. Includes collapsing frame and main nip rollers.",
    price: 0,
    techDesc: {
      "Main Nip rollers": "2 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
      "Nip roller width": "TBD mm",
      "Nip roller drive": "1-2 HP AC motor with variable frequency drive.",
      "Collapsing Frames": "PBT roller / Wooden Slates frame.",
      "Idler rollers": "Adequate quantity as per layout.",
    },
  },
];
