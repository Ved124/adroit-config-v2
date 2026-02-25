// data/addons/corona.ts
// Corona Treaters as optional add-on items

export type MachineType = "mono" | "aba" | "3layer" | "5layer";
export interface TechSpecMap { [label: string]: string; }

export interface CoronaTreater {
  id: string;
  name: string;
  type: "single" | "dual" | "high-frequency" | "wide-web";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
  qty?: number;
  shortDesc?: string;
}

export const CORONA_TREATER_COMPONENTS: CoronaTreater[] = [
  // ---------------- BASIC UNIT (MONO / SMALL ABA) ----------------
  {
    id: "corona-basic-mono",
    name: "Corona Treater – Basic",
    type: "single",
    machineTypes: ["mono", "aba"],
    usedInModels: ["UNOFLEX-450", "UNOFLEX-750_900", "DUOFLEX-750"],
    image: "/images/addons/corona/basic-corona.png",
    cardDesc: "Entry-level corona treater for monolayer and small ABA lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Type": "Single side surface treatment system for plastic films.",
      "Power": "3–5 kW treatment generator (material dependent).",
      "Roller Type": "Anodized aluminium electrode roller.",
      "Treatment Width": "600–900 mm depending on line width.",
      "Cooling": "Air-cooled electrode chamber.",
      "Control": "Standalone analog control panel.",
      "Application": "General packaging film, liners, basic lamination.",
    },
    shortDesc: "Corona treater for surface energy modification to improve printability and adhesion on film."
  },

  // ---------------- MID-RANGE (ABA / 3L) ----------------
  {
    id: "corona-semi-auto",
    name: "Corona Treater – Semi Automatic",
    type: "single",
    machineTypes: ["aba", "3layer"],
    usedInModels: ["DUOFLEX-1000", "AE-1125", "AE-1350"],
    image: "/images/addons/corona/semi-auto.png",
    cardDesc:
      "Semi automatic corona treater with remote control & digital monitoring.",
    price: 0,
    qty: 1,
    techDesc: {
      "Control": "Digital touch controller with energy feedback & recipe storage.",
      "Power": "5–8 kW generator (material dependent).",
      "Treatment Width": "1000–1500 mm.",
      "Electrode": "High efficiency ceramic electrode with safety interlocks.",
      "Cooling": "Forced air cooling with spark detection.",
      "Application": "Lamination, printing grade film, bags.",
    },
    shortDesc: "Enhanced corona treater with digital controls for improved treatment consistency and ease of use."
  },

  // ---------------- HIGH OUTPUT (WIDE WEB) ----------------
  {
    id: "corona-high-output",
    name: "Corona Treater – High Output Industrial",
    type: "high-frequency",
    machineTypes: ["3layer"],
    usedInModels: ["AE-1625", "AE-1870"],
    image: "/images/addons/corona/high-output.png",
    cardDesc: "High output HF corona treater for lamination & multilayer film.",
    price: 0,
    qty: 1,
    techDesc: {
      "Control":
        "PLC based unit with closed loop energy feed, digital web speed sync.",
      "Power": "10–15 kW generator with feedback compensation.",
      "Treatment Width": "1500–2000 mm web width.",
      "Electrode": "Ceramic segmented electrode for uniform treatment.",
      "Cooling": "Blower cooled + optional chilled air integration.",
      "Safety": "Over-voltage, over-heat & spark shutoff protection.",
    },
    shortDesc: "High-frequency corona treater for superior surface treatment on multilayer films."
  },

  // ---------------- VERY WIDE WEB (AGRI / STRETCH / HOOD) ----------------
  {
    id: "corona-wide-web",
    name: "Wide Web Corona Treater",
    type: "wide-web",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-2125", "AE-2370", "AE-2625"],
    image: "/images/addons/corona/wide-web.png",
    cardDesc:
      "Wide web corona treater for industrial packaging & agricultural film.",
    price: 0,
    qty: 1,
    techDesc: {
      "Power": "15–25 kW high power generator.",
      "Treatment Width": "2000–3000 mm.",
      "Application":
        "Stretch hood, pallet hood, greenhouse film, construction film.",
      "Cooling": "Water-cooled electrodes with spark protection.",
      "Integration":
        "Fully integrated with main HMI including energy logs & panel alarms.",
    },
    shortDesc: "Industrial wide web corona treater for high volume film production with superior surface treatment."
  },
];
