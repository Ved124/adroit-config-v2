// src/data/modelPresets.ts

export type PresetComponent = {
  category: string;
  id: string;
  qty?: number;
  metadata?: any;
};

export type PresetConfig = {
  machineType: "mono" | "aba" | "3layer" | "5layer";
  components: PresetComponent[];
  addons?: PresetComponent[];
  basePrice?: number; // ← NEW: used for fixed package pricing
};

/**
 * MODEL_PRESETS:
 * Keys must match the label / code you set when selecting a model
 * (e.g. "INNOFLEX-1125").
 */
export const MODEL_PRESETS: Record<string, PresetConfig> = {
  // ---------------------------------------------------------
  // Innoflex 3 Layer – INNOFLEX-1125
  // ---------------------------------------------------------
  "INNOFLEX-1125": {
    machineType: "3layer",
    basePrice: 6125000,
    components: [
      // 3-layer extruder package – 40/40/40
      { category: "Extruder", id: "ext-40-coex-long", qty: 3 },

      // 225 mm three-layer die (Die Rotation included)

      // 225 mm three-layer die (Die Rotation included)
      { category: "Die Head", id: "die-3layer-225", qty: 1 },

      // Bubble cage & collapsing frame
      {
        category: "Bubble Cage",
        id: "bc-open-close-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          price: 250000,
          customName: "Open Close Bubble Cage - 1250 mm",
          techDesc: { "Type": "Motorized open-close operation with PBT rollers.", "Cage Size": "1250 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },

      // Air Ring (Missing)
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 425000,
          customName: "300 mm Standard Air Ring (10 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "300 mm", "Blower": "10 HP AC Motor" }
        }
      },

      // Haul-Off + Tower + Winder
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          price: 1100000,
          customName: "HORIZONTAL HAULOFF - 1250 mm",
          techDesc: {
            "Construction": "The haul off will be shipped in assembled parts.",
            "Main Nip rollers": "2 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Hauloff Size": "1250 mm",
            "Nip roller width": "1375 mm",
            "Nip roller drive": "5 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT rollers.",
            "Oscillation": "360 degree oscillating mechanism for even thickness variation.",
          }
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          price: 1000000,
          customName: "TOWER / PLATFORM - 1250 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "3-walk around platforms.", "Staircase": "600 mm wide staircase." }
        }
      },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      // Electrical panel
      {
        category: "Electrical & Control Panel",
        id: "panel-acdrive-standard",
        qty: 1,
      },
    ],
  },
  "INNOFLEX-1350 DR": {
    machineType: "3layer",
    basePrice: 6750000,
    components: [
      { category: "Extruder", id: "ext-45-coex-long", qty: 3 },
      { category: "Die Head", id: "die-3layer-275", qty: 1 },
      {
        category: "Bubble Cage", id: "bc-open-close-dynamic", qty: 1,
        metadata: {
          size: "1350",
          price: 250000,
          customName: "Open Close Bubble Cage - 1350 mm",
          techDesc: { "Type": "Motorized open-close operation with PBT rollers.", "Cage Size": "1350 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 425000,
          customName: "300 mm Standard Air Ring (10 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "300 mm", "Blower": "10 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1350",
          price: 1150000,
          customName: "HORIZONTAL HAULOFF - 1350 mm",
          techDesc: {
            "Construction": "The haul off will be shipped in assembled parts.",
            "Main Nip rollers": "2 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Hauloff Size": "1350 mm",
            "Nip roller width": "1475 mm",
            "Nip roller drive": "5 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT rollers.",
            "Oscillation": "360 degree oscillating mechanism for even thickness variation.",
          }
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "1350",
          price: 1150000,
          customName: "TOWER / PLATFORM - 1350 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "3-walk around platforms.", "Staircase": "600 mm wide staircase." }
        }
      },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "INNOFLEX-1350 HO": {
    machineType: "3layer",
    basePrice: 7875000,
    components: [
      { category: "Extruder", id: "ext-45-coex-long", qty: 3 },
      { category: "Die Head", id: "die-3layer-275-stationary", qty: 1 },
      {
        category: "Bubble Cage", id: "bc-open-close-dynamic", qty: 1,
        metadata: {
          size: "1350",
          price: 250000,
          customName: "Open Close Bubble Cage - 1350 mm",
          techDesc: { "Type": "Motorized open-close operation with PBT rollers.", "Cage Size": "1350 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 425000,
          customName: "300 mm Standard Air Ring (10 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "300 mm", "Blower": "10 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1350",
          price: 1150000,
          customName: "HORIZONTAL HAULOFF - 1350 mm",
          techDesc: {
            "Construction": "The haul off will be shipped in assembled parts.",
            "Main Nip rollers": "2 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Hauloff Size": "1350 mm",
            "Nip roller width": "1475 mm",
            "Nip roller drive": "5 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT rollers.",
            "Oscillation": "360 degree oscillating mechanism for even thickness variation.",
          }
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "1350",
          price: 1150000,
          customName: "TOWER / PLATFORM - 1350 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "3-walk around platforms.", "Staircase": "600 mm wide staircase." }
        }
      },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "INNOFLEX-1350-170": {
    machineType: "3layer",
    basePrice: 8551000,
    components: [
      { category: "Extruder", id: "ext-45-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-55-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layer-275", qty: 1 },
      {
        category: "Bubble Cage",
        id: "bc-open-close-dynamic",
        qty: 1,
        metadata: {
          size: "1350",
          price: 250000,
          customName: "Open Close Bubble Cage - 1350 mm",
          techDesc: { "Type": "Motorized open-close operation with PBT rollers.", "Cage Size": "1350 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "INNOFLEX-1350-180": {
    machineType: "3layer",
    basePrice: 8850000,
    components: [
      { category: "Extruder", id: "ext-50-coex-long", qty: 3 },
      { category: "Die Head", id: "die-3layer-300", qty: 1 },
      {
        category: "Bubble Cage",
        id: "bc-open-close-dynamic",
        qty: 1,
        metadata: {
          size: "1350",
          price: 250000,
          customName: "Open Close Bubble Cage - 1350 mm",
          techDesc: { "Type": "Motorized open-close operation with PBT rollers.", "Cage Size": "1350 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "INNOFLEX-1450": {
    machineType: "3layer",
    basePrice: 8971000,
    components: [
      { category: "Extruder", id: "ext-45-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-55-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layer-300", qty: 1 },
      { category: "Bubble Cage", id: "bc-open-close-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 425000,
          customName: "300 mm Standard Air Ring (10 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "300 mm", "Blower": "10 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1500",
          price: 1200000,
          customName: "HORIZONTAL HAULOFF - 1500 mm",
          techDesc: {
            "Construction": "The haul off will be shipped in assembled parts.",
            "Main Nip rollers": "2 Nos. mounted in bearings.",
            "Hauloff Size": "1500 mm",
            "Oscillation": "360 degree oscillating mechanism."
          }
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "1500",
          price: 1300000,
          customName: "TOWER / PLATFORM - 1500 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "3-walk around platforms." }
        }
      },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "INNOFLEX-1625": {
    machineType: "3layer",
    basePrice: 9875000,
    components: [
      { category: "Extruder", id: "ext-50-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-65-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layer-325", qty: 1 },
      { category: "Bubble Cage", id: "bc-open-close-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "325",
          price: 475000,
          customName: "325 mm Standard Air Ring (15 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "325 mm", "Blower": "15 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1750",
          price: 1400000,
          customName: "HORIZONTAL HAULOFF - 1750 mm",
          techDesc: {
            "Hauloff Size": "1750 mm",
            "Main Nip": "3 HP",
            "Line Speed": "80 MPM",
            "Oscillation": "360 degree oscillating mechanism."
          }
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "1750",
          price: 1500000,
          customName: "TOWER / PLATFORM - 1750 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "3-walk around platforms." }
        }
      },
      { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "INNOFLEX-1870": {
    machineType: "3layer",
    basePrice: 10651000,
    components: [
      { category: "Extruder", id: "ext-55-coex-long", qty: 3 },
      { category: "Die Head", id: "die-3layer-375", qty: 1 },
      { category: "Bubble Cage", id: "bc-open-close-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "375",
          price: 525000,
          customName: "375 mm Standard Air Ring (15 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "375 mm", "Blower": "15 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1850",
          price: 1500000,
          customName: "HORIZONTAL HAULOFF - 1850 mm",
          techDesc: {
            "Hauloff Size": "1850 mm",
            "Main Nip": "3 HP",
            "Line Speed": "80 MPM",
            "Oscillation": "360 degree oscillating mechanism."
          }
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "1850",
          price: 1650000,
          customName: "TOWER / PLATFORM - 1850 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "3-walk around platforms." }
        }
      },
      { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "INNOFLEX-1970": {
    machineType: "3layer",
    basePrice: 11875000,
    components: [
      { category: "Extruder", id: "ext-55-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-65-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layer-400", qty: 1 },
      { category: "Bubble Cage", id: "bc-open-close-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "400",
          price: 575000,
          customName: "400 mm Standard Air Ring (15 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "400 mm", "Blower": "15 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "2000",
          price: 1800000,
          customName: "HORIZONTAL HAULOFF - 2000 mm",
          techDesc: {
            "Hauloff Size": "2000 mm",
            "Main Nip": "3 HP",
            "Line Speed": "80 MPM",
            "Oscillation": "360 degree oscillating mechanism."
          }
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "2000",
          price: 1800000,
          customName: "TOWER / PLATFORM - 2000 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "3-walk around platforms." }
        }
      },
      { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "INNOFLEX-2125": {
    machineType: "3layer",
    basePrice: 13750000,
    components: [
      { category: "Extruder", id: "ext-65-coex-long", qty: 3 },
      { category: "Die Head", id: "die-3layer-450", qty: 1 },
      { category: "Bubble Cage", id: "bc-up-down-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "450",
          price: 600000,
          customName: "450 mm Standard Air Ring (20 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "450 mm", "Blower": "20 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "2250",
          price: 2500000,
          customName: "HORIZONTAL HAULOFF - 2125 mm",
          techDesc: {
            "Hauloff Size": "2125 mm",
            "Main Nip": "3 HP",
            "Line Speed": "80 MPM",
            "Oscillation": "360 degree oscillating mechanism."
          }
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "2125",
          price: 2000000,
          customName: "TOWER / PLATFORM - 2125 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "4-walk around platforms." }
        }
      },
      { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "INNOFLEX-2370": {
    machineType: "3layer",
    basePrice: 18750000,
    components: [
      { category: "Extruder", id: "ext-65-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-75-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layer-525", qty: 1 },
      { category: "Bubble Cage", id: "bc-up-down-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-slat-motorized", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "550",
          price: 850000,
          customName: "550 mm Standard Air Ring (25 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "550 mm", "Blower": "25 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "2500",
          price: 2700000,
          customName: "HORIZONTAL HAULOFF - 2370 mm",
          techDesc: {
            "Hauloff Size": "2370 mm",
            "Main Nip": "5 HP",
            "Line Speed": "80 MPM",
            "Oscillation": "360 degree oscillating mechanism."
          }
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "2370",
          price: 2350000,
          customName: "TOWER / PLATFORM - 2370 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "4-walk around platforms." }
        }
      },
      { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "INNOFLEX-2650": {
    machineType: "3layer",
    basePrice: 21575000,
    components: [
      { category: "Extruder", id: "ext-65-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-75-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layer-550", qty: 1 },
      { category: "Bubble Cage", id: "bc-up-down-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-heavy-duty", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "550",
          price: 850000,
          customName: "550 mm Standard Air Ring (25 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "550 mm", "Blower": "25 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "2750",
          price: 3200000,
          customName: "HORIZONTAL HAULOFF - 2750 mm",
          techDesc: {
            "Hauloff Size": "2750 mm",
            "Oscillation": "360 degree oscillating mechanism."
          }
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "2650",
          price: 2650000,
          customName: "TOWER / PLATFORM - 2650 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "4-walk around platforms." }
        }
      },
      { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },

  // "DUOFLEX-750": {
  //   machineType: "aba",
  //   components: [
  //     { category: "Extruder", id: "ext-35-aba", qty: 1 },
  //     { category: "Extruder", id: "ext-45-aba", qty: 1 },
  //     { category: "Die Head", id: "die-aba-70-150", qty: 1 },
  //     // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
  //     { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
  //     { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
  //     { category: "Tower / Platform", id: "tower_std", qty: 1 },
  //     { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
  //   ],

  //   addons: [
  //     {
  //       category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
  //     },
  //   ],
  // },
  // "DUOFLEX-1000": {
  //   machineType: "aba",
  //   components: [
  //     { category: "Extruder", id: "ext-55-aba", qty: 1 },
  //     { category: "Extruder", id: "ext-45-aba", qty: 1 },
  //     { category: "Die Head", id: "die-aba-125-250", qty: 1 },
  //     // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
  //     { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
  //     { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
  //     { category: "Tower / Platform", id: "tower_std", qty: 1 },
  //     { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
  //   ],

  //   addons: [
  //     {
  //       category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
  //     },
  //   ],
  // },
  // "DUOFLEX-1250": {
  //   machineType: "aba",
  //   components: [
  //     { category: "Extruder", id: "ext-55-aba", qty: 2 },
  //     { category: "Die Head", id: "die-aba-150-300", qty: 1 },
  //     // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
  //     { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
  //     { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
  //     { category: "Tower / Platform", id: "tower_std", qty: 1 },
  //     { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
  //   ],

  //   addons: [
  //     {
  //       category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
  //     },
  //   ],
  // },
  // "DUOFLEX-1750": {
  //   machineType: "aba",
  //   components: [
  //     { category: "Extruder", id: "ext-55-aba", qty: 1 },
  //     { category: "Extruder", id: "ext-65-aba", qty: 1 },
  //     { category: "Die Head", id: "die-aba-225-375", qty: 1 },
  //     // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
  //     { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
  //     { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
  //     { category: "Tower / Platform", id: "tower_std", qty: 1 },
  //     { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
  //   ],

  //   addons: [
  //     {
  //       category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
  //     },
  //   ],
  // },

  // "UNOFLEX-450": {
  //   machineType: "aba",
  //   components: [
  //     { category: "Extruder", id: "ext-35-mono-short", qty: 1 },
  //     { category: "Die Head", id: "die-mono-50-100", qty: 1 },
  //     // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
  //     { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
  //     { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
  //     { category: "Tower / Platform", id: "tower_std", qty: 1 },
  //     { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
  //   ],

  //   addons: [
  //     {
  //       category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
  //     },
  //   ],
  // },
  // "UNOFLEX-750_900": {
  //   machineType: "aba",
  //   components: [
  //     { category: "Extruder", id: "ext-45-mono-short", qty: 1 },
  //     { category: "Die Head", id: "die-mono-90-175", qty: 1 },
  //     // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
  //     { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
  //     { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
  //     { category: "Tower / Platform", id: "tower_std", qty: 1 },
  //     { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
  //   ],

  //   addons: [
  //     {
  //       category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
  //     },
  //   ],
  // },
  // "UNOFLEX-1000_1250": {
  //   machineType: "aba",
  //   components: [
  //     { category: "Extruder", id: "ext-55-mono-short", qty: 1 },
  //     { category: "Die Head", id: "die-mono-150-275", qty: 1 },
  //     // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
  //     { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
  //     { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
  //     { category: "Tower / Platform", id: "tower_std", qty: 1 },
  //     { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
  //   ],

  //   addons: [
  //     {
  //       category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
  //     },
  //   ],
  // },
  // "UNOFLEX-1250_1500": {
  //   machineType: "aba",
  //   components: [
  //     { category: "Extruder", id: "ext-60-mono-short", qty: 1 },
  //     { category: "Die Head", id: "die-mono-200-325", qty: 1 },
  //     // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
  //     { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
  //     { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
  //     { category: "Tower / Platform", id: "tower_std", qty: 1 },
  //     { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
  //   ],

  //   addons: [
  //     {
  //       category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
  //     },
  //   ],
  // },
  // "UNOFLEX-2000": {
  //   machineType: "aba",
  //   components: [
  //     { category: "Extruder", id: "ext-75-mono-short", qty: 1 },
  //     { category: "Die Head", id: "die-mono-300-475", qty: 1 },
  //     // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
  //     { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
  //     { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
  //     { category: "Tower / Platform", id: "tower_std", qty: 1 },
  //     { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
  //   ],

  //   addons: [
  //     {
  //       category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
  //     },
  //   ],
  // },
  // "UNOFLEX-2500": {
  //   machineType: "aba",
  //   components: [
  //     { category: "Extruder", id: "ext-90-mono-short", qty: 1 },
  //     { category: "Die Head", id: "die-mono-400-600", qty: 1 },
  //     // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
  //     { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
  //     { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
  //     { category: "Tower / Platform", id: "tower_std", qty: 1 },
  //     { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
  //   ],

  //   addons: [
  //     {
  //       category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
  //     },
  //   ],
  // },
  // "UNOFLEX-3000": {
  //   machineType: "aba",
  //   components: [
  //     { category: "Extruder", id: "ext-100-mono-short", qty: 1 },
  //     { category: "Die Head", id: "die-mono-450-700", qty: 1 },
  //     // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
  //     { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
  //     { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
  //     { category: "Tower / Platform", id: "tower_std", qty: 1 },
  //     { category: "Winder", id: "winder-surface-dynamic", qty: 1 },
  //   ],

  //   addons: [
  //     {
  //       category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
  //     },
  //   ],
  // },

  "DUOFLEX-26": {
    machineType: "aba",
    basePrice: 1350000,
    components: [
      { category: "Extruder", id: "ext-35-aba", qty: 1 },
      { category: "Extruder", id: "ext-40-aba", qty: 1 },
      { category: "Die Head", id: "die-aba-100", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-g-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 350000,
          customName: "300 mm G-Series Air Ring",
          techDesc: { "Design": "G-Series Aerodynamic Air Ring", "Size": "300 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-wooden", qty: 1 },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          price: 1100000,
          customName: "HORIZONTAL HAULOFF - 1250 mm",
          techDesc: { "Hauloff Size": "1250 mm" }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-dol-starter", qty: 1,
      },
    ],
  },

  "DUOFLEX-32": {
    machineType: "aba",
    basePrice: 1750000,
    components: [
      { category: "Extruder", id: "ext-35-aba", qty: 1 },
      { category: "Extruder", id: "ext-45-aba", qty: 1 },
      { category: "Die Head", id: "die-aba-150", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-g-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 350000,
          customName: "300 mm G-Series Air Ring",
          techDesc: { "Design": "G-Series Aerodynamic Air Ring", "Size": "300 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-wooden", qty: 1 },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          price: 1100000,
          customName: "HORIZONTAL HAULOFF - 1250 mm",
          techDesc: { "Hauloff Size": "1250 mm" }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-dol-starter", qty: 1,
      },
    ],
  },

  "DUOFLEX-40": {
    machineType: "aba",
    basePrice: 2250000,
    components: [
      { category: "Extruder", id: "ext-40-aba", qty: 1 },
      { category: "Extruder", id: "ext-45-aba", qty: 1 },
      { category: "Die Head", id: "die-aba-200", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-g-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 350000,
          customName: "300 mm G-Series Air Ring",
          techDesc: { "Design": "G-Series Aerodynamic Air Ring", "Size": "300 mm" }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          price: 55000,
          customName: "Manual Bubble Cage - 1250 mm",
          techDesc: { "Type": "Manual open-close operation with PBT rollers.", "Cage Size": "1250 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-wooden", qty: 1 },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          price: 1100000,
          customName: "HORIZONTAL HAULOFF - 1250 mm",
          techDesc: { "Hauloff Size": "1250 mm" }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-dol-starter", qty: 1,
      },
    ],
  },

  "DUOFLEX-50": {
    machineType: "aba",
    basePrice: 3675000,
    components: [
      { category: "Extruder", id: "ext-45-aba", qty: 1 },
      { category: "Extruder", id: "ext-55-aba", qty: 1 },
      { category: "Die Head", id: "die-aba-300", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-g-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 350000,
          customName: "300 mm G-Series Air Ring",
          techDesc: { "Design": "G-Series Aerodynamic Air Ring", "Size": "300 mm" }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          price: 55000,
          customName: "Manual Bubble Cage - 1250 mm",
          techDesc: { "Type": "Manual open-close operation with PBT rollers.", "Cage Size": "1250 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-pbt-mono", qty: 1 },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1350",
          price: 1150000,
          customName: "HORIZONTAL HAULOFF - 1350 mm",
          techDesc: { "Hauloff Size": "1350 mm" }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },

  "DUOFLEX-60": {
    machineType: "aba",
    basePrice: 5475000,
    components: [
      { category: "Extruder", id: "ext-55-aba", qty: 1 },
      { category: "Extruder", id: "ext-65-aba", qty: 1 },
      { category: "Die Head", id: "die-aba-600", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-g-dynamic",
        qty: 1,
        metadata: {
          size: "400",
          price: 450000,
          customName: "400 mm G-Series Air Ring",
          techDesc: { "Design": "G-Series Aerodynamic Air Ring", "Size": "400 mm" }
        }
      },
      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-mono", qty: 1 },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1750",
          price: 1400000,
          customName: "HORIZONTAL HAULOFF - 1750 mm",
          techDesc: { "Hauloff Size": "1750 mm" }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },

  "UNOFLEX-20": {
    machineType: "mono",
    basePrice: 674000,
    components: [
      { category: "Extruder", id: "ext-35-mono-short", qty: 1 },
      { category: "Die Head", id: "die-mono-100", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-g-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 350000,
          customName: "300 mm G-Series Air Ring",
          techDesc: { "Design": "G-Series Aerodynamic Air Ring", "Size": "300 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-wooden", qty: 1 },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          price: 1100000,
          customName: "HORIZONTAL HAULOFF - 1250 mm",
          techDesc: { "Hauloff Size": "1250 mm" }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-dol-starter", qty: 1,
      },
    ],
  },

  "UNOFLEX-32": {
    machineType: "mono",
    basePrice: 1065000,
    components: [
      { category: "Extruder", id: "ext-45-mono-short", qty: 1 },
      { category: "Die Head", id: "die-mono-200", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-g-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 350000,
          customName: "300 mm G-Series Air Ring",
          techDesc: { "Design": "G-Series Aerodynamic Air Ring", "Size": "300 mm" }
        }
      },
      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-wooden", qty: 1 },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          price: 1100000,
          customName: "HORIZONTAL HAULOFF - 1250 mm",
          techDesc: { "Hauloff Size": "1250 mm" }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-dol-starter", qty: 1,
      },
    ],
  },

  "UNOFLEX-40": {
    machineType: "mono",
    basePrice: 1225000,
    components: [
      { category: "Extruder", id: "ext-45-mono-short", qty: 1 },
      { category: "Die Head", id: "die-mono-250", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-g-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 350000,
          customName: "300 mm G-Series Air Ring",
          techDesc: { "Design": "G-Series Aerodynamic Air Ring", "Size": "300 mm" }
        }
      },
      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-wooden", qty: 1 },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          price: 1100000,
          customName: "HORIZONTAL HAULOFF - 1250 mm",
          techDesc: { "Hauloff Size": "1250 mm" }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-dol-starter", qty: 1,
      },
    ],
  },

  "UNOFLEX-50": {
    machineType: "mono",
    basePrice: 1650000,
    components: [
      { category: "Extruder", id: "ext-55-mono-short", qty: 1 },
      { category: "Die Head", id: "die-mono-300", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-g-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 350000,
          customName: "300 mm G-Series Air Ring",
          techDesc: { "Design": "G-Series Aerodynamic Air Ring", "Size": "300 mm" }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          price: 55000,
          customName: "Manual Bubble Cage - 1250 mm",
          techDesc: { "Type": "Manual open-close operation with PBT rollers.", "Cage Size": "1250 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-wooden", qty: 1 },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1350",
          price: 1150000,
          customName: "HORIZONTAL HAULOFF - 1350 mm",
          techDesc: { "Hauloff Size": "1350 mm" }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-dol-starter", qty: 1,
      },
    ],
  },

  "UNOFLEX-72": {
    machineType: "mono",
    basePrice: 4800000,
    components: [
      { category: "Extruder", id: "ext-65-mono-short", qty: 1 },
      { category: "Die Head", id: "die-mono-400", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "400",
          price: 575000,
          customName: "400 mm Standard Air Ring (15 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "400 mm" }
        }
      },
      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-mono", qty: 1 },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "2000",
          price: 1800000,
          customName: "HORIZONTAL HAULOFF - 2000 mm",
          techDesc: { "Hauloff Size": "2000 mm" }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },

  "UNOFLEX-110": {
    machineType: "mono",
    basePrice: 6500000,
    components: [
      { category: "Extruder", id: "ext-90-mono-short", qty: 1 },
      { category: "Die Head", id: "die-mono-600", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "600",
          price: 950000,
          customName: "600 mm Standard Air Ring (25 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "600 mm" }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic",
        qty: 1,
        metadata: {
          size: "3000",
          price: 500000,
          customName: "Manual Bubble Cage - 3000 mm",
          techDesc: { "Type": "Manual open-close operation with PBT rollers.", "Cage Size": "3000 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-pbt-mono", qty: 1 },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "3000",
          price: 3500000,
          customName: "HORIZONTAL HAULOFF - 3000 mm",
          techDesc: { "Hauloff Size": "3000 mm" }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },

  // ---------------------------------------------------------
  // IBC MODELS
  // ---------------------------------------------------------
  "INNOFLEX-1870 IBC": {
    machineType: "3layer",
    basePrice: 17951000,
    components: [
      { category: "Extruder", id: "ext-65-coex-long", qty: 2, metadata: { techDesc: { "Material": "Bimetallic screw and barrel" } } },
      { category: "Extruder", id: "ext-75-coex-long", qty: 1, metadata: { techDesc: { "Material": "Bimetallic screw and barrel" } } },
      { category: "Die Head", id: "die-3layeribc-375", qty: 1 },
      { category: "IBC", id: "ibc-system", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "375",
          price: 525000,
          customName: "375 mm Standard Air Ring (20 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "375 mm", "Blower": "20 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1850",
          price: 1500000,
          customName: "HORIZONTAL HAULOFF - 1850 mm",
          techDesc: { "Hauloff Size": "1850 mm", "Nip roller drive": "3 HP", "Line Speed": "80 MPM" }
        }
      },
      { category: "Tower / Platform", id: "tower-dynamic", qty: 1, metadata: { size: "1850", price: 1650000 } },
      {
        category: "Bubble Cage",
        id: "bc-up-down-dynamic",
        qty: 1,
        metadata: {
          size: "1850",
          price: 700000,
          customName: "6 Segment Motorized Up-Down Bubble Cage - 1850 mm",
          techDesc: { "Segments": "6", "Type": "Motorized Up-Down & Open-Close" }
        }
      },
      { category: "Winder", id: "winder-surface-dynamic", qty: 1, metadata: { size: "1850", price: 3200000 } },
      { category: "Trim Blower", id: "trim-blower-heavy", qty: 1, price: 0 },
    ],
    addons: [
      { category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1 },
      { category: "Extruder Addons", id: "bimetallic-upgrade-base", qty: 3 },
    ],
  },
  "INNOFLEX-1975 IBC": {
    machineType: "3layer",
    basePrice: 20850000,
    components: [
      { category: "Extruder", id: "ext-55-coex-long", qty: 2, metadata: { techDesc: { "Material": "Bimetallic screw and barrel", "Main Drive": "50 HP AC motor (ABB)" } } },
      { category: "Extruder", id: "ext-75-coex-long", qty: 1, metadata: { techDesc: { "Material": "Bimetallic screw and barrel", "Main Drive": "100 HP AC motor (ABB)" } } },
      { category: "Die Head", id: "die-3layeribc-350", qty: 1 },
      { category: "IBC", id: "ibc-system", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "350",
          price: 500000,
          customName: "350 mm Standard Air Ring (20 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "350 mm", "Blower": "20 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1975",
          price: 1750000,
          customName: "HORIZONTAL HAULOFF - 1975 mm",
          techDesc: { "Hauloff Size": "1975 mm", "Nip roller drive": "3 HP", "Line Speed": "80 MPM" }
        }
      },
      { category: "Tower / Platform", id: "tower-dynamic", qty: 1, metadata: { size: "1975", price: 1750000 } },
      {
        category: "Bubble Cage",
        id: "bc-up-down-dynamic",
        qty: 1,
        metadata: {
          size: "1975",
          price: 725000,
          customName: "6 Segment Motorized Up-Down Bubble Cage - 1975 mm",
          techDesc: { "Segments": "6", "Type": "Motorized Up-Down & Open-Close" }
        }
      },
      { category: "Winder", id: "winder-automatic-dynamic", qty: 1, metadata: { size: "1975", price: 3400000 } },
      { category: "Trim Blower", id: "trim-blower-heavy", qty: 1, price: 0 },
    ],
    addons: [
      { category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1 },
      { category: "Extruder Addons", id: "bimetallic-upgrade-base", qty: 3 },
    ],
  },
  "INNOFLEX-2125 IBC": {
    machineType: "3layer",
    basePrice: 22751000,
    components: [
      { category: "Extruder", id: "ext-65-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-75-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layeribc-450", qty: 1 },
      { category: "IBC", id: "ibc-system", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "450",
          price: 600000,
          customName: "450 mm Standard Air Ring (20 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "450 mm", "Blower": "20 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "2125",
          price: 2500000,
          customName: "HORIZONTAL HAULOFF - 2125 mm",
          techDesc: { "Hauloff Size": "2125 mm", "Nip roller drive": "3 HP", "Line Speed": "80 MPM" }
        }
      },
      { category: "Tower / Platform", id: "tower-dynamic", qty: 1, metadata: { size: "2125", price: 2000000 } },
      {
        category: "Bubble Cage",
        id: "bc-up-down-dynamic",
        qty: 1,
        metadata: {
          size: "2125",
          price: 800000,
          customName: "9 Segment Motorized Up-Down Bubble Cage - 2125 mm",
          techDesc: { "Segments": "9", "Type": "Motorized Up-Down & Open-Close" }
        }
      },
      { category: "Winder", id: "winder-surface-dynamic", qty: 1, metadata: { size: "2125", price: 4000000 } },
      { category: "Trim Blower", id: "trim-blower-heavy", qty: 1, price: 0 },
    ],
    addons: [
      { category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1 },
    ],
  },
  "INNOFLEX-2370 IBC": {
    machineType: "3layer",
    basePrice: 25851000,
    components: [
      { category: "Extruder", id: "ext-65-coex-long", qty: 2, metadata: { techDesc: { "Material": "Bimetallic screw and barrel" } } },
      { category: "Extruder", id: "ext-75-coex-long", qty: 1, metadata: { techDesc: { "Material": "Bimetallic screw and barrel" } } },
      { category: "Die Head", id: "die-3layeribc-500", qty: 1 },
      { category: "IBC", id: "ibc-system", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "500",
          price: 750000,
          customName: "500 mm Standard Air Ring (25 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "500 mm", "Blower": "25 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "2370",
          price: 2700000,
          customName: "HORIZONTAL HAULOFF - 2370 mm",
          techDesc: { "Hauloff Size": "2370 mm", "Nip roller drive": "5 HP", "Line Speed": "80 MPM" }
        }
      },
      { category: "Tower / Platform", id: "tower-dynamic", qty: 1, metadata: { size: "2370", price: 2350000 } },
      {
        category: "Bubble Cage",
        id: "bc-up-down-dynamic",
        qty: 1,
        metadata: {
          size: "2370",
          price: 900000,
          customName: "9 Segment Motorized Up-Down Bubble Cage - 2370 mm",
          techDesc: { "Segments": "9", "Type": "Motorized Up-Down & Open-Close" }
        }
      },
      { category: "Winder", id: "winder-automatic-dynamic", qty: 1, metadata: { size: "2370", price: 4500000 } },
      { category: "Trim Blower", id: "trim-blower-heavy", qty: 1, price: 0 },
    ],
    addons: [
      { category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1 },
      { category: "Extruder Addons", id: "bimetallic-upgrade-base", qty: 3 },
    ],
  },
  "INNOFLEX-2370 IBC (75/75/75)": {
    machineType: "3layer",
    basePrice: 26045000,
    components: [
      { category: "Extruder", id: "ext-75-coex-long", qty: 3, metadata: { techDesc: { "Material": "Bimetallic screw and barrel", "Main Drive": "100 HP AC motor (ABB)" } } },
      { category: "Die Head", id: "die-3layeribc-500", qty: 1 },
      { category: "IBC", id: "ibc-system", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "500",
          price: 750000,
          customName: "500 mm Standard Air Ring (25 HP)",
          techDesc: { "Design": "Standard Series Air Ring", "Size": "500 mm", "Blower": "25 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "2370",
          price: 2700000,
          customName: "HORIZONTAL HAULOFF - 2370 mm",
          techDesc: { "Hauloff Size": "2370 mm", "Nip roller drive": "5 HP", "Line Speed": "80 MPM" }
        }
      },
      { category: "Tower / Platform", id: "tower-dynamic", qty: 1, metadata: { size: "2370", price: 2350000 } },
      {
        category: "Bubble Cage",
        id: "bc-up-down-dynamic",
        qty: 1,
        metadata: {
          size: "2370",
          price: 900000,
          customName: "9 Segment Motorized Up-Down Bubble Cage - 2370 mm",
          techDesc: { "Segments": "9", "Type": "Motorized Up-Down & Open-Close" }
        }
      },
      { category: "Winder", id: "winder-surface-dynamic", qty: 1, metadata: { size: "2370", price: 4500000 } },
      { category: "Trim Blower", id: "trim-blower-heavy", qty: 1, price: 0 },
    ],
    addons: [
      { category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1 },
      { category: "Extruder Addons", id: "bimetallic-upgrade-base", qty: 3 },
    ],
  },
};
