async function safe(path, name) {
  try { const m = await import(path); return m[name] || m.default || [] }
  catch(e) { console.warn(`Skip ${name}:`, e.message); return [] }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-cache')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const b = '../../src/data'
    const [
      extruders, dies, airRing, bubbleCages, winders, collapsingFrame,
      tower, trim, ibc, corona, materialHandling, gauge, webGuide,
      hauloffs, electricalPanel, extruderAddons, winderAddons, dieAddons,
      chiller, heatExchanger, epc, bimetallic, mdo, hydraulicUnloader,
      optionalFeatures, printer
    ] = await Promise.all([
      safe(`${b}/extruders`, 'EXTRUDER_COMPONENTS'),
      safe(`${b}/dies`, 'DIE_COMPONENTS'),
      safe(`${b}/airRing`, 'AIR_RING_COMPONENTS'),
      safe(`${b}/bubbleCages`, 'BUBBLE_CAGE_COMPONENTS'),
      safe(`${b}/winders`, 'WINDER_COMPONENTS'),
      safe(`${b}/collapsingFrame`, 'COLLAPSING_FRAME_COMPONENTS'),
      safe(`${b}/tower`, 'TOWER_COMPONENTS'),
      safe(`${b}/trim`, 'TRIM_ADDONS'),
      safe(`${b}/ibc`, 'IBC_COMPONENTS'),
      safe(`${b}/corona`, 'CORONA_TREATER_COMPONENTS'),
      safe(`${b}/materialHandling`, 'MATERIAL_HANDLING_ADDONS'),
      safe(`${b}/gauge`, 'GAUGE_ADDONS'),
      safe(`${b}/webGuide`, 'WEB_GUIDE_ADDONS'),
      safe(`${b}/hauloffs`, 'HAULOFF_COMPONENTS'),
      safe(`${b}/electricalPanel`, 'ELECTRICAL_ADDONS'),
      safe(`${b}/extruderAddons`, 'EXTRUDER_ADDONS'),
      safe(`${b}/winderAddons`, 'WINDER_ADDONS'),
      safe(`${b}/dieAddons`, 'DIE_ADDONS'),
      safe(`${b}/chiller`, 'CHILLER_ADDONS'),
      safe(`${b}/heatExchanger`, 'HEAT_EXCHANGER_ADDONS'),
      safe(`${b}/epc`, 'EPC_COMPONENTS'),
      safe(`${b}/bimetallic`, 'BIMETALLIC_BASE'),
      safe(`${b}/mdo`, 'MDO_ADDONS'),
      safe(`${b}/hydraulicUnloader`, 'HYDRAULIC_UNLOADER_ADDONS'),
      safe(`${b}/optionalFeatures`, 'OPTIONAL_FEATURE_ADDONS'),
      safe(`${b}/printer`, 'PRINTER_ADDONS'),
    ])
    const map = [
      [extruders,'Extruder'],[dies,'Die Head'],[airRing,'Air Ring'],
      [bubbleCages,'Bubble Cage'],[winders,'Winder'],[collapsingFrame,'Collapsing Frame'],
      [tower,'Tower / Platform'],[trim,'Trim Blower'],[ibc,'IBC'],
      [corona,'Corona'],[materialHandling,'Material Handling'],[gauge,'Gauge Control'],
      [webGuide,'Web Guide'],[hauloffs,'Haul-Off'],[electricalPanel,'Electrical & Control Panel'],
      [extruderAddons,'Extruder Addons'],[winderAddons,'Winder Addons'],[dieAddons,'Die Addons'],
      [chiller,'Cooling System'],[heatExchanger,'Heat Exchanger'],[epc,'EPC'],
      [bimetallic,'Extruder Addons'],[mdo,'MDO'],[hydraulicUnloader,'Hydraulic Unloader'],
      [optionalFeatures,'Optional Features'],[printer,'Printer'],
    ]
    const all = []
    for (const [items, category] of map) {
      if (Array.isArray(items)) items.forEach(item => { if (item?.id || item?.name) all.push({...item, category}) })
    }
    const { category } = req.query
    const filtered = category ? all.filter(c => c.category === category) : all
    return res.status(200).json({ components: filtered, total: filtered.length })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
