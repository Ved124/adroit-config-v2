// data/winders.ts
// Beta component data for Secondary Nip & Surface Winders.

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface WinderComponent {
  id: string;
  name: string;
  variant: "secondary-nip" | "surface-manual" | "surface-semi-auto" | "surface-auto" | "turret-auto";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
}

export const WINDER_COMPONENTS: WinderComponent[] = [
  // ---------- SECONDARY NIP & TRIM SECTION ----------
  {
    id: "sec-nip-standard",
    name: "Secondary Nip Assembly",
    variant: "secondary-nip",
    machineTypes: ["mono", "aba", "3layer"],
    usedInModels: ["AE-1625", "AE-1870", "AE-2125"],
    image: "/images/components/winders/secondary-nip.png",
    cardDesc:
      "Secondary nip with edge trimming as per proposal screenshot.",
    price: 0,
    techDesc: {
      "Additional Nip":
        "2 Nos. nip rollers mounted in bearings – one chrome plated and one rubber roller, pneumatically movable.",
      "Edge Slit Assembly":
        "High efficiency design for trouble-free operation and reduced trim wastage.",
      "Nip Roller Width": "Matches haul-off width (e.g. 1950 mm in spec).",
      "Nip Roller Drive":
        "2 HP gear motor with variable frequency drive (typical).",
      "Tension Control": "Through loadcell-based closed loop control.",
      "Trim Handling":
        "Trim suction blower / trim winder can be integrated as optional.",
    },
  },

  // ---------- SURFACE WINDERS – MANUAL / SEMI AUTO / AUTO ----------
  {
    id: "winder-surface-manual",
    name: "Surface Winder – Manual",
    variant: "surface-manual",
    machineTypes: ["mono", "aba"],
    usedInModels: ["UNOFLEX-450", "UNOFLEX-750_900", "DUOFLEX-750"],
    image: "/images/components/winders/surface-manual.png",
    cardDesc:
      "Manual two-station surface winder for smaller lines.",
    price: 0,
    techDesc: {
      "Type of Winder": "Two station surface winder with manual changeover.",
      "Maximum Web Width":
        "Up to 900–1125 mm depending on machine model.",
      "Roll Diameter":
        "Up to 700 mm diameter or 400 kg roll weight (whichever is first).",
      "Winder Drive":
        "1–1.5 HP AC motor with variable frequency drive.",
      "Tension Control":
        "Manual brake / torque control with simple mechanical adjustment.",
      "Core Sizes":
        "Typically 3\" or 6\" paper cores (as per order).",
    },
  },

  {
    id: "winder-surface-semi-auto",
    name: "Surface Winder – Semi Auto",
    variant: "surface-semi-auto",
    machineTypes: ["mono", "aba", "3layer"],
    usedInModels: ["UNOFLEX-1000_1250", "DUOFLEX-1000", "AE-1125", "AE-1350A", "AE-1350B"],
    image: "/images/components/winders/surface-semi-auto.png",
    cardDesc:
      "Semi automatic surface winder with pneumatic changeover.",
    price: 0,
    techDesc: {
      "Type of Winder":
        "Two station surface winder with semi automatic changeover.",
      "Maximum Web Width":
        "Up to 1850 mm web width with manual / pneumatic changeover.",
      "Roll Diameter":
        "700 mm diameter or 400 kg in single up (whichever reaches first).",
      "Surface Winder Drive":
        "2 HP gear motor with variable frequency drive.",
      "Tension Control": "Through loadcell based automatic tension control.",
      "Length Counter": "Electronic length counter provided.",
      "Trim Suction Blower": "Provided where specified.",
    },
  },

  {
    id: "winder-surface-auto",
    name: "Surface Winder – Automatic",
    variant: "surface-auto",
    machineTypes: ["aba", "3layer", "5layer"],
    usedInModels: ["DUOFLEX-1750", "AE-1625", "AE-1870", "AE-2125"],
    image: "/images/components/winders/surface-auto.png",
    cardDesc:
      "Fully automatic surface winder for high speed lines.",
    price: 0,
    techDesc: {
      "Type of Winder":
        "Automatic turret type surface winder with automatic cut and transfer (depending on config).",
      "Web Width":
        "Up to 1850–2100 mm (machine dependent).",
      "Roll Change":
        "Automatic roll changeover at preset length / diameter.",
      "Tension Control":
        "Closed loop loadcell based tension control with recipe settings.",
      "Drive":
        "AC motor with vector VFD; dancer / torque mode control as required.",
      "Options":
        "Automatic roll unloading, core loader, label printer (optional).",
    },
  },

  {
    id: "winder-turret-auto",
    name: "Turret Winder – Automatic",
    variant: "turret-auto",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-2125", "AE-2370", "AE-2625"],
    image: "/images/components/winders/turret-auto.png",
    cardDesc:
      "High speed turret winder for large 3-layer / 5-layer lines.",
    price: 0,
    techDesc: {
      "Type of Winder":
        "Centre / surface combination turret winder with automatic index.",
      "Web Width": "Up to 2500 mm web width.",
      "Roll Diameter": "Up to 1000 mm or 600 kg roll weight.",
      "Drive":
        "Independent AC drives for each winding station with torque control.",
      "Tension Control":
        "Loadcell feedback with dancer for very stable tension.",
      "Applications":
        "High speed stretch hood film, lamination film and industrial packaging rolls.",
    },
  },
];
