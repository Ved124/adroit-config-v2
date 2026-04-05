// data/addons/corona.ts
// Corona Treaters as optional add-on items

export type MachineType = "mono" | "aba" | "3layer" | "5layer";
export interface TechSpecMap { [label: string]: string; }

export interface CoronaTreater {
  id: string;
  name: string;
  type: "single" | "dual" | "high-frequency" | "wide-web";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
  qty?: number;
  shortDesc?: string;
  isDynamic?: boolean; // New flag for dropdown-based selection
}

// Extracted from user image
export const CORONA_PRICES = {
  "1125": 425000,
  "1350": 550000,
  "1450": 550000,
  "1550": 625000,
  "1625": 715000,
  "1870": 715000,
  "1970": 715000,
  "2125": 850000,
  "2370": 975000,
  "2650": 1025000,
};

export const CORONA_BRANDS = ["Jain Electrotech", "IEEC"];

export const CORONA_TREATER_COMPONENTS: CoronaTreater[] = [
  {
    id: "corona-dynamic",
    name: "Corona Treater",
    type: "single",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/addons/corona/semi-auto.png",
    cardDesc: "Select Brand and Max Roller Width to add.",
    price: 0,
    qty: 1,
    isDynamic: true,
    techDesc: {
      "Brand": "Selectable (Jain Electro / IEEC)",
      "Size": "Selectable (1125mm - 2650mm)",
      "System": "Surface treatment system for plastic films.",
    },
    shortDesc: "High performance corona treater for superior surface treatment."
  }
];
