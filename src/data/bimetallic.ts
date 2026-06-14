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
  isDynamic: boolean;
}

export const SCREW_SIZES = ["35", "40", "45", "50", "55", "60", "65", "75", "90", "100"];

export const BIMETALLIC_BASE: BimetallicAddon = {
  id: "bimetallic-upgrade-all",
  name: "Bi-metallic Screw Barrel Upgrade",
  category: "Extruder Addons",
  machineTypes: ["mono", "aba", "3layer", "5layer"],
  image: "/images/Acessories/bimetallic_sb.jpg",
  cardDesc: "Upgrade to premium wear-resistant Bi-metallic screw and barrel.",
  price: 100000,
  isDynamic: false,
  techDesc: {
    "Material": "Bi-metallic screw and barrel",
    "Application": "Suitable for abrasive materials like CaCO3, Carbon Black, etc.",
    "Benefit": "Enhanced life and consistent melt quality over time."
  }
};
