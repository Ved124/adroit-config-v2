// src/data/tower.ts
// Tower / Platform components

export type MachineType = "mono" | "aba" | "3layer" | "5layer";
export interface TechSpecMap {
  [label: string]: string;
}

export interface TowerComponent {
  id: string;
  name: string;
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  isDynamic?: boolean;
  techDesc: TechSpecMap;
}

export const TOWER_PRICES: Record<string, number> = {
  "1000": 1000000,
  "1250": 1000000,
  "1350": 1150000,
  "1500": 1300000,
  "1750": 1400000,
  "1850": 1500000,
  "2000": 1800000,
  "2250": 2200000,
  "2500": 2500000,
  "2750": 3000000,
  "3000": 3500000,
};

export const TOWER_COMPONENTS: TowerComponent[] = [
  {
    id: "tower-dynamic",
    name: "Tower",
    isDynamic: true,
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    usedInModels: [],
    image: "https://res.cloudinary.com/kqver3iv/image/upload/v1784362511/adroit_configurator/tower.png",
    cardDesc: "Heavy duty MS structure with service platform and safety rails.",
    price: 1000000,
    techDesc: {
      "Structure": "Knock-down type tower structure.",
      "Platforms": "3-walk around platforms.",
      "Staircase": "Staircase with hand rails.",
      "Safety": "Hand rails and kick plates according to European safety standards.",
      "Idler rollers": "Set of idler aluminium rollers as per nip size.",
    },
  },
  {
    id: "tower_std",
    name: "Tower / Platform",
    isDynamic: false,
    machineTypes: ["mono", "aba"],
    usedInModels: [],
    image: "https://res.cloudinary.com/kqver3iv/image/upload/v1784362511/adroit_configurator/tower.png",
    cardDesc: "Standard MS tower structure with walk-around platform, staircase and safety handrails for ABA / mono lines.",
    price: 600000,
    techDesc: {
      "Structure": "Knock-down type tower structure fabricated in mild steel.",
      "Platforms": "Walk-around platform with grating.",
      "Staircase": "Staircase with hand rails.",
      "Safety": "Hand rails and kick plates.",
      "Idler rollers": "Set of idler aluminium rollers as per layout.",
    },
  },
];
