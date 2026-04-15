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
      { category: "Bubble Cage", id: "bc-open-close-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },

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
            "Idler rollers": "Adequate quantity as per layout.",
            "Oscillation": "360 degree with end limit switch sensing and override protection ensuring even thickness variation distribution on rolls giving excellent roll geometry.",
            "Turnbars": "02 Nos. Hard Anodized Aluminum roller mounted in haul off.",
          }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
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
      { category: "Bubble Cage", id: "bc-open-close-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
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
            "Idler rollers": "Adequate quantity as per layout.",
            "Oscillation": "360 degree with end limit switch sensing and override protection ensuring even thickness variation distribution on rolls giving excellent roll geometry.",
            "Turnbars": "02 Nos. Hard Anodized Aluminum roller mounted in haul off.",
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
          techDesc: {
            "Structure": "Knock-down type tower structure.",
            "Tower Size": "1250 mm",
            "Platforms": "3-walk around platforms.",
            "Staircase": "600 mm wide staircase.",
            "Safety": "Hand rails and kick plates according to European safety standards.",
            "Idler rollers": "Set of 150 mm diameter idler aluminium rollers of 1450 mm face width.",
          }
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
      { category: "Bubble Cage", id: "bc-open-close-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
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
            "Idler rollers": "Adequate quantity as per layout.",
            "Oscillation": "360 degree with end limit switch sensing and override protection ensuring even thickness variation distribution on rolls giving excellent roll geometry.",
            "Turnbars": "02 Nos. Hard Anodized Aluminum roller mounted in haul off.",
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
          techDesc: {
            "Structure": "Knock-down type tower structure.",
            "Tower Size": "1350 mm",
            "Platforms": "3-walk around platforms.",
            "Staircase": "600 mm wide staircase.",
            "Safety": "Hand rails and kick plates according to European safety standards.",
            "Idler rollers": "Set of 150 mm diameter idler aluminium rollers of 1550 mm face width.",
          }
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
  "INNOFLEX-1625": {
    machineType: "3layer",
    basePrice: 9875000,
    components: [
      { category: "Extruder", id: "ext-50-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-65-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layer-325", qty: 1 },
      { category: "Bubble Cage", id: "bc-open-close-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
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
      { category: "Haul-Off", id: "haul-horizontal-heavy", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
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
      { category: "Haul-Off", id: "haul-horizontal-heavy", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
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
      { category: "Haul-Off", id: "haul-horizontal-heavy", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
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
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-heavy", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
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
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-heavy", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
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
      { category: "Air Ring", id: "airring-irish", qty: 1 },
      { category: "Collapsing Frame", id: "cf-wooden", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
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
      { category: "Air Ring", id: "airring-irish", qty: 1 },
      { category: "Collapsing Frame", id: "cf-wooden", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
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
      { category: "Air Ring", id: "airring-5hp-mono", qty: 1 },
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
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
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
      { category: "Air Ring", id: "airring-7.5hp-mono", qty: 1 },
      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-mono", qty: 1 },
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

  "DUOFLEX-60": {
    machineType: "aba",
    basePrice: 5475000,
    components: [
      { category: "Extruder", id: "ext-55-aba", qty: 1 },
      { category: "Extruder", id: "ext-65-aba", qty: 1 },
      { category: "Die Head", id: "die-aba-600", qty: 1 },
      { category: "Air Ring", id: "airring-10hp-mono", qty: 1 },
      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-mono", qty: 1 },
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

  "UNOFLEX-20": {
    machineType: "mono",
    basePrice: 674000,
    components: [
      { category: "Extruder", id: "ext-35-mono-short", qty: 1 },
      { category: "Die Head", id: "die-mono-100", qty: 1 },
      { category: "Air Ring", id: "airring-irish", qty: 1 },
      { category: "Collapsing Frame", id: "cf-wooden", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
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
      { category: "Air Ring", id: "airring-irish", qty: 1 },
      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-wooden", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
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
      { category: "Air Ring", id: "airring-irish", qty: 1 },
      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-wooden", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
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
      { category: "Air Ring", id: "airring-5hp-mono", qty: 1 },
      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-wooden", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
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
      { category: "Air Ring", id: "airring-10hp-mono", qty: 1 },
      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-mono", qty: 1 },
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

  "UNOFLEX-110": {
    machineType: "mono",
    basePrice: 6500000,
    components: [
      { category: "Extruder", id: "ext-90-mono-short", qty: 1 },
      { category: "Die Head", id: "die-mono-600", qty: 1 },
      { category: "Air Ring", id: "airring-15hp-mono", qty: 1 },
      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-mono", qty: 1 },
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
};
