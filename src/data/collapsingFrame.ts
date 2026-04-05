// data/collapsingFrame.ts
// Collapsing frames for blown film (PBT rollers / aluminium slats)

export type MachineType = "mono" | "aba" | "3layer" | "5layer";
export interface TechSpecMap { [label: string]: string; }

export interface CollapsingFrameComponent {
  id: string;
  name: string;
  style: "PBT" | "slat" | "wooden" | "wide";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
  shortDesc?: string;
}

export const COLLAPSING_FRAME_COMPONENTS: CollapsingFrameComponent[] = [
  // ---------------- BASIC MONO ----------------
  {
    id: "cf-pbt-mono",
    name: "Collapsing Frame – PBT Rollers (Mono)",
    style: "PBT",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-450", "UNOFLEX-750_900"],
    image: "/images/Acessories/Gusset Board Assembly.jpeg",
    cardDesc: "Compact collapsing frame with PBT rollers for monolayer machines.",
    price: 0,
    techDesc: {
      "Construction": "Side mounted PBT rollers to collapse the layflat bubble.",
      "Material": "PBT anti-static rollers with aluminium brackets.",
      "Width Capability": "Up to 900–1250 mm layflat depending on model.",
      "Frame Design": "Lightweight frame, manually adjustable width.",
      "Benefit": "Low drag, smooth collapsing, suitable for thin films.",
    },
    shortDesc: "For monolayer blown film machines.",
  },

  // ---------------- WIDE ABA / 3-LAYER ----------------
  {
    id: "cf-pbt-wide",
    name: "Collapsing Frame – PBT Rollers (Wide Web)",
    style: "PBT",
    machineTypes: ["aba", "3layer"],
    usedInModels: ["DUOFLEX-1000", "DUOFLEX-1250", "DUOFLEX-1750", "AE-1125", "AE-1350A", "AE-1350B"],
    image: "/images/Acessories/Gusset Board Assembly.jpeg",
    cardDesc: "Wide web collapsing frame with PBT rollers.",
    price: 0,
    techDesc: {
      "Construction":
        "Aluminium + PBT roller frame mounted before haul-off for layflat formation.",
      "Material": "Hard anodized rollers for scratch-free handling.",
      "Adjustment": "Manual width adjustment with locking system.",
      "Width Capability": "1000 to 1600 mm layflat.",
      "Application": "Suitable for ABA / 3-layer lamination films.",
    },
    shortDesc: "Robust collapsing frame to flatten and guide the film bubble into a stable lay-flat.",
  },

  // ---------------- MOTORIZED PREMIUM ----------------
  {
    id: "cf-slat-motorized",
    name: "Motorized Slat Collapsing Frame",
    style: "slat",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-1870", "AE-2125", "AE-2370", "AE-2625"],
    image: "/images/Acessories/Gusset Board Assembly.jpeg",
    cardDesc: "Motorized slat type collapsing frame for wide industrial films.",
    price: 0,
    techDesc: {
      "Construction": "Wooden / fibre slats mounted on articulated arms.",
      "Adjustment": "Motorized opening/closing via synchronized mechanism.",
      "Width Capability": "Up to ~2500 mm layflat.",
      "Benefits":
        "Very stable layflat, recommended for lamination film & stretch hood.",
      "Controls": "Operated from control panel with limit switches.",
    },
    shortDesc: "Premium collapsing frame with motorized adjustment for wide blown film applications.",
  },

  // ---------------- HEAVY DUTY AGRI & WIDE FILM ----------------
  {
    id: "cf-heavy-duty",
    name: "Heavy Duty Wide Width Collapsing System",
    style: "wide",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-2370", "AE-2625"],
    image: "/images/Acessories/Gusset Board Assembly.jpeg",
    cardDesc: "Heavy duty collapsing frame for wide / greenhouse film.",
    price: 0,
    techDesc: {
      "Construction": "Reinforced frame with long lasting fibre slats.",
      "Width Capability": "Up to 3000 mm+ layflat (model dependent).",
      "Application": "Greenhouse, silage, mulch film, very wide industrial film.",
      "Roller Type": "Low-friction composite material rollers.",
      "Height Adjustment": "Manual or motorized based on configuration.",
    },
    shortDesc: "Robust collapsing frame for very wide blown film applications.",
  },
  {
    id: "cf-wooden",
    name: "Collapsing Frame – Wooden Boards",
    style: "wooden",
    machineTypes: ["aba", "mono"],
    usedInModels: ["ABA-26"],
    image: "/images/Acessories/Gusset Board Assembly.jpeg",
    cardDesc: "Traditional wooden board collapsing frame.",
    price: 0,
    techDesc: {
      "Material": "Seasoned teak wood boards / smooth finish fibre boards.",
      "Design": "Manual adjustable width for basic web forming.",
    },
    shortDesc: "Basic wooden board frame for narrow web machines.",
  },
];
