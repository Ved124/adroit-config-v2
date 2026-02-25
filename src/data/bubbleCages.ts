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
    machineTypes: [ "mono", "aba", "3layer"],
    usedInModels: [ "AE-1125"],
    image: "/images/Bubble Cage/Manual Cage.JPG",
    cardDesc:
      "Calibration bubble guide basket with 4 segments, 4 rows, manual adjustment.",
    price: 0,
    techDesc: {
      "Type":
        "Calibration bubble guide basket with 4 arms arranged to provide full support to the film bubble.",
      "Adjustment":
        "Manual radial adjustment with locking arrangement for each segment.",
      "Film Width Range": "Approx. 450 to 900 mm layflat (machine dependent).",
      "Roll Material": "Aluminium / PBT rollers for minimum drag.",
      "Mounting":
        "Rigid structure fixed on tower, adjustable in height with manual arrangement.",
    },
    shortDesc: "Compact manual bubble cage for narrow monolayer lines.",
  },

  {
    id: "bc-6seg-4row-manual",
    name: "Bubble Cage – 6 Segment / 4 Row (Manual)",
    variant: "manual",
    segments: 6,
    rows: 4,
    machineTypes: [ "mono","aba","3layer"],
    usedInModels: [ ],
    image: "/images/Bubble Cage/Manual Cage.JPG",
    cardDesc:
      "6 segment bubble cage with 4 rows of rollers, manual radial setting.",
    price: 0,
    techDesc: {
      "Type":
        "Calibration bubble guide basket with 6 arms arranged symmetrically around the bubble.",
      "Support Rollers":
        "Multiple aluminium rollers with low friction bearings to minimize film drag.",
      "Adjustment":
        "Manual radial adjustment of each segment with locking handles.",
      "Film Width Range": "1000 to 1500 mm layflat (model dependent).",
      "Construction":
        "Fabricated MS frame with powder coating, rollers hard anodized.",
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
    machineTypes: [ "mono","aba","3layer"],
    usedInModels: ["AE-1350A","AE-1350B","AE-1625", "AE-1870"],
    image: "/images/Bubble Cage/Motorized Bubble Cage.png",
    cardDesc:
      "Motorized bubble cage with 6 segments for Innoflex / Duoflex mid-size lines.",
    price: 0,
    techDesc: {
      "Type":
        "Calibration bubble guide basket with 6 arms arranged to provide full support. Bubble contact through aluminium rollers for minimum drag.",
      "Actuation of Arms":
        "Motorized open–close and up–down operation from operator panel.",
      "Film Width Range": "Approx. 1000 to 1750 mm layflat.",
      "Structure":
        "Heavy duty fabricated structure mounted on tower with height adjustment.",
      "Rollers": "Aluminium / PBT rollers, dynamically balanced.",
      "Safety":
        "Limit switches provided on travel to prevent over-travel of cage.",
    },
    shortDesc: "Convenient motorized bubble cage for mid-size film lines.",
  },

  {
    id: "bc-9seg-motorized",
    name: "Bubble Cage – 9 Segment (Motorized)",
    variant: "motorized",
    segments: 9,
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-2125", "AE-2370", "AE-2625"],
    image: "/images/Bubble Cage/Bubble Cage Silver.JPG",
    cardDesc:
      "Heavy duty 9 segment motorized bubble cage for wide web 3-layer lines.",
    price: 0,
    techDesc: {
      "Type":
        "Calibration bubble guide basket with 9 arms for excellent bubble stability on wide web.",
      "Actuation of Arms":
        "Electric motor with gear reducer, synchronized radial movement of all segments.",
      "Film Width Range": "Up to approx. 2500 mm layflat (model dependent).",
      "Roll Material":
        "Hard anodized aluminium rollers with precision bearings.",
      "Controls":
        "Open / close and vertical movement operated from main control panel.",
    },
    shortDesc: "Robust motorized bubble cage for wide 3-layer film lines.",
  },

  // ---------- PNEUMATIC OPTION ----------
  {
    id: "bc-6seg-pneumatic",
    name: "Bubble Cage – 6 Segment (Pneumatic)",
    variant: "pneumatic",
    segments: 6,
    machineTypes: [ "3layer"],
    usedInModels: [],
    image: "/images/Bubble Cage/Bubble Cage Silver.JPG",
    cardDesc:
      "6 segment pneumatic bubble cage for quick repeatable bubble settings.",
    price: 0,
    techDesc: {
      "Type":
        "Calibration bubble cage with 6 segments, pneumatically actuated for fast size change.",
      "Actuation":
        "Pneumatic cylinders for radial movement of segments with flow control valves.",
      "Film Width Range": "1000 to 1750 mm layflat.",
      "Air Requirement": "Dry, lubricated compressed air at 5–6 bar.",
      "Controls": "Selector valves located near operator platform.",
    },
    shortDesc: "Fast pneumatic bubble cage for 3-layer film lines.",
  },
];
