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
  "U20\"": 70000,
  "U24\"": 70000,
  "U32\"": 80000,
  "U40\"": 90000,
  "U50\"": 115000,
  "U72\"": 165000,
  "U110\"": 360000,
  "D26\"": 85000,
  "D32\"": 95000,
  "D40\"": 135000,
  "D50\"": 160000,
  "D60\"": 200000,
  "1120": 425000,
  "1370": 550000,
  "1450": 625000,
  "1620": 715000,
  "1870": 715000,
  "1970": 785000,
  "2120": 850000,
  "2370": 975000,
  "2620": 1025000,

};

export const CORONA_BRANDS = ["Jain Electrotech", "IEEC"];

export const CORONA_TREATER_COMPONENTS: CoronaTreater[] = [
  {
    id: "corona-dynamic",
    name: "Corona Treater",
    type: "single",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/coronatreater.jpg",
    cardDesc: "Select Brand and Max Roller Width to add.",
    price: 0,
    qty: 1,
    isDynamic: true,
    techDesc: {
      "Brand": "Selectable (Jain Electro / IEEC)",
      "Size": "Selectable (U20\" - U110\")",
      "System": "Surface treatment system for plastic films.",
    },
    shortDesc: "High performance corona treater for superior surface treatment."
  }
];
