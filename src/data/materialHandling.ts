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
  scopeDesc?: string;
  isDynamic?: boolean;
  pricingType?: "size" | "brand" | "dropdown" | string;
  prices?: Record<string, number>;
  monoPrices?: Record<string, number>;
}

// Prices for Mixer Dryer: 100, 200, 300, 500 kg/hr (placeholder values)
export const MIXER_DRYER_PRICES: Record<string, number> = {
  "100": 155000,
  "200": 250000,
  "300": 290000,
  "500": 335000,
};

export const MIXER_PRICES: Record<string, number> = {
  "100": 140000,
  "200": 225000,
  "300": 285000,
  "500": 350000,
};

export const MIXER_DRYER_BRANDS = ["Adroit"];

export const HOPPER_LOADER_MULTI: Record<string, number> = {
  "1000": 195000,
  "1250": 195000,
  "1350": 195000,
  "1500": 195000,
  "1750": 235000,
  "1850": 235000,
  "2000": 235000,
  "2250": 235000,
  "2500": 275000,
}

export const HOPPER_LOADER_UNO_PRICES: Record<string, number> = {
  "U20\"": 62000,
  "U24\"": 62000,
  "U32\"": 62000,
  "U40\"": 62000,
  "U50\"": 62000,
  "U72\"": 75000,
  "U110\"": 75000,
};

export const HOPPER_LOADER_DUO_PRICES: Record<string, number> = {
  "D20\"": 120000, // flat tier (26-40 all share 120000)
  "D24\"": 120000,
  "D26\"": 120000,
  "D32\"": 120000,
  "D36\"": 120000,
  "D40\"": 120000,
  "D50\"": 105000,
  "D60\"": 135000,
};

export const HOPPER_DRYER_B_PRICES: Record<string, number> = {
  "D20\"": 65000, // matches D26/D32 tier
  "D24\"": 65000,
  "D26\"": 65000,
  "D32\"": 65000,
  "D36\"": 77500, // interpolated between D32 (65000) and D40 (90000)
  "D40\"": 90000,
  "D50\"": 90000,
  "D60\"": 105000,
};

export const MATERIAL_HANDLING_ADDONS: MaterialHandlingAddon[] = [

  {
    id: "hopper-loader-uno-dynamic",
    name: "Hopper Loader Uno",
    type: "hopper-loader",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/Hopper Loader Trio.png",
    cardDesc: "Single component automatic material loader for feeding system.",
    price: 0,
    isDynamic: true,
    qty: 1,
    pricingType: "size",
    prices: HOPPER_LOADER_UNO_PRICES,
    techDesc: {
      "Capacity": "Appropriate kg/hr loading speed.",
      "Material Type": "Virgin / Reprocess Granules.",
      "Conveying Method": "Vacuum conveying.",
      "Filter": "Integrated easy-clean filter system.",
    },
  },
  {
    id: "hopper-loader-duo-dynamic",
    name: "Hopper Loader Duo",
    type: "hopper-loader",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/Hopper Loader Trio.png", // Or appropriate image if available
    cardDesc: "Dual component automatic material loader for feeding system.",
    price: 0,
    isDynamic: true,
    qty: 1,
    pricingType: "size",
    prices: HOPPER_LOADER_DUO_PRICES,
    techDesc: {
      "Capacity": "Appropriate kg/hr loading speed.",
      "Material Type": "Virgin / Reprocess Granules.",
      "Conveying Method": "Vacuum conveying.",
      "Filter": "Integrated easy-clean filter system.",
    },
  },
  {
    id: "hopper-loader-300kg",
    name: "Hopper Loader Trio",
    type: "hopper-loader",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/Hopper Loader Trio.png",
    cardDesc: "Robust automatic material loader for feeding system.",
    price: 0,
    isDynamic: true,
    qty: 1,
    pricingType: "size",
    prices: HOPPER_LOADER_MULTI,
    techDesc: {
      "Capacity": "300 kg/hr loading speed.",
      "Material Type": "Virgin / Reprocess Granules.",
      "Conveying Method": "Vacuum conveying.",
      "Filter": "Integrated easy-clean filter system.",
    },
  },
  {
    id: "hopper-dryer-b",
    name: "Hopper Dryer for B",
    type: "hopper-loader", // wait, what type? hopper-loader is fine
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/Hopper Loader Trio.png",
    cardDesc: "Hopper Dryer specifically for layer B.",
    price: 0,
    isDynamic: true,
    qty: 1,
    pricingType: "size",
    prices: HOPPER_DRYER_B_PRICES,
    techDesc: {
      "Type": "Hopper Dryer",
      "Function": "Efficient moisture removal from granules."
    },
  },
  {
    id: "mixer-dynamic",
    name: "Vertical Granule Mixer",
    type: "mixer",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/Vertical Granule Mixer with Dryer.png",
    cardDesc: "Dynamic Vertical Granule Mixer (Adroit make)",
    price: 0,
    isDynamic: true,
    qty: 1,
    pricingType: "size",
    prices: MIXER_PRICES,
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
    image: "/images/Acessories/Vertical Granule Mixer with Dryer.png",
    cardDesc: "Dynamic Vertical Granule Mixer with Integrated Dryer system. (Adroit make)",
    price: 0,
    isDynamic: true,
    qty: 1,
    pricingType: "size",
    prices: MIXER_DRYER_PRICES,
    techDesc: {
      "Motor": "ABB (1 HP for 50-100 kg and 2 HP for 150-300 kg)",
      "Switch Gear": "SCHNEIDER",
      "Temp. Controller": "MULTISPAN",
      "Material of Construction": "MS Painted",
      "Drive": "Through belt and Pulley",
    },
  },
];
