// src/data/trimRecycling.ts

export type MachineType = "mono" | "aba" | "3layer" | "5layer";
export interface TechSpecMap { [label: string]: string; }

export interface TrimRecyclingAddon {
  id: string;
  name: string;
  type: string;
  machineTypes: MachineType[];
  image: string;
  cardDesc: string;
  price: number;
  qty?: number;
  techDesc: TechSpecMap;
  scopeDesc?: string;
  shortDesc?: string;
  isDynamic?: boolean;
}

export const TRIM_RECYCLING_ADDONS: TrimRecyclingAddon[] = [
  {
    id: "trim-recycling-addon",
    name: "Trim Recycling System",
    type: "trim-recycling",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/trim-recycling.png",
    cardDesc: "Reprocesses edge trim waste back into usable material.",
    price: 475000,
    qty: 1,
    isDynamic: false,
    techDesc: {
      "Function": "Recovers and reprocesses edge trim waste generated during winding/slitting.",
      "Process": "Trim is fed, granulated/compacted, and returned for reuse in the material feed.",
      "Benefit": "Reduces raw material waste and lowers per-kg production cost."
    },
    shortDesc: "Trim recycling system for reprocessing edge waste."
  }
];
