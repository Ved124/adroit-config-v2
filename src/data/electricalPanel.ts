// data/addons/electricalPanel.ts
// Electrical panel, drives & automation packages (optional but typically selected)

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface ElectricalAddon {
  id: string;
  name: string;
  type: "basic-panel" | "ac-drive-panel" | "plc-hmi" | "advanced-plc";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  qty?: number;
  isDynamic?: boolean;
  techDesc: TechSpecMap;
  scopeDesc?: string;
  shortDesc?: string;
  pricingType?: "size" | "brand" | "dropdown";
  prices?: Record<string, number>;
}

export const PANEL_DYNAMIC_PRICES: Record<string, number> = {
  // Mono/ABA sizes, re-keyed from the mm tier below by each model's machineWidth
  // (layflatWidthMm), the same way the dynamic-sizing logic looks them up automatically.
  "U20": 1100000,  // UNOFLEX-20 (450mm -> 1000 tier)
  "U24": 1100000,  // UNOFLEX-24 (550mm -> 1000 tier)
  "U32": 1100000,  // UNOFLEX-32 (750mm -> 1000 tier)
  "U40": 1100000,  // UNOFLEX-40 / UNOFLEX-40-55MM (1000mm tier)
  "U50": 1350000,  // UNOFLEX-50 / UNOFLEX-50-65MM (1250mm tier)
  "U72": 1970000,  // UNOFLEX-72 (1800mm -> 1850 tier)
  "U110": 2620000, // UNOFLEX-110 (2800mm, beyond table range -> largest tier)
  "D20": 1100000,  // DUOFLEX-20 (450mm -> 1000 tier)
  "D24": 1100000,  // DUOFLEX-24 (550mm -> 1000 tier)
  "D32": 1100000,  // DUOFLEX-32 (750mm -> 1000 tier)
  "D36": 1100000,  // DUOFLEX-36 (850mm -> 1000 tier)
  "D40": 1100000,  // DUOFLEX-40 (950mm -> 1000 tier)
  "D50": 1350000,  // DUOFLEX-50 / DUOFLEX-50-65/55 (1250mm tier)
  // Existing 3/5 layer sizes
  "1000": 1100000,
  "1250": 1350000,
  "1350": 1450000,
  "1500": 1650000,
  "1750": 1870000,
  "1850": 1970000,
  "2000": 2120000,
  "2250": 2370000,
  "2500": 2620000,
};

export const ELECTRICAL_ADDONS: ElectricalAddon[] = [
  {
    id: "panel-dynamic",
    name: "Electrical & Control Panel",
    type: "advanced-plc",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Panel/Panel.png",
    cardDesc:
      "Advanced control panel for all lines. Select size/model to match your machine.",
    price: 0,
    qty: 1,
    isDynamic: true,
    pricingType: "size",
    prices: PANEL_DYNAMIC_PRICES,
    techDesc: {
      "Panel Type":
        "Floor mounted MS powder coated enclosure with integrated cooling.",
      "Temperature Control":
        "PID temperature controllers (brand specific).",
      "Drives":
        "AC variable frequency drives for extruder and downstream equipment.",
      "Automation":
        "Relay logic / PLC based automation depending on model size.",
      "Protection":
        "MCBs, contactors, overload relays, SSRs, and emergency stop circuits.",
      "Indicators":
        "Comprehensive digital monitoring for all critical parameters.",
      "Supply":
        "Suitable for 3 phase, 415 V, 50 Hz AC mains (or as specified).",
    },
    scopeDesc: "Complete extrusion controls on main panel with Cold start protection.",
    shortDesc: "Advanced control panel with sizing.",
  },
];
