// scripts/seed-to-crm.ts
// Correctly transforms configurator TypeScript data into CRM-compatible format

import * as extrudersModule from '../src/data/extruders';
import * as diesModule from '../src/data/dies';
import * as airRingModule from '../src/data/airRing';
import * as bubbleCagesModule from '../src/data/bubbleCages';
import * as windersModule from '../src/data/winders';
import * as collapsingFrameModule from '../src/data/collapsingFrame';
import * as towerModule from '../src/data/tower';
import * as trimModule from '../src/data/trim';
import * as ibcModule from '../src/data/ibc';
import * as coronaModule from '../src/data/corona';
import * as materialHandlingModule from '../src/data/materialHandling';
import * as gaugeModule from '../src/data/gauge';
import * as webGuideModule from '../src/data/webGuide';
import * as hauloffsModule from '../src/data/hauloffs';
import * as electricalPanelModule from '../src/data/electricalPanel';
import * as extruderAddonsModule from '../src/data/extruderAddons';
import * as winderAddonsModule from '../src/data/winderAddons';
import * as dieAddonsModule from '../src/data/dieAddons';
import * as chillerModule from '../src/data/chiller';
import * as heatExchangerModule from '../src/data/heatExchanger';
import * as epcModule from '../src/data/epc';
import * as bimetallicModule from '../src/data/bimetallic';
import * as mdoModule from '../src/data/mdo';
import { MODEL_PRESETS } from '../src/data/modelPresets';
const { MONO_MODELS } = require('../data/monoModels.ts');
const { ABA_MODELS } = require('../data/abaModels.ts');
const { THREE_LAYER_MODELS } = require('../data/threeLayerModels.ts');

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractArray(mod: any): any[] {
  for (const key of Object.keys(mod)) {
    const val = mod[key]
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && 'id' in val[0]) {
      return val
    }
  }
  return []
}

function extractPriceTables(mod: any): { category: string; code: string; price: number }[] {
  const rows: { category: string; code: string; price: number }[] = []
  for (const key of Object.keys(mod)) {
    const val = mod[key]
    if (val && typeof val === 'object' && !Array.isArray(val) && !key.startsWith('__') && key !== 'default') {
      const entries = Object.entries(val)
      if (entries.length > 0 && typeof entries[0][1] === 'number') {
        for (const [sizeKey, price] of entries) {
          rows.push({ category: key, code: `${key}-${sizeKey}`, price: price as number })
        }
      }
    }
  }
  return rows
}

function normalizeComponent(comp: any, category: string): any {
  return {
    code: comp.id,
    machineType: comp.machineTypes ? comp.machineTypes.join(', ') : 'mono',
    category,
    label: comp.customName || comp.name || comp.id,
    description: comp.scopeDesc || comp.desc || comp.shortDesc || null,
    specs: comp
  }
}

// ── Build Components ──────────────────────────────────────────────────────────

function buildComponents(): any[] {
  const all: any[] = []
  const sources: { mod: any; category: string }[] = [
    { mod: extrudersModule, category: 'Extruder' },
    { mod: diesModule, category: 'Die Head' },
    { mod: airRingModule, category: 'Air Ring' },
    { mod: bubbleCagesModule, category: 'Bubble Cage' },
    { mod: windersModule, category: 'Winder' },
    { mod: collapsingFrameModule, category: 'Collapsing Frame' },
    { mod: towerModule, category: 'Tower' },
    { mod: trimModule, category: 'Trim Blower' },
    { mod: ibcModule, category: 'IBC' },
    { mod: coronaModule, category: 'Corona' },
    { mod: materialHandlingModule, category: 'Material Handling' },
    { mod: gaugeModule, category: 'Gauge Control' },
    { mod: webGuideModule, category: 'Web Guide' },
    { mod: hauloffsModule, category: 'Haul-Off' },
    { mod: electricalPanelModule, category: 'Electrical' },
    { mod: extruderAddonsModule, category: 'Extruder Addons' },
    { mod: winderAddonsModule, category: 'Winder Addons' },
    { mod: dieAddonsModule, category: 'Die Addons' },
    { mod: chillerModule, category: 'Cooling' },
    { mod: heatExchangerModule, category: 'Heat Exchanger' },
    { mod: epcModule, category: 'Web Guide' },
    { mod: bimetallicModule, category: 'Extruder Addons' },
    { mod: mdoModule, category: 'MDO' },
  ]
  for (const { mod, category } of sources) {
    const arr = extractArray(mod)
    for (const comp of arr) {
      if (comp.id) all.push(normalizeComponent(comp, category))
    }
  }
  return all
}

// ── Build Price Tables ────────────────────────────────────────────────────────

