// data/hauloffs.ts
// Beta component data for Haul-Off / Main Nip units.

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface HauloffComponent {
  id: string;
  name: string;
  variant: "vertical" | "horizontal" | "oscillating";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
  isDynamic?: boolean;
}

// Prices extracted from master list image
export const HAULOFF_PRICES: Record<string, number> = {
  "1250": 1100000,
  "1350": 1150000,
  "1500": 1200000,
  "1750": 1400000,
  "1850": 1500000,
  "2000": 1800000,
  "2250": 2500000,
  "2500": 2700000,
  "2750": 3200000,
  "3000": 3500000,
};

export const HAULOFF_COMPONENTS: HauloffComponent[] = [
  {
    id: "haul-vertical-compact",
    name: "Vertical Haul-Off (Compact)",
    variant: "vertical",
    machineTypes: ["mono", "3layer"],
    usedInModels: ["UNOFLEX-450", "UNOFLEX-750_900", "Innoflex-1350A"],
    image: "/images/parts/haul_2r.png",
    cardDesc:
      "Compact vertical haul-off for small and medium monolayer lines.",
    price: 0,
    techDesc: {
      "Construction":
        "The haul-off will be supplied as a compact assembly mounted above the die with adjustable platform.",
      "Main Nip Rollers":
        "2 Nos. rubber coated nip rollers mounted in bearings with pneumatic loading.",
      "Nip Roller Width": "Matched to machine layflat (typically 500–900 mm).",
      "Nip Roller Drive":
        "AC geared motor with variable frequency drive for line speed control.",
      "Collapsing Frames":
        "Side-mounted slat / PBT roller collapsing frame (as per configuration).",
      "Oscillation":
        "Optional manual oscillation arrangement for better roll geometry.",
      "Turnbars": "Optional aluminium turn bars for edge trimming / gusseting.",
    },
  },

  {
    id: "haul-horizontal-dynamic",
    name: "Horizontal Haul-Off",
    variant: "oscillating",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/parts/haul_osc.png",
    cardDesc: "Select size and technical specifications will update automatically.",
    price: 0,
    isDynamic: true,
    techDesc: {
      "Construction": "The haul off will be shipped in assembled parts.",
      "Main Nip rollers": "2 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
      "Nip roller width": "TBD mm",
      "Nip roller drive": "5 HP AC motor with variable frequency drive.",
      "Collapsing Frames": "PBT rollers.",
      "Idler rollers": "Adequate quantity as per layout.",
      "Oscillation": "360 degree with end limit switch sensing and override protection ensuring even thickness variation distribution on rolls giving excellent roll geometry.",
      "Turnbars": "02 Nos. Hard Anodized Aluminum roller mounted in haul off.",
    },
  },
];
