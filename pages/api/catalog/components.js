// pages/api/catalog/components.js
// GET /api/catalog/components — returns all components

function safeRequire(path, exportName) {
  try {
    const mod = require(path)
    return mod[exportName] || mod.default || []
  } catch(e) {
    console.warn(`Could not load ${exportName} from ${path}:`, e.message)
    return []
  }
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Cache-Control', 'no-cache')

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const base = '../../../src/data'

    const sources = [
      { file: `${base}/extruders`,       export: 'EXTRUDER_COMPONENTS',         category: 'Extruder' },
      { file: `${base}/dies`,             export: 'DIE_COMPONENTS',              category: 'Die Head' },
      { file: `${base}/airRing`,          export: 'AIR_RING_COMPONENTS',         category: 'Air Ring' },
      { file: `${base}/bubbleCages`,      export: 'BUBBLE_CAGE_COMPONENTS',      category: 'Bubble Cage' },
      { file: `${base}/winders`,          export: 'WINDER_COMPONENTS',           category: 'Winder' },
      { file: `${base}/collapsingFrame`,  export: 'COLLAPSING_FRAME_COMPONENTS', category: 'Collapsing Frame' },
      { file: `${base}/tower`,            export: 'TOWER_COMPONENTS',            category: 'Tower / Platform' },
      { file: `${base}/trim`,             export: 'TRIM_ADDONS',                 category: 'Trim Blower' },
      { file: `${base}/ibc`,              export: 'IBC_COMPONENTS',              category: 'IBC' },
      { file: `${base}/corona`,           export: 'CORONA_TREATER_COMPONENTS',   category: 'Corona' },
      { file: `${base}/materialHandling`, export: 'MATERIAL_HANDLING_ADDONS',    category: 'Material Handling' },
      { file: `${base}/gauge`,            export: 'GAUGE_ADDONS',                category: 'Gauge Control' },
      { file: `${base}/webGuide`,         export: 'WEB_GUIDE_ADDONS',            category: 'Web Guide' },
      { file: `${base}/hauloffs`,         export: 'HAULOFF_COMPONENTS',          category: 'Haul-Off' },
      { file: `${base}/electricalPanel`,  export: 'ELECTRICAL_ADDONS',           category: 'Electrical & Control Panel' },
      { file: `${base}/extruderAddons`,   export: 'EXTRUDER_ADDONS',             category: 'Extruder Addons' },
      { file: `${base}/winderAddons`,     export: 'WINDER_ADDONS',               category: 'Winder Addons' },
      { file: `${base}/dieAddons`,        export: 'DIE_ADDONS',                  category: 'Die Addons' },
      { file: `${base}/chiller`,          export: 'CHILLER_ADDONS',              category: 'Cooling System' },
      { file: `${base}/heatExchanger`,    export: 'HEAT_EXCHANGER_ADDONS',       category: 'Heat Exchanger' },
      { file: `${base}/epc`,              export: 'EPC_COMPONENTS',              category: 'EPC' },
      { file: `${base}/bimetallic`,       export: 'BIMETALLIC_BASE',             category: 'Extruder Addons' },
      { file: `${base}/mdo`,              export: 'MDO_ADDONS',                  category: 'MDO' },
      { file: `${base}/hydraulicUnloader`,export: 'HYDRAULIC_UNLOADER_ADDONS',   category: 'Hydraulic Unloader' },
      { file: `${base}/optionalFeatures`, export: 'OPTIONAL_FEATURE_ADDONS',     category: 'Optional Features' },
      { file: `${base}/printer`,          export: 'PRINTER_ADDONS',              category: 'Printer' },
    ]

    const allComponents = []
    for (const src of sources) {
      const items = safeRequire(src.file, src.export)
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (item && (item.id || item.name)) {
            allComponents.push({ ...item, category: src.category })
          }
        })
      }
    }

    const { category } = req.query
    const filtered = category
      ? allComponents.filter(c => c.category === category)
      : allComponents

    return res.status(200).json({
      components: filtered,
      total: filtered.length,
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
