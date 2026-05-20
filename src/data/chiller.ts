// data/addons/chiller.ts
// Cooling & Chiller Systems (Optional Add-ons)

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface ChillerAddon {
  id: string;
  name: string;
  type: "air-chiller" | "water-chiller" | "heat-exchanger" | "cooling-tower" | "circulation-system";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  qty?: number;
  techDesc: TechSpecMap;
  shortDesc?: string;
  isDynamic?: boolean;
}

export const CHILLER_BRANDS = ["Prasad", "Con Air"];

// Air Chiller prices based on machine size
export const PRASAD_WATER_CHILLER_PRICES: { [key: string]: number } = {
  "3 TR": 365690,
  "5 TR": 417565,
  "8 TR": 536395,
  "9 TR": 636285,
  "10.5 TR": 731445,
  "12 TR": 842700,
  "13.5 TR": 885310,
  "18 TR": 1083200,
  "22 TR": 1203975,
};

// Water Chiller prices based on machine size
export const PRASAD_AIR_CHILLER_PRICES: { [key: string]: number } = {
  "PBF 15L": 530145,
  "PBF 20L": 597465,
  "PBF 30L": 765000,
  "PBF 40L": 908820,
  "PBF 50L": 1018300,
  "PBF 60L": 1093950,
  "PBF 80L": 1304325,
};

export const CONAIR_AIR_CHILLER_PRICES: { [key: string]: number } = {
  "9 TR": 803450,
  "12 TR": 965785,
  "16 TR": 1204250,
  "23 TR": 1516805,
  "28 TR": 1857960,
};

export const CONAIR_WATER_CHILLER_PRICES: { [key: string]: number } = {
  "3 TR": 365690,
  "5 TR": 417565,
  "8 TR": 536395,
  "9 TR": 636285,
  "10.5 TR": 731445,
  "12 TR": 842700,
  "13.5 TR": 885310,
  "18 TR": 1083200,
  "22 TR": 1203975,
};

export const CHILLER_ADDONS: ChillerAddon[] = [
  {
    id: "chiller-air-dynamic",
    name: "Air Cooled Air Chiller",
    type: "air-chiller",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/addons/chiller/air-chiller.png",
    cardDesc: "Select Brand and Machine Size.",
    price: 0,
    qty: 1,
    isDynamic: true,
    techDesc: {
      "Type": "Refrigerated Air Cooling",
      "Function": "Cooling for main air ring and internal bubble cooling (IBC) air circuits.",
      "Control": "Automatic temperature regulation."
    },
  },
  {
    id: "chiller-water-dynamic",
    name: "Air Cooled Water Chiller",
    type: "water-chiller",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/addons/chiller/water-chiller.png",
    cardDesc: "Select Brand and Machine Size.",
    price: 0,
    qty: 1,
    isDynamic: true,
    techDesc: {
      "Type": "Refrigerated Water Cooling",
      "Function": "Supplies chilled water for die-head cooling and IBC heat exchangers.",
      "Portability": "Self-contained with pump and tank."
    },
  },
];
