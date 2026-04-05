// data/addons/materialHandling.ts
// Updated with professional dynamic selection for Mixer and static Hopper Loader

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export type MaterialAddonType = "mixer-dryer" | "hopper-loader";

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
  "100": 175000,
  "200": 250000,
  "300": 325000,
  "500": 450000,
};

export const MIXER_DRYER_BRANDS = ["Adroit"];

export const MATERIAL_HANDLING_ADDONS: MaterialHandlingAddon[] = [
  {
    id: "hopper-loader-300kg",
    name: "Hopper Loader 300kg",
    type: "hopper-loader",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/Vertical Granule Mixer with Dryer.JPG",
    cardDesc: "Robust automatic material loader for 300kg capacity feeding system.",
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
      "Make": "Adroit",
      "Features": "Combined mixing and drying in a single vertical unit.",
      "Construction": "Durable fabricated drum with insulation.",
      "Heating": "Electric heater with thermostat control.",
    },
  },
];
