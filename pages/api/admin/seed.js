/**
 * Seed helper — reads from the compiled Next.js module cache (the TS files
 * are transpiled on demand by Next) and writes initial JSON files to
 * public/admin-data/ so the admin API has something to read/write.
 *
 * Called automatically by every admin API route on first use.
 */

import fs from 'fs';
import path from 'path';

// Dynamic require the compiled TS modules
function loadTsModule(relPath) {
  try {
    // Next.js compiles these for us at runtime
    return require(path.join(process.cwd(), relPath));
  } catch (e) {
    console.warn(`Could not load ${relPath}:`, e.message);
    return {};
  }
}

const ADMIN_DATA_DIR = path.join(process.cwd(), 'public', 'admin-data');

export function ensureAdminDataDir() {
  if (!fs.existsSync(ADMIN_DATA_DIR)) {
    fs.mkdirSync(ADMIN_DATA_DIR, { recursive: true });
  }
}

export function getAdminDataPath(filename) {
  return path.join(ADMIN_DATA_DIR, filename);
}

export function readAdminJson(filename) {
  const filePath = getAdminDataPath(filename);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {
      return null;
    }
  }
  return null;
}

export function writeAdminJson(filename, data) {
  ensureAdminDataDir();
  fs.writeFileSync(
    getAdminDataPath(filename),
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}

// ─── SEEDING ───────────────────────────────────────────────────────────────

export function seedModels() {
  if (readAdminJson('models.json')) return; // already seeded

  const mono = loadTsModule('data/monoModels').MONO_MODELS || [];
  const aba = loadTsModule('data/abaModels').ABA_MODELS || [];
  const three = loadTsModule('data/threeLayerModels').THREE_LAYER_MODELS || [];

  writeAdminJson('models.json', { mono, aba, threeLayer: three });
  console.log('[seed] models.json created');
}

export function seedComponents() {
  if (readAdminJson('components.json')) return;

  const modules = {
    extruders:        'src/data/extruders',
    bubbleCages:      'src/data/bubbleCages',
    hauloffs:         'src/data/hauloffs',
    dies:             'src/data/dies',
    winders:          'src/data/winders',
    airRing:          'src/data/airRing',
    collapsingFrame:  'src/data/collapsingFrame',
    tower:            'src/data/tower',
    electricalPanel:  'src/data/electricalPanel',
    materialHandling: 'src/data/materialHandling',
    optionalFeatures: 'src/data/optionalFeatures',
    gauge:            'src/data/gauge',
    corona:           'src/data/corona',
    ibc:              'src/data/ibc',
    epc:              'src/data/epc',
    mdo:              'src/data/mdo',
    chiller:          'src/data/chiller',
    heatExchanger:    'src/data/heatExchanger',
    trim:             'src/data/trim',
    webGuide:         'src/data/webGuide',
    hydraulicUnloader:'src/data/hydraulicUnloader',
    printer:          'src/data/printer',
    bimetallic:       'src/data/bimetallic',
    dieAddons:        'src/data/dieAddons',
    extruderAddons:   'src/data/extruderAddons',
    winderAddons:     'src/data/winderAddons',
  };

  const components = {};
  for (const [key, modPath] of Object.entries(modules)) {
    const mod = loadTsModule(modPath);
    // Each TS file exports an array like EXTRUDER_COMPONENTS, BUBBLE_CAGE_COMPONENTS etc.
    const arr = Object.values(mod).find(v => Array.isArray(v)) || [];
    components[key] = arr;
  }

  writeAdminJson('components.json', components);
  console.log('[seed] components.json created');
}

export function seedPresets() {
  if (readAdminJson('presets.json')) return;

  const mod = loadTsModule('src/data/modelPresets');
  const presets = mod.MODEL_PRESETS || {};
  writeAdminJson('presets.json', presets);
  console.log('[seed] presets.json created');
}

export function seedPricing() {
  if (readAdminJson('pricing.json')) return;

  const bcMod    = loadTsModule('src/data/bubbleCages');
  const haulMod  = loadTsModule('src/data/hauloffs');
  const winMod   = loadTsModule('src/data/winders');

  writeAdminJson('pricing.json', {
    MANUAL_BC_PRICES:       bcMod.MANUAL_BC_PRICES || {},
    OPEN_CLOSE_BC_PRICES:   bcMod.OPEN_CLOSE_BC_PRICES || {},
    UP_DOWN_BC_PRICES:      bcMod.UP_DOWN_BC_PRICES || {},
    HAULOFF_PRICES:         haulMod.HAULOFF_PRICES || {},
    MANUAL_BACK_TO_BACK_PRICES: winMod.MANUAL_BACK_TO_BACK_PRICES || {},
    SURFACE_WINDER_PRICES:  winMod.SURFACE_WINDER_PRICES || {},
    AUTOMATIC_WINDER_PRICES:winMod.AUTOMATIC_WINDER_PRICES || {},
  });
  console.log('[seed] pricing.json created');
}

export function seedAll() {
  ensureAdminDataDir();
  seedModels();
  seedComponents();
  seedPresets();
  seedPricing();
}