function buildPriceTables(): any[] {
  const all: any[] = []
  const sources = [
    airRingModule, bubbleCagesModule, windersModule, diesModule,
    coronaModule, webGuideModule, hauloffsModule, gaugeModule,
    chillerModule, heatExchangerModule, towerModule, collapsingFrameModule,
  ]
  for (const mod of sources) all.push(...extractPriceTables(mod))
  const seen = new Set<string>()
  return all.filter(row => {
    const key = row.code
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ── Build Models ──────────────────────────────────────────────────────────────

function buildModels(): any[] {
  const all: any[] = []

  for (let i = 0; i < MONO_MODELS.length; i++) {
    const m = MONO_MODELS[i] as any
    const preset = MODEL_PRESETS[m.code] || MODEL_PRESETS[m.label]
    if (preset && preset.basePrice) m.basePrice = preset.basePrice
    all.push({
      code: m.code, label: m.label, type: 'mono',
      widthMm: m.layflatWidthMm ? parseInt(String(m.layflatWidthMm).replace(/[^0-9]/g, ''), 10) || null : null,
      outputKgHr: m.maxOutputKgHr ? String(m.maxOutputKgHr) : null,
      description: m.family || 'Monolayer',
      specs: m,
      isActive: true
    })
  }

  for (let i = 0; i < ABA_MODELS.length; i++) {
    const m = ABA_MODELS[i] as any
    const preset = MODEL_PRESETS[m.code] || MODEL_PRESETS[m.label]
    if (preset && preset.basePrice) m.basePrice = preset.basePrice
    all.push({
      code: m.code, label: m.label, type: 'aba',
      widthMm: m.layflatWidthMm ? parseInt(String(m.layflatWidthMm).replace(/[^0-9]/g, ''), 10) || null : null,
      outputKgHr: m.maxOutputKgHr ? String(m.maxOutputKgHr) : null,
      description: m.family || 'ABA',
      specs: m,
      isActive: true
    })
  }

  for (let i = 0; i < THREE_LAYER_MODELS.length; i++) {
    const m = THREE_LAYER_MODELS[i] as any
    const preset = MODEL_PRESETS[m.code] || MODEL_PRESETS[m.label]
    if (preset && preset.basePrice) m.basePrice = preset.basePrice
    all.push({
      code: m.code, label: m.label, type: '3layer',
      widthMm: m.widthMm ? parseInt(String(m.widthMm).replace(/[^0-9]/g, ''), 10) || null : null,
      outputKgHr: m.outputKgHr ? String(m.outputKgHr) : null,
      description: m.family || '3 Layer',
      specs: m,
      isActive: true
    })
  }

  return all
}

// ── Build Presets ─────────────────────────────────────────────────────────────

function buildPresets(): any[] {
  return Object.entries(MODEL_PRESETS).map(([modelCode, preset]: [string, any]) => ({
    modelCode: modelCode,
    components: preset.components || [],
    addons: preset.addons || []
  }))
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function seedData() {
  const crmApiUrl = process.env.CRM_API_URL || 'http://localhost:4000'
  const seedToken = process.env.CRM_SEED_TOKEN || process.env.SEED_TOKEN || 'adroit-seed-token-2026'

  console.log('\n🚀 Starting Adroit machine catalog seed to CRM...')
  console.log(`📡 CRM URL: ${crmApiUrl}\n`)

  console.log('📦 Building models...')
  const models = buildModels()
  console.log(`   ✅ ${models.length} machine models`)

  console.log('🔧 Building components...')
  const components = buildComponents()
  console.log(`   ✅ ${components.length} components`)

  console.log('💰 Building price tables...')
  const priceTables = buildPriceTables()
  console.log(`   ✅ ${priceTables.length} price table entries`)

  console.log('⚙️  Building presets...')
  const presets = buildPresets()
  console.log(`   ✅ ${presets.length} model presets`)

  const payload = { models, components, priceTables, presets }

  console.log('\n📤 Sending to CRM backend...')

  try {
    const response = await fetch(`${crmApiUrl}/api/machines/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-seed-token': seedToken,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errText}`)
    }

    const result = await response.json()

    console.log('\n🎉 Seed complete!\n')
    console.log('Results:')
    console.log(`   Machine models:  ${result.seeded?.models ?? '?'} saved`)
    console.log(`   Components:      ${result.seeded?.components ?? '?'} saved`)
    console.log(`   Price tables:    ${result.seeded?.priceTables ?? '?'} saved`)
    console.log(`   Model presets:   ${result.seeded?.presets ?? '?'} saved`)
    console.log('\n✅ Go to localhost:3000/dashboard/configurator/machines to verify\n')

  } catch (error: any) {
    console.error('\n❌ Seed failed:', error.message)
    console.error('\nMake sure:')
    console.error('  1. CRM backend running: cd adroit-forge/backend && npx ts-node src/index.ts')
    console.error('  2. SEED_TOKEN matches in both .env files')
    console.error('  3. /api/machines/seed route exists in backend\n')
  }
}

seedData()