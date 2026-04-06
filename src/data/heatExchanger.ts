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
  shortDesc?: string;
  isDynamic?: boolean;
}

export const HEAT_EXCHANGER_BRANDS = ["Adroit"];
export const HEAT_EXCHANGER_PRICES: { [key: string]: number } = {
  "150": 175000,
  "250": 250000,
};

export const HEAT_EXCHANGER_ADDONS: HeatExchangerAddon[] = [
  {
    id: "heat-exchanger-dynamic",
    name: "Heat Exchanger",
    type: "heat-exchanger",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/addons/chiller/heat-exchanger.png",
    cardDesc: "Select Capacity (kg).",
    price: 0,
    qty: 1,
    isDynamic: true,
    techDesc: {
      "Type": "Air-to-Water Heat Exchanger",
      "Function": "Efficient heat transfer for process air cooling.",
      "Construction": "Copper tubes with aluminum fins."
    },
  },
];
