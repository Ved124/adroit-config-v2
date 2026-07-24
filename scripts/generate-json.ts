import fs from 'fs';
import path from 'path';

import { MONO_MODELS, ABA_MODELS, THREE_LAYER_MODELS } from '../src/data/models';

import * as extruders from '../src/data/extruders';
import * as bubbleCages from '../src/data/bubbleCages';
import * as hauloffs from '../src/data/hauloffs';
import * as dies from '../src/data/dies';
import * as winders from '../src/data/winders';
import * as airRing from '../src/data/airRing';
import * as collapsingFrame from '../src/data/collapsingFrame';
import * as tower from '../src/data/tower';
import * as electricalPanel from '../src/data/electricalPanel';
import * as materialHandling from '../src/data/materialHandling';
import * as optionalFeatures from '../src/data/optionalFeatures';
import * as gauge from '../src/data/gauge';
import * as corona from '../src/data/corona';
import * as ibc from '../src/data/ibc';
import * as epc from '../src/data/epc';
import * as mdo from '../src/data/mdo';
import * as chiller from '../src/data/chiller';
import * as heatExchanger from '../src/data/heatExchanger';
import * as trim from '../src/data/trim';
import * as webGuide from '../src/data/webGuide';
import * as hydraulicUnloader from '../src/data/hydraulicUnloader';
import * as printer from '../src/data/printer';
import * as bimetallic from '../src/data/bimetallic';
import * as dieAddons from '../src/data/dieAddons';
import * as extruderAddons from '../src/data/extruderAddons';
import * as winderAddons from '../src/data/winderAddons';

const modules = {
  extruders, bubbleCages, hauloffs, dies, winders, airRing, collapsingFrame, tower,
  electricalPanel, materialHandling, optionalFeatures, gauge, corona, ibc, epc, mdo, chiller,
  heatExchanger, trim, webGuide, hydraulicUnloader, printer, bimetallic, dieAddons,
  extruderAddons, winderAddons
};

const componentsData = {};
for (const [name, mod] of Object.entries(modules)) {
  for (const [key, value] of Object.entries(mod)) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0].id) {
      componentsData[name] = value;
      break;
    }
  }
}

const publicAdminDataPath = path.join(process.cwd(), 'public', 'admin-data');
if (!fs.existsSync(publicAdminDataPath)) {
  fs.mkdirSync(publicAdminDataPath, { recursive: true });
}

// Each model entry already carries its own preset (components/addons/basePrice),
// so a separate presets.json is no longer needed.
fs.writeFileSync(path.join(publicAdminDataPath, 'models.json'), JSON.stringify({ mono: MONO_MODELS, aba: ABA_MODELS, threeLayer: THREE_LAYER_MODELS }, null, 2));
fs.writeFileSync(path.join(publicAdminDataPath, 'components.json'), JSON.stringify(componentsData, null, 2));

console.log('JSON files successfully generated in public/admin-data');
