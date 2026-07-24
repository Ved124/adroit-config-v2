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
  pricingType?: string;
  techDesc: TechSpecMap;
  scopeDesc?: string;
  prices?: Record<string, number>;
}

// ----- Size-keyed price tables -----
// Keys are roller widths in mm — matches the convention used across the configurator
// (e.g. "1125" = 1125 mm roller width, same as WEB_GUIDE_PRICES "1120", "1350", etc.)

export const PLC_CONTROL_PRICES: Record<string, number> = {
  "1000": 175000,
  "1250": 175000,
  "1350": 175000,
};

export const PBT_ALU_ROLLERS_PRICES: Record<string, number> = {
  "1000": 150000,
  "1250": 180000,
  "1350": 180000,
  "1500": 210000,
  "1750": 320000,
  "1850": 320000,
  "2000": 210000,
  "2250": 210000,
  "2500": 210000,
};

export const CHAIN_PULLEY_PRICES: Record<string, number> = {
  "1000": 150000,
  "1250": 250000,
  "1350": 250000,
  "1500": 250000,
  "1750": 250000,
  "1850": 250000,
  "2000": 360000,
  "2250": 360000,
  "2500": 360000,
};

export const MELT_TEMP_INDICATOR_PRICES: Record<string, number> = {
  "1000": 185000,
  "1250": 185000,
  "1350": 185000,
  "1500": 185000,
  "1750": 185000,
  "1850": 185000,
  "2000": 185000,
  "2250": 185000,
  "2500": 185000,
};

export const STATIC_ELIMINATOR_PRICES: Record<string, number> = {
  "1000": 65000,
  "1250": 70000,
  "1350": 75000,
  "1500": 80000,
  "1750": 85000,
  "1850": 95000,
  "2000": 110000,
  "2250": 120000,
  "2500": 130000,
};

export const MANUAL_TO_AUTO_PRICES: Record<string, number> = {
  "1000": 650000,
  "1250": 750000,
  "1350": 750000,
  "1500": 750000,
  "1750": 825000,
  "1850": 950000,
  "2000": 950000,
  "2250": 1015000,
  "2500": 1450000,
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
    image: "/images/Acessories/aluminium_rollers.jpeg",
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
    id: "optional-chain-pulley-block",
    name: "Chain Pulley Block for Die Lifting",
    category: "Optional Features",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Acessories/chain_pulley.jpg",
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
    image: "/images/Acessories/melt_temp_press_indicator.jpg",
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
    image: "/images/Acessories/static_elim.jpg",
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
