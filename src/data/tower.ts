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
  usedInModels?: string[];     // e.g. ["AE-1125", "AE-1625"]
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
}

export const TOWER_COMPONENTS: TowerComponent[] = [
  {
    id: "tower_std",
    name: "Tower – Standard",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    usedInModels: [], // fill later per model (AE-1125, etc.)
    image: "/images/parts/tower_std.png",
    cardDesc: "Standard tower with platform and access ladders.",
    price: 180000,
    techDesc: {
      "Structure":
        "Fabricated MS structure with platforms and interconnecting ladders.",
      "Levels":
        "Suitable for standard bubble heights of mono / ABA / 3-layer lines.",
      "Finish": "Primer + industrial enamel paint.",
      "Safety":
        "Hand rails and toe guards provided on all platforms (where applicable).",
    },
  },
  {
    id: "tower_h",
    name: "Tower – High",
    machineTypes: ["aba", "3layer", "5layer"],
    usedInModels: [],
    image: "/images/parts/tower_h.png",
    cardDesc: "High tower structure for tall bubble and high output lines.",
    price: 260000,
    techDesc: {
      "Structure":
        "Heavy duty tower designed for higher bubble height and wider web.",
      "Application":
        "3-layer and above high output lines with higher frost line.",
      "Access":
        "Multiple service platforms with ladders and safety rails.",
      "Integration":
        "Provision for mounting bubble cage, collapsing frame and haul-off.",
    },
  },
];
