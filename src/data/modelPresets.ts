// src/data/modelPresets.ts

import { image } from "html2canvas/dist/types/css/types/image";

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
 * (e.g. "INNOFLEX-1120").
 */
export const MODEL_PRESETS: Record<string, PresetConfig> = {
  // ---------------------------------------------------------
  // Innoflex 3 Layer – INNOFLEX-1120
  // ---------------------------------------------------------
  "INNOFLEX-1120": {
    machineType: "3layer",
    basePrice: 6125000,
    components: [
      // 3-layer extruder package – 40/40/40
      { category: "Extruder", id: "ext-40-coex-long", qty: 3 },

      // 225 mm three-layer die
      { category: "Die Head", id: "die-3layer-225", qty: 1 },

      // Bubble cage & collapsing frame
      {
        category: "Bubble Cage",
        id: "bc-open-close-dynamic",
        qty: 1,
        metadata: {
          size: "1000",
          price: 250000,
          customName: "Motorised Bubble Cage - 1120 mm",
          techDesc: { "Type": "Motorized open-close operation with PBT rollers.", "Cage Size": "1120 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-pbt-dynamic", qty: 1 },

      // Air Ring (Missing)
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "225",
          price: 0,
          customName: "225 mm Dual Lip Air Ring (5 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "225 mm", "Blower": "5 HP AC Motor" }
        }
      },

      // Main Nip + Tower + Winder (No Haul-Off — Die Rotation model)
      {
        category: "Main Nip",
        id: "main-nip-dynamic",
        qty: 1,
        metadata: {
          size: "1000",
          price: 1100000,
          customName: "MAIN NIP - 1120 mm",
          scopeDesc: "Collapsing frame with Segmented PBT Roller, side guides, Main Nip with 2 HP AC Drive.",
          techDesc: {
            "Main Nip rollers": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller width": "1120 mm",
            "Nip roller drive": "02 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT rollers.",
            "Idler rollers": "Adequate quantity as per layout.",
          }
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "1000",
          price: 1000000,
          customName: "TOWER / PLATFORM - 1120 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "3-walk around platforms.", "Staircase": "Staircase with hand rails." }
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
      { category: "Die Addons", id: "die-rotation-addon", qty: 1, metadata: { price: 0 } },
    ],
  },
  "INNOFLEX-1370 DR": {
    machineType: "3layer",
    basePrice: 7365000,
    components: [
      { category: "Extruder", id: "ext-45-coex-long", qty: 3 },
      { category: "Die Head", id: "die-3layer-300", qty: 1 },
      {
        category: "Bubble Cage", id: "bc-open-close-dynamic", qty: 1,
        metadata: {
          size: "1350",
          price: 250000,
          customName: "Motorised Bubble Cage - 1370 mm",
          techDesc: { "Type": "Motorized open-close operation with PBT rollers.", "Cage Size": "1370 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-pbt-dynamic", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 0,
          customName: "300 mm Dual Lip Air Ring (10 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "300 mm", "Blower": "10 HP AC Motor" }
        }
      },
      {
        category: "Main Nip",
        id: "main-nip-dynamic",
        qty: 1,
        metadata: {
          size: "1350",
          price: 1150000,
          customName: "MAIN NIP - 1370 mm",
          scopeDesc: "Collapsing frame with Segmented PBT Roller, side guides, Main Nip with 2 HP AC Drive.",
          techDesc: {
            "Main Nip rollers": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller width": "1370 mm",
            "Nip roller drive": "02 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT rollers.",
            "Idler rollers": "Adequate quantity as per layout.",
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
          customName: "TOWER / PLATFORM - 1370 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "3-walk around platforms.", "Staircase": "Staircase with hand rails." }
        }
      },
      {
        category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1,
        metadata: {
          techDesc: {
            "Additional Nip": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Edge slit assembly": "Highly efficient design for trouble free operation reduces trim wastage.",
            "Nip roller width": "1370 mm",
            "Nip roller drive": "02 HP AC motor with variable frequency drive.",
            "Tension control": "Through Torque mode.",
            "Surface Winders (02 Nos.)": "Maximum web width of 1250 mm with Manual Changeover.",
            "Roll diameter": "500 mm diameter or 400 kg weight in single up whichever reaches first. Bow roller prior to drum roller for wrinkle free winding.",
            "Surface winder drive": "02 HP AC motor with variable frequency drive.",
            "Tension control ": "Through Torque mode.",
            "Trim Suction Blower": "Provided",
          }
        }
      },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
      { category: "Die Addons", id: "die-rotation-addon", qty: 1, metadata: { price: 0 } },
    ],
  },
  "INNOFLEX-1370 HO": {
    machineType: "3layer",
    basePrice: 8171000,
    components: [
      { category: "Extruder", id: "ext-45-coex-long", qty: 3 },
      { category: "Die Head", id: "die-3layer-300", qty: 1 },
      {
        category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1,
        metadata: {
          size: "1350",
          price: 250000,
          customName: "Manual Bubble Cage - 1370 mm",
          techDesc: {
            "Type": "Calibration bubble guide basket with 4 arms arranged to provide full support. Bubble contact is through PBT for minimum drag.",
            "Actuation of arms": "Manual open-close operation.",
            "Bubble width range": "750 to 1250 mm",
          }
        }
      },
      { category: "Collapsing Frame", id: "cf-pbt-dynamic", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 0,
          customName: "300 mm Dual Lip Air Ring (10 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "300 mm", "Blower": "10 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1350",
          price: 1150000,
          customName: "HORIZONTAL HAULOFF - 1370 mm",
          techDesc: {
            "Construction": "The haul off will be shipped in assembled parts.",
            "Main Nip rollers": "2 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller width": "1370 mm",
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
          customName: "TOWER / PLATFORM - 1370 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "3-walk around platforms.", "Staircase": "Staircase with hand rails." }
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
  "INNOFLEX-1370-170": {
    machineType: "3layer",
    basePrice: 8751000,
    components: [
      { category: "Extruder", id: "ext-45-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-55-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layer-300", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 0,
          customName: "300 mm Dual Lip Air Ring (10 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "300 mm", "Blower": "10 HP AC Motor" }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic",
        qty: 1,
        metadata: {
          size: "1350",
          price: 250000,
          customName: "Manual Bubble Cage - 1370 mm",
          techDesc: {
            "Type": "Calibration bubble guide basket with 4 arms arranged to provide full support. Bubble contact is through PBT for minimum drag.",
            "Actuation of arms": "Manual open-close operation.",
            "Bubble width range": "750 to 1250 mm",
          }
        }
      },
      { category: "Collapsing Frame", id: "cf-pbt-dynamic", qty: 1 },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1350",
          price: 1150000,
          customName: "HORIZONTAL HAULOFF - 1370 mm",
          techDesc: {
            "Construction": "The haul off will be shipped in assembled parts.",
            "Main Nip rollers": "2 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller width": "1370 mm",
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
          customName: "TOWER / PLATFORM - 1370 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "3-walk around platforms.", "Staircase": "Staircase with hand rails." }
        }
      },
      {
        category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1,
        metadata: {
          techDesc: {
            "Additional Nip": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Edge slit assembly": "Highly efficient design for trouble free operation reduces trim wastage.",
            "Nip roller width": "1370 mm",
            "Nip roller drive": "2 HP AC motor with variable frequency drive.",
            "Tension control": "Through Torque mode.",
            "Surface Winders (02 Nos.)": "Maximum web width of 1250 mm with Manual Changeover.",
            "Roll diameter": "600 mm diameter or 400 kg weight in single up whichever reaches first. Bow roller prior to drum roller for wrinkle free winding.",
            "Surface winder drive": "2 HP AC motor with variable frequency drive.",
            "Tension control ": "Through Torque mode.",
            "Length counter meter": "Provided",
            "Trim Suction Blower": "Provided",
          }
        }
      },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },
  "INNOFLEX-1370-180": {
    machineType: "3layer",
    basePrice: 8925000,
    components: [
      { category: "Extruder", id: "ext-50-coex-long", qty: 3 },
      { category: "Die Head", id: "die-3layer-300", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 425000,
          customName: "300 mm Dual Lip Air Ring (10 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "300 mm", "Blower": "10 HP AC Motor" }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-open-close-dynamic",
        qty: 1,
        metadata: {
          size: "1350",
          price: 250000,
          customName: "Motorised Bubble Cage - 1370 mm",
          techDesc: { "Type": "Motorized open-close operation with PBT rollers.", "Cage Size": "1370 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-pbt-dynamic", qty: 1 },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1350",
          price: 1150000,
          customName: "HORIZONTAL HAULOFF - 1370 mm",
          techDesc: {
            "Construction": "The haul off will be shipped in assembled parts.",
            "Main Nip rollers": "2 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller width": "1370 mm",
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
          customName: "TOWER / PLATFORM - 1370 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "3-walk around platforms.", "Staircase": "Staircase with hand rails." }
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
  "INNOFLEX-1450": {
    machineType: "3layer",
    basePrice: 8971000,
    components: [
      { category: "Extruder", id: "ext-45-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-55-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layer-300", qty: 1 },
      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-dynamic", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 425000,
          customName: "300 mm Dual Lip Air Ring (10 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "300 mm", "Blower": "10 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1500",
          price: 1200000,
          customName: "HORIZONTAL HAULOFF - 1450 mm",
          techDesc: {
            "Construction": "The haul off will be shipped in assembled parts.",
            "Main Nip rollers": "2 Nos. mounted in bearings.",
            "Hauloff Size": "1450 mm",
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
          customName: "TOWER / PLATFORM - 1450 mm",
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
  "INNOFLEX-1620": {
    machineType: "3layer",
    basePrice: 10671000,
    components: [
      { category: "Extruder", id: "ext-50-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-65-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layer-325", qty: 1 },
      { category: "Bubble Cage", id: "bc-open-close-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-dynamic", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "325",
          price: 475000,
          customName: "325 mm Dual Lip Air Ring (15 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "325 mm", "Blower": "15 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1750",
          price: 1400000,
          customName: "HORIZONTAL HAULOFF - 1620 mm",
          techDesc: {
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
          customName: "TOWER / PLATFORM - 1620 mm",
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
  "INNOFLEX-1870-250": {
    machineType: "3layer",
    basePrice: 11645000,
    components: [
      { category: "Extruder", id: "ext-55-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-65-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layer-400", qty: 1 },
      {
        category: "Bubble Cage",
        id: "bc-open-close-dynamic",
        qty: 1,
        metadata: {
          size: "1750",
          price: 0,
          customName: "Motorised Bubble Cage - 1870 mm",
          techDesc: { "Type": "Motorized open-close operation.", "Cage Size": "1870 mm" }
        }
      },
      { category: "Collapsing Frame", id: "cf-pbt-dynamic", qty: 1, metadata: { size: "1870" } },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "400",
          price: 0,
          customName: "400 mm Dual Lip Air Ring (15 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "400 mm", "Blower": "15 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1750",
          price: 0,
          customName: "HORIZONTAL HAULOFF - 1870 mm",
          techDesc: {
            "Oscillation": "360 degree oscillating mechanism.",
            "Nip roller drive": "3 HP AC motor (Bonvario, Italy)",
            "Max linespeed": "80 MPM"
          }
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "1870",
          price: 0,
          customName: "TOWER / PLATFORM - 1870 mm",
          techDesc: { "Structure": "Knock-down type tower structure.", "Platforms": "3-walk around platforms." }
        }
      },
      { category: "Winder", id: "winder-manual-back-to-back-dynamic", qty: 1, metadata: { size: "1750" } },
    ],

    addons: [
      { category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1 },
    ],
  },
  "INNOFLEX-1870-220": {
    machineType: "3layer",
    basePrice: 10651000,
    components: [
      { category: "Extruder", id: "ext-55-coex-long", qty: 3 },
      { category: "Die Head", id: "die-3layer-375", qty: 1 },
      { category: "Bubble Cage", id: "bc-open-close-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-dynamic", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "375",
          price: 525000,
          customName: "375 mm Dual Lip Air Ring (15 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "375 mm", "Blower": "15 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1850",
          price: 1500000,
          customName: "HORIZONTAL HAULOFF - 1870 mm",
          // techDesc removed to match screenshot
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "1850",
          price: 1650000,
          customName: "TOWER / PLATFORM - 1870 mm",
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
      { category: "Collapsing Frame", id: "cf-pbt-dynamic", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "400",
          price: 575000,
          customName: "400 mm Dual Lip Air Ring (15 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "400 mm", "Blower": "15 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "2000",
          price: 1800000,
          customName: "HORIZONTAL HAULOFF - 1970 mm",
          // techDesc removed to match screenshot
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "2000",
          price: 1800000,
          customName: "TOWER / PLATFORM - 1970 mm",
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
  "INNOFLEX-2120": {
    machineType: "3layer",
    basePrice: 13700000,
    components: [
      { category: "Extruder", id: "ext-65-coex-long", qty: 3 },
      { category: "Die Head", id: "die-3layer-450", qty: 1 },
      { category: "Bubble Cage", id: "bc-up-down-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-dynamic", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "450",
          price: 800000,
          customName: "450 mm Dual Lip Air Ring (20 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "450 mm", "Blower": "20 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "2250",
          price: 2500000,
          customName: "HORIZONTAL HAULOFF - 2120 mm",
          // techDesc removed to match screenshot
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "2120",
          price: 2000000,
          customName: "TOWER / PLATFORM - 2120 mm",
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
    basePrice: 19451000,
    components: [
      { category: "Extruder", id: "ext-65-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-75-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layer-525", qty: 1 },
      { category: "Bubble Cage", id: "bc-up-down-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-dynamic", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "525",
          price: 0,
          customName: "525 mm Dual Lip Air Ring (25 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "525 mm", "Blower": "25 HP AC Motor" }
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
          // techDesc removed to match screenshot
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
  "INNOFLEX-2620": {
    machineType: "3layer",
    basePrice: 21575000,
    components: [
      { category: "Extruder", id: "ext-65-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-75-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layer-550", qty: 1 },
      { category: "Bubble Cage", id: "bc-up-down-dynamic", qty: 1 },
      { category: "Collapsing Frame", id: "cf-pbt-dynamic", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "550",
          price: 850000,
          customName: "550 mm Dual Lip Air Ring (25 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "550 mm", "Blower": "25 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "2750",
          price: 3200000,
          customName: "HORIZONTAL HAULOFF - 2620 mm",
          // techDesc removed to match screenshot
        }
      },
      {
        category: "Tower / Platform",
        id: "tower-dynamic",
        qty: 1,
        metadata: {
          size: "2620",
          price: 2620000,
          customName: "TOWER / PLATFORM - 2620 mm",
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



  "DUOFLEX-32": {
    machineType: "aba",
    basePrice: 1750000,
    components: [
      {
        category: "Extruder",
        id: "ext-35-aba",
        qty: 1,
        metadata: {
          scopeDesc: "Two Nos. Extruders of 35/45 mm screw diameter and L/D ratio of 30:1, Nitro Alloy screw & barrel, Ceramic Heater, 7.5/15 HP AC Motor & AC variable frequency Drive. Two Candle type Screen Changers for 35/45 mm Extruders."
        }
      },
      { category: "Extruder", id: "ext-45-aba", qty: 1 },
      {
        category: "Die Head",
        id: "die-aba-150",
        qty: 1,
        metadata: {
          scopeDesc: "One Chrome plated Three Layer Spiral Mandrel Die with lip diameter as per width, complete with die adapters and carriage."
        }
      },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic-aba",
        qty: 1,
        metadata: {
          size: "150",
          price: 0,
          customName: "150 mm G-Series Air Ring",
          scopeDesc: "Air Ring Package consisting of highly efficient air ring, distributor manifold, High Pressure 5 HP Blower.",
          techDesc: {
            "Construcion": "Aluminum body aerodynamic type air cooling ring for cooling.\nThe airing had circular casing with many entry ports 4 efficient cooling.",
            "Blower": "5 HP with inlet air filter."
          }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic-aba",
        qty: 1,
        metadata: {
          size: "750",
          scopeDesc: "One Bubble Stabilizing Basket with Diameter adjustment.",
          techDesc: {
            "Type": "Bubble Cage to support the bubble."
          }
        }
      },
      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          size: "800",
          price: 0,
          customName: "Main Nip - 800 mm",
          scopeDesc: "Main Nip with 1 HP AC Drive. Wooden Slates/PBT roller Collapsing Frame.",
          techDesc: {
            "Main Nip rollers": "2 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller width": "800 mm",
            "Nip roller drive": "1 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT roller / Wooden Slates frame.",
            "Construction": "hidden",
            "Material": "hidden",
            "Adjustment": "hidden",
            "Width Capability": "hidden",
            "Application": "hidden"
          }
        }
      },
      {
        category: "Winder",
        id: "winder-single-surface-only-dynamic",
        qty: 1,
        metadata: {
          size: "750",
          price: 0,
          customName: "Single Surface Winder - 750 mm",
          scopeDesc: "Single Surface Winders of 750 mm film width. 3\" mechanical Shaft – 04 Nos.",
          techDesc: {
            "Surface Winder (01 No.)": "Maximum web width of 750 mm with Manual Changeover.\nBow roller prior to drum roller for wrinkle free winding.",
            "Surface Winders (01 No.)": "hidden",
            "Surface winder drive": "1 HP AC motor with variable frequency drive.",
            "Tension control": "Through Torque mode.",
            "Winder Type": "Single Surface type."
          }
        }
      },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-dol-starter", qty: 1,
      },
    ],
  },

  "DUOFLEX-36": {
    machineType: "aba",
    basePrice: 2487000,
    components: [
      {
        category: "Extruder",
        id: "ext-35-aba",
        qty: 1,
        metadata: {
          scopeDesc: "Two Nos. Extruders of 35/45 mm screw diameter and L/D ratio of 30:1, Nitro Alloy screw & barrel, Ceramic Heater, 7.5/15 HP AC Motor & AC variable frequency Drive. Two Candle type Screen Changers for 35/45 mm Extruders."
        }
      },
      { category: "Extruder", id: "ext-45-aba", qty: 1 },
      {
        category: "Die Head",
        id: "die-aba-150",
        qty: 1,
        metadata: {
          scopeDesc: "One Chrome plated Three Layer Spiral Mandrel Die with lip diameter as per width, complete with die adapters and carriage."
        }
      },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic-aba",
        qty: 1,
        metadata: {
          size: "150",
          price: 0,
          customName: "150 mm G-Series Air Ring",
          scopeDesc: "Air Ring Package consisting of highly efficient air ring, distributor manifold, High Pressure 5 HP Blower.",
          techDesc: {
            "Construcion": "Aluminum body aerodynamic type air cooling ring for cooling.\nThe airing had circular casing with many entry ports 4 efficient cooling.",
            "Blower": "5 HP with inlet air filter."
          }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic-aba",
        qty: 1,
        metadata: {
          size: "850",
          scopeDesc: "One Bubble Stabilizing Basket with Diameter adjustment.",
          techDesc: {
            "Type": "Bubble Cage to support the bubble."
          }
        }
      },
      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          size: "900",
          price: 0,
          customName: "Main Nip - 900 mm",
          scopeDesc: "Main Nip with 1 HP AC Drive. Wooden Slates/PBT roller Collapsing Frame.",
          techDesc: {
            "Main Nip rollers": "2 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller width": "900 mm",
            "Nip roller drive": "1 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT roller / Wooden Slates frame.",
            "Construction": "hidden",
            "Material": "hidden",
            "Adjustment": "hidden",
            "Width Capability": "hidden",
            "Application": "hidden"
          }
        }
      },
      {
        category: "Winder",
        id: "winder-manual-back-to-back-dynamic",
        qty: 1,
        metadata: {
          size: "850",
          techDesc: {
            "Surface Winder (02 No.)": "Maximum web width of 850 mm with Manual Changeover.\nBow roller prior to drum roller for wrinkle free winding.",
            "Surface Winders (01 No.)": "hidden",
            "Roll diameter": "hidden",
            "Surface winder drive": "0.5 HP Torque motor with variable frequency drive.",
            "Tension control ": "hidden",
            "Tension control": "Through Torque mode.",
            "Winder Type": "Dual Surface type."
          }
        }
      },
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
      {
        category: "Extruder",
        id: "ext-40-aba",
        qty: 1,
        metadata: {
          scopeDesc: "Two Nos. Extruders of 40/45 mm screw diameter and L/D ratio of 30:1, Nitro Alloy screw & barrel, Ceramic Heater, 10/15 HP AC Motor & AC variable frequency Drive. Two Candle type Screen Changers for 40/45 mm Extruders."
        }
      },
      { category: "Extruder", id: "ext-45-aba", qty: 1 },
      {
        category: "Die Head",
        id: "die-aba-200",
        qty: 1,
        metadata: {
          scopeDesc: "One Chrome plated Three Layer Spiral Mandrel Die with lip diameter as per width, complete with die adapters and carriage."
        }
      },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic-aba",
        qty: 1,
        metadata: {
          size: "200",
          price: 0,
          customName: "200 mm G-Series Air Ring",
          scopeDesc: "Air Ring Package consisting of highly efficient air ring, distributor manifold, High Pressure 5 HP Blower.",
          techDesc: {
            "Blower": "5 HP with inlet air filter."
          }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic-aba",
        qty: 1,
        metadata: {
          size: "1000",
          price: 55000,
          customName: "Manual BC - 1000 mm",
          scopeDesc: "One Bubble Stabilizing Basket with Diameter adjustment.",
          techDesc: {
            "Type": "Calibration bubble guide basket arranged to provide full support. Bubble contact is through PBT for minimum drag.",
            "Actuation of ring": "Manual open-close operation.",
            "Bubble diameter range": "600 to 950 mm"
          }
        }
      },
      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          size: "1050",
          price: 0,
          customName: "Main Nip - 1050 mm",
          scopeDesc: "Main Nip with 1 HP AC Drive. Wooden Slates Collapsing Frame. Gusset included.",
          techDesc: {
            "Width Capability": "950 mm layflat"
          }
        }
      },
      {
        category: "Winder",
        id: "winder-single-surface-only-dynamic",
        qty: 1,
        metadata: {
          size: "1000",
          customName: "Single Surface Winder - 1000 mm",
          scopeDesc: "Single Surface Winders of 1000 mm film width. 3” mechanical Shaft – 02 Nos.",
          techDesc: {
            "Surface Winder (01 No.)": "hidden",
            "Roll diameter": "hidden",
            "Surface Winders (01 No.)": "hidden",
            "Surface Winder (02 No.)": "Maximum web width of 950 mm with Manual Changeover.\nBow roller prior to drum roller for wrinkle free winding."
          }
        }
      },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-dol-starter", qty: 1,
      },
    ],
  },

  "DUOFLEX-50": {
    machineType: "aba",
    basePrice: 5981000,
    components: [
      { category: "Extruder", id: "ext-45-aba", qty: 1 },
      { category: "Extruder", id: "ext-55-aba", qty: 1 },
      { category: "Die Head", id: "die-aba-300", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic-aba",
        qty: 1,
        metadata: {
          size: "300",
          price: 350000,
          customName: "300 mm G-Series Air Ring"
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic-aba",
        qty: 1,
        metadata: {
          size: "1250",
          price: 55000,
          customName: "Manual BC - 1250 mm"
        }
      },
      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          price: 0,
          customName: "MAIN NIP",
          techDesc: {
            "Main Nip rollers": "2 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller width": "1370 mm",
            "Nip roller drive": "2 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT rolls.",
            "Idler rollers": "Adequate quantity as per layout.",
            "Construction": "hidden",
            "Material": "hidden",
            "Adjustment": "hidden",
            "Width Capability": "hidden",
            "Application": "hidden"
          }
        }
      },
      {
        category: "Winder",
        id: "winder-manual-back-to-back-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          customName: "SURFACE WINDER",
          techDesc: {
            "Surface Winders (01 No.)": "hidden",
            "Surface Winders (02 Nos.)": "hidden",
            "Nip roller width": "hidden",
            "Nip roller drive": "hidden",
            "Roll diameter": "hidden",
            "Length counter meter": "hidden",
            "Trim Suction Blower": "hidden",
            "Tension control ": "hidden",
            "Surface Winder (02 No.)": "Maximum web width of 1250 mm with Manual Changeover.\nBow roller prior to drum roller for wrinkle free winding.",
            "Surface winder drive": "1 HP AC motor with variable frequency drive.",
            "Tension control": "Through Torque mode.",
            "Type of Winder": "Back to Back Surface Winder"
          }
        }
      },
    ],

    addons: [
      { category: "Die Addons", id: "die-rotation-addon", qty: 1, metadata: { size: "300" } },
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },

  "DUOFLEX-50-65/55": {
    machineType: "aba",
    basePrice: 7625000,
    components: [
      { category: "Extruder", id: "ext-55-aba", qty: 1 },
      { category: "Extruder", id: "ext-65-aba", qty: 1 },
      { category: "Die Head", id: "die-aba-350", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic-aba",
        qty: 1,
        metadata: {
          size: "350",
          price: 0,
          customName: "350 mm G-Series Air Ring (10 HP)",
          techDesc: {
            "Blower": "10 HP with inlet air filter."
          }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic-aba",
        qty: 1,
        metadata: {
          size: "1250",
          customName: "Manual BC - 1250 mm"
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          customName: "HORIZONTAL HAULOFF - 1250 mm",
          scopeDesc: "One 360-degree rotation Horizontal Oscillating Haul Off. Collapsing frame with Segmented PBT Roller, side guides, Main Nip with 2 HP AC Drive.",
          techDesc: {
            "Hauloff Size": "1250 mm",
            "Nip roller width": "1370 mm"
          }
        }
      },
      {
        category: "Winder",
        id: "winder-single-surface-only-dynamic",
        qty: 1,
        metadata: {
          size: "1250",
          techDesc: {
            "Nip roller width": "1370 mm",
            "Surface Winder (01 No.)": "hidden"
          }
        }
      },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1,
      },
    ],
  },

  "DUOFLEX-20": {
    machineType: "aba",
    basePrice: 1585000,
    components: [
      { category: "Extruder", id: "ext-35-aba", qty: 2 },
      { category: "Die Head", id: "die-aba-75", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic-aba",
        qty: 1,
        metadata: {
          size: "75",
          price: 0,
          customName: "75 mm Air Ring (2 HP Blower)",
          techDesc: {
            "Blower": "2 HP with inlet air filter."
          }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic-aba",
        qty: 1,
        metadata: {
          size: "500",
          price: 0,
          customName: "Manual BC - 500 mm"
        }
      },
      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          size: "500",
          price: 0,
          customName: "Collapsing Frame - 500 mm",
          techDesc: {
            "Main Nip rollers": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller width": "500 mm",
            "Nip roller drive": "01 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT rollers / Wooden Slates.",
            "Construction": "hidden",
            "Material": "hidden",
            "Adjustment": "hidden",
            "Width Capability": "hidden",
            "Application": "hidden"
          }
        }
      },
      // {
      //   category: "Haul-Off",
      //   id: "haul-horizontal-dynamic",
      //   qty: 1,
      //   metadata: {
      //     size: "500",
      //     customName: "HORIZONTAL HAULOFF - 500 mm",
      //     techDesc: {
      //       "Hauloff Size": "500 mm",
      //       "Nip roller width": "500 mm",
      //       "Nip roller drive": "1 HP AC motor with variable frequency drive."
      //     }
      //   }
      // },
      {
        category: "Winder",
        id: "winder-single-surface-only-dynamic",
        qty: 1,
        metadata: {
          size: "450",
          techDesc: {
            "Surface Winder (01 No.)": "hidden",
            "Surface Winder (02 No.)": "hidden",
            "Surface Winders (01 No.)": "hidden",
            "Surface Winder": "Maximum web width of 450 mm with Manual Changeover.",
            "Roll diameter": "400 mm diameter or 100 kg weight in single up Which ever reaches first. Bow roller prior to drum roller for wrinkle free winding.",
            "Surface winder drive": "0.5 HP AC motor with variable frequency drive.",
            "Tension control": "Through Torque mode."
          }
        }
      },
    ],
    addons: [
      { category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1 },
    ],
  },

  "DUOFLEX-26": {
    machineType: "aba",
    basePrice: 1585000,
    components: [
      {
        category: "Extruder",
        id: "ext-35-aba",
        qty: 1,
        metadata: {
          customName: "Extruder 35 mm",
          techDesc: {
            "Barrel": "Water cooled grooved feed section",
            "Material": "Nitro Alloy.",
            "Heating System": "Ceramic Band type Heaters (Hitco or equivalent)",
            "No. of Zones": "02 Nos. on barrel",
            "Transmission System": "Motor directly coupled / Belt with helical gearbox.",
            "Gearbox": "Premium or equivalent make."
          }
        }
      },
      {
        category: "Extruder",
        id: "ext-40-aba",
        qty: 1,
        metadata: {
          customName: "Extruder 40 mm",
          techDesc: {
            "Barrel": "Water cooled grooved feed section",
            "Material": "Nitro Alloy.",
            "Heating System": "Ceramic Band type Heaters",
            "No. of Zones": "02 Nos. on barrel",
            "Main Drive": "10 HP AC motor (ABB) with frequency variable drive.",
            "Transmission System": "Motor directly coupled / Belt with helical gearbox.",
            "Gearbox": "Zeal or equivalent make."
          }
        }
      },
      {
        category: "Die Head",
        id: "die-aba-100",
        qty: 1,
        metadata: {
          scopeDesc: "One Chrome plated Three Layer ABA Spiral Mandrel Die and lip diameter of 100 mm, complete with die adapters and carriage.",
          techDesc: {
            "Surface Treatment": "Chrome plated & highly polished melt paths.",
            "Die Size": "Diameter as per width and lip gap.",
            "Die setting": "Die adjusting bolts will be provided.",
            "Heating System": "Ceramic band heaters (Hitco or equivalent)",
            "Heating Zones": "hidden",
            "Distribution": "hidden"
          }
        }
      },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "100",
          price: 0,
          customName: "Air Ring (3 HP)",
          techDesc: {
            "Design": "hidden",
            "Construction": "hidden",
            "Cooling": "hidden",
            "Construcion": "Aluminum body aerodynamic type air cooling ring for cooling. The airing had circular casing with many entry ports 4 efficient cooling.",
            "Blower": "3 HP with inlet air filter."
          }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic",
        qty: 1,
        metadata: {
          size: "550",
          customName: "Irish Ring",
          scopeDesc: "One Irish Ring to support the bubble.",
          techDesc: {
            "Type": "Manual Cage to Support the bubble."
          }
        }
      },
      {
        category: "Collapsing Frame",
        id: "main-nip-dynamic",
        qty: 1,
        metadata: {
          size: "550",
          customName: "Collapsing Frame",
          scopeDesc: "Collapsing frame with Segmented wooden slates, side guides, Main Nip with 1 HP AC Drive.",
          techDesc: {
            "Main Nip rollers": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically. Knurling Provided",
            "Nip roller width": "600 mm",
            "Nip roller drive": "1 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "Wooden Slates.",
            "Construction": "hidden",
            "Material": "hidden",
            "Adjustment": "hidden",
            "Width Capability": "hidden",
            "Application": "hidden",
            "Idler rollers": "Adequate quantity as per layout."
          }
        }
      },
      {
        category: "Winder",
        id: "winder-single-surface-only-dynamic",
        qty: 1,
        metadata: {
          size: "550",
          customName: "Single Surface Winder",
          scopeDesc: "One Surface Winders of 550 mm film width. Manual roll change over mechanism, 02 nos.- 3” Mechanical shaft, bow roller, 0.5 HP Torque Motor and Drive.",
          techDesc: {
            "Additional Nip": "hidden",
            "Edge slit assembly": "hidden",
            "Length counter meter": "hidden",
            "Trim Suction Blower": "hidden",
            "Surface Winder (01 No.)": "hidden",
            "Surface Winder (02 No.)": "hidden",
            "Surface Winders (01 No.)": "hidden",
            "Surface Winder": "Maximum web width of 550 mm with Manual Changeover.",
            "Roll diameter": "400 mm diameter or 100 kg weight in single up Which ever reaches first.\nBow roller prior to drum roller for wrinkle free winding.",
            "Surface winder drive": "0.5 HP AC motor with variable frequency drive.",
            "Tension control": "Through Torque mode."
          }
        }
      }
    ],
    addons: [
      { category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1 },
    ],
  },

  "UNOFLEX-20": {
    machineType: "mono",
    basePrice: 820000,
    components: [
      {
        category: "Extruder",
        id: "ext-35-mono-short",
        qty: 1,
        metadata: {
          scopeDesc: "One Nos. Extruders of 35 mm screw diameter and L/D ratio of 28:1, Screw & barrel, Ceramic Heater, 7.5 HP AC Motor & AC variable frequency Drive. One Candle type Manual Screen Changers for 35 mm Extruders.",
          techDesc: {
            "Screw Diameter": "35 mm single screw extruder mounted on a sturdy frame.",
            "L/D ratio": "28:1",
            "Type": "hidden",
            "Screw Speed": "hidden",
            "No. of Heating Zones": "hidden",
            "Barrel": "Water cooled grooved feed section",
            "Material": "Nitro Alloy.",
            "Heating System": "Ceramic Band type Heaters",
            "No. of Zones": "02 Nos. on barrel",
            "Hopper": "MS fabricated with glass window for visual inspection. Magnetic grill provided.",
            "Main Drive": "7.5 HP AC motor with frequency variable drive.",
            "Transmission System": "Motor Belt coupled with helical gearbox.",
            "Gearbox": "Zeal or equivalent make.",
            "Screen Changer": "Candle type"
          }
        }
      },
      {
        category: "Die Head",
        id: "die-mono-100",
        qty: 1,
        metadata: {
          scopeDesc: "One Chrome plated Mono Layer Spiral Mandrel Die and lip diameter of as per widths, complete with die adapters and carriage.",
          techDesc: {
            "Type": "hidden",
            "Material of Construction": "Hardened high strength alloy steel.",
            "Surface Treatment": "Electroless Nickel plated & highly polished melt paths.",
            "Die Size": "Diameter as per width and lip gap.",
            "Die setting": "Die adjusting bolts will be provided.",
            "Heating Zones": "02 Nos.",
            "Heating System": "Ceramic band heaters"
          }
        }
      },
      {
        category: "Air Ring",
        id: "airring-g-dynamic",
        qty: 1,
        metadata: {
          size: "100",
          price: 0,
          customName: "100 mm Air Ring",
          scopeDesc: "Air Ring Package consisting of highly efficient air ring, distributor manifold, High Pressure 3 HP Blower.",
          techDesc: {
            "Design": "hidden",
            "Construction": "hidden",
            "Cooling": "hidden",
            "Construcion": "Aluminum body aerodynamic type air cooling ring for cooling. The airing had circular casing with many entry ports 4 efficient cooling.",
            "Blower": "03 HP with inlet air filter."
          }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic-aba",
        qty: 1,
        metadata: {
          size: "450",
          price: 0,
          customName: "Manual Cage",
          scopeDesc: "One Manual Cage to support the bubble."
        }
      },

      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          size: "450",
          customName: "Collapsing Frame - 450 mm",
          scopeDesc: "Collapsing frame with Segmented wooden slates, side guides, Main Nip with 1 HP AC Drive.",
          techDesc: {
            "Main Nip rollers": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller width": "450 mm",
            "Nip roller drive": "01 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "Wooden Slates."
          }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      {
        category: "Winder",
        id: "winder-single-surface-only-dynamic",
        qty: 1,
        metadata: {
          size: "500",
          customName: "Single Surface Winder - 500 mm",
          scopeDesc: "One Surface Winders of 500 mm film width. Manual roll change over mechanism, 02 nos.- 3” Mechanical shaft, bow roller, 0.5 HP Torque Motor and Drive.",
          techDesc: {
            "Winder Type": "hidden",
            "Surface Winder (01 No.)": "hidden",
            "Surface Winder (02 No.)": "hidden",
            "Surface Winders (01 No.)": "hidden",
            "Surface Winder": "Maximum web width of 450 mm with Manual Changeover.",
            "Roll diameter": "300 mm diameter or 100 kg weight in single up Which ever reaches first. Bow roller prior to drum roller for wrinkle free winding.",
            "Surface winder drive": "01 HP AC motor with variable frequency drive.",
            "Tension control": "Through Torque mode."
          }
        }
      },
      {
        category: "Electrical & Control Panel",
        id: "panel-dol-starter",
        qty: 1,
        metadata: {
          customName: "Extrusion Control Panel",
          scopeDesc: "Complete extrusion controls on main panel with Cold start protection."
        }
      },
    ],

    addons: [
    ],
  },

  "UNOFLEX-24": {
    machineType: "mono",
    basePrice: 850000,
    components: [
      {
        category: "Extruder",
        id: "ext-mono-40",
        qty: 1,
        metadata: {
          image: "/images/Extruder/Extruder ABA.png",
          customName: "40 mm Extruder",
          scopeDesc: "One Nos. Extruders of 40 mm screw diameter and L/D ratio of 28:1, Screw & barrel, Ceramic Heater, 10 HP AC Motor & AC variable frequency Drive. One Candle type Manual Screen Changers for 40 mm Extruders.",
          techDesc: {
            "Screw Diameter": "40 mm single screw extruder mounted on a sturdy frame.",
            "L/D ratio": "28:1",
            "Barrel": "Water cooled grooved feed section",
            "Material": "Nitro Alloy.",
            "Heating System": "Ceramic Band type Heaters",
            "No. of Zones": "02 Nos. on barrel",
            "Hopper": "MS fabricated with glass window for visual inspection. Magnetic grill provided.",
            "Main Drive": "10 HP AC motor (ABB) with frequency variable drive.",
            "Transmission System": "Motor directly coupled / Belt with helical gearbox.",
            "Gearbox": "Zeal or equivalent make.",
            "Screen Changer": "Candle type"
          }
        }
      },
      {
        category: "Die Head",
        id: "die-mono-100",
        qty: 1,
        metadata: {
          scopeDesc: "One Chrome plated Mono Layer Spiral Mandrel Die and lip diameter of as per widths, complete with die adapters and carriage.",
          techDesc: {
            "Type": "hidden",
            "Material of Construction": "Hardened high strength alloy steel.",
            "Surface Treatment": "Chrome plated & highly polished melt paths.",
            "Die Size": "Diameter as per width and lip gap.",
            "Die setting": "Die adjusting bolts will be provided.",
            "Heating Zones": "02 Nos.",
            "Heating System": "Ceramic band heaters"
          }
        }
      },
      {
        category: "Air Ring",
        id: "airring-g-dynamic",
        qty: 1,
        metadata: {
          size: "150",
          price: 0,
          customName: "150 mm Air Ring",
          scopeDesc: "Air Ring Package consisting of highly efficient air ring, distributor manifold, High Pressure 3 HP Blower.",
          techDesc: {
            "Design": "hidden",
            "Construction": "hidden",
            "Cooling": "hidden",
            "Construcion": "Aluminum body aerodynamic type air cooling ring for cooling. The airing had circular casing with many entry ports 4 efficient cooling.",
            "Blower": "3 HP"
          }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic-aba",
        qty: 1,
        metadata: {
          size: "600",
          price: 0,
          customName: "Manual Cage",
          scopeDesc: "One Manual Bubble cage to support the bubble.",
          techDesc: {
            "Type": "Manual cage to Support the bubble.",
            "Support Rollers": "hidden",
            "Adjustment": "hidden",
            "Film Width Range": "hidden",
            "Construction": "hidden"
          }
        }
      },

      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          size: "600",
          customName: "Collapsing Frame - 600 mm",
          scopeDesc: "Collapsing frame with Segmented wooden slates, side guides, Main Nip with 1 HP AC Drive.",
          techDesc: {
            "Main Nip rollers": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller width": "600 mm",
            "Nip roller drive": "01 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "Wooden Slates."
          }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      {
        category: "Winder",
        id: "winder-single-surface-only-dynamic",
        qty: 1,
        metadata: {
          size: "600",
          customName: "Surface Winder - 600 mm",
          scopeDesc: "One Surface Winders of 600 mm film width. Manual roll change over mechanism, 02 nos.- 3” Mechanical shaft, bow roller, 0.5 HP Torque Motor and Drive.",
          techDesc: {
            "Winder Type": "hidden",
            "Surface Winder (01 No.)": "hidden",
            "Surface Winder (02 No.)": "hidden",
            "Surface Winders (01 No.)": "hidden",
            "Surface Winder": "Maximum web width of 550 mm with Manual Changeover.\nBow roller prior to drum roller for wrinkle free winding.",
            "Surface winder drive": "0.5 HP Torque motor with variable frequency drive.",
            "Tension control": "Through Torque mode."
          }
        }
      },
      {
        category: "Electrical & Control Panel",
        id: "panel-dol-starter",
        qty: 1,
        metadata: {
          customName: "Extrusion Control Panel",
          scopeDesc: "Complete extrusion controls on main panel with Cold start protection."
        }
      },
    ],
    addons: []
  },

  "UNOFLEX-32": {
    machineType: "mono",
    basePrice: 1185000,
    components: [
      {
        category: "Extruder",
        id: "ext-45-mono-short",
        qty: 1,
        metadata: {
          scopeDesc: "One Nos. Extruders of 45 mm screw diameter and L/D ratio of 28:1, Nitro Alloy Screw & barrel, Ceramic Heater, 15 HP AC Motor & AC variable frequency Drive. One Candle type Manual Screen Changers for 45 mm Extruders.",
          techDesc: {
            "Screw Diameter": "45 mm single screw extruder mounted on a sturdy Frame.",
            "L/D ratio": "30:1",
            "Type": "hidden",
            "Screw Speed": "hidden",
            "No. of Heating Zones": "hidden",
            "Barrel": "Water cooled grooved feed section",
            "Material": "Nitro Alloy steel",
            "Heating System": "Ceramic Band type Heaters",
            "No. of Zones": "02 Nos. on barrel",
            "Hopper": "MS fabricated with glass window for visual Inspection. Magnetic grill provided.",
            "Main Drive": "15 HP AC motor (ABB/ BB) with frequency variable drive.",
            "Transmission System": "Motor coupled with helical gearbox.",
            "Screen Changer": "Candle type"
          }
        }
      },
      {
        category: "Die Head",
        id: "die-mono-150",
        qty: 1,
        metadata: {
          scopeDesc: "One Chrome plated Mono Layer Spiral Mandrel Die and lip diameter of 150 mm, complete with die adapters and carriage.",
          techDesc: {
            "Type": "hidden",
            "Material of Construction": "Hardened high strength alloy steel.",
            "Surface Treatment": "Electroless Nickel / plated & highly polished melt paths.",
            "Die Size": "Diameter as per width and lip gap.",
            "Die setting": "Die adjusting bolts will be provided.",
            "Heating Zones": "02 Nos.",
            "Heating System": "Ceramic band heaters (Hitco or equivalent)"
          }
        }
      },
      {
        category: "Air Ring",
        id: "airring-g-dynamic",
        qty: 1,
        metadata: {
          size: "150",
          price: 0,
          customName: "150 mm Air Ring",
          scopeDesc: "Air Ring Package consisting of highly efficient air ring, distributor manifold, High Pressure 3 HP Blower.",
          techDesc: {
            "Design": "hidden",
            "Construction": "hidden",
            "Cooling": "hidden",
            "Construcion": "Aluminum body aerodynamic type air cooling ring for cooling. The airing had circular casing with many entry ports 4 efficient cooling.",
            "Blower": "3 HP with inlet air filter."
          }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic-aba",
        qty: 1,
        metadata: {
          size: "750",
          price: 0,
          customName: "Manual Cage",
          scopeDesc: "One Manual Bubble cage to support the bubble.",
          techDesc: {
            "Type": "Manual cage to Support the bubble.",
            "Support Rollers": "hidden",
            "Adjustment": "hidden",
            "Film Width Range": "hidden",
            "Construction": "hidden"
          }
        }
      },
      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          size: "800",
          customName: "Collapsing Frame - 800 mm",
          scopeDesc: "Collapsing frame with Segmented wooden slates, side guides, Main Nip with 1 HP AC Drive. Gusset included.",
          techDesc: {
            "Main Nip rollers": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller width": "800 mm",
            "Nip roller drive": "01 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "Wooden Slates."
          }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      {
        category: "Winder",
        id: "winder-single-surface-only-dynamic",
        qty: 1,
        metadata: {
          size: "750",
          customName: "Back to Back Surface Winder - 750 mm",
          scopeDesc: "One Surface Winder of 750 mm film width. Manual roll change over mechanism, 02 nos.- 3” Mechanical shaft, bow roller, 0.5 HP AC Motor and Drive.",
          techDesc: {
            "Winder Type": "hidden",
            "Surface Winder (01 No.)": "hidden",
            "Surface Winder (02 No.)": "hidden",
            "Surface Winders (01 No.)": "hidden",
            "Surface Winder": "Maximum web width of 750 mm with Manual Changeover.",
            "Roll diameter": "300 mm diameter or 100 kg weight in single up Which ever reaches first. Bow roller prior to drum roller for wrinkle free winding.",
            "Surface winder drive": "0.5 HP AC motor with torque drive.",
            "Tension control": "Through Torque mode."
          }
        }
      },
      {
        category: "Electrical & Control Panel",
        id: "panel-dol-starter",
        qty: 1,
        metadata: {
          customName: "Extrusion Control Panel",
          scopeDesc: "Complete extrusion controls on main panel with Cold start protection."
        }
      },
    ],
    addons: [
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
          size: "250",
          price: 0,
          customName: "250 mm G-Series Air Ring",
          techDesc: { "Design": "G-Series Aerodynamic Air Ring", "Size": "250 mm" }
        }
      },
      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 },
      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          techDesc: {
            "Main Nip rollers": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller drive": "01 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT rollers / Wooden Slates."
          }
        }
      },
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
      {
        category: "Winder",
        id: "winder-manual-back-to-back-dynamic",
        qty: 1,
        metadata: {
          techDesc: {
            "Collapsing Frames": "PBT rollers / Wooden Slates."
          }
        }
      },
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
          customName: "Manual BC - 1250 mm",
          techDesc: { "Type": "Manual open-close operation with PBT rollers.", "Cage Size": "1250 mm" }
        }
      },
      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          techDesc: {
            "Construction": "hidden",
            "Material": "hidden",
            "Adjustment": "hidden",
            "Width Capability": "hidden",
            "Application": "hidden",
            "Collapsing Frames": "hidden"
          }
        }
      },
      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          techDesc: {
            "Construction": "hidden",
            "Material": "hidden",
            "Adjustment": "hidden",
            "Width Capability": "hidden",
            "Application": "hidden",
            "Collapsing Frames": "hidden"
          }
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
          techDesc: { "Hauloff Size": "1350 mm" }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      {
        category: "Winder",
        id: "winder-manual-back-to-back-dynamic",
        qty: 1,
        metadata: {
          techDesc: {
            "Collapsing Frames": "PBT rollers / Wooden Slates."
          }
        }
      },
    ],

    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-dol-starter", qty: 1,
      },
    ],
  },
  "UNOFLEX-50-65MM": {
    machineType: "mono",
    basePrice: 3974000,
    components: [
      { category: "Extruder", id: "ext-65-mono-short", qty: 1 },
      {
        category: "Die Head",
        id: "die-mono-300",
        qty: 1,
        metadata: {
          scopeDesc: "One chrome plated Mono Layer Spiral Mandrel Die and lip diameter of as per widths, complete with die adapters and carriage. Die with Rotation.",
          techDesc: { "Die Size": "300 mm" }
        }
      },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "300",
          price: 150000,
          customName: "Dual Lip Air Ring (7.5 HP)",
          techDesc: {
            "Design": "hidden",
            "Construction": "hidden",
            "Cooling": "hidden",
            "Construcion": "Aluminum body aerodynamic type Dual air cooling ring for cooling. The airing had circular casing with many entry ports 4 efficient cooling.",
            "Blower ": "7.5 HP AC variable frequency drive."
          }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic",
        qty: 1,
        metadata: {
          techDesc: {
            "Type": "Calibration bubble guide basket with 4 arms arranged to provide full support. Bubble contact is through PBT for minimum drag."
          }
        }
      },
      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          scopeDesc: "Collapsing frame with Segmented PBT Rollers, Side guides, Main Nip with 02 HP AC Drive.",
          techDesc: {
            "Main Nip rollers": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller width": "1370 mm",
            "Nip roller drive": "02 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT rollers."
          }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      {
        category: "Winder",
        id: "winder-manual-back-to-back-dynamic",
        qty: 1,
        metadata: {
          name: "Manual Back to Back Winder",
          customName: "Two back to back Surface Winders of 1250 mm film width",
          scopeDesc: "Back to Back Surface Winder of 1250 mm film width. Manual roll change over mechanism, tension control through Torque, digital length counter, 04 nos.- 3” Air shaft, bow roller, 2 HP AC Motor and Drive. Post Extrusion Gear Motors will be Bonvario or Equivalent.",
          techDesc: {
            "Additional Nip": "hidden",
            "Edge slit assembly": "hidden",
            "Length counter meter": "hidden",
            "Trim Suction Blower": "hidden",
            "Tension control ": "hidden",
            "Surface Winder (01 No.)": "hidden",
            "Surface Winder (02 No.)": "hidden",
            "Surface Winders (01 No.)": "hidden",
            "Two Surface Winder": "Maximum web width of 1250 mm with Manual Changeover.",
            "Roll diameter": "500 mm diameter or 350 kg weight in single up Which ever reaches first.\nBow roller prior to drum roller for wrinkle free winding.",
            "Surface winder drive": "02 HP AC motor with variable frequency drive.",
            "Tension control": "Through Torque mode.",
            "Type of winder": "Two back to back type."
          }
        }
      },
    ],
    addons: [
      {
        category: "Electrical & Control Panel", id: "panel-dol-starter", qty: 1,
      },
      { category: "Die Addons", id: "die-rotation-addon", qty: 1 },
    ],
  },

  "UNOFLEX-40-55MM": {
    machineType: "mono",
    basePrice: 2451000,
    components: [
      {
        category: "Extruder",
        id: "ext-55-mono-short",
        qty: 1,
        metadata: {
          techDesc: {
            "No. of Heating Zones": "hidden",
            "No. of Zones": "04 Nos. on barrel",
            "Heating System": "Ceramic Band type Heaters (Hitco or equivalent)",
            "Main Drive": "30 HP AC motor (ABB) with frequency variable drive.",
            "Gearbox": "Premium / Zeal or equivalent make."
          }
        }
      },
      {
        category: "Die Head",
        id: "die-mono-200",
        qty: 1,
        metadata: {
          scopeDesc: "One Chrome plated Mono Layer Spiral Mandrel Die with lip diameter of 200 mm, complete with die adapters and carriage. Die with Rotation.",
          techDesc: {
            "Surface Treatment": "Chrome plated and highly polished.",
            "Die Size": "Diameter as per width and lip gap.",
            "Heating System": "Ceramic band heaters (DHE or equivalent)",
            "Die rotation": "Provided"
          }
        }
      },
      {
        category: "Air Ring",
        id: "airring-standard-dynamic",
        qty: 1,
        metadata: {
          size: "200",
          price: 0,
          customName: "Air Ring (5 HP)",
          techDesc: {
            "Design": "hidden",
            "Construction": "hidden",
            "Cooling": "hidden",
            "Construcion": "Aluminum body aerodynamic type air cooling ring for cooling. The airing had circular casing with many entry ports 4 efficient cooling.",
            "Blower": "05 HP with Drive and inlet air filter."
          }
        }
      },
      {
        category: "Bubble Cage",
        id: "bc-manual-dynamic",
        qty: 1,
        metadata: {
          techDesc: {
            "Type": "Manual cage to Support the bubble."
          }
        }
      },
      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          size: "1000",
          customName: "Collapsing Frame - 1000 mm",
          scopeDesc: "Collapsing frame with Segmented PBT Rollers, Side guides, Main Nip with 1 HP AC Drive.",
          techDesc: {
            "Main Nip rollers": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller width": "1000 mm",
            "Nip roller drive": "01 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT rollers."
          }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      {
        category: "Winder",
        id: "winder-manual-back-to-back-dynamic",
        qty: 1,
        metadata: {
          name: "Manual Back to Back Winder",
          customName: "Back to Back Dual Surface Winder of 1000 mm width",
          scopeDesc: "Back to Back Dual Surface Winder of 1000 mm width. Manual roll change over mechanism, 04 nos.- 3” Mechanical shaft, bow roller, 1 HP AC Motor and Drive.",
          techDesc: {
            "Additional Nip": "hidden",
            "Edge slit assembly": "hidden",
            "Nip roller width": "hidden",
            "Nip roller drive": "hidden",
            "Length counter meter": "hidden",
            "Trim Suction Blower": "hidden",
            "Tension control ": "hidden",
            "Surface Winder (01 No.)": "hidden",
            "Surface Winder (02 No.)": "hidden",
            "Surface Winders (01 No.)": "hidden",
            "Single Surface Winder": "Maximum web width of 1000 mm with Manual Changeover.",
            "Roll diameter": "300 mm diameter or 100 kg weight in single up Which ever reaches first.\nBow roller prior to drum roller for wrinkle free winding.",
            "Surface winder drive": "1 HP AC motor with variable frequency drive.",
            "Tension control": "Through Torque mode.",
            "Winder Type": "Single Surface winder."
          }
        }
      },
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
      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          techDesc: {
            "Main Nip rollers": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller drive": "02 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT rollers."
          }
        }
      },
      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          techDesc: {
            "Main Nip rollers": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller drive": "02 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT rollers."
          }
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
          techDesc: { "Hauloff Size": "2000 mm" }
        }
      },
      { category: "Tower / Platform", id: "tower_std", qty: 1 },
      {
        category: "Winder",
        id: "winder-manual-back-to-back-dynamic",
        qty: 1,
        metadata: {
          techDesc: {
            "Collapsing Frames": "PBT rollers / Wooden Slates."
          }
        }
      },
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
          customName: "Manual BC - 3000 mm",
          techDesc: { "Type": "Manual open-close operation with PBT rollers.", "Cage Size": "3000 mm" }
        }
      },
      {
        category: "Collapsing Frame",
        id: "cf-pbt-dynamic",
        qty: 1,
        metadata: {
          techDesc: {
            "Main Nip rollers": "02 Nos. mounted in bearings. One chrome plated roller and one rubber roller movable pneumatically.",
            "Nip roller drive": "03 HP AC motor with variable frequency drive.",
            "Collapsing Frames": "PBT rollers."
          }
        }
      },
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
      {
        category: "Winder",
        id: "winder-manual-back-to-back-dynamic",
        qty: 1,
        metadata: {
          techDesc: {
            "Collapsing Frames": "PBT rollers / Wooden Slates."
          }
        }
      },
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
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "375",
          price: 525000,
          customName: "375 mm Dual Lip Air Ring (20 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "375 mm", "Blower": "20 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1850",
          price: 1500000,
          customName: "HORIZONTAL HAULOFF - 1870 mm",
          // techDesc removed to match screenshot
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
          customName: "Motorised Bubble Cage - 1870 mm",
          techDesc: { "Cage Size": "1870 mm" }
        }
      },
      { category: "Winder", id: "winder-surface-dynamic", qty: 1, metadata: { size: "1850", price: 3200000 } },
      { category: "Trim Blower", id: "trim-blower-heavy", qty: 1, metadata: { price: 0 } },
    ],
    addons: [
      { category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1 },
      { category: "Extruder Addons", id: "bimetallic-upgrade-all", qty: 3 },
    ],
  },
  "INNOFLEX-1970 IBC": {
    machineType: "3layer",
    basePrice: 20850000,
    components: [
      { category: "Extruder", id: "ext-55-coex-long", qty: 2, metadata: { techDesc: { "Material": "Bimetallic screw and barrel", "Main Drive": "50 HP AC motor (ABB)" } } },
      { category: "Extruder", id: "ext-75-coex-long", qty: 1, metadata: { techDesc: { "Material": "Bimetallic screw and barrel", "Main Drive": "100 HP AC motor (ABB)" } } },
      { category: "Die Head", id: "die-3layeribc-350", qty: 1 },
      { category: "IBC", id: "ibc-system", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "350",
          price: 500000,
          customName: "350 mm Dual Lip Air Ring (20 HP)",
          techDesc: { "Design": "Dual Lip Air Ring", "Size": "350 mm", "Blower": "20 HP AC Motor" }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "1970",
          price: 1750000,
          customName: "HORIZONTAL HAULOFF - 1970 mm",
          // techDesc removed to match screenshot
        }
      },
      { category: "Tower / Platform", id: "tower-dynamic", qty: 1, metadata: { size: "1970", price: 1750000 } },
      {
        category: "Bubble Cage",
        id: "bc-up-down-dynamic",
        qty: 1,
        metadata: {
          size: "1970",
          price: 725000,
          customName: "Motorised Bubble Cage - 1970 mm",
          // techDesc removed so dynamic typeStr applies
        }
      },
      { category: "Winder", id: "winder-automatic-dynamic", qty: 1, metadata: { size: "1970", price: 3400000 } },
      { category: "Trim Blower", id: "trim-blower-heavy", qty: 1, metadata: { price: 0 } },
    ],
    addons: [
      { category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1 },
      { category: "Extruder Addons", id: "bimetallic-upgrade-all", qty: 3 },
    ],
  },
  "INNOFLEX-2120 IBC": {
    machineType: "3layer",
    basePrice: 22751000,
    components: [
      { category: "Extruder", id: "ext-65-coex-long", qty: 2 },
      { category: "Extruder", id: "ext-75-coex-long", qty: 1 },
      { category: "Die Head", id: "die-3layeribc-450", qty: 1 },
      { category: "IBC", id: "ibc-system", qty: 1 },
      {
        category: "Air Ring",
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "450",
          price: 800000,
          customName: "450 mm Dual Lip Air Ring (20 HP)",
          techDesc: { "Design": "hidden", "Size": "hidden", "Blower": "20 HP AC variable frequency drive." }
        }
      },
      {
        category: "Haul-Off",
        id: "haul-horizontal-dynamic",
        qty: 1,
        metadata: {
          size: "2120",
          price: 2500000,
          customName: "HORIZONTAL HAULOFF - 2120 mm",
          // techDesc removed to match screenshot
        }
      },
      { category: "Tower / Platform", id: "tower-dynamic", qty: 1, metadata: { size: "2120", price: 2000000 } },
      {
        category: "Bubble Cage",
        id: "bc-up-down-dynamic",
        qty: 1,
        metadata: {
          size: "2120",
          price: 800000,
          customName: "Motorised Bubble Cage - 2120 mm",
          // techDesc removed so dynamic typeStr applies
        }
      },
      { category: "Winder", id: "winder-surface-dynamic", qty: 1, metadata: { size: "2120", price: 4000000 } },
      { category: "Trim Blower", id: "trim-blower-heavy", qty: 1, metadata: { price: 0 } },
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
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "500",
          price: 750000,
          customName: "500 mm Dual Lip Air Ring (20 HP)",
          techDesc: { "Design": "hidden", "Size": "hidden", "Blower": "20 HP AC variable frequency drive." }
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
          // techDesc removed to match screenshot
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
          customName: "Motorised Bubble Cage - 2370 mm",
          // techDesc removed so dynamic typeStr applies
        }
      },
      { category: "Winder", id: "winder-automatic-dynamic", qty: 1, metadata: { size: "2370", price: 4500000 } },
      { category: "Trim Blower", id: "trim-blower-heavy", qty: 1, metadata: { price: 0 } },
    ],
    addons: [
      { category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1 },
      { category: "Extruder Addons", id: "bimetallic-upgrade-all", qty: 3 },
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
        id: "airring-dr-dynamic",
        qty: 1,
        metadata: {
          size: "500",
          price: 750000,
          customName: "500 mm Dual Lip Air Ring (25 HP)",
          techDesc: { "Design": "hidden", "Size": "hidden", "Blower": "25 HP AC variable frequency drive." }
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
          // techDesc removed to match screenshot
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
          customName: "Motorised Bubble Cage - 2370 mm",
          // techDesc removed so dynamic typeStr applies
        }
      },
      { category: "Winder", id: "winder-surface-dynamic", qty: 1, metadata: { size: "2370", price: 4500000 } },
      { category: "Trim Blower", id: "trim-blower-heavy", qty: 1, metadata: { price: 0 } },
    ],
    addons: [
      { category: "Electrical & Control Panel", id: "panel-acdrive-standard", qty: 1 },
      { category: "Extruder Addons", id: "bimetallic-upgrade-all", qty: 3 },
    ],
  },
};
