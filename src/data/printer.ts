// src/data/printer.ts

export type MachineType = "mono" | "aba" | "3layer" | "5layer";
export interface TechSpecMap { [label: string]: string; }

export interface PrinterAddon {
  id: string;
  name: string;
  type: string;
  machineTypes: MachineType[];
  image: string;
  cardDesc: string;
  price: number;
  qty?: number;
  techDesc: TechSpecMap;
  shortDesc?: string;
  isDynamic?: boolean;
}

export const PRINTER_ADDONS: PrinterAddon[] = [
  {
    id: "printer-addon",
    name: "Printer",
    type: "printer",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "https://res.cloudinary.com/kqver3iv/image/upload/v1784362075/adroit_configurator/Acessories/printer.png",
    cardDesc: "Add an inline printer for branding and coding.",
    price: 40000,
    qty: 1,
    isDynamic: false,
    techDesc: {
      "Type": "Inline flexographic or coding printer",
      "Function": "Provides printing capabilities directly on the film.",
      "Benefit": "Ideal for basic branding, logos, or barcode printing."
    },
    shortDesc: "Inline printer for film branding and coding."
  }
];
