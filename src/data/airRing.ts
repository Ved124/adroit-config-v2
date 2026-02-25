// data/airRing.ts
// Beta data for Air Rings (Mono, ABA, 3-Layer, 5-Layer)

export type MachineType = "mono" | "aba" | "3layer" | "5layer";
export interface TechSpecMap { [label: string]: string; }

export interface AirRingComponent {
  id: string;
  name: string;
  type: "single" | "dual" | "bichannel" | "high-output" | "ibc-compatible";
  blowerPowerHP: number;
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  techDesc: TechSpecMap;
  shortDesc?: string;
}

export const AIR_RING_COMPONENTS: AirRingComponent[] = [
  // ---------------- MONO BASIC ----------------
  {
    id: "airring-5hp-mono",
    name: "Single Lip Air Ring – 5 HP",
    type: "single",
    blowerPowerHP: 5,
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-750_900"],
    image: "/images/Airring/Airring.JPG",
    cardDesc: "Single lip air ring with 5 HP blower for monolayer narrow web lines.",
    price: 0,
    techDesc: {
      "Design": "Single lip air ring with annular air distribution.",
      "Blower": "5 HP radial blower with AC drive.",
      "Cooling Efficiency": "Suitable for thin gauge LDPE / LLDPE films.",
      "Construction": "Aluminium precision machined body.",
      "Air Control": "Manual airflow adjustment valves.",
    },
    shortDesc: "Economical cooling solution for narrow monolayer lines.",
  },

  {
    id: "airring-10hp-mono",
    name: "Single Lip Air Ring – 10 HP",
    type: "single",
    blowerPowerHP: 10,
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-1000_1250"],
    image: "/images/Airring/Airring.JPG",
    cardDesc: "Higher cooling capacity for medium-width monolayer.",
    price: 0,
    techDesc: {
      "Design": "Precision machined aluminium die–ring interface.",
      "Blower": "10 HP radial blower, AC drive controlled.",
      "Cooling Efficiency": "Improved frost-line height & gauge control.",
      "Air Control": "Manual segmented airflow adjustment.",
    },
    shortDesc: "Enhanced cooling for medium-width monolayer lines.",
  },

  // ---------------- ABA / CO-EX HIGH OUTPUT ----------------
  {
    id: "airring-10hp-dual-aba",
    name: "Dual Lip Air Ring – 10 HP (ABA)",
    type: "dual",
    blowerPowerHP: 10,
    machineTypes: ["aba"],
    usedInModels: ["DUOFLEX-1000", "DUOFLEX-1250"],
    image: "/images/Airring/Airring.JPG",
    cardDesc: "Dual lip air ring for ABA films with improved cooling.",
    price: 0,
    techDesc: {
      "Design": "Dual lip with separate inner & outer airflow channels.",
      "Blower": "10 HP high static blower with AC drive.",
      "Cooling Efficiency": "Faster cooling for co-ex films and skin layers.",
      "Body Material": "CNC machined aluminium with hard anodized finish.",
      "Adjustments": "Rotary ring with sector airflow tuning.",
    },
    shortDesc: "Optimized cooling for ABA and co-extruded films.",
  },

  {
    id: "airring-15hp-dual-aba",
    name: "Dual Lip Air Ring – 15 HP (Large ABA)",
    type: "dual",
    blowerPowerHP: 15,
    machineTypes: ["aba"],
    usedInModels: ["DUOFLEX-1750"],
    image: "/images/Airring/Airring.JPG",
    cardDesc: "High cooling output dual ring for wider ABA lines.",
    price: 0,
    techDesc: {
      "Cooling Capacity": "Designed for high output skin-core-skin structures.",
      "Blower": "15 HP radial blower, VFD controlled.",
      "Lip Profile": "Profiled air channels for stable bubble geometry.",
    },
    shortDesc: "High capacity cooling for wide ABA film lines.",
  },

  // ---------------- 3-LAYER HIGH CAPACITY ----------------
  {
    id: "airring-15hp-3layer",
    name: "Dual Lip Air Ring – 15 HP (3-Layer)",
    type: "dual",
    blowerPowerHP: 15,
    machineTypes: ["3layer"],
    usedInModels: ["AE-1625", "AE-1870"],
    image: "/images/Airring/Airring.JPG",
    cardDesc: "Dual lip spiral-cooled ring for 3-layer mid-size lines.",
    price: 0,
    techDesc: {
      "Design": "Dual lip ring with flow straightening vanes.",
      "Blower": "15 HP centrifugal blower.",
      "Air Control": "Sector valve controlled airflow distribution.",
      "Performance": "Suitable for lamination, milk & FFS film.",
    },
    shortDesc: "Efficient cooling for mid-size 3-layer film lines.",
  },

  {
    id: "airring-20hp-3layer",
    name: "Dual Lip Air Ring – 20 HP (Large 3-Layer)",
    type: "dual",
    blowerPowerHP: 20,
    machineTypes: ["3layer"],
    usedInModels: ["AE-2125", "AE-2370"],
    image: "/images/Airring/Airring.JPG",
    cardDesc: "Large dual lip air ring for wide industrial films.",
    price: 0,
    techDesc: {
      "Cooling Capacity": "Optimized for heavy duty industrial film.",
      "Blower": "20 HP blower with AC drive speed control.",
      "Application": "Stretch hood, lamination, agro films.",
    },
    shortDesc: "Robust cooling for wide 3-layer industrial film lines.",
  },

  {
    id: "airring-25hp-ultra-3layer",
    name: "Ultra Output Air Ring – 25 HP",
    type: "high-output",
    blowerPowerHP: 25,
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-2625"],
    image: "/images/Airring/Airring.JPG",
    cardDesc: "High-output air ring for extra wide machine AE-2625.",
    price: 0,
    techDesc: {
      "Design": "Optimized cooling fins with dual spiral distribution.",
      "Blower": "25 HP high pressure blower.",
      "Layer Suitability": "Designed for multilayer lamination film.",
      "Performance": "High line speed up to 80 m/min (material dependent).",
    },
    shortDesc: "Maximum cooling for extra wide multilayer film lines.",
  },

  // ---------------- IBC COMPATIBLE RINGS ----------------
  {
    id: "airring-ibc-ready",
    name: "IBC-Ready Dual Lip Air Ring",
    type: "ibc-compatible",
    blowerPowerHP: 20,
    machineTypes: ["aba", "3layer", "5layer"],
    usedInModels: ["AE-1870", "AE-2125"],
    image: "/images/Airring/Airring.JPG",
    cardDesc:
      "Dual lip ring designed for internal bubble cooling integration.",
    price: 0,
    techDesc: {
      "Compatibility": "Designed to interface with internal bubble cooling manifolds.",
      "Cooling Mode": "Supports external + internal cooling zones.",
      "Blower": "20 HP + dedicated IBC blower ring (optional).",
      "Sensor Ports": "Bubble pressure & diameter feedback ports provided.",
    },
    shortDesc: "Prepared for advanced internal bubble cooling systems.",
  },

];
