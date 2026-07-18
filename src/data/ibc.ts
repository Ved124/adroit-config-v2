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
    usedInModels: ["Innoflex-1620", "Innoflex-1870"],
    image: "https://res.cloudinary.com/kqver3iv/image/upload/v1784362055/adroit_configurator/Acessories/ibc_system.jpg",
    cardDesc: "Internal bubble cooling system with complete control.",
    price: 3000000,
    techDesc: {
      "IBC System": "Complete controls including sensors, control software.",
      "Blowers": "Inlet and Outlet Blowers Provided.",
      "IBC Hardware": "IBC pancakes, Silicone hoses, Manifolds, Gauges to be provided.",
    },
  },
];
