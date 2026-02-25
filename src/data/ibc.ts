// data/ibc.ts
// Internal Bubble Cooling Systems

import { MachineType, TechSpecMap } from "./extruders";

export interface IBCSystem {
  id: string;
  name: string;
  stages: 1 | 2;
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
}

export const IBC_COMPONENTS: IBCSystem[] = [
  {
    id: "ibc-single-stage",
    name: "IBC System – Single Stage",
    stages: 1,
    machineTypes: ["aba", "3layer"],
    usedInModels: ["AE-1625", "AE-1870"],
    image: "/images/components/ibc/ibc-single.png",
    cardDesc: "Single stage internal bubble cooling system.",
    price: 0,
    techDesc: {
      "Blower": "Dedicated high pressure fan with chilled air supply.",
      "Air Path": "Internal upflow duct with return passage.",
      "Control": "Basic manual control system.",
      "Sensors": "Film diameter feedback optional.",
      "Usage": "Improves cooling efficiency for medium output co-ex lines.",
    },
  },

  {
    id: "ibc-dual-stage",
    name: "IBC System – Double Stage",
    stages: 2,
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-2125", "AE-2370", "AE-2625"],
    image: "/images/components/ibc/ibc-dual.png",
    cardDesc: "Dual stage IBC system with automatic pressure control.",
    price: 0,
    techDesc: {
      "Blower": "Two-stage blower system with chilled air loop.",
      "Cooling Efficiency": "Higher frost-line stability & thinner gauge capability.",
      "Sensors": "Closed-loop diameter + pressure feedback sensors.",
      "Control": "PLC + HMI based system with recipe storage.",
      "Safety": "Over-pressure protection & auto-venting.",
      "Application": "High-speed multilayer film lines.",
    },
  }
];
