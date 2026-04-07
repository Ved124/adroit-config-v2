// data/addons/gauge.ts
// Thickness / Gauge Control Systems (Optional Add-ons)

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface GaugeControlAddon {
  id: string;
  name: string;
  type: "monitoring" | "auto-gauge" | "imported-auto" | "tension-loadcell" | "dancer";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  qty?: number;
  techDesc: TechSpecMap;
  shortDesc?: string;
}

export const GAUGE_ADDONS: GaugeControlAddon[] = [
  // --------------------------------------
  // BASIC GAUGE MONITORING PANEL
  // --------------------------------------
  {
    id: "gauge-basic-monitor",
    name: "Basic Thickness Monitoring Panel",
    type: "monitoring",
    machineTypes: ["mono", "aba"],
    usedInModels: ["UNOFLEX-750_900", "DUOFLEX-750"],
    image: "/images/addons/gauge/basic-monitor.png",
    cardDesc:
      "PID-based thickness monitoring panel for basic monolayer/ABA lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "System Type": "Passive thickness display (no auto adjustment)",
      "Sensor": "Single zone thickness sensor mapping bubble profile",
      "Control": "PID-based temperature control only (no closed loop)",
      "Display": "Digital gauge feedback on operator console",
      "Use Case": "Basic LD/LLD general packaging film",
    },
    shortDesc: "Basic thickness monitoring panel with PID control for stable film gauge in monolayer and ABA extrusion lines.",
  },

  // --------------------------------------
  // AUTO GAUGE CONTROL – MID RANGE
  // --------------------------------------
  {
    id: "gauge-auto-control",
    name: "Automatic Thickness Control System",
    type: "auto-gauge",
    machineTypes: ["aba", "3layer"],
    usedInModels: ["DUOFLEX-1000", "Innoflex-1125", "Innoflex-1350"],
    image: "/images/addons/gauge/auto-gauge.png",
    cardDesc:
      "Closed-loop thickness control with automatic die & air ring correction.",
    price: 0,
    qty: 1,
    techDesc: {
      "System Type": "Closed loop gauge control system",
      "Control Method": "Automatic die bolt heater control + zone correction",
      "Sensors": "Dual scanner profile measurement (rotational mapping)",
      "Display": "Profile map + deviation heatmap",
      "Output": "Auto feedback to heater zones for thickness balancing",
      "Use Case":
        "Skin-core-skin ABA film, lamination film, food packaging",
    },
    shortDesc: "Automatic thickness control system with closed-loop feedback for consistent film gauge in ABA and 3-layer extrusion lines.",
  },

  // --------------------------------------
  // IMPORTED HIGH-PRECISION GAUGE CONTROL
  // --------------------------------------
  {
    id: "gauge-imported-full",
    name: "Imported Automatic Thickness Control System",
    type: "imported-auto",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["Innoflex-1625", "Innoflex-1870", "Innoflex-2125", "Innoflex-2370", "Innoflex-2625"],
    image: "/images/addons/gauge/imported-auto.png",
    cardDesc:
      "Imported auto gauge system for industrial multilayer films with high accuracy.",
    price: 0,
    qty: 1,
    techDesc: {
      "System Type": "High precision imported gauge system",
      "Resolution": "Micron-level accuracy with multi-zone compensation",
      "Sensors": "Laser / capacitive scanning system (model dependent)",
      "Control": "Real-time closed loop to die zones + air ring + IBC",
      "Integration": "PLC + HMI based; recipe upload & trend monitoring",
      "Use Case": "Stretch hood, lamination, agriculture & barrier films",
      "Compliance": "CE certified hardware (model dependent)",
    },
    shortDesc: "Imported automatic thickness control system with high precision for multilayer extrusion lines producing industrial films.",
  },

  // --------------------------------------
  // LOADCELL TENSION CONTROL
  // --------------------------------------
  {
    id: "tension-loadcell",
    name: "Loadcell Based Tension Control",
    type: "tension-loadcell",
    machineTypes: ["aba", "3layer", "5layer"],
    usedInModels: ["Innoflex-1125", "Innoflex-1625", "Innoflex-2125"],
    image: "/images/addons/gauge/loadcell-tension.png",
    cardDesc:
      "Closed loop tension control using loadcell feedback from winder section.",
    price: 0,
    qty: 1,
    techDesc: {
      "Control Type": "Closed loop tension control with feedback",
      "Sensor": "Dual loadcell integrated with winder control",
      "Loop": "Automatic torque/dancer correction",
      "Application":
        "High performance rolls with uniform winding tension",
      "Benefits": "Reduced gauge bands and improved roll geometry",
    },
    shortDesc: "Loadcell based tension control system for consistent web tension and improved roll quality in multilayer extrusion lines.",
  },

  // --------------------------------------
  // DANCER SYSTEM FOR WEB TENSION
  // --------------------------------------
  {
    id: "tension-dancer",
    name: "Dancer System for Web Tension",
    type: "dancer",
    machineTypes: ["mono", "aba"],
    usedInModels: ["UNOFLEX-1000_1250", "DUOFLEX-1000"],
    image: "/images/addons/gauge/dancer.png",
    cardDesc:
      "Dancer-based mechanical tension stabilization system for winding.",
    price: 0,
    qty: 1,
    techDesc: {
      "Control Type": "Mechanical dancer with spring/pneumatic counterbalance",
      "Function": "Smoothens tension oscillations before winding",
      "Sensor": "Potentiometer feedback optional",
      "Benefit":
        "Reduces wrinkles, improves layflat & roll compactness",
      "Use Case": "Economical tension solution for low-mid speed lines",
    },
    shortDesc: "Dancer system for mechanical web tension stabilization, reducing wrinkles and improving roll quality in monolayer and ABA extrusion lines.",
  },
];
