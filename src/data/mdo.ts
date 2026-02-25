// data/addons/mdo.ts
// MDO (Machine Direction Orientation) systems – optional add-ons

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface MDOAddon {
  id: string;
  name: string;
  type: "compact" | "inline" | "high-output";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  qty?: number;
  techDesc: TechSpecMap;
}

export const MDO_ADDONS: MDOAddon[] = [
  // ---------------- COMPACT MDO – SMALL/MEDIUM LINES ----------------
  {
    id: "mdo-compact",
    name: "MDO Unit – Compact",
    type: "compact",
    machineTypes: ["mono", "aba"],
    usedInModels: ["UNOFLEX-1000_1250", "DUOFLEX-750", "DUOFLEX-1000"],
    image: "/images/addons/mdo/mdo-compact.png",
    cardDesc:
      "Compact MDO unit for basic film orientation and gauge reduction on small/medium lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Application":
        "Machine direction orientation of thin films for strength and stiffness improvement.",
      "Configuration":
        "Pre-heating zone + stretching zone + cooling zone in a compact frame.",
      "Stretch Ratio": "Typical 2:1 to 4:1 (application dependent).",
      "Rollers":
        "Chrome plated and rubber covered rollers with temperature control on heating section.",
      "Drive":
        "Individual AC drive for main stretching section with speed ratio control.",
      "Installation":
        "Mounted after blown film take-off / collapsing then re-wound at separate winder.",
    },
  },

  // ---------------- INLINE MDO – CO-EX / 3-LAYER ----------------
  {
    id: "mdo-inline-std",
    name: "MDO Unit – Inline (Standard)",
    type: "inline",
    machineTypes: ["aba", "3layer"],
    usedInModels: ["AE-1125", "AE-1350", "AE-1625"],
    image: "/images/addons/mdo/mdo-inline.png",
    cardDesc:
      "Inline MDO unit for ABA / 3-layer lamination and high dart FFS films.",
    price: 0,
    qty: 1,
    techDesc: {
      "Application":
        "Orientation of co-extruded film for lamination, FFS and high dart applications.",
      "Zones":
        "Multiple pre-heat rollers, stretching roller pair and post-cooling rollers.",
      "Temperature Control":
        "Electrical heating on pre-heat rolls with PID temperature controllers.",
      "Stretch Ratio":
        "Adjustable ratio via independent drives on pre- and post-stretch sections.",
      "Web Handling":
        "Precise nip control, edge guides and tension control through the MDO frame.",
      "Integration":
        "Integrated with main line speed reference; coordinated ramp up/down.",
    },
  },

  // ---------------- HIGH OUTPUT / WIDE WEB MDO ----------------
  {
    id: "mdo-high-output",
    name: "MDO Unit – High Output / Wide Web",
    type: "high-output",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-1870", "AE-2125", "AE-2370", "AE-2625"],
    image: "/images/addons/mdo/mdo-high-output.png",
    cardDesc:
      "Heavy duty MDO unit for wide web multilayer film, designed for high line speeds.",
    price: 0,
    qty: 1,
    techDesc: {
      "Application":
        "Production of oriented films for stretch hood, high strength lamination and industrial packaging.",
      "Working Width": "Up to machine layflat (e.g. 1750–2500 mm, model dependent).",
      "Rollers":
        "Large diameter chrome plated rolls, supported on heavy duty bearings.",
      "Drive System":
        "Multiple AC vector drives with closed loop synchronization between sections.",
      "Stretch Ratio":
        "Wide adjustment range with recipe-based setpoints from HMI.",
      "Cooling":
        "Efficient post-cooling zone with chilled water rollers / air knives (depending on configuration).",
      "Integration":
        "Fully integrated into main PLC/HMI with recipe management, alarms and trending.",
    },
  },
];
