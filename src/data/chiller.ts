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
export const WATER_CHILLER_PRICES: { [key: string]: number } = {
  "1125": 325000,
  "1350": 325000,
  "1450": 325000,
  "1625": 325000,
  "1870": 325000,
  "1970": 325000,
  "2125": 325000,
  "2370": 325000,
  "2650": 325000,
};

// Water Chiller prices based on machine size
export const AIR_CHILLER_PRICES: { [key: string]: number } = {
  "1125": 655000,
  "1350": 790000,
  "1450": 790000,
  "1625": 985000,
  "1870": 1085000,
  "1970": 1085000,
  "2125": 1250000,
  "2370": 1250000,
  "2650": 1250000,
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
