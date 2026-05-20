// data/addons/materialHandling.ts
// Updated with professional dynamic selection for Mixer and static Hopper Loader

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export type MaterialAddonType = "mixer-dryer" | "mixer" | "hopper-loader";

export interface MaterialHandlingAddon {
  id: string;
  name: string;
  type: MaterialAddonType;
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  qty?: number;
  techDesc: TechSpecMap;
  isDynamic?: boolean;
}

// Prices for Mixer Dryer: 100, 200, 300, 500 kg/hr (placeholder values)
export const MIXER_DRYER_PRICES: Record<string, number> = {
  "100": 165000,
  "200": 250000,
  "300": 310000,
  "500": 375000,
};

export const MIXER_PRICES: Record<string, number> = {
  "100": 140000,
  "200": 225000,
  "300": 285000,
  "500": 350000,
};

export const MIXER_DRYER_BRANDS = ["Adroit"];

export const MATERIAL_HANDLING_ADDONS: MaterialHandlingAddon[] = [
  {
    id: "hopper-loader-300kg",
    name: "Hopper Loader Trio",
    type: "hopper-loader",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/Hopper Loader.JPG",
    cardDesc: "Robust automatic material loader for feeding system.",
    price: 195000,
    qty: 1,
    techDesc: {
      "Capacity": "300 kg/hr loading speed.",
      "Material Type": "Virgin / Reprocess Granules.",
      "Conveying Method": "Vacuum conveying.",
      "Filter": "Integrated easy-clean filter system.",
    },
  },
  {
    id: "mixer-dynamic",
    name: "Vertical Granule Mixer",
    type: "mixer",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/Vertical Granule Mixer with Dryer.JPG",
    cardDesc: "Dynamic Vertical Granule Mixer (Adroit make)",
    price: 0,
    isDynamic: true,
    qty: 1,
    techDesc: {
      "Motor": "ABB (1 HP for 50-100 kg and 2 HP for 150-300 kg)",
      "Switch Gear": "SCHNEIDER",
      "Temp. Controller": "MULTISPAN",
      "Material of Construction": "MS Painted",
      "Drive": "Through belt and Pulley",
    },
  },
  {
    id: "mixer-dryer-dynamic",
    name: "Vertical Granule Mixer with Dryer",
    type: "mixer-dryer",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/Vertical Granule Mixer with Dryer.JPG",
    cardDesc: "Dynamic Vertical Granule Mixer with Integrated Dryer system. (Adroit make)",
    price: 0,
    isDynamic: true,
    qty: 1,
    techDesc: {
      "Motor": "ABB (1 HP for 50-100 kg and 2 HP for 150-300 kg)",
      "Switch Gear": "SCHNEIDER",
      "Temp. Controller": "MULTISPAN",
      "Material of Construction": "MS Painted",
      "Drive": "Through belt and Pulley",
    },
  },
];
