// src/data/bimetallic.ts
import { MachineType, TechSpecMap } from "./extruders";

export interface BimetallicAddon {
  id: string;
  name: string;
  category: string;
  machineTypes: MachineType[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
  scopeDesc?: string;
  isDynamic: boolean;
}

export const BIMETALLIC_PRICES = {
  "45": 50000,
  "50": 100000,
  "55": 125000,
  "65": 150000,
  "75": 225000
};

export const SCREW_SIZES = Object.keys(BIMETALLIC_PRICES);

export const BIMETALLIC_BASE: BimetallicAddon = {
  id: "bimetallic-upgrade",
  name: "Bi-metallic Screw Barrel Upgrade",
  category: "Extruder Addons",
  machineTypes: ["mono", "aba", "3layer", "5layer"],
  image: "/images/Acessories/bimetallic_sb.jpg",
  cardDesc: "Upgrade to premium wear-resistant Bi-metallic screw and barrel.",
  price: 0,
  isDynamic: true,
  techDesc: {
    "Material": "Bi-metallic screw and barrel",
    "Application": "Suitable for abrasive materials like CaCO3, Carbon Black, etc.",
    "Benefit": "Enhanced life and consistent melt quality over time."
  }
};
