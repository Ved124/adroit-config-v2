// src/data/optionalFeatures.ts
// Optional Features add-ons — additional upgrades and accessories
// Prices are keyed by roller width in mm (same convention as WEB_GUIDE_PRICES)

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface OptionalFeatureAddon {
  id: string;
  name: string;
  category: string;
  machineTypes: MachineType[];
  image: string;
  cardDesc: string;
  price: number;
  isDynamic?: boolean;
  techDesc: TechSpecMap;
  prices?: Record<string, number>;
}

// ----- Size-keyed price tables -----
// Keys are roller widths in mm — matches the convention used across the configurator
// (e.g. "1125" = 1125 mm roller width, same as WEB_GUIDE_PRICES "1120", "1350", etc.)

export const PLC_CONTROL_PRICES: Record<string, number> = {
  "1125": 175000,
  "1350": 175000,
  "1450": 175000,
};

export const PBT_ALU_ROLLERS_PRICES: Record<string, number> = {
  "1125": 150000,
  "1350": 180000,
  "1450": 180000,
  "1550": 210000,
  "1625": 210000,
  "1870": 320000,
  "1970": 320000,
  "2125": 210000,
  "2370": 210000,
  "2620": 210000,
};

export const GRAVIMETRIC_PRICES: Record<string, number> = {
  "1350": 1025000,
  "1450": 1025000,
  "1550": 1025000,
  "1625": 1025000,
  "1870": 1025000,
  "1970": 1025000,
  "2125": 1250000,
  "2370": 1250000,
  "2620": 1250000,
};

export const CHAIN_PULLEY_PRICES: Record<string, number> = {
  "1125": 150000,
  "1350": 250000,
  "1450": 250000,
  "1550": 250000,
  "1625": 250000,
  "1870": 250000,
  "1970": 250000,
  "2125": 360000,
  "2370": 360000,
  "2620": 360000,
};

export const MELT_TEMP_INDICATOR_PRICES: Record<string, number> = {
  "1125": 185000,
  "1350": 185000,
  "1450": 185000,
  "1550": 185000,
  "1625": 185000,
  "1870": 185000,
  "1970": 185000,
  "2125": 185000,
  "2370": 185000,
  "2620": 185000,
};

export const STATIC_ELIMINATOR_PRICES: Record<string, number> = {
  "1125": 65000,
  "1350": 70000,
  "1450": 75000,
  "1550": 80000,
  "1625": 85000,
  "1870": 95000,
  "1970": 110000,
  "2125": 120000,
  "2370": 130000,
  "2620": 140000,
};

export const MANUAL_TO_AUTO_PRICES: Record<string, number> = {
  "1125": 650000,
  "1350": 750000,
  "1450": 750000,
  "1550": 750000,
  "1625": 825000,
  "1870": 950000,
  "1970": 950000,
  "2125": 1015000,
  "2370": 1450000,
  "2620": 1450000,
};

// ---- Addon list ----

