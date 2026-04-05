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
  isDynamic?: boolean;
}

export const WEB_GUIDE_PRICES = {
  "1125": 160000,
  "1350": 200000,
  "1450": 200000,
  "1550": 240000,
  "1625": 290000,
  "1870": 290000,
  "1970": 290000,
  "2125": 325000,
  "2370": 380000,
  "2650": 425000,
};

export const WEB_GUIDE_BRANDS = ["Adroit", "E+L"];

export const WEB_GUIDE_ADDONS: WebGuideAddon[] = [
  {
    id: "webguide-dynamic",
    name: "Web Guide",
    type: "standard-epc",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/addons/webguide/webguide-standard.png",
    cardDesc: "Digital Edge Positioning Control (EPC) system.",
    price: 0,
    qty: 1,
    isDynamic: true,
    techDesc: {
      "Function": "Maintains film edge position before winding / slitting to ensure neat roll edges.",
      "Sensor": "High resolution edge sensors with adjustable bracket.",
      "Actuator": "Heavy duty linear actuator with position feedback.",
      "Installation": "Typically mounted before secondary nip or winder infeed.",
    },
  },
];
