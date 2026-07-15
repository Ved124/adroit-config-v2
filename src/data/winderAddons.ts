// src/data/winderAddons.ts
import { MachineType, TechSpecMap } from "./winders";

export interface WinderAddon {
  id: string;
  name: string;
  category: string;
  machineTypes: MachineType[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
  isDynamic?: boolean;
  monoPrices?: Record<string, number>;
}

export const BACK_TO_BACK_PRICES: Record<string, number> = {
  "U20\"": 245000,
  "U24\"": 245000,
  "U32\"": 265000,
  "U40\"": 330000,
  "U50\"": 475000,
  "U72\"": 650000,
  "U110\"": 1250000,
  "D26\"": 210000,
  "D32\"": 250000,
  "D40\"": 310000,
  "D50\"": 425000,
  "D60\"": 600000,
};

export const AIR_SHAFT_PRICES: Record<string, number> = {
  "U20\"": 23000,
  "U24\"": 23000,
  "U32\"": 23000,
  "U40\"": 28000,
  "U50\"": 32000,
  "U72\"": 41000,
  "U110\"": 64000,
  "D26\"": 24000,
  "D32\"": 26000,
  "D40\"": 29000,
  "D50\"": 31000,
  "D60\"": 35000,
  "1000": 0,
  "1250": 0,
  "1350": 0,
  "1500": 0,
  "1750": 0,
  "1850": 0,
  "2000": 0,
  "2250": 0,
  "2500": 0,
  "2750": 0,
  "3000": 0,
};

export const WINDER_ADDONS: WinderAddon[] = [
  {
    id: "winder-manual-back-to-back-dynamic",
    name: "Back to back Surface Winder",
    category: "Winder Addons",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Winder/Back to Back Winder.png",
    cardDesc: "Add a Back-to-back surface winder for efficient winding.",
    price: 0,
    isDynamic: true,
    techDesc: {
      "Two Surface Winder": "Maximum web width of [W] mm with Manual Changeover.",
      "Roll diameter": "500 mm diameter or 350 kg weight in single up Which ever reaches first. Bow roller prior to drum roller for wrinkle free winding.",
      "Surface winder drive": "02 HP AC motor with variable frequency drive.",
      "Tension control": "Through Torque mode.",
      "Type of winder": "Two back to back type.",
      "Length counter meter": "Provided",
      "Trim Suction Blower": "Provided"
    }
  },
  {
    id: "addon-loadcell-tension",
    name: "Loadcell with HMI for Tension Control",
    category: "Winder Addons",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/loadcell.png",
    cardDesc: "Loadcell with HMI for Tension Control",
    price: 325000,
    techDesc: {
      "Type": "Loadcell feedback based automatic tension control.",
      "HMI Panel": "Tension Display on HMI Panel",
      "Loadcells": "Loadcells, amplifier, and PLC integration.",
      "Application": "Suitable for high tension applications"
    }
  },
  {
    id: "addon-air-shaft-dynamic",
    name: "Air Shaft Upgrade",
    category: "Winder Addons",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/loadcell.png",
    cardDesc: "Upgrade to Air Shaft for quick and easy roll changes, providing consistent tension and better grip.",
    price: 0,
    isDynamic: true,
    techDesc: {
      "Air Shaft": "Provided for quick and easy roll changes.",
      "Benefit": "Ensures consistent tension and provides a better grip on the core.",
      "Material": "High-strength alloy or aluminum construction."
    }
  }
];
