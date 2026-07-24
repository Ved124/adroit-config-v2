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
  scopeDesc?: string;
  isDynamic?: boolean;
}

export const WEB_GUIDE_PRICES = {
  "1000": 160000,
  "1250": 200000,
  "1350": 240000,
  "1500": 290000,
  "1750": 290000,
  "1850": 290000,
  "2000": 325000,
  "2250": 380000,
  "2500": 425000,
};

export const WEB_GUIDE_BRANDS = ["Adroit", "E+L"];

export const WEB_GUIDE_ADDONS: WebGuideAddon[] = [
  {
    id: "webguide-dynamic",
    name: "Web Guide",
    type: "standard-epc",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/e+l_webguide.jpg",
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
  {
    id: "webguide-hydro-pneumatic-dynamic",
    name: "Hydro Pneumatic Webguide",
    type: "standard-epc",
    machineTypes: ["aba"],
    image: "/images/Acessories/e+l_webguide.jpg",
    cardDesc: "Hydro Pneumatic Webguide system for ABA machine.",
    price: 0,
    qty: 1,
    isDynamic: true,
    techDesc: {
      "Type": "Hydro Pneumatic Webguide",
      "Application": "Suitable for high tension applications.",
      "Features": "Hydro-pneumatic system ensures smooth and precise web guiding.",
      "Sensor": "High resolution edge sensors with adjustable bracket.",
      "Actuator": "Heavy duty linear actuator with position feedback.",
      "Installation": "Typically mounted before secondary nip or winder infeed.",
    },
  },
];
