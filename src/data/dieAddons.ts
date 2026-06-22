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
}

export const DIE_SIZES = ["225", "275", "300", "325", "350", "375", "400", "425", "450", "500", "525", "550", "600", "650", "700", "750"];

export const DIE_ROTATION_PRICES: Record<string, number> = DIE_SIZES.reduce((acc, size) => ({
  ...acc,
  [size]: 600000
}), {});

export const DIE_ROTATION_ADDON: DieAddon = {
  id: "die-rotation-addon",
  name: "Die Rotation System",
  category: "Die Addons",
  machineTypes: ["mono", "aba", "3layer", "5layer"],
  image: "/images/Acessories/DieRotation.png",
  cardDesc: "Revolving die head system for even distribution of thickness variation.",
  price: 600000,
  isDynamic: true,
  techDesc: {
    "Die Rotation": "Provided"
  }
};
