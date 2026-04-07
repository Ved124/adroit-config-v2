// data/bubbleCages.ts
// Beta component data for Bubble Cage units.

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface BubbleCageComponent {
  id: string;
  name: string;
  variant: "manual" | "motorized" | "pneumatic";
  segments: number;           // 4 / 6 / 9 etc.
  rows?: number;              // when applicable (e.g. 4 row)
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
  shortDesc?: string;
}

export const BUBBLE_CAGE_COMPONENTS: BubbleCageComponent[] = [
  // ---------- MONO / SMALL ABA ----------
  {
    id: "bc-4seg-4row-manual",
    name: "Bubble Cage – 4 Segment / 4 Row (Manual)",
    variant: "manual",
    segments: 4,
    rows: 4,
    machineTypes: ["mono", "aba", "3layer"],
    usedInModels: ["Innoflex-1125"],
    image: "/images/Bubble Cage/Manual Cage.JPG",
    cardDesc:
      "Calibration bubble guide basket with 4 segments, 4 rows, manual adjustment.",
    price: 0,
    techDesc: {
      "Type":
        "Calibration bubble guide basket with 4 arms arranged to provide full support to the film bubble. Bubble contact is through PBT for minimum drag.",
      "Actuation of arms":
        "Manual open-close operation.",
      "Bubble Width Range": "750 to 1350 mm.",
    },
    shortDesc: "Compact manual bubble cage for narrow monolayer lines.",
  },

  {
    id: "bc-6seg-4row-manual",
    name: "Bubble Cage – 6 Segment / 4 Row (Manual)",
    variant: "manual",
    segments: 6,
    rows: 4,
    machineTypes: ["mono", "aba", "3layer"],
    usedInModels: [],
    image: "/images/Bubble Cage/Manual Cage.JPG",
    cardDesc:
      "6 segment bubble cage with 4 rows of rollers, manual radial setting.",
    price: 0,
    techDesc: {
      "Type":
        "Calibration bubble guide basket with 6 arms arranged to provide full support to the film bubble. Bubble contact is through PBT for minimum drag.",
      "Actuation of arms":
        "Manual open-close operation.",
      "Bubble Width Range": "1700 to 3000 mm.",
    },
    shortDesc: "Versatile manual bubble cage for mid-size film lines.",
  },

  // ---------- MOTORIZED (from your spec screenshot) ----------
  {
    id: "bc-6seg-motorized",
    name: "Bubble Cage – 6 Segment (Motorized)",
    variant: "motorized",
    segments: 6,
    rows: 4,
    machineTypes: ["mono", "aba", "3layer"],
    usedInModels: ["Innoflex-1350A", "Innoflex-1350B", "Innoflex-1625", "Innoflex-1870"],
    image: "/images/Bubble Cage/Motorized Bubble Cage.png",
    cardDesc:
      "Motorized bubble cage with 6 segments for Innoflex / Duoflex mid-size lines.",
    price: 0,
    techDesc: {
      "Type":
        "Calibration bubble guide basket with 6 arms arranged to provide full support to the film bubble. Bubble contact is through PBT for minimum drag.",
      "Actuation of arms":
        "Motorized open-close aned up-down operation.",
      "Bubble Width Range": "1200 to 2300 mm.",
    },
    shortDesc: "Convenient motorized bubble cage for mid-size film lines.",
  },

  {
    id: "bc-9seg-motorized",
    name: "Bubble Cage – 9 Segment (Motorized)",
    variant: "motorized",
    segments: 9,
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["Innoflex-2125", "Innoflex-2370", "Innoflex-2625"],
    image: "/images/Bubble Cage/Bubble Cage Silver.JPG",
    cardDesc:
      "Heavy duty 9 segment motorized bubble cage for wide web 3-layer lines.",
    price: 0,
    techDesc: {
      "Type":
        "Calibration bubble guide basket with 9 arms arranged to provide full support to the film bubble. Bubble contact is through PBT for minimum drag.",
      "Actuation of arms":
        "Motorized open-close aned up-down operation.",
      "Bubble Width Range": "1200 to 2300 mm.",
    },
    shortDesc: "Robust motorized bubble cage for wide 3-layer film lines.",
  },

  // ---------- PNEUMATIC OPTION ----------
  {
    id: "bc-6seg-pneumatic",
    name: "Bubble Cage – 6 Segment (Pneumatic)",
    variant: "pneumatic",
    segments: 6,
    machineTypes: ["3layer"],
    usedInModels: [],
    image: "/images/Bubble Cage/Bubble Cage Silver.JPG",
    cardDesc:
      "6 segment pneumatic bubble cage for quick repeatable bubble settings.",
    price: 0,
    techDesc: {
      "Type":
        "Calibration bubble guide basket with 6 arms arranged to provide full support to the film bubble. Bubble contact is through PBT for minimum drag.",
      "Actuation of arms":
        "Motorized open-close aned up-down operation.",
      "Bubble Width Range": "1200 to 2300 mm.",
    },
    shortDesc: "Fast pneumatic bubble cage for 3-layer film lines.",
  },
];
