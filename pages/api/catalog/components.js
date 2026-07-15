// GET /api/catalog/components
// Returns all components from TypeScript data files

import { EXTRUDER_COMPONENTS } from '../../../src/data/extruders'
import { DIE_COMPONENTS } from '../../../src/data/dies'
import { AIR_RING_COMPONENTS } from '../../../src/data/airRing'
import { BUBBLE_CAGE_COMPONENTS } from '../../../src/data/bubbleCages'
import { WINDER_COMPONENTS } from '../../../src/data/winders'
import { COLLAPSING_FRAME_COMPONENTS } from '../../../src/data/collapsingFrame'
import { TOWER_COMPONENTS } from '../../../src/data/tower'
import { TRIM_COMPONENTS } from '../../../src/data/trim'
import { IBC_COMPONENTS } from '../../../src/data/ibc'
import { CORONA_COMPONENTS } from '../../../src/data/corona'
import { MATERIAL_HANDLING_COMPONENTS } from '../../../src/data/materialHandling'
import { GAUGE_COMPONENTS } from '../../../src/data/gauge'
import { WEB_GUIDE_COMPONENTS } from '../../../src/data/webGuide'
import { HAULOFF_COMPONENTS } from '../../../src/data/hauloffs'
import { ELECTRICAL_PANEL_COMPONENTS } from '../../../src/data/electricalPanel'
import { EXTRUDER_ADDON_COMPONENTS } from '../../../src/data/extruderAddons'
import { WINDER_ADDON_COMPONENTS } from '../../../src/data/winderAddons'
import { DIE_ADDON_COMPONENTS } from '../../../src/data/dieAddons'
import { CHILLER_COMPONENTS } from '../../../src/data/chiller'
import { HEAT_EXCHANGER_COMPONENTS } from '../../../src/data/heatExchanger'
import { EPC_COMPONENTS } from '../../../src/data/epc'

// Wrap each with category — handle missing exports gracefully
function safe(arr, category) {
  if (!arr || !Array.isArray(arr)) return []
  return arr.map(c => ({ ...c, category }))
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { category } = req.query

    const allComponents = [
      ...safe(EXTRUDER_COMPONENTS, 'Extruder'),
      ...safe(DIE_COMPONENTS, 'Die Head'),
      ...safe(AIR_RING_COMPONENTS, 'Air Ring'),
      ...safe(BUBBLE_CAGE_COMPONENTS, 'Bubble Cage'),
      ...safe(WINDER_COMPONENTS, 'Winder'),
      ...safe(COLLAPSING_FRAME_COMPONENTS, 'Collapsing Frame'),
      ...safe(TOWER_COMPONENTS, 'Tower / Platform'),
      ...safe(TRIM_COMPONENTS, 'Trim Blower'),
      ...safe(IBC_COMPONENTS, 'IBC'),
      ...safe(CORONA_COMPONENTS, 'Corona'),
      ...safe(MATERIAL_HANDLING_COMPONENTS, 'Material Handling'),
      ...safe(GAUGE_COMPONENTS, 'Gauge Control'),
      ...safe(WEB_GUIDE_COMPONENTS, 'Web Guide'),
      ...safe(HAULOFF_COMPONENTS, 'Haul-Off'),
      ...safe(ELECTRICAL_PANEL_COMPONENTS, 'Electrical & Control Panel'),
      ...safe(EXTRUDER_ADDON_COMPONENTS, 'Extruder Addons'),
      ...safe(WINDER_ADDON_COMPONENTS, 'Winder Addons'),
      ...safe(DIE_ADDON_COMPONENTS, 'Die Addons'),
      ...safe(CHILLER_COMPONENTS, 'Cooling System'),
      ...safe(HEAT_EXCHANGER_COMPONENTS, 'Heat Exchanger'),
      ...safe(EPC_COMPONENTS, 'EPC'),
    ]

    const filtered = category
      ? allComponents.filter(c => c.category === category)
      : allComponents

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=300')

    return res.status(200).json({
      components: filtered,
      total: filtered.length,
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
