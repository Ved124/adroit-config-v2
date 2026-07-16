// pages/api/admin/seed-now.js
// One-time seed endpoint — call GET /api/admin/seed-now to populate all JSON files
// from the actual TS data sources (which Next.js has already transpiled)

import fs from 'fs';
import path from 'path';

// Machine models
import { MONO_MODELS } from '../../../data/monoModels';
import { ABA_MODELS } from '../../../data/abaModels';
import { THREE_LAYER_MODELS } from '../../../data/threeLayerModels';

// Presets
import { MODEL_PRESETS } from '../../../src/data/modelPresets';

// Components with _COMPONENTS export name
import { BUBBLE_CAGE_COMPONENTS, MANUAL_BC_PRICES, OPEN_CLOSE_BC_PRICES, UP_DOWN_BC_PRICES } from '../../../src/data/bubbleCages';
import { HAULOFF_COMPONENTS, HAULOFF_PRICES } from '../../../src/data/hauloffs';
import { EXTRUDER_COMPONENTS } from '../../../src/data/extruders';
import { DIE_COMPONENTS } from '../../../src/data/dies';
import { WINDER_COMPONENTS, MANUAL_BACK_TO_BACK_PRICES, SURFACE_WINDER_PRICES, AUTOMATIC_WINDER_PRICES } from '../../../src/data/winders';
import { AIR_RING_COMPONENTS } from '../../../src/data/airRing';
import { COLLAPSING_FRAME_COMPONENTS } from '../../../src/data/collapsingFrame';
import { TOWER_COMPONENTS } from '../../../src/data/tower';
import { EPC_COMPONENTS } from '../../../src/data/epc';
import { IBC_COMPONENTS } from '../../../src/data/ibc';

// Components with _ADDONS export name
import { CHILLER_ADDONS } from '../../../src/data/chiller';
import { MDO_ADDONS } from '../../../src/data/mdo';
import { HEAT_EXCHANGER_ADDONS } from '../../../src/data/heatExchanger';
import { TRIM_ADDONS } from '../../../src/data/trim';
import { HYDRAULIC_UNLOADER_ADDONS } from '../../../src/data/hydraulicUnloader';
import { PRINTER_ADDONS } from '../../../src/data/printer';
import { GAUGE_ADDONS } from '../../../src/data/gauge';
import { WEB_GUIDE_ADDONS } from '../../../src/data/webGuide';
import { MATERIAL_HANDLING_ADDONS } from '../../../src/data/materialHandling';
import { OPTIONAL_FEATURE_ADDONS } from '../../../src/data/optionalFeatures';
import { ELECTRICAL_ADDONS } from '../../../src/data/electricalPanel';
import { DIE_ADDONS } from '../../../src/data/dieAddons';
import { EXTRUDER_ADDONS } from '../../../src/data/extruderAddons';
import { WINDER_ADDONS } from '../../../src/data/winderAddons';
import { BIMETALLIC_BASE } from '../../../src/data/bimetallic';

const ADMIN_DATA_DIR = path.join(process.cwd(), 'public', 'admin-data');

function write(filename, data) {
  if (!fs.existsSync(ADMIN_DATA_DIR)) fs.mkdirSync(ADMIN_DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(ADMIN_DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8');
}

function safeArr(v) { return Array.isArray(v) ? v : (v ? [v] : []); }

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  try {
    // 1. Models
    write('models.json', {
      mono: safeArr(MONO_MODELS),
      aba: safeArr(ABA_MODELS),
      threeLayer: safeArr(THREE_LAYER_MODELS),
    });

    // 2. Presets
    write('presets.json', MODEL_PRESETS || {});

    // 3. Components (use whatever array each file exports)
    write('components.json', {
      extruders:         safeArr(EXTRUDER_COMPONENTS),
      bubbleCages:       safeArr(BUBBLE_CAGE_COMPONENTS),
      hauloffs:          safeArr(HAULOFF_COMPONENTS),
      dies:              safeArr(DIE_COMPONENTS),
      winders:           safeArr(WINDER_COMPONENTS),
      airRing:           safeArr(AIR_RING_COMPONENTS),
      collapsingFrame:   safeArr(COLLAPSING_FRAME_COMPONENTS),
      tower:             safeArr(TOWER_COMPONENTS),
      electricalPanel:   safeArr(ELECTRICAL_ADDONS),
      materialHandling:  safeArr(MATERIAL_HANDLING_ADDONS),
      optionalFeatures:  safeArr(OPTIONAL_FEATURE_ADDONS),
      gauge:             safeArr(GAUGE_ADDONS),
      corona:            [],  // CORONA_TREATER_COMPONENTS — no price-based items
      ibc:               safeArr(IBC_COMPONENTS),
      epc:               safeArr(EPC_COMPONENTS),
      mdo:               safeArr(MDO_ADDONS),
      chiller:           safeArr(CHILLER_ADDONS),
      heatExchanger:     safeArr(HEAT_EXCHANGER_ADDONS),
      trim:              safeArr(TRIM_ADDONS),
      webGuide:          safeArr(WEB_GUIDE_ADDONS),
      hydraulicUnloader: safeArr(HYDRAULIC_UNLOADER_ADDONS),
      printer:           safeArr(PRINTER_ADDONS),
      bimetallic:        safeArr(BIMETALLIC_BASE),
      dieAddons:         safeArr(DIE_ADDONS),
      extruderAddons:    safeArr(EXTRUDER_ADDONS),
      winderAddons:      safeArr(WINDER_ADDONS),
    });

    // 4. Pricing
    write('pricing.json', {
      MANUAL_BC_PRICES:           MANUAL_BC_PRICES || {},
      OPEN_CLOSE_BC_PRICES:       OPEN_CLOSE_BC_PRICES || {},
      UP_DOWN_BC_PRICES:          UP_DOWN_BC_PRICES || {},
      HAULOFF_PRICES:             HAULOFF_PRICES || {},
      MANUAL_BACK_TO_BACK_PRICES: MANUAL_BACK_TO_BACK_PRICES || {},
      SURFACE_WINDER_PRICES:      SURFACE_WINDER_PRICES || {},
      AUTOMATIC_WINDER_PRICES:    AUTOMATIC_WINDER_PRICES || {},
    });

    const mono = safeArr(MONO_MODELS).length;
    const aba = safeArr(ABA_MODELS).length;
    const three = safeArr(THREE_LAYER_MODELS).length;

    return res.status(200).json({
      success: true,
      seeded: {
        models: mono + aba + three,
        presets: Object.keys(MODEL_PRESETS || {}).length,
        components: safeArr(EXTRUDER_COMPONENTS).length + safeArr(BUBBLE_CAGE_COMPONENTS).length + safeArr(HAULOFF_COMPONENTS).length,
        priceTables: 7,
      }
    });
  } catch (err) {
    console.error('[seed-now]', err);
    return res.status(500).json({ error: err.message });
  }
}
