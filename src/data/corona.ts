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
  scopeDesc?: string;
  qty?: number;
  shortDesc?: string;
  isDynamic?: boolean; // New flag for dropdown-based selection
}

// Extracted from user image
export const CORONA_PRICES = {
  "U20\"": 65000,
  "U24\"": 75000,
  "U32\"": 85000,
  "U40\"": 110000,
  "U50\"": 130000,
  "U72\"": 150000,
  "U110\"": 360000,
  "D20\"": 65000, // matches D26 tier (mirrors U20=U24 sharing the smallest tier)
  "D24\"": 75000, // matches D26 tier
  "D26\"": 75000,
  "D32\"": 850000,
  "D36\"": 110000, // interpolated between D32 (95000) and D40 (135000)
  "D40\"": 110000,
  "D50\"": 150000,
  "D60\"": 180000,
  "1000": 425000,
  "1250": 550000,
  "1350": 625000,
  "1500": 715000,
  "1750": 715000,
  "1850": 785000,
  "2000": 850000,
  "2250": 975000,
  "2500": 1025000,

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
