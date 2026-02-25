// src/data/modelPresets.ts

export type PresetComponent = {
  category: string;
  id: string;
  qty?: number;
};

export type PresetConfig = {
  machineType: "mono" | "aba" | "3layer" | "5layer";
  components: PresetComponent[];
  addons?: PresetComponent[];
};

/**
 * MODEL_PRESETS:
 * Keys must match the label / code you set when selecting a model
 * (e.g. "AE-1125").
 */
export const MODEL_PRESETS: Record<string, PresetConfig> = {
  // ---------------------------------------------------------
  // Innoflex 3 Layer – AE-1125
  // ---------------------------------------------------------
  "AE-1125": {
    machineType: "3layer",
    components: [
      // 3-layer extruder package – approximate 40/40/40 with 45/55/45
      { category: "Extruder", id: "ext-40-coex-long", qty: 3 }, // skin extruders

      // 3-layer feedblock
      { category: "Feedblock / Co-extrusion", id: "fb_3l", qty: 1 },

      // 225 mm three-layer die
      { category: "Die Head", id: "die-3layer-225", qty: 1 },

      // Bubble cage & collapsing frame
      { category: "Bubble Cage", id: "bc-6seg-4row-manual", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },

      // Haul-Off + Tower + Winder
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-manual", qty: 1 },
    ],

    addons: [
      // Electrical panel is treated as an add-on in your data
      {
        category: "Electrical & Control Panel",
        id: "panel-acdrive-standard",
        qty: 1,
      },

      // You can add more default add-ons here if you want:
      // { category: "Corona Treater", id: "corona-wideweb-semi-auto", qty: 1 },
      // { category: "Trim Handling", id: "trim-suction-heavy-duty", qty: 1 },
    ],
  },
  "AE-1350A": {
    machineType: "3layer",
    components: [
      { category: "Extruder", id: "ext-45-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-55-coex-long", qty: 1 },
      { category: "Feedblock / Co-extrusion", id: "fb_3l", qty: 1 },
      { category: "Die Head", id: "die-3layer-275", qty: 1 },
      { category: "Bubble Cage", id: "bc-6seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-manual", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "AE-1350B": {
    machineType: "3layer",
    components: [
      { category: "Extruder", id: "ext-50-coex-long", qty: 3 },
      { category: "Feedblock / Co-extrusion", id: "fb_3l", qty: 1 },
      { category: "Die Head", id: "die-3layer-300", qty: 1 },
      { category: "Bubble Cage", id: "bc-6seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-semi-auto", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "AE-1625": {
    machineType: "3layer",
    components: [
      { category: "Extruder", id: "ext-50-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-65-coex-long", qty: 1 },
      { category: "Feedblock / Co-extrusion", id: "fb_3l", qty: 1 },
      { category: "Die Head", id: "die-3layer-325", qty: 1 },
      { category: "Bubble Cage", id: "bc-6seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-semi-auto", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "AE-2370": {
    machineType: "3layer",
    components: [
      { category: "Extruder", id: "ext-75-coex-long", qty: 1 },
      { category: "Extruder", id: "ext-65-coex-long", qty: 2 },
      { category: "Feedblock / Co-extrusion", id: "fb_3l", qty: 1 },
      { category: "Die Head", id: "die-3layer-525", qty: 1 },
      { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-auto", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "AE-2625": {
    machineType: "3layer",
    components: [
      { category: "Extruder", id: "ext-75-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-90-coex-long", qty: 1 },
      { category: "Feedblock / Co-extrusion", id: "fb_3l", qty: 1 },
      { category: "Die Head", id: "die-3layer-575", qty: 1 },
      { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-auto", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },

  "DUOFLEX-750": {
    machineType: "aba",
    components: [
      { category: "Extruder", id: "ext-35-aba-long", qty: 1 },
      { category: "Extruder", id: "ext-45-coex-long", qty: 1 },
      { category: "Feedblock / Co-extrusion", id: "fb_2l", qty: 1 },
      { category: "Die Head", id: "die-aba-70-150", qty: 1 },
      // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-manual", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "DUOFLEX-1000": {
    machineType: "aba",
    components: [
      { category: "Extruder", id: "ext-55-aba-long", qty: 1 },
      { category: "Extruder", id: "ext-45-coex-long", qty: 1 },
      { category: "Feedblock / Co-extrusion", id: "fb_2l", qty: 1 },
      { category: "Die Head", id: "die-aba-125-250", qty: 1 },
      // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-semi-auto", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "DUOFLEX-1250": {
    machineType: "aba",
    components: [
      { category: "Extruder", id: "ext-55-aba-long", qty: 2 },
      { category: "Feedblock / Co-extrusion", id: "fb_2l", qty: 1 },
      { category: "Die Head", id: "die-aba-150-300", qty: 1 },
      // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-semi-auto", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "DUOFLEX-1750": {
    machineType: "aba",
    components: [
      { category: "Extruder", id: "ext-55-aba-long", qty: 1 },
      { category: "Extruder", id: "ext-65-coex-long", qty: 1 },
      { category: "Feedblock / Co-extrusion", id: "fb_2l", qty: 1 },
      { category: "Die Head", id: "die-aba-225-375", qty: 1 },
      // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-semi-auto", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },

  "UNOFLEX-450": {
    machineType: "aba",
    components: [
      { category: "Extruder", id: "ext-35-mono-short", qty: 1 },
      { category: "Feedblock / Co-extrusion", id: "fb_mono", qty: 1 },
      { category: "Die Head", id: "die-mono-50-100", qty: 1 },
      // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-semi-auto", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "UNOFLEX-750_900": {
    machineType: "aba",
    components: [
      { category: "Extruder", id: "ext-45-mono-short", qty: 1 },
      { category: "Feedblock / Co-extrusion", id: "fb_mono", qty: 1 },
      { category: "Die Head", id: "die-mono-90-175", qty: 1 },
      // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-semi-auto", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "UNOFLEX-1000_1250": {
    machineType: "aba",
    components: [
      { category: "Extruder", id: "ext-55-mono-short", qty: 1 },
      { category: "Feedblock / Co-extrusion", id: "fb_mono", qty: 1 },
      { category: "Die Head", id: "die-mono-150-275", qty: 1 },
      // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-semi-auto", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "UNOFLEX-1250_1500": {
    machineType: "aba",
    components: [
      { category: "Extruder", id: "ext-60-mono-short", qty: 1 },
      { category: "Feedblock / Co-extrusion", id: "fb_mono", qty: 1 },
      { category: "Die Head", id: "die-mono-200-325", qty: 1 },
      // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-semi-auto", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "UNOFLEX-2000": {
    machineType: "aba",
    components: [
      { category: "Extruder", id: "ext-75-mono-short", qty: 1 },
      { category: "Feedblock / Co-extrusion", id: "fb_mono", qty: 1 },
      { category: "Die Head", id: "die-mono-300-475", qty: 1 },
      // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-semi-auto", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "UNOFLEX-2500": {
    machineType: "aba",
    components: [
      { category: "Extruder", id: "ext-90-mono-short", qty: 1 },
      { category: "Feedblock / Co-extrusion", id: "fb_mono", qty: 1 },
      { category: "Die Head", id: "die-mono-400-600", qty: 1 },
      // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-semi-auto", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "UNOFLEX-3000": {
    machineType: "aba",
    components: [
      { category: "Extruder", id: "ext-100-mono-short", qty: 1 },
      { category: "Feedblock / Co-extrusion", id: "fb_mono", qty: 1 },
      { category: "Die Head", id: "die-mono-450-700", qty: 1 },
      // { category: "Bubble Cage", id: "bc-9seg-motorized", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-wide", qty: 1 },
      { category: "Haul-Off", id: "haul-horizontal-standard", qty: 1 },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      { category: "Winder", id: "winder-surface-semi-auto", qty: 1 },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },

};
