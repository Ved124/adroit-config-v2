// src/data/dieAddons.ts
import { MachineType, TechSpecMap } from "./dies";

export interface DieAddon {
  id: string;
  name: string;
  category: string;
  machineTypes: MachineType[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
  isDynamic: boolean;
  monoPrices?: Record<string, number>;
}

export const DIE_SIZES = ["200", "225", "275", "300", "325", "350", "375", "400", "425", "450", "500", "525", "550", "600", "650", "700", "750"];

export const DIE_ROTATION_PRICES: Record<string, number> = {
  "U20\"": 195000,
  "U24\"": 195000,
  "U32\"": 195000,
  "U40\"": 205000,
  "U50\"": 235000,
  "U72\"": 280000,
  "U110\"": 315000,
  "D26\"": 350000,
  "D32\"": 350000,
  "D40\"": 350000,
  "D50\"": 350000,
  "D60\"": 350000,
};

export const ADDITIONAL_LIP_PRICES: Record<string, number> = {
  "U20\"": 95000,
  "U24\"": 95000,
  "U32\"": 95000,
  "U40\"": 135000,
  "U50\"": 270000,
  "U72\"": 375000,
  "U110\"": 635000,
  "D26\"": 95000,
  "D32\"": 95000,
  "D40\"": 125000,
  "D50\"": 190000,
  "D60\"": 365000,
};

export const DIE_ROTATION_ADDON: DieAddon = {
  id: "die-rotation-addon",
  name: "Die Rotation System",
  category: "Die Addons",
  machineTypes: ["mono", "aba", "3layer", "5layer"],
  image: "/images/Acessories/DieRotation.png",
  cardDesc: "Revolving die head system for even distribution of thickness variation.",
  price: 0,
  isDynamic: true,
  techDesc: {
    "Die Rotation": "Provided"
  }
};

export const ADDITIONAL_LIP_SET_ADDON: DieAddon = {
  id: "additional-lip-set-addon",
  name: "Additional Lip Set with Inserts",
  category: "Die Addons",
  machineTypes: ["mono", "aba", "3layer", "5layer"],
  image: "/images/Acessories/die_lip.png", // Or a relevant image
  cardDesc: "Additional Lip Set with Inserts for versatile production.",
  price: 0,
  isDynamic: true,
  techDesc: {
    "Additional Lip Set": "Provided with Inserts"
  }
};

export const DIE_ADDONS: DieAddon[] = [
  DIE_ROTATION_ADDON,
  ADDITIONAL_LIP_SET_ADDON
];
