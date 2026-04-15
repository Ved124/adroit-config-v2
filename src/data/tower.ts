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
    image: "/images/parts/tower.png",
    cardDesc: "Heavy duty MS structure with service platform and safety rails.",
    price: 1000000,
    techDesc: {
      "Structure": "Knock-down type tower structure.",
      "Tower Size": "TBD mm",
      "Platforms": "3-walk around platforms.",
      "Staircase": "600 mm wide staircase.",
      "Safety": "Hand rails and kick plates according to European safety standards.",
      "Idler rollers": "Set of 150 mm diameter idler aluminium rollers of TBD mm face width.",
    },
  },
];
