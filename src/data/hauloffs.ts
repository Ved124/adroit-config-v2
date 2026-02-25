// data/hauloffs.ts
// Beta component data for Haul-Off / Main Nip units.

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface HauloffComponent {
  id: string;
  name: string;
  variant: "vertical" | "horizontal" | "oscillating";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
}

export const HAULOFF_COMPONENTS: HauloffComponent[] = [
  {
    id: "haul-vertical-compact",
    name: "Vertical Haul-Off (Compact)",
    variant: "vertical",
    machineTypes: ["mono", "3layer"],
    usedInModels: ["UNOFLEX-450", "UNOFLEX-750_900", "AE-1350A"],
    image: "/images/components/hauloff/vertical-compact.png",
    cardDesc:
      "Compact vertical haul-off for small and medium monolayer lines.",
    price: 0,
    techDesc: {
      "Construction":
        "The haul-off will be supplied as a compact assembly mounted above the die with adjustable platform.",
      "Main Nip Rollers":
        "2 Nos. rubber coated nip rollers mounted in bearings with pneumatic loading.",
      "Nip Roller Width": "Matched to machine layflat (typically 500–900 mm).",
      "Nip Roller Drive":
        "AC geared motor with variable frequency drive for line speed control.",
      "Collapsing Frames":
        "Side-mounted slat / PBT roller collapsing frame (as per configuration).",
      "Oscillation":
        "Optional manual oscillation arrangement for better roll geometry.",
      "Turnbars": "Optional aluminium turn bars for edge trimming / gusseting.",
    },
  },

  {
    id: "haul-horizontal-standard",
    name: "Horizontal Haul-Off",
    variant: "horizontal",
    machineTypes: ["mono", "aba", "3layer"],
    usedInModels: ["UNOFLEX-1000_1250", "AE-1350A", "AE-1350B", "AE-1625"],
    image: "/images/components/hauloff/horizontal-standard.png",
    cardDesc:
      "Horizontal haul-off platform as per spec screenshot – 1950 mm nip, AC drive.",
    price: 0,
    techDesc: {
      "Construction":
        "Haul-off supplied in assembled modules, mounted on robust platform.",
      "Main Nip Rollers":
        "2 Nos. nip rollers mounted in bearings: one chrome plated roller and one rubber coated roller, pneumatically loaded.",
      "Nip Roller Width": "Approx. 1950 mm (model dependent).",
      "Nip Roller Drive":
        "3 HP gear motor with variable frequency drive for precise speed control.",
      "Collapsing Frames": "Aluminium / PBT rollers mounted before nip.",
      "Idler Rollers":
        "Adequate idler rollers in aluminium to guide film without wrinkles.",
      "Oscillation":
        "360° oscillation arrangement with limit switches and override protection, ensuring even thickness distribution on rolls.",
      "Turnbars":
        "2 Nos. aluminium turn bars with hard anodized surface in haul-off.",
    },
  },

  {
    id: "haul-horizontal-heavy",
    name: "Horizontal Haul-Off – Heavy Duty",
    variant: "horizontal",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-1870", "AE-2125", "AE-2370", "AE-2625"],
    image: "/images/components/hauloff/horizontal-heavy.png",
    cardDesc:
      "Heavy duty horizontal haul-off for wide web 3-layer / future 5-layer lines.",
    price: 0,
    techDesc: {
      "Construction":
        "Heavy duty haul-off platform designed for wide web and high line speed.",
      "Main Nip Rollers":
        "Large diameter chrome plated and rubber covered rollers with pneumatic loading.",
      "Nip Roller Width": "Up to 2650–3150 mm (machine dependent).",
      "Drive":
        "5–7.5 HP AC gear motor with VFD, integrated with line control.",
      "Oscillation":
        "Motorized oscillation with electronic end-limit sensing for perfect roll build-up.",
      "Turnbars": "Heavy duty aluminium turnbars with hard anodized surface.",
    },
  },

  {
    id: "haul-oscillating",
    name: "Oscillating Haul-Off Assembly",
    variant: "oscillating",
    machineTypes: ["aba", "3layer", "5layer"],
    usedInModels: ["DUOFLEX-1750", "AE-1870", "AE-2125", "AE-2370"],
    image: "/images/components/hauloff/oscillating.png",
    cardDesc:
      "Oscillating haul-off with 360° rotation for excellent roll geometry.",
    price: 0,
    techDesc: {
      "Construction":
        "Horizontal haul-off mounted on oscillating frame for 360° rotation.",
      "Drive":
        "AC geared motor with VFD for oscillation, with adjustable speed and stroke.",
      "Control":
        "Limit switches and control logic to avoid over-travel, ensuring uniform lay of film on rolls.",
      "Benefit":
        "Improves thickness distribution and roll geometry, reduces gauge bands.",
    },
  },
];
