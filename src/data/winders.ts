// data/winders.ts
// Beta component data for Secondary Nip & Dynamic Winders.

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface WinderComponent {
  category?: string;
  id: string;
  name: string;
  variant: "secondary-nip" | "surface-manual" | "surface-semi-auto" | "surface-auto" | "turret-auto";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
  isDynamic?: boolean;
}

// Prices extracted from spreadsheet image
export const MANUAL_BACK_TO_BACK_PRICES: Record<string, number> = {
  "850": 500000,
  "950": 600000,
  "1000": 700000,
  "1250": 700000,
  "1350": 800000,
  "1500": 1000000,
  "1750": 1200000,
  "1850": 1325000,
  "2000": 1500000,
  "2250": 2400000,
  "2500": 2800000,
  "2750": 3200000,
  "3000": 4000000,
};

export const SURFACE_WINDER_PRICES: Record<string, number> = {
  "1000": 850000,
  "1250": 850000,
  "1350": 1000000,
  "1500": 1120000,
  "1750": 1350000,
  "1850": 1450000,
  "2000": 1650000,
  "2250": 2575000,
  "2500": 2950000,
  "2750": 3350000,
  "3000": 4150000,
};

export const AUTOMATIC_WINDER_PRICES: Record<string, number> = {
  "1250": 1400000,
  "1350": 1500000,
  "1500": 1700000,
  "1750": 2100000,
  "1850": 2300000,
  "2000": 2500000,
  "2250": 3200000,
  "2500": 3800000,
  "2750": 4200000,
  "3000": 5000000,
};

export const SINGLE_SURFACE_PRICES: Record<string, number> = {
  "200": 0,
  "300": 0,
  "450": 0,
  "500": 0,
  "550": 0,
  "600": 0,
  "750": 0,
  "850": 0,
  "1000": 0,
  "1250": 0,
  "1500": 0,
};

export const SECONDARY_NIP_TECH_DESC: TechSpecMap = {
  "Additional Nip": "2 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
  "Edge slit assembly": "Highly efficient design for trouble free operation reduces trim wastage.",
  "Nip roller width": "TBD", // Will be set dynamically
  "Nip roller drive": "2 HP AC motor with variable frequency drive. ",
  "Tension control": "Through torque.",
};

export const WINDER_COMPONENTS: WinderComponent[] = [
  // ---------- DYNAMIC COMBINED WINDER & SECONDARY NIP SECTION ----------
  {
    category: "Winder",
    id: "winder-manual-back-to-back-dynamic",
    name: "Secondary Nip & Manual Back to Back Winder",
    variant: "surface-manual",
    machineTypes: ["mono", "aba", "3layer"],
    image: "/images/winder/Back to Back Winder.png",
    cardDesc: "Secondary Nip & Manual Back to Back Surface Winder. Select size to add.",
    price: 0,
    isDynamic: true,
    techDesc: {
      "Additional Nip": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
      "Edge slit assembly": "Highly efficient design for trouble free operation reduces trim wastage.",
      "Nip roller width": "TBD",
      "Nip roller drive": "TBD HP AC motor with variable frequency drive. ",
      "Tension control": "Through Torque mode.",
      "Surface Winders (02 Nos.)": "TBD",
      "Roll diameter": "600 mm diameter or 400 kg weight in single up whichever reaches first. Bow roller prior to drum roller for wrinkle free winding.",
      "Surface winder drive": "TBD HP AC motor with variable frequency drive. ",
      "Tension control ": "Through Torque mode.",
      "Length counter meter": "Provided",
      "Trim Suction Blower": "Provided",
    },
  },

  {
    category: "Winder",
    id: "winder-single-surface-only-dynamic",
    name: "Single Surface Winder",
    variant: "surface-manual",
    machineTypes: ["mono", "aba"],
    image: "/images/winder/Single Surface.png",
    cardDesc: "Single Surface Winder. Select size to add.",
    price: 0,
    isDynamic: true,
    techDesc: {
      "Roll diameter": "Bow roller prior to drum roller for wrinkle free winding.",
      "Surface winder drive": "1 HP AC motor with variable frequency drive.",
      "Tension control": "Through Torque mode.",
      "Winder Type": "Single Surface type.",
    },
  },

  {
    category: "Winder",
    id: "winder-surface-dynamic",
    name: "Secondary Nip & Two Separate Surface Winder",
    variant: "surface-semi-auto",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/winder/Separate_Winder.png",
    cardDesc: "Secondary Nip & two separate surface winders. Select size to add.",
    price: 0,
    isDynamic: true,
    techDesc: {
      "Additional Nip": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
      "Edge slit assembly": "Highly efficient design for trouble free operation reduces trim wastage.",
      "Nip roller width": "TBD",
      "Nip roller drive": "TBD HP AC motor with variable frequency drive. Gear motor-Bon Vario, Italy or Equivalent.",
      "Tension control": "Through Loadcell.",
      "Surface Winders (02 Nos.)": "TBD",
      "Roll diameter": "800 mm diameter or 600 kg weight in single up Which ever reaches first. Bow roller prior to drum roller for wrinkle free winding.",
      "Surface winder drive": "TBD HP AC motor with variable frequency drive. Gear motor-Bon Vario, Italy or Equivalent.",
      "Tension control ": "Through Loadcell.",
      "Length counter meter": "Provided",
      "Trim Suction Blower": "Provided",
    },
  },

  {
    category: "Winder",
    id: "winder-automatic-dynamic",
    name: "Secondary Nip & Two Separate Automatic Surface Winder",
    variant: "surface-auto",
    machineTypes: ["aba", "3layer", "5layer"],
    image: "/images/winder/5_layer_winder.png",
    cardDesc: "Secondary Nip & two separate surface winders with fully automatic changeover. Select size to add.",
    price: 0,
    isDynamic: true,
    techDesc: {
      "Additional Nip": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
      "Edge slit assembly": "Highly efficient design for trouble free operation reduces trim wastage.",
      "Nip roller width": "TBD",
      "Nip roller drive": "TBD HP AC motor with variable frequency drive. Gear motor-Bon Vario, Italy or Equivalent.",
      "Tension control": "Through Loadcell.",
      "Surface Winders (02 Nos.)": "TBD",
      "Roll diameter": "600 mm diameter or 450 kg weight in single up Which ever reaches first. Bow roller prior to drum roller for wrinkle free winding.",
      "Surface winder drive": "TBD HP AC motor with variable frequency drive. Gear motor-Bon Vario, Italy or Equivalent.",
      "Tension control ": "Through Loadcell.",
      "Length counter meter": "Provided",
      "Trim Suction Blower": "Provided",
    },
  },
];
