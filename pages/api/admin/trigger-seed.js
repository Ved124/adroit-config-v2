import { seedAll } from './seed';
import '../../../src/data/modelPresets';
import '../../../src/data/extruders';
import '../../../src/data/bubbleCages';
import '../../../src/data/hauloffs';
import '../../../src/data/dies';
import '../../../src/data/winders';
import '../../../src/data/airRing';
import '../../../src/data/collapsingFrame';
import '../../../src/data/tower';
import '../../../src/data/electricalPanel';
import '../../../src/data/materialHandling';
import '../../../src/data/optionalFeatures';
import '../../../src/data/gauge';
import '../../../src/data/corona';
import '../../../src/data/ibc';
import '../../../src/data/epc';
import '../../../src/data/mdo';
import '../../../src/data/chiller';
import '../../../src/data/heatExchanger';
import '../../../src/data/trim';
import '../../../src/data/webGuide';
import '../../../src/data/hydraulicUnloader';
import '../../../src/data/printer';
import '../../../src/data/bimetallic';
import '../../../src/data/dieAddons';
import '../../../src/data/extruderAddons';
import '../../../src/data/winderAddons';

export default function handler(req, res) {
  seedAll();
  res.status(200).json({ success: true, message: 'Seeded locally to public/admin-data/' });
}
