// src/data/heatExchanger.ts

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface HeatExchangerAddon {
  id: string;
  name: string;
  type: "heat-exchanger";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  qty?: number;
  techDesc: TechSpecMap;
  scopeDesc?: string;
  shortDesc?: string;
  isDynamic?: boolean;
}

export const HEAT_EXCHANGER_BRANDS = ["Adroit"];
export const HEAT_EXCHANGER_PRICES: { [key: string]: number } = {
  "150": 175000,
  "250": 250000,
};

export const HEAT_EXCHANGER_UNO_PRICES: { [key: string]: number } = {
  "U20\"": 80000,
  "U24\"": 80000,
  "U32\"": 80000,
  "U40\"": 80000,
  "U50\"": 95000,
  "U72\"": 140000,
  "U110\"": 140000,

};

export const HEAT_EXCHANGER_DUO_PRICES: { [key: string]: number } = {
  "D20\"": 85000, // flat tier (26-40 all share 85000)
  "D24\"": 85000,
  "D26\"": 85000,
  "D32\"": 85000,
  "D36\"": 85000,
  "D40\"": 85000,
  "D50\"": 160000,
  "D60\"": 160000,
};

export const HEAT_EXCHANGER_ADDONS: HeatExchangerAddon[] = [
  {
    id: "heat-exchanger-dynamic",
    name: "Heat Exchanger",
    type: "heat-exchanger",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/Heat Exchanger.png",
    cardDesc: "Select Capacity (kg).",
    price: 0,
    qty: 1,
    isDynamic: true,
    techDesc: {
      "Type": "Air-to-Water Heat Exchanger",
      "Function": "Efficient heat transfer for process air cooling.",
      "Construction": "Copper tubes with aluminum fins."
    },
    shortDesc: "Efficient heat transfer for process air cooling."
  },
  {
    id: "heat-exchanger-uno",
    name: "Heat Exchanger Uno",
    type: "heat-exchanger",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/Heat Exchanger.png",
    cardDesc: "Select Capacity for Mono/ABA machines.",
    price: 0,
    qty: 1,
    isDynamic: true,
    techDesc: {
      "Type": "Air-to-Water Heat Exchanger",
      "Function": "Efficient heat transfer for process air cooling.",
      "Construction": "Copper tubes with aluminum fins."
    },
    shortDesc: "Efficient heat exchanger for Mono models."
  },
  {
    id: "heat-exchanger-duo",
    name: "Heat Exchanger Duo",
    type: "heat-exchanger",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/Heat Exchanger.png",
    cardDesc: "Select Capacity for ABA and Multilayer machines.",
    price: 0,
    qty: 1,
    isDynamic: true,
    techDesc: {
      "Type": "Air-to-Water Heat Exchanger",
      "Function": "Efficient heat transfer for process air cooling.",
      "Construction": "Copper tubes with aluminum fins."
    },
    shortDesc: "Efficient heat exchanger for ABA and Multilayer models."
  }
];
