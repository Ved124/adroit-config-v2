// data/extruders.ts
// Beta component data ONLY for extruders.
// You can adjust prices, images and wording as needed.

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface ExtruderComponent {
  id: string;
  name: string;
  sizeMm: number;
  variant: "short" | "long";
  machineTypes: MachineType[];   // where this extruder can be used
  usedInModels?: string[];       // optional: machine codes like "DUOFLEX-750"
  image: string;
  cardDesc: string;              // short text for the card
  price: number;                 // placeholder – change as per your costing
  techDesc: TechSpecMap;
  shortDesc?: string;             // detailed spec for modal / Word / PDF
}

// 💡 NOTE:
// - “short” = typical monolayer blown film extruder
// - “long”  = higher-output screw for ABA / 3-Layer

export const EXTRUDER_COMPONENTS: ExtruderComponent[] = [
  // ---------------- MONOLAYER SHORT EXTRUDERS ----------------
  {
    id: "ext-35-mono-short",
    name: "Extruder 35 mm (Monolayer)",
    sizeMm: 35,
    variant: "short",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-450"],
    image: "/images/Extruder/Extruder ABA.JPG",
    cardDesc: "35 mm monolayer extruder. Motor 7.5 kW, L/D 30:1.",
    price: 0, // TODO: fill price
    techDesc: {
      "Screw Diameter":
        "35 mm single screw extruder mounted on a sturdy fabricated frame.",
      "L/D ratio": "30 : 1 (short barrel for monolayer output range 25–30 kg/hr).",
      "Type": "Barrier type screw with grooved feed section.",
      "Barrel":
        "Nitride hardened alloy steel barrel, water-cooled grooved feed section.",
      "Material": "Bimetallic screw and barrel, suitable for PE / LD / LLD blends.",
      "Screw Speed": "Approx. 115 RPM (variable with AC drive).",
      "Heating System":
        "Ceramic band heaters with individual temperature control zones.",
      "No. of Heating Zones": "4 zones on barrel + die adapter zone.",
      "Main Drive":
        "7.5 kW AC motor with vector type variable frequency drive.",
      "Transmission System": "Helical gear reducer with thrust bearing housing.",
      "Hopper":
        "MS fabricated hopper with sight glass and magnetic grill for metal trapping.",
      "Screen Changer": "Manual candle type screen changer.",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },

  {
    id: "ext-45-mono-short",
    name: "Extruder 45 mm (Monolayer – Short)",
    sizeMm: 45,
    variant: "short",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-750_900"],
    image: "/images/Extruder/Extruder ABA.JPG",
    cardDesc: "45 mm monolayer extruder. Motor 15 kW, L/D 30:1.",
    price: 0,
    techDesc: {
      "Screw Diameter":
        "45 mm single screw extruder for Unoflex monolayer range.",
      "L/D ratio": "30 : 1 short barrel for medium output 50–60 kg/hr.",
      "Type": "Barrier screw profile optimised for thin gauge film.",
      "Barrel":
        "Water-cooled grooved feed section with bimetallic wear-resistant liner.",
      "Screw Speed": "Up to 115 RPM with closed-loop speed control.",
      "Heating System":
        "9.7 kW ceramic band heater load with PID temperature controllers.",
      "No. of Heating Zones": "4 barrel zones + adapter.",
      "Main Drive": "15 kW AC motor with VFD.",
      "Transmission System": "Helical gear box with thrust bearing housing.",
      "Hopper":
        "Fabricated hopper with glass window for visual inspection and magnetic grill.",
      "Screen Changer": "Manual candle type (optional hydraulic on request).",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },

  {
    id: "ext-55-mono-short",
    name: "Extruder 55 mm (Monolayer – Short)",
    sizeMm: 55,
    variant: "short",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-1000_1250"],
    image: "/images/Extruder/Extruder ABA.JPG",
    cardDesc: "55 mm monolayer extruder. Motor 22.5 kW, L/D 30:1.",
    price: 0,
    techDesc: {
      "Screw Diameter": "55 mm single screw extruder for higher layflat widths.",
      "L/D ratio": "30 : 1 short barrel.",
      "Type": "Barrier screw, suitable for LD / LLD and blends with CaCO₃.",
      "Barrel": "Water-cooled grooved feed with bimetallic liner.",
      "Screw Speed": "Approx. 115 RPM.",
      "Heating System":
        "10.2 kW ceramic band heaters with digital temperature control.",
      "No. of Heating Zones": "4–5 barrel zones + adapter.",
      "Main Drive": "22.5 kW AC motor with VFD.",
      "Transmission System": "Helical gearbox with in-built thrust bearing.",
      "Hopper": "MS hopper with sight glass and magnetic grill.",
      "Screen Changer": "Manual candle type screen changer.",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },

  {
    id: "ext-60-mono-short",
    name: "Extruder 60 mm (Monolayer – Short)",
    sizeMm: 60,
    variant: "short",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-1250_1500"],
    image: "/images/Extruder/Extruder ABA.JPG",
    cardDesc: "60 mm monolayer extruder. Motor 30 kW, L/D 30:1.",
    price: 0,
    techDesc: {
      "Screw Diameter": "60 mm single screw extruder.",
      "L/D ratio": "30 : 1 short barrel.",
      "Main Drive": "30 kW AC motor with vector drive.",
      "Heating System": "Approx. 15 kW total heater load on barrel.",
      "Type": "Barrier screw, medium duty.",
      "Hopper": "MS hopper with magnetic grill and level window.",
      "Screen Changer": "Manual candle type.",
      "Application":
        "For general purpose blown film, shopping bags and liners.",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },

  {
    id: "ext-75-mono-short",
    name: "Extruder 75 mm (Monolayer – Short)",
    sizeMm: 75,
    variant: "short",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-2000"],
    image: "/images/Extruder/Extruder ABA.JPG",
    cardDesc: "75 mm monolayer extruder. Motor 45 kW, L/D 30:1.",
    price: 0,
    techDesc: {
      "Screw Diameter": "75 mm single screw extruder for high output monolayer line.",
      "L/D ratio": "30 : 1 short barrel.",
      "Main Drive": "45 kW AC motor with VFD.",
      "Heating System": "Approx. 22.4 kW heater load.",
      "Type": "Barrier type screw, bimetallic barrel.",
      "Applications":
        "Heavy duty liner film, shrink film and high width shopping bags.",
      "Screen Changer": "Optional hydraulic screen changer.",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },

  {
    id: "ext-90-mono-short",
    name: "Extruder 90 mm (Monolayer – Short)",
    sizeMm: 90,
    variant: "short",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-2500"],
    image: "/images/Extruder/Extruder ABA.JPG",
    cardDesc: "90 mm monolayer extruder. Motor 50 kW, L/D 30:1.",
    price: 0,
    techDesc: {
      "Screw Diameter": "90 mm single screw extruder.",
      "L/D ratio": "30 : 1.",
      "Main Drive": "50 kW AC motor with inverter.",
      "Heating System": "29.5 kW total barrel heater load.",
      "Applications": "Wide width film for construction and agricultural use.",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },

  {
    id: "ext-100-mono-short",
    name: "Extruder 100 mm (Monolayer – Short)",
    sizeMm: 100,
    variant: "short",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-3000"],
    image: "/images/Extruder/Extruder ABA.JPG",
    cardDesc: "100 mm monolayer extruder. Motor 60 kW, L/D 30:1.",
    price: 0,
    techDesc: {
      "Screw Diameter": "100 mm single screw extruder.",
      "L/D ratio": "30 : 1.",
      "Main Drive": "60 kW AC motor with VFD.",
      "Heating System": "31.5 kW heater load.",
      "Applications": "Very wide width liner and greenhouse film.",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },

  // ---------------- ABA / COEX LONG EXTRUDERS ----------------

  {
    id: "ext-35-aba-long",
    name: "Extruder 35 mm (ABA / Co-ex – Long)",
    sizeMm: 35,
    variant: "long",
    machineTypes: ["aba"],
    usedInModels: ["DUOFLEX-750"],
    image: "/images/Extruder/Extruder ABA.JPG",
    cardDesc: "35 mm long screw co-extruder for skin layer (ABA).",
    price: 0,
    techDesc: {
      "Application": "Skin layer extruder for Duoflex 750 ABA / AB line.",
      "Screw Diameter": "35 mm long barrier screw.",
      "L/D ratio": "30 : 1 (extended for higher plasticising).",
      "Main Drive": "7.5 kW AC motor (approx.).",
      "Heating System": "4.1 kW heater load with multi-zone PID control.",
      "Remarks":
        "Designed for thin outer layer with good mixing of additives / masterbatch.",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },

  {
    id: "ext-40-coex-long",
    name: "Extruder 40 mm (ABA / 3-Layer – Long)",
    sizeMm: 40,
    variant: "long",
    machineTypes: [ "3layer", "5layer"],
    usedInModels: ["AE-1125"],
    image: "/images/Extruder/Extruder ABA.JPG",
    cardDesc: "40 mm long co-extruder for 3-layer machines.",
    price: 0,
    techDesc: {
      "Role":
        "Side or skin layer extruder on Innoflex 3 layer lines.",
      "Screw Diameter": "40 mm long barrier screw with mixing section.",
      "L/D ratio": "30 : 1 or 32 : 1 (machine dependent).",
      "Main Drive":
        "15–20 kW AC motor with vector type VFD (depending on model).",
      "Heating System":
        "Approx. 9.7 kW ceramic band heaters on barrel with PID temperature control.",
      "Material": "Bimetallic screw and barrel for abrasive masterbatch.",
      "Features":
        "High specific output, good melt homogeneity suitable for multilayer film.",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },

  {
    id: "ext-45-coex-long",
    name: "Extruder 45 mm (ABA / 3-Layer – Long)",
    sizeMm: 45,
    variant: "long",
    machineTypes: ["aba", "3layer", "5layer"],
    usedInModels: ["DUOFLEX-750", "DUOFLEX-1000", "AE-1350A"],
    image: "/images/Extruder/Extruder.png",
    cardDesc: "45 mm long co-extruder for ABA / 3-layer machines.",
    price: 0,
    techDesc: {
      "Role":
        "Side or skin layer extruder on Duoflex ABA and Innoflex 3 layer lines.",
      "Screw Diameter": "45 mm long barrier screw with mixing section.",
      "L/D ratio": "30 : 1 or 32 : 1 (machine dependent).",
      "Main Drive":
        "15–20 kW AC motor with vector type VFD (depending on model).",
      "Heating System":
        "Approx. 9.7 kW ceramic band heaters on barrel with PID temperature control.",
      "Material": "Bimetallic screw and barrel for abrasive masterbatch.",
      "Features":
        "High specific output, good melt homogeneity suitable for multilayer film.",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },

  {
    id: "ext-50-coex-long",
    name: "Extruder 50 mm (ABA / 3-Layer – Long)",
    sizeMm: 50,
    variant: "long",
    machineTypes: [ "3layer", "5layer"],
    usedInModels: ["AE-1350B", "AE-1625", "AE-1870"],
    image: "/images/Extruder/Extruder.png",
    cardDesc: "50 mm long co-extruder for 3-layer machines.",
    price: 0,
    techDesc: {
      "Role":
        "Side or skin layer extruder on Innoflex 3 layer lines.",
      "Screw Diameter": "50 mm long barrier screw with mixing section.",
      "L/D ratio": "30 : 1 or 32 : 1 (machine dependent).",
      "Main Drive":
        "15–20 kW AC motor with vector type VFD (depending on model).",
      "Heating System":
        "Approx. 9.7 kW ceramic band heaters on barrel with PID temperature control.",
      "Material": "Bimetallic screw and barrel for abrasive masterbatch.",
      "Features":
        "High specific output, good melt homogeneity suitable for multilayer film.",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },

  {
    id: "ext-55-coex-long",
    name: "Extruder 55 mm (ABA / 3-Layer – Long)",
    sizeMm: 55,
    variant: "long",
    machineTypes: ["aba", "3layer", "5layer"],
    usedInModels: ["DUOFLEX-1000", "DUOFLEX-1250", "DUOFLEX-1750", "AE-1350A", "AE-1870"],
    image: "/images/Extruder/Extruder.png",
    cardDesc: "55 mm long screw co-extruder for core or skin layer.",
    price: 0,
    techDesc: {
      "Screw Diameter": "55 mm long screw (core or skin layer).",
      "L/D ratio": "30 : 1 or 32 : 1.",
      "Main Drive":
        "22.5–30 kW AC motor (model dependent) with VFD for fine speed control.",
      "Heating System": "10.2 kW heater load on barrel.",
      "Applications": "Core layer of ABA, or central extruder in 3-layer line.",
      "Remarks":
        "Designed for higher output and better mixing for multilayer film structures.",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },

  {
    id: "ext-65-coex-long",
    name: "Extruder 65 mm (Co-ex – Long)",
    sizeMm: 65,
    variant: "long",
    machineTypes: ["aba", "3layer", "5layer"],
    usedInModels: ["DUOFLEX-1750", "AE-1625", "AE-1870", "AE-2125", "AE-2370"],
    image: "/images/Extruder/Extruder.png",
    cardDesc: "65 mm long co-extruder for high output ABA / 3-layer lines.",
    price: 0,
    techDesc: {
      "Screw Diameter": "65 mm long barrier screw for high throughput.",
      "L/D ratio": "32 : 1 (for improved mixing and output).",
      "Main Drive":
        "30–60 kW AC motor (depending on position and machine model).",
      "Heating System": "Approx. 22–30 kW heater load.",
      "Applications":
        "Center or skin layer extruder on wider web ABA / 3-layer machines.",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },

  {
    id: "ext-75-coex-long",
    name: "Extruder 75 mm (Co-ex – Long)",
    sizeMm: 75,
    variant: "long",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-2125", "AE-2370", "AE-2625"],
    image: "/images/Extruder/Extruder.png",
    cardDesc: "75 mm long screw extruder for large 3-layer machines.",
    price: 0,
    techDesc: {
      "Screw Diameter": "75 mm long barrier screw.",
      "L/D ratio": "32 : 1.",
      "Main Drive": "60–75 kW AC motor with VFD (model dependent).",
      "Applications":
        "Core extruder for high output 3-layer lines and 5-layer lines (future).",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },

  {
    id: "ext-90-coex-long",
    name: "Extruder 90 mm (Co-ex – Long)",
    sizeMm: 90,
    variant: "long",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-2625"],
    image: "/images/Extruder/Extruder.png",
    cardDesc: "90 mm long screw extruder for very high output core layer.",
    price: 0,
    techDesc: {
      "Screw Diameter": "90 mm long screw for heavy duty 3-layer line AE-2625.",
      "L/D ratio": "32 : 1.",
      "Main Drive": "125 kW AC motor (approx. 170 HP) with VFD.",
      "Applications":
        "High output core layer for wide web heavy gauge films and industrial packaging.",
    },
    shortDesc: "Extruder unit with precision screw/barrel design for stable melt flow and consistent output.",
  },
];
