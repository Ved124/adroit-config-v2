// pages/api/catalog/models.js
// GET /api/catalog/models — returns all machine models

let MONO_MODELS, ABA_MODELS, THREE_LAYER_MODELS

try { ({ MONO_MODELS } = require('../../../src/data/monoModels')) } catch(e) { MONO_MODELS = [] }
try { ({ ABA_MODELS } = require('../../../src/data/abaModels')) } catch(e) { ABA_MODELS = [] }
try { ({ THREE_LAYER_MODELS } = require('../../../src/data/threeLayerModels')) } catch(e) { THREE_LAYER_MODELS = [] }

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Cache-Control', 'no-cache')

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const mono = (MONO_MODELS || []).map(m => ({ ...m, machineType: 'mono' }))
    const aba = (ABA_MODELS || []).map(m => ({ ...m, machineType: 'aba' }))
    const threeLayer = (THREE_LAYER_MODELS || []).map(m => ({ ...m, machineType: '3layer' }))

    const { type } = req.query
    let models
    if (type === 'mono') models = mono
    else if (type === 'aba') models = aba
    else if (type === '3layer') models = threeLayer
    else models = [...mono, ...aba, ...threeLayer]

    return res.status(200).json({
      models,
      total: models.length,
      counts: {
        mono: mono.length,
        aba: aba.length,
        '3layer': threeLayer.length,
        total: mono.length + aba.length + threeLayer.length
      }
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
