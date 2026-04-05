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

// Placeholder prices based on kg/hr output
export const CHILLER_PRICES: { [key: string]: number } = {
  "100": 325000,
  "200": 450000,
  "300": 575000,
  "400": 700000,
  "500": 850000,
  "600": 975000,
  "800": 1250000,
  "1000": 1500000,
};

export const CHILLER_ADDONS: ChillerAddon[] = [
  {
    id: "chiller-air-dynamic",
    name: "Air Cooled Air Chiller",
    type: "air-chiller",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/addons/chiller/air-chiller.png",
    cardDesc: "Select Brand and Output Capacity (kg/hr).",
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
    cardDesc: "Select Brand and Output Capacity (kg/hr).",
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