export const OPTIONAL_FEATURE_ADDONS: OptionalFeatureAddon[] = [
  {
    id: "optional-plc-control",
    name: "PLC Control in Place of POTs",
    category: "Optional Features",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Panel/Panel.png",
    cardDesc: "Upgrade from manual potentiometer controls to PLC-based digital control for precise and repeatable speed management.",
    price: 0,
    isDynamic: true,
    techDesc: {
      "Control Type": "PLC-based digital speed control replacing manual POT controllers.",
      "Benefit": "Precise, repeatable speed settings with digital display and recipe storage.",
      "Integration": "Integrated with existing VFDs and HMI for seamless operation.",
      "Compatibility": "Suitable for all extruder, haul-off, and winder drives."
    },
    prices: PLC_CONTROL_PRICES,
  },
  {
    id: "optional-pbt-alu-rollers",
    name: "PBT to Aluminium Rollers in Frame",
    category: "Optional Features",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/MainNip/MainNip.png",
    cardDesc: "Replace standard PBT rollers with precision-machined aluminium rollers for improved film handling and reduced film sticking.",
    price: 0,
    isDynamic: true,
    techDesc: {
      "Material": "Precision-machined aluminium rollers with anodized finish.",
      "Benefit": "Reduced film sticking, better heat dissipation, and longer service life.",
      "Application": "Idler rollers, guide rollers, and collapsing frame rollers.",
      "Surface Finish": "Mirror-polished or hard anodized as per application."
    },
    prices: PBT_ALU_ROLLERS_PRICES,
  },
  {
    id: "optional-gravimetric-system",
    name: "Single Component Gravimetric System",
    category: "Optional Features",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/loadcell.png",
    cardDesc: "Gravimetric blending and dosing system for accurate single-component material feeding based on weight, ensuring consistent film quality.",
    price: 0,
    isDynamic: true,
    techDesc: {
      "Type": "Single component loss-in-weight gravimetric feeder.",
      "Accuracy": "Throughput accuracy within ±0.5% of setpoint.",
      "Control": "Microprocessor-based controller with digital display.",
      "Integration": "Syncs with extruder screw speed for closed-loop output control.",
      "Benefit": "Eliminates material waste and ensures consistent film thickness."
    },
    prices: GRAVIMETRIC_PRICES,
  },
  {
    id: "optional-chain-pulley-block",
    name: "Chain Pulley Block for Die Lifting",
    category: "Optional Features",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Die/die.png",
    cardDesc: "Heavy-duty chain pulley block assembly mounted above the die for safe and easy die lifting during maintenance.",
    price: 0,
    isDynamic: true,
    techDesc: {
      "Type": "Manual chain pulley hoist with gear-operated lifting mechanism.",
      "Capacity": "1 ton (1000 kg) safe working load.",
      "Mounting": "Mounted on die support beam above the die head.",
      "Application": "Safe lifting and lowering of die components during maintenance.",
      "Safety": "Overload protection and self-locking brake mechanism."
    },
    prices: CHAIN_PULLEY_PRICES,
  },
  {
    id: "optional-melt-temp-indicator",
    name: "Melt Temperature & Pressure Indicator",
    category: "Optional Features",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Panel/Panel.png",
    cardDesc: "Real-time melt temperature and pressure monitoring at the die head for process optimization and quality control.",
    price: 0,
    isDynamic: true,
    techDesc: {
      "Temperature Sensor": "Melt temperature thermocouple (Type J/K) at die inlet.",
      "Pressure Sensor": "High-accuracy melt pressure transducer.",
      "Display": "Digital panel-mounted indicator with peak hold function.",
      "Range": "Temperature: 0–400°C | Pressure: 0–700 bar.",
      "Benefit": "Enables process optimization and early detection of blockages."
    },
    prices: MELT_TEMP_INDICATOR_PRICES,
  },
  {
    id: "optional-static-eliminator",
    name: "Static Eliminator – 2 Nos.",
    category: "Optional Features",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/loadcell.png",
    cardDesc: "Ionizing bar static eliminators to neutralize static charge on the film surface, preventing dust attraction and improving roll quality.",
    price: 0,
    isDynamic: true,
    techDesc: {
      "Type": "AC ionizing bar static eliminator.",
      "Quantity": "2 Nos. – one before winder, one at film exit zone.",
      "Ionizing Range": "Up to 400 mm effective range.",
      "Power Supply": "24V DC power supply unit included.",
      "Benefit": "Prevents dust contamination and reduces film sticking during winding."
    },
    prices: STATIC_ELIMINATOR_PRICES,
  },
  {
    id: "optional-manual-to-auto-changeover",
    name: "Manual to Auto Changeover",
    category: "Optional Features",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Panel/Panel.png",
    cardDesc: "Automatic changeover system for winder / process stations, reducing downtime and improving operator efficiency.",
    price: 0,
    isDynamic: true,
    techDesc: {
      "Function": "Automated changeover sequence from manual to automatic mode.",
      "Control": "PLC-controlled sequence with HMI interface.",
      "Benefit": "Reduces roll changeover time and minimizes waste.",
      "Safety": "Interlocked with emergency stop and safety circuits.",
      "Integration": "Compatible with existing winder and haul-off drives."
    },
    prices: MANUAL_TO_AUTO_PRICES,
  },
];
