// src/data/winderAddons.ts
import { MachineType, TechSpecMap } from "./winders";

export interface WinderAddon {
  id: string;
  name: string;
  category: string;
  machineTypes: MachineType[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
}

export const WINDER_ADDONS: WinderAddon[] = [
  {
    id: "winder-manual-back-to-back-dynamic",
    name: "Back to back Surface Winder",
    category: "Winder Addons",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Winder/Back to back winder.png",
    cardDesc: "Add a Back-to-back surface winder for efficient winding.",
    price: 350000,
    techDesc: {
      "Type": "Back to back Surface Winder",
      "Actuation": "Manual Changeover."
    }
  },
  {
    id: "addon-loadcell-tension",
    name: "Loadcell upgrade",
    category: "Winder Addons",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/loadcell.png",
    cardDesc: "Upgrade winder tension control from torque to loadcell-based feedback for precise tension management.",
    price: 150000,
    techDesc: {
      "Type": "Loadcell feedback based automatic tension control.",
      "Benefit": "Precise tension control for thin and sensitive films.",
      "Components": "Loadcells, amplifier, and PLC integration."
    }
  }
];
