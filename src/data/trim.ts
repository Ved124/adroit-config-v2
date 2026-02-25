// data/addons/trim.ts
// Trim handling equipment: trim suction blower + trim winder (add-ons only)

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface TrimAddon {
  id: string;
  name: string;
  type: "trim-blower" | "trim-winder";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  qty?: number;
  techDesc: TechSpecMap;
}

export const TRIM_ADDONS: TrimAddon[] = [
  // ---------- TRIM SUCTION BLOWER – SMALL / MEDIUM LINES ----------
  {
    id: "trim-blower-standard",
    name: "Trim Suction Blower – Standard",
    type: "trim-blower",
    machineTypes: ["mono", "aba"],
    usedInModels: ["UNOFLEX-750_900", "UNOFLEX-1000_1250", "DUOFLEX-750"],
    image: "/images/addons/trim/trim-blower-standard.png",
    cardDesc:
      "Trim suction blower for conveying edge trims from secondary nip to trim winder / collection.",
    price: 0,
    qty: 1,
    techDesc: {
      "Application":
        "Used to extract side trims generated at secondary nip or slitting station.",
      "Blower Type": "Centrifugal air blower with sheet metal housing.",
      "Power": "Approx. 2–3 HP AC motor (model dependent).",
      "Ducting":
        "Flexible / rigid duct from slitting point to cyclonic separator / trim winder.",
      "Installation":
        "Mounted near winder or at convenient location; includes necessary bends and duct supports.",
      "Benefit":
        "Keeps working area clean, reduces manual handling of trims.",
    },
  },

  // ---------- TRIM SUCTION BLOWER – WIDE WEB ----------
  {
    id: "trim-blower-heavy",
    name: "Trim Suction Blower – Heavy Duty",
    type: "trim-blower",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-1625", "AE-1870", "AE-2125", "AE-2370", "AE-2625"],
    image: "/images/addons/trim/trim-blower-heavy.png",
    cardDesc:
      "Heavy duty trim blower for wide 3-layer / 5-layer lines with higher trim load.",
    price: 0,
    qty: 1,
    techDesc: {
      "Blower Type": "Heavy duty centrifugal blower with high static pressure.",
      "Power": "3–5 HP AC motor with starter / VFD as required.",
      "Trim Capacity":
        "Designed to handle continuous side trims from both edges at high line speeds.",
      "Discharge":
        "Trim can be directed to trim winder, baler or collection bin.",
      "Additional Features":
        "Filter / separator where required to avoid dust in trim area.",
    },
  },

  // ---------- TRIM WINDER – SMALL / MEDIUM ----------
  {
    id: "trim-winder-standard",
    name: "Trim Winder – Standard",
    type: "trim-winder",
    machineTypes: ["mono", "aba", "3layer"],
    usedInModels: ["UNOFLEX-1000_1250", "DUOFLEX-1000", "AE-1125", "AE-1350"],
    image: "/images/addons/trim/trim-winder-standard.png",
    cardDesc:
      "Single station trim winder for narrow edge trims, driven by small AC motor.",
    price: 0,
    qty: 1,
    techDesc: {
      "Application":
        "Used for winding edge trims coming from side slitters / secondary nip.",
      "Stations": "Typically single station narrow width winder.",
      "Drive": "Small AC motor with torque control / VFD.",
      "Maximum Trim Width": "Up to ~100 mm per side (model dependent).",
      "Core Sizes": "Normally 3\" paper core (others on request).",
      "Control":
        "Manual speed control; can be synchronized with line speed if required.",
    },
  },

  // ---------- TRIM WINDER – HEAVY DUTY / WIDE ----------
  {
    id: "trim-winder-heavy",
    name: "Trim Winder – Heavy Duty",
    type: "trim-winder",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-1625", "AE-1870", "AE-2125", "AE-2370", "AE-2625"],
    image: "/images/addons/trim/trim-winder-heavy.png",
    cardDesc:
      "Heavy duty trim winder for wide, high-speed lines with continuous trims.",
    price: 0,
    qty: 1,
    techDesc: {
      "Application":
        "For continuous winding of trims at high speed and higher trim thickness.",
      "Stations": "Single / dual station configuration depending on requirement.",
      "Drive":
        "AC motor with torque mode operation; basic tension control included.",
      "Integration":
        "Can be interlocked with trim blower for automatic start/stop.",
      "Roll Diameter":
        "Up to ~500 mm trim roll (depending on trim thickness and width).",
    },
  },
];
