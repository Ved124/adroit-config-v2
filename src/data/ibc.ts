// data/ibc.ts
// Internal Bubble Cooling Systems

import { MachineType, TechSpecMap } from "./extruders";

export interface IBCSystem {
  id: string;
  name: string;
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
}

export const IBC_COMPONENTS: IBCSystem[] = [
  {
    id: "ibc-system",
    name: "IBC System",
    machineTypes: ["aba", "3layer", "5layer"],
    usedInModels: ["AE-1625", "AE-1870"],
    image: "/images/components/ibc/ibc-single.png",
    cardDesc: "Internal bubble cooling system with complete control.",
    price: 0,
    techDesc: {
      "IBC System": "Complete controls including sensors, control software.",
      "Blower": "Inlet and Outlet Blowers Provided.",
      "IBC Hardware": "IBC pancakes, Silicone hoses, Manifolds, Gauges to be provided.",
    },
  },
];
