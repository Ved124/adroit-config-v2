// @ts-nocheck
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

import { MONO_MODELS } from '../data/monoModels.ts';
import { ABA_MODELS } from '../data/abaModels.ts';
import { THREE_LAYER_MODELS } from '../data/threeLayerModels.ts';
import { MODEL_PRESETS } from '../src/data/modelPresets.ts';

import * as extruders from '../src/data/extruders.ts';
import * as bubbleCages from '../src/data/bubbleCages.ts';
import * as hauloffs from '../src/data/hauloffs.ts';
import * as dies from '../src/data/dies.ts';
import * as winders from '../src/data/winders.ts';
import * as airRing from '../src/data/airRing.ts';
import * as collapsingFrame from '../src/data/collapsingFrame.ts';
import * as tower from '../src/data/tower.ts';
import * as electricalPanel from '../src/data/electricalPanel.ts';
import * as materialHandling from '../src/data/materialHandling.ts';
import * as optionalFeatures from '../src/data/optionalFeatures.ts';
import * as gauge from '../src/data/gauge.ts';
import * as corona from '../src/data/corona.ts';
import * as ibc from '../src/data/ibc.ts';
import * as epc from '../src/data/epc.ts';
import * as mdo from '../src/data/mdo.ts';
import * as chiller from '../src/data/chiller.ts';
import * as heatExchanger from '../src/data/heatExchanger.ts';
import * as trim from '../src/data/trim.ts';
import * as webGuide from '../src/data/webGuide.ts';
import * as hydraulicUnloader from '../src/data/hydraulicUnloader.ts';
import * as printer from '../src/data/printer.ts';
import * as bimetallic from '../src/data/bimetallic.ts';
import * as dieAddons from '../src/data/dieAddons.ts';
import * as extruderAddons from '../src/data/extruderAddons.ts';
import * as winderAddons from '../src/data/winderAddons.ts';


async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DB || 'adroit_configurator';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  console.log('Seeding models...');
  const modelsData = { mono: MONO_MODELS, aba: ABA_MODELS, threeLayer: THREE_LAYER_MODELS };
  await db.collection('models').updateOne(
    { _id: 'all_models' as any },
    { $set: { _id: 'all_models', ...modelsData } as any },
    { upsert: true }
  );

  console.log('Seeding presets...');
  const presetsCollection = db.collection('presets');
  await presetsCollection.deleteMany({});
  const presetsDocs = Object.keys(MODEL_PRESETS || {}).map((key) => ({
    _id: key as any,
    ...(MODEL_PRESETS as any)[key],
  }));
  if (presetsDocs.length > 0) {
    await presetsCollection.insertMany(presetsDocs as any);
  }

  console.log('Seeding components...');
  const modules = {
    extruders, bubbleCages, hauloffs, dies, winders, airRing, collapsingFrame, tower,
    electricalPanel, materialHandling, optionalFeatures, gauge, corona, ibc, epc,
    mdo, chiller, heatExchanger, trim, webGuide, hydraulicUnloader, printer,
    bimetallic, dieAddons, extruderAddons, winderAddons
  };

  const componentsData = {};
  for (const [key, mod] of Object.entries(modules)) {
    const arr = Object.values(mod as any).find(v => Array.isArray(v)) || [];
    componentsData[key] = arr;
  }

  await db.collection('components').updateOne(
    { _id: 'all_components' as any },
    { $set: { _id: 'all_components', ...componentsData } as any },
    { upsert: true }
  );

  // Write files for local usage
  const publicAdminDataPath = path.join(process.cwd(), 'public', 'admin-data');
  if (!fs.existsSync(publicAdminDataPath)) fs.mkdirSync(publicAdminDataPath, { recursive: true });
  fs.writeFileSync(path.join(publicAdminDataPath, 'models.json'), JSON.stringify(modelsData, null, 2));
  fs.writeFileSync(path.join(publicAdminDataPath, 'presets.json'), JSON.stringify(MODEL_PRESETS, null, 2));
  fs.writeFileSync(path.join(publicAdminDataPath, 'components.json'), JSON.stringify(componentsData, null, 2));

  console.log('Successfully seeded everything and saved local JSONs!');
  await client.close();
}

seed().catch(console.error);
