// scripts/generate-catalog-json.js
// Run: node scripts/generate-catalog-json.js
// Generates static JSON files that the API routes serve

const path = require('path')
const fs = require('fs')

// Register ts-node to handle TypeScript imports
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', esModuleInterop: true }
})

const outputDir = path.join(__dirname, '../public/catalog')
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

function safeRequire(filePath, exportName) {
  try {
    const mod = require(filePath)
    return mod[exportName] || mod.default || []
  } catch(e) {
    console.warn(`⚠️  Could not load ${exportName}:`, e.message)
    return []
  }
}

const dataDir = path.join(__dirname, '../src/data')

// Load models
const rootDataDir = path.join(__dirname, '../data')
const MONO_MODELS = safeRequire(path.join(rootDataDir, 'monoModels.ts'), 'MONO_MODELS')
const ABA_MODELS = safeRequire(path.join(rootDataDir, 'abaModels.ts'), 'ABA_MODELS')
const THREE_LAYER_MODELS = safeRequire(path.join(rootDataDir, 'threeLayerModels.ts'), 'THREE_LAYER_MODELS')
const MODEL_PRESETS = safeRequire(path.join(dataDir, 'modelPresets.ts'), 'MODEL_PRESETS')

// Build models JSON
const models = [
  ...MONO_MODELS.map(m => ({ ...m, machineType: 'mono' })),
  ...ABA_MODELS.map(m => ({ ...m, machineType: 'aba' })),
  ...THREE_LAYER_MODELS.map(m => ({ ...m, machineType: '3layer' })),
]
fs.writeFileSync(path.join(outputDir, 'models.json'), JSON.stringify({ models, total: models.length, counts: { mono: MONO_MODELS.length, aba: ABA_MODELS.length, '3layer': THREE_LAYER_MODELS.length, total: models.length } }, null, 2))
console.log(`✅ models.json — ${models.length} models`)

// Build components JSON
const componentSources = [
  ['extruders', 'EXTRUDER_COMPONENTS', 'Extruder'],
  ['dies', 'DIE_COMPONENTS', 'Die Head'],
  ['airRing', 'AIR_RING_COMPONENTS', 'Air Ring'],
  ['bubbleCages', 'BUBBLE_CAGE_COMPONENTS', 'Bubble Cage'],
  ['winders', 'WINDER_COMPONENTS', 'Winder'],
  ['collapsingFrame', 'COLLAPSING_FRAME_COMPONENTS', 'Collapsing Frame'],
  ['tower', 'TOWER_COMPONENTS', 'Tower / Platform'],
  ['trim', 'TRIM_ADDONS', 'Trim Blower'],
  ['ibc', 'IBC_COMPONENTS', 'IBC'],
  ['corona', 'CORONA_TREATER_COMPONENTS', 'Corona'],
  ['materialHandling', 'MATERIAL_HANDLING_ADDONS', 'Material Handling'],
  ['gauge', 'GAUGE_ADDONS', 'Gauge Control'],
  ['webGuide', 'WEB_GUIDE_ADDONS', 'Web Guide'],
  ['hauloffs', 'HAULOFF_COMPONENTS', 'Haul-Off'],
  ['electricalPanel', 'ELECTRICAL_ADDONS', 'Electrical & Control Panel'],
  ['extruderAddons', 'EXTRUDER_ADDONS', 'Extruder Addons'],
  ['winderAddons', 'WINDER_ADDONS', 'Winder Addons'],
  ['dieAddons', 'DIE_ADDONS', 'Die Addons'],
  ['chiller', 'CHILLER_ADDONS', 'Cooling System'],
  ['heatExchanger', 'HEAT_EXCHANGER_ADDONS', 'Heat Exchanger'],
  ['epc', 'EPC_COMPONENTS', 'EPC'],
  ['bimetallic', 'BIMETALLIC_BASE', 'Extruder Addons'],
  ['mdo', 'MDO_ADDONS', 'MDO'],
  ['hydraulicUnloader', 'HYDRAULIC_UNLOADER_ADDONS', 'Hydraulic Unloader'],
  ['optionalFeatures', 'OPTIONAL_FEATURE_ADDONS', 'Optional Features'],
  ['printer', 'PRINTER_ADDONS', 'Printer'],
]

const allComponents = []
for (const [file, exportName, category] of componentSources) {
  const items = safeRequire(path.join(dataDir, `${file}.ts`), exportName)
  if (Array.isArray(items)) {
    items.forEach(item => {
      if (item?.id || item?.name) allComponents.push({ ...item, category })
    })
  }
}
fs.writeFileSync(path.join(outputDir, 'components.json'), JSON.stringify({ components: allComponents, total: allComponents.length }, null, 2))
console.log(`✅ components.json — ${allComponents.length} components`)

// Build presets JSON
const presets = Object.entries(MODEL_PRESETS || {}).map(([modelCode, preset]) => ({
  modelCode,
  machineType: preset.machineType,
  basePrice: preset.basePrice || 0,
  components: preset.components || [],
  addons: preset.addons || [],
}))
fs.writeFileSync(path.join(outputDir, 'presets.json'), JSON.stringify({ presets, total: presets.length }, null, 2))
console.log(`✅ presets.json — ${presets.length} presets`)

console.log('\n🎉 Catalog JSON generated in public/catalog/')
console.log('Now commit and push — Vercel will serve these as static files.')
