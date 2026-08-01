// src/data/catalogRegistry.js
//
// Single source of truth for the machine/component catalog, shared between the
// client (ConfigContext.jsx, pages/addons.jsx, pages/selection.jsx) and the
// server (pages/api/catalog.js, admin CRUD routes).
//
// Exports start out backed by the static .ts data files exactly as ConfigContext
// used to build them inline. applyCatalogOverride() can later reassign these
// exports to fetched data — because ES module named exports are live bindings,
// every file that does `import { ALL_MODELS } from "./catalogRegistry"` picks up
// the override automatically, with no other call site needing to change.

import { ALL_MODELS as STATIC_ALL_MODELS } from "./models";
import { EXTRUDER_COMPONENTS } from "./extruders";
import { DIE_COMPONENTS } from "./dies";
import { BUBBLE_CAGE_COMPONENTS } from "./bubbleCages";
import { HAULOFF_COMPONENTS } from "./hauloffs";
import { TOWER_COMPONENTS } from "./tower";
import { WINDER_COMPONENTS } from "./winders";
import { COLLAPSING_FRAME_COMPONENTS } from "./collapsingFrame";
import { EXTRUDER_ADDONS } from "./extruderAddons";
import { AIR_RING_COMPONENTS } from "./airRing";
import { IBC_COMPONENTS } from "./ibc";
import { MAIN_NIP_COMPONENTS } from "./mainNip";
import { CORONA_TREATER_COMPONENTS } from "./corona";
import { TRIM_ADDONS } from "./trim";
import { MATERIAL_HANDLING_ADDONS } from "./materialHandling";
import { WEB_GUIDE_ADDONS } from "./webGuide";
import { CHILLER_ADDONS } from "./chiller";
import { HEAT_EXCHANGER_ADDONS } from "./heatExchanger";
import { PRINTER_ADDONS } from "./printer";
import { ELECTRICAL_ADDONS } from "./electricalPanel";
import { BIMETALLIC_BASE } from "./bimetallic";
import { WINDER_ADDONS } from "./winderAddons";
import { DIE_ROTATION_ADDON } from "./dieAddons";
import { EPC_COMPONENTS } from "./epc";
import { OPTIONAL_FEATURE_ADDONS } from "./optionalFeatures";

// Mirrors ConfigContext.jsx's COMPONENTS_DATA / ADDONS_DATA construction verbatim
// (previously inline at src/ConfigContext.jsx:79-106) — moved here so both the
// client provider and server-side catalog routes can share one definition.
function buildComponentsData() {
  return {
    Extruder: EXTRUDER_COMPONENTS,
    "Die Head": DIE_COMPONENTS,
    "Air Ring": AIR_RING_COMPONENTS,
    IBC: IBC_COMPONENTS, // Will group with Air Ring based on sorting logic if it's there
    "Bubble Cage": BUBBLE_CAGE_COMPONENTS,
    "Main Nip": MAIN_NIP_COMPONENTS,
    "Haul-Off": HAULOFF_COMPONENTS.filter((c) => !c.id.includes("main-nip")),
    Winder: WINDER_COMPONENTS,
    "Tower / Platform": TOWER_COMPONENTS,
    "Electrical & Control Panel": ELECTRICAL_ADDONS,
    "Trim Blower": TRIM_ADDONS,
    "Collapsing Frame": COLLAPSING_FRAME_COMPONENTS,
  };
}

function buildAddonsData() {
  return {
    Corona: CORONA_TREATER_COMPONENTS,
    "Material Handling": MATERIAL_HANDLING_ADDONS,
    "Web Guide": WEB_GUIDE_ADDONS,
    Chiller: CHILLER_ADDONS,
    "Heat Exchanger": HEAT_EXCHANGER_ADDONS,
    "Die Addons": [DIE_ROTATION_ADDON],
    "Extruder Addons": [BIMETALLIC_BASE, ...EXTRUDER_ADDONS],
    "Winder Addons": WINDER_ADDONS,
    EPC: EPC_COMPONENTS,
    Printer: PRINTER_ADDONS,
    "Optional Features": OPTIONAL_FEATURE_ADDONS,
    IBC: IBC_COMPONENTS,
  };
}

function filterByType(models, machineType) {
  return models.filter((m) => m.machineType === machineType);
}

// Business-rule constants that used to be hardcoded in src/lib/pricing.js —
// moved here so they follow the same admin-editable-with-static-fallback
// pattern as everything else in this file, instead of being a one-off a
// non-coder could never reach without a code change.
const STATIC_EXPORT_MARKUP = 1.3;

export let ALL_MODELS = STATIC_ALL_MODELS;
export let COMPONENTS_DATA = buildComponentsData();
export let ADDONS_DATA = buildAddonsData();
export let EXPORT_MARKUP = STATIC_EXPORT_MARKUP;

export let MONO_MODELS = filterByType(ALL_MODELS, "mono");
export let ABA_MODELS = filterByType(ALL_MODELS, "aba");
export let THREE_LAYER_MODELS = filterByType(ALL_MODELS, "3layer");

// Returns the catalog exactly as it looks with zero overrides applied — the
// "factory defaults" fallback pages/api/catalog.js serves if blob storage is
// ever empty or unreachable.
export function getStaticCatalog() {
  return {
    models: STATIC_ALL_MODELS,
    components: buildComponentsData(),
    addons: buildAddonsData(),
    settings: { exportMarkup: STATIC_EXPORT_MARKUP },
  };
}

// Called once on app boot (ConfigProvider) after a successful /api/catalog
// fetch. Reassigns the live-bound exports above so every existing import
// across the app transparently sees the fetched data. Malformed input is
// ignored so a bad fetch can never leave the app in a half-updated state.
export function applyCatalogOverride(catalog) {
  if (!catalog || !Array.isArray(catalog.models)) return false;
  ALL_MODELS = catalog.models;
  COMPONENTS_DATA = catalog.components || COMPONENTS_DATA;
  ADDONS_DATA = catalog.addons || ADDONS_DATA;
  MONO_MODELS = filterByType(ALL_MODELS, "mono");
  ABA_MODELS = filterByType(ALL_MODELS, "aba");
  THREE_LAYER_MODELS = filterByType(ALL_MODELS, "3layer");
  if (catalog.settings && typeof catalog.settings.exportMarkup === "number") {
    EXPORT_MARKUP = catalog.settings.exportMarkup;
  }
  return true;
}
