// data/addons/webGuide.ts
// Edge Position Control / Web Guide systems (optional add-ons)

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface WebGuideAddon {
  id: string;
  name: string;
  type: "basic-epc" | "standard-epc" | "heavy-epc";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  qty?: number;
  techDesc: TechSpecMap;
}

export const WEB_GUIDE_ADDONS: WebGuideAddon[] = [
  // ---------------- BASIC EPC – SMALL / MEDIUM LINES ----------------
  {
    id: "webguide-basic",
    name: "Web Guide – Basic EPC",
    type: "basic-epc",
    machineTypes: ["mono", "aba"],
    usedInModels: ["UNOFLEX-450", "UNOFLEX-750_900", "DUOFLEX-750"],
    image: "/images/addons/webguide/webguide-basic.png",
    cardDesc:
      "Basic edge position control (EPC) unit for monolayer and small ABA lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Function":
        "Maintains film edge position before winding / slitting to ensure neat roll edges.",
      "Sensor": "Infrared / ultrasonic edge sensor (model dependent).",
      "Actuator": "Electro-mechanical actuator with guided slide frame.",
      "Installation Position":
        "Typically mounted before secondary nip or winder infeed.",
      "Control": "Standalone EPC controller with manual offset adjustment.",
      "Application":
        "Shopping bags, liners, basic lamination films with moderate speeds.",
    },
  },

  // ---------------- STANDARD EPC – CO-EX / 3-LAYER ----------------
  {
    id: "webguide-standard",
    name: "Web Guide – Standard EPC System",
    type: "standard-epc",
    machineTypes: ["aba", "3layer"],
    usedInModels: ["DUOFLEX-1000", "AE-1125", "AE-1350", "AE-1625"],
    image: "/images/addons/webguide/webguide-standard.png",
    cardDesc:
      "Standard EPC system for ABA and 3-layer blown film lines with higher speeds.",
    price: 0,
    qty: 1,
    techDesc: {
      "Function":
        "Precise edge guiding to maintain web alignment through secondary nip and winder.",
      "Sensors":
        "High resolution edge sensors with adjustable bracket (left/right selection).",
      "Actuator":
        "Heavy duty linear actuator with position feedback to EPC controller.",
      "Guide Frame":
        "Roller guide assembly with lateral movement to correct film path.",
      "Integration":
        "EPC controller integrated or interlocked with winder section.",
      "Application":
        "FFS film, lamination film, milk film and co-ex structures.",
    },
  },

  // ---------------- HEAVY DUTY EPC – WIDE WEB / HIGH SPEED ----------------
  {
    id: "webguide-heavy",
    name: "Web Guide – Heavy Duty EPC System",
    type: "heavy-epc",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-1870", "AE-2125", "AE-2370", "AE-2625"],
    image: "/images/addons/webguide/webguide-heavy.png",
    cardDesc:
      "Heavy duty EPC for wide web 3-layer / 5-layer lines and industrial films.",
    price: 0,
    qty: 1,
    techDesc: {
      "Function":
        "Maintains accurate web alignment on wide and heavy rolls at high speed.",
      "Sensors":
        "Pair of high precision edge sensors with adjustable stand.",
      "Actuator":
        "Heavy duty servo or motorized actuator with robust linear guides.",
      "Guide Frame":
        "Reinforced web guide frame designed for wide web tension and roll weight.",
      "Integration":
        "Can be linked to main line PLC / HMI for alarm & status display.",
      "Application":
        "Stretch hood film, pallet hood film, greenhouse film, industrial packaging.",
    },
  },
];
