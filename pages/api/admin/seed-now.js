// pages/api/admin/seed-now.js
// One-time seed endpoint — call GET /api/admin/seed-now to populate all JSON files
// from the actual TS data sources (which Next.js has already transpiled)



// Machine models
import { MONO_MODELS } from '../../../data/monoModels';
import { ABA_MODELS } from '../../../data/abaModels';
import { THREE_LAYER_MODELS } from '../../../data/threeLayerModels';

// Presets
import { MODEL_PRESETS } from '../../../src/data/modelPresets';

// Components with _COMPONENTS export name
import { BUBBLE_CAGE_COMPONENTS } from '../../../src/data/bubbleCages';
import { HAULOFF_COMPONENTS } from '../../../src/data/hauloffs';
import { EXTRUDER_COMPONENTS } from '../../../src/data/extruders';
import { DIE_COMPONENTS } from '../../../src/data/dies';
import { WINDER_COMPONENTS } from '../../../src/data/winders';
import { AIR_RING_COMPONENTS } from '../../../src/data/airRing';
import { COLLAPSING_FRAME_COMPONENTS } from '../../../src/data/collapsingFrame';
import { TOWER_COMPONENTS } from '../../../src/data/tower';
import { EPC_COMPONENTS } from '../../../src/data/epc';
import { IBC_COMPONENTS } from '../../../src/data/ibc';
import { CORONA_TREATER_COMPONENTS } from '../../../src/data/corona';

// Components with _ADDONS export name
import { CHILLER_ADDONS } from '../../../src/data/chiller';
import { HEAT_EXCHANGER_ADDONS } from '../../../src/data/heatExchanger';
import { PRINTER_ADDONS } from '../../../src/data/printer';
import { GAUGE_ADDONS } from '../../../src/data/gauge';
import { WEB_GUIDE_ADDONS } from '../../../src/data/webGuide';
import { MATERIAL_HANDLING_ADDONS } from '../../../src/data/materialHandling';
import { OPTIONAL_FEATURE_ADDONS } from '../../../src/data/optionalFeatures';
import { ELECTRICAL_ADDONS } from '../../../src/data/electricalPanel';

import clientPromise from '../../../src/lib/mongodb';

const DB_NAME = process.env.MONGODB_DB || 'adroit_configurator';
function safeArr(v) { return Array.isArray(v) ? v : (v ? [v] : []); }

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // 1. Models
    const modelsDoc = {
      _id: 'all_models',
      mono: safeArr(MONO_MODELS),
      aba: safeArr(ABA_MODELS),
      threeLayer: safeArr(THREE_LAYER_MODELS),
    };
    await db.collection('models').updateOne(
      { _id: 'all_models' },
      { $set: modelsDoc },
      { upsert: true }
    );

    // 2. Presets
    const presetsCollection = db.collection('presets');
    await presetsCollection.deleteMany({}); // clear existing
    const presetsDocs = Object.keys(MODEL_PRESETS || {}).map(key => ({
      _id: key,
      ...MODEL_PRESETS[key]
    }));
    if (presetsDocs.length > 0) {
      await presetsCollection.insertMany(presetsDocs);
    }

    // 3. Components
    const componentsDoc = {
      _id: 'all_components',
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
      corona:            safeArr(CORONA_TREATER_COMPONENTS),
      ibc:               safeArr(IBC_COMPONENTS),
      epc:               safeArr(EPC_COMPONENTS),
      chiller:           safeArr(CHILLER_ADDONS),
      heatExchanger:     safeArr(HEAT_EXCHANGER_ADDONS),
      webGuide:          safeArr(WEB_GUIDE_ADDONS),
      printer:           safeArr(PRINTER_ADDONS),
    };
    await db.collection('components').updateOne(
      { _id: 'all_components' },
      { $set: componentsDoc },
      { upsert: true }
    );

    const mono = safeArr(MONO_MODELS).length;
    const aba = safeArr(ABA_MODELS).length;
    const three = safeArr(THREE_LAYER_MODELS).length;

    return res.status(200).json({
      success: true,
      seeded: {
        models: mono + aba + three,
        presets: Object.keys(MODEL_PRESETS || {}).length,
        components: safeArr(EXTRUDER_COMPONENTS).length + safeArr(BUBBLE_CAGE_COMPONENTS).length + safeArr(HAULOFF_COMPONENTS).length,
      }
    });
  } catch (err) {
    console.error('[seed-now]', err);
    return res.status(500).json({ error: err.message });
  }
}
