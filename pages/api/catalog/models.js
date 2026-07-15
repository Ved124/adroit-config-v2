// GET /api/catalog/models
// Returns all machine models from TypeScript data files

import { MONO_MODELS } from '../../../data/monoModels'
import { ABA_MODELS } from '../../../data/abaModels'
import { THREE_LAYER_MODELS } from '../../../data/threeLayerModels'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { type } = req.query

    const allModels = [
      ...MONO_MODELS.map(m => ({ ...m, machineType: 'mono' })),
      ...ABA_MODELS.map(m => ({ ...m, machineType: 'aba' })),
      ...THREE_LAYER_MODELS.map(m => ({ ...m, machineType: '3layer' })),
    ]

    const filtered = type
      ? allModels.filter(m => m.machineType === type)
      : allModels

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=300')

    return res.status(200).json({
      models: filtered,
      total: filtered.length,
      types: {
        mono: MONO_MODELS.length,
        aba: ABA_MODELS.length,
        '3layer': THREE_LAYER_MODELS.length,
      }
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
