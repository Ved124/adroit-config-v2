// GET /api/catalog/presets
// Returns all model presets

import { MODEL_PRESETS } from '../../../src/data/modelPresets'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=300')

    const presets = Object.entries(MODEL_PRESETS).map(([modelCode, preset]) => ({
      modelCode,
      ...preset,
    }))

    return res.status(200).json({
      presets,
      total: presets.length,
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
