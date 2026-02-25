// data/addons/chiller.ts
// Cooling & Chiller Systems (Optional Add-ons)

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface ChillerAddon {
  id: string;
  name: string;
  type: "air-chiller" | "water-chiller" | "heat-exchanger" | "cooling-tower" | "circulation-system";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  qty?: number;
  techDesc: TechSpecMap;
  shortDesc?: string;
}

export const CHILLER_ADDONS: ChillerAddon[] = [
  // -----------------------------------------
  // AIR COOLED COMPACT CHILLER – SMALL LINES
  // -----------------------------------------
  {
    id: "air-chiller-3tr",
    name: "Air Cooled Chiller – 3 TR",
    type: "air-chiller",
    machineTypes: ["mono", "aba"],
    usedInModels: ["UNOFLEX-450", "UNOFLEX-750_900"],
    image: "/images/addons/chiller/air-3tr.png",
    cardDesc: "Compact 3 TR air-cooled chiller for monolayer machines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Cooling Capacity": "Approx. 3 TR (~10.5 kW) (material dependent)",
      "Compressor": "Hermetically sealed scroll compressor",
      "Condenser": "Air cooled condenser with axial fan",
      "Evaporator": "Plate type heat exchanger with insulated tank",
      "Pump": "Built-in circulation pump",
      "Application": "Small lines, general film cooling, die & air ring water circuits",
    },
    shortDesc: "Ideal for small monolayer extrusion lines.",
  },

  // -----------------------------------------
  // MID-SIZE AIR CHILLER
  // -----------------------------------------
  {
    id: "air-chiller-5tr",
    name: "Air Cooled Chiller – 5 TR",
    type: "air-chiller",
    machineTypes: ["aba", "3layer"],
    usedInModels: ["DUOFLEX-1000", "AE-1125", "AE-1350"],
    image: "/images/addons/chiller/air-5tr.png",
    cardDesc:
      "Medium capacity 5 TR air chiller for ABA & 3-layer lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Cooling Capacity": "Approx. 5 TR (~17.5 kW)",
      "Condenser": "Air cooled coil with forced draft fans",
      "Temperature Range": "10–20°C adjustable",
      "Application": "IBC cooling circuit + air ring + die temp control",
    },
    shortDesc: "Suitable for medium output ABA & 3-layer lines.",
  },

  // -----------------------------------------
  // WATER TYPE CHILLER – HIGH OUTPUT LINES
  // -----------------------------------------
  {
    id: "water-chiller-10tr",
    name: "Water Cooled Chiller – 10 TR",
    type: "water-chiller",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-1625", "AE-1870"],
    image: "/images/addons/chiller/water-10tr.png",
    cardDesc:
      "Heavy duty water-cooled chiller for industrial multi-layer lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Cooling Capacity": "Approx. 10 TR (~35 kW)",
      "Cooling Method": "Shell & tube exchanger + cooling tower",
      "Pump": "High flow chilled water pump for continuous duty",
      "Use Case":
        "High throughput film lines requiring stable die & IBC temperature",
      "Installation": "Outdoor cooling tower + indoor chiller skid",
    },
    shortDesc: "Designed for high output multi-layer extrusion lines.",
  },

  {
    id: "water-chiller-20tr",
    name: "Water Cooled Chiller – 20 TR",
    type: "water-chiller",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-2125", "AE-2370", "AE-2625"],
    image: "/images/addons/chiller/water-20tr.png",
    cardDesc:
      "Large capacity water chiller for wide web heavy output lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Cooling Capacity": "Approx. 20 TR (~70 kW)",
      "Heat Rejection": "Cooling tower required",
      "Monitoring": "Digital temp & pressure monitoring",
      "Applications": "Greenhouse film, stretch hood, lamination films",
    },
    shortDesc: "For wide web, high output multi-layer extrusion lines.",
  },

  // -----------------------------------------
  // HEAT EXCHANGER (NO CHILLER) – BUDGET OPTION
  // -----------------------------------------
  {
    id: "heat-exchanger-compact",
    name: "Heat Exchanger – Compact",
    type: "heat-exchanger",
    machineTypes: ["mono", "aba"],
    usedInModels: ["UNOFLEX-750_900", "DUOFLEX-750"],
    image: "/images/addons/chiller/heat-exchanger-small.png",
    cardDesc:
      "Compact plate heat exchanger for basic die + air ring cooling (no refrigeration).",
    price: 0,
    qty: 1,
    techDesc: {
      "Cooling Method": "Uses ambient chilled water (no compressor)",
      "Type": "Plate heat exchanger",
      "Use Case": "Low cost temperature control for small lines",
      "Flow": "Moderate flow rate, suitable for small 35–55mm extruders",
    },
    shortDesc: "Budget-friendly cooling without refrigeration.",
  },

  // -----------------------------------------
  // COOLING TOWER SET
  // -----------------------------------------
  {
    id: "cooling-tower-standard",
    name: "Cooling Tower System",
    type: "cooling-tower",
    machineTypes: ["aba", "3layer", "5layer"],
    usedInModels: ["AE-1350", "AE-1625", "AE-1870"],
    image: "/images/addons/chiller/cooling-tower.png",
    cardDesc:
      "Cooling tower for process water circulation to chiller / heat exchanger.",
    price: 0,
    qty: 1,
    techDesc: {
      "Construction": "FRP cooling tower with eliminators & fill media",
      "Pump": "High discharge water pump included",
      "Water Circuit":
        "Closed loop with storage tank + filter + return piping",
      "Application": "Supports die & air ring cooling loop",
    },
    shortDesc: "Efficient cooling tower for process water circulation.",
  },

  // -----------------------------------------
  // FULL CIRCULATION SET
  // -----------------------------------------
  {
    id: "circulation-set",
    name: "Cooling Water Circulation Set",
    type: "circulation-system",
    machineTypes: ["mono", "aba", "3layer"],
    usedInModels: ["UNOFLEX-1000_1250", "DUOFLEX-1000", "AE-1125"],
    image: "/images/addons/chiller/circulation-set.png",
    cardDesc:
      "Complete pipeline + valves + pump + tank set for cooling water handling.",
    price: 0,
    qty: 1,
    techDesc: {
      "Includes": "Pump, storage tank, valves, filters, return piping",
      "Purpose": "Distributes chilled water to die, air ring, gearbox, etc.",
      "Material": "MS / SS manifolds, insulated return lines",
      "Benefit": "Fully plumbed system reduces installation cost",
    },
    shortDesc: "All-in-one cooling water circulation solution.",
  },
];
