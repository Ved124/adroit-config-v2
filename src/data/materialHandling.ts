// data/addons/materialHandling.ts
// Gravimetric dosing, mixer + dryer, hopper loader/dryer (optional add-ons)

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export type MaterialAddonType =
  | "gravimetric-doser"
  | "gravimetric-blender"
  | "mixer-dryer"
  | "hopper-loader"
  | "hopper-dryer";

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
}

export const MATERIAL_HANDLING_ADDONS: MaterialHandlingAddon[] = [
  // ========== GRAVIMETRIC DOSER – SMALL / MEDIUM LINES ==========
  {
    id: "grav-doser-2comp-small",
    name: "Gravimetric Doser – 2 Component (Small Line)",
    type: "gravimetric-doser",
    machineTypes: ["mono", "aba"],
    usedInModels: ["UNOFLEX-450", "UNOFLEX-750_900", "DUOFLEX-750"],
    image: "/images/Acessories/Vertical Granule Mixer with Dryer.JPG",
    cardDesc:
      "2-component gravimetric doser for masterbatch + reprocess control on small / medium lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Application":
        "Accurate dosing of masterbatch / additive into main extruder hopper.",
      "Components": "Up to 2 components (e.g. virgin + masterbatch).",
      "Control Principle": "Loss-in-weight with loadcell feedback.",
      "Accuracy": "Typical dosing accuracy ±0.3–0.5 % (material dependent).",
      "Control Interface": "Standalone controller with recipe storage.",
      "Throughput": "Sized for small/medium extruders (e.g. 35–55 mm).",
      "Mounting": "Directly mounted on extruder feed throat or hopper.",
    },
  },

  {
    id: "grav-doser-4comp-std",
    name: "Gravimetric Doser – 4 Component",
    type: "gravimetric-doser",
    machineTypes: ["mono", "aba", "3layer"],
    usedInModels: ["UNOFLEX-1000_1250", "DUOFLEX-1000", "AE-1125", "AE-1350"],
    image: "/images/Acessories/Vertical Granule Mixer with Dryer.JPG",
    cardDesc:
      "4-component gravimetric dosing system for co-ex and monolayer lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Application":
        "Simultaneous metering of virgin, regranulate and 2 masterbatches.",
      "Components": "Up to 4 materials, each hopper equipped with dosing screw.",
      "Control Principle": "Loss-in-weight, automatic refilling, closed loop.",
      "Accuracy": "±0.3 % or better under stable conditions.",
      "Throughput":
        "Sized for extruders up to ~65 mm (model dependent throughput).",
      "Control Panel":
        "Touch panel controller with recipe management, alarms and trending.",
      "Integration":
        "Can provide extruder throughput information to main line control.",
    },
  },

  {
    id: "grav-doser-6comp-high",
    name: "Gravimetric Blender – 6 Component (High Output)",
    type: "gravimetric-blender",
    machineTypes: ["aba", "3layer", "5layer"],
    usedInModels: ["AE-1625", "AE-1870", "AE-2125", "AE-2370", "AE-2625"],
    image: "/images/Acessories/Vertical Granule Mixer with Dryer.JPG",
    cardDesc:
      "High capacity 6-component gravimetric blender for multilayer film lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Application":
        "Central blending of multiple materials feeding 2–3 extruders.",
      "Components":
        "Up to 6 components (virgin, re-grind, masterbatch, slip, antiblock, etc.).",
      "Weighing": "Batch weighing with high-resolution loadcells.",
      "Accuracy": "Better than ±0.2–0.3 % on each component ratio.",
      "Control": "PLC + touch HMI, Ethernet / fieldbus communication.",
      "Data Logging":
        "Consumption logging, recipe printout (depending on model).",
      "Installation": "Mounted on mezzanine or above extruder hoppers.",
    },
  },

  // ========== GRANULE MIXER + DRYER ==========
  {
    id: "mixer-dryer-200kg",
    name: "Granule Mixer with Dryer – 200 kg",
    type: "mixer-dryer",
    machineTypes: ["mono", "aba"],
    usedInModels: ["UNOFLEX-750_900", "UNOFLEX-1000_1250", "DUOFLEX-750"],
    image: "/images/Acessories/Vertical Granule Mixer with Dryer.JPG",
    cardDesc: "Granule mixer with integrated heater for batch drying up to ~200 kg.",
    price: 0,
    qty: 1,
    techDesc: {
      "Capacity": "Approx. 150–200 kg per batch (material dependent).",
      "Construction": "MS / SS drum with top loading and bottom discharge.",
      "Mixing": "Paddle / ribbon type agitator driven by geared motor.",
      "Heating": "Electric heaters with thermostat for gentle drying.",
      "Application":
        "Pre-mixing and mild drying of granules, reprocess, masterbatch.",
    },
  },

  {
    id: "mixer-dryer-500kg",
    name: "Granule Mixer with Dryer – 500 kg",
    type: "mixer-dryer",
    machineTypes: ["aba", "3layer"],
    usedInModels: ["DUOFLEX-1000", "AE-1125", "AE-1350", "AE-1625"],
    image: "/images/Acessories/Vertical Granule Mixer with Dryer.JPG",
    cardDesc:
      "Large capacity granule mixer + dryer for higher throughput lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Capacity": "Approx. 400–500 kg per batch.",
      "Construction": "Robust fabricated drum with insulated outer shell.",
      "Drive": "Geared motor with suitable torque for heavy mixing.",
      "Heating": "Electric heater band or hot air circulation, thermostat controlled.",
      "Application": "Centralised mixing of virgin + re-grind + additives.",
    },
  },

  // ========== HOPPER LOADER + HOPPER DRYER ==========
  {
    id: "hopper-loader-single",
    name: "Hopper Loader – Single Station",
    type: "hopper-loader",
    machineTypes: ["mono", "aba", "3layer"],
    usedInModels: ["UNOFLEX-450", "UNOFLEX-750_900", "DUOFLEX-750", "AE-1125"],
    image: "/images/Acessories/Vertical Granule Mixer with Dryer.JPG",
    cardDesc:
      "Automatic hopper loader for feeding granules to one extruder hopper.",
    price: 0,
    qty: 1,
    techDesc: {
      "Application": "Automatic conveying of granules from floor bin to hopper.",
      "Blower": "Venturi / vacuum blower arrangement (model dependent).",
      "Control": "Timer based / level sensor based automatic loading.",
      "Filter": "Inline filter element with easy cleaning.",
      "Benefits": "Reduced manual handling, consistent hopper level.",
    },
  },

  {
    id: "hopper-loader-central",
    name: "Central Hopper Loader System",
    type: "hopper-loader",
    machineTypes: ["aba", "3layer", "5layer"],
    usedInModels: ["DUOFLEX-1000", "AE-1350", "AE-1625", "AE-1870"],
    image: "/images/Acessories/Vertical Granule Mixer with Dryer.JPG",
    cardDesc:
      "Central vacuum loader feeding multiple extruders from a common material station.",
    price: 0,
    qty: 1,
    techDesc: {
      "Stations": "Can feed 2–3 extruders (depending on configuration).",
      "Vacuum Pump": "Central pump with distribution manifold.",
      "Control": "Sequence control with priority logic, hopper level sensors.",
      "Benefits":
        "Clean material handling, reduced dust and manual material carrying.",
    },
  },

  {
    id: "hopper-dryer-50kg",
    name: "Hopper Dryer – 50 kg",
    type: "hopper-dryer",
    machineTypes: ["mono", "aba"],
    usedInModels: ["UNOFLEX-450", "UNOFLEX-750_900"],
    image: "/images/Acessories/Vertical Granule Mixer with Dryer.JPG",
    cardDesc: "Compact hopper dryer for moisture sensitive materials.",
    price: 0,
    qty: 1,
    techDesc: {
      "Capacity": "Approx. 50 kg material loading.",
      "Heating": "Electric heaters with temperature control.",
      "Air Flow": "Hot air circulation through granule bed.",
      "Application": "Drying of moisture prone materials prior to extrusion.",
    },
  },

  {
    id: "hopper-dryer-150kg",
    name: "Hopper Dryer – 150 kg",
    type: "hopper-dryer",
    machineTypes: ["aba", "3layer"],
    usedInModels: ["DUOFLEX-1000", "AE-1125", "AE-1350"],
    image: "/images/Acessories/Vertical Granule Mixer with Dryer.JPG",
    cardDesc:
      "Larger hopper dryer for higher throughput machines and multilayer lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Capacity": "Approx. 100–150 kg material.",
      "Insulation": "Insulated hopper to reduce heat loss.",
      "Control": "Digital temperature controller with safety cut-out.",
      "Application":
        "Ensures consistent moisture level for critical film grades.",
    },
  },
];
