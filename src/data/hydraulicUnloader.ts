// data/addons/hydraulicUnloader.ts
// Hydraulic roll unloading & handling systems (optional add-ons)

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface HydraulicUnloaderAddon {
  id: string;
  name: string;
  type: "basic" | "swing-arm" | "floor-trolley";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  qty?: number;
  techDesc: TechSpecMap;
}

export const HYDRAULIC_UNLOADER_ADDONS: HydraulicUnloaderAddon[] = [
  // ---------------- BASIC HYDRAULIC UNLOADER – MEDIUM ROLLS ----------------
  {
    id: "hyd-unloader-basic",
    name: "Hydraulic Roll Unloader – Basic",
    type: "basic",
    machineTypes: ["mono", "aba"],
    usedInModels: ["UNOFLEX-1000_1250", "DUOFLEX-750", "DUOFLEX-1000"],
    image: "/images/addons/hydraulic/unloader-basic.png",
    cardDesc:
      "Basic hydraulic roll unloader for safely unloading finished rolls from surface winder.",
    price: 0,
    qty: 1,
    techDesc: {
      "Application":
        "Assists operator in unloading finished film rolls from winder without manual lifting.",
      "Operation":
        "Hydraulic lifting platform raises/lower to winder level to receive roll.",
      "Capacity": "Suitable for medium rolls (typically up to ~400 kg).",
      "Control": "Simple up/down push button station near winder.",
      "Benefit": "Improves safety and reduces operator fatigue.",
    },
  },

  // ---------------- SWING ARM TYPE – HEAVIER ROLLS ----------------
  {
    id: "hyd-unloader-swingarm",
    name: "Hydraulic Swing Arm Roll Unloader",
    type: "swing-arm",
    machineTypes: ["aba", "3layer"],
    usedInModels: ["AE-1125", "AE-1350", "AE-1625"],
    image: "/images/addons/hydraulic/unloader-swingarm.png",
    cardDesc:
      "Swing arm type hydraulic unloader for heavier rolls and wider web lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Operation":
        "Hydraulically actuated swing arm picks roll from winder shafts and lowers to operator height.",
      "Capacity": "Designed for rolls up to approx. 400–600 kg (model dependent).",
      "Interface":
        "Mounted adjacent to winder frame; arm movement synchronized for safe operation.",
      "Controls":
        "Local control box with joystick / push buttons and emergency stop.",
      "Benefit":
        "Enables single operator handling for heavy rolls, reduces risk of injury.",
    },
  },

  // ---------------- FLOOR TROLLEY SYSTEM – LARGE 3L / FUTURE 5L ----------------
  {
    id: "hyd-unloader-trolley",
    name: "Hydraulic Roll Unloader with Floor Trolley",
    type: "floor-trolley",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-1870", "AE-2125", "AE-2370", "AE-2625"],
    image: "/images/addons/hydraulic/unloader-trolley.png",
    cardDesc:
      "Heavy duty hydraulic unloader with floor level trolley for very large rolls.",
    price: 0,
    qty: 1,
    techDesc: {
      "Application":
        "Used for unloading wide, heavy rolls from turret / surface winder and transferring to storage.",
      "Construction":
        "Hydraulic lifting cradle integrated with movable trolley or rail-guided platform.",
      "Capacity": "For rolls up to approx. 600 kg or more (model dependent).",
      "Operation":
        "Lift-lower and clamp release via hydraulic power pack; trolley moved manually or with drive.",
      "Safety":
        "Mechanical locks and safety valves provided as per standard practice.",
      "Benefit":
        "Essential for safe handling on high output industrial lines.",
    },
  },
];
