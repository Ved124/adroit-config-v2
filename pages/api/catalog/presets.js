export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-cache')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { MODEL_PRESETS } = await import('../../src/data/modelPresets')
    const presets = Object.entries(MODEL_PRESETS || {}).map(([modelCode, preset]) => ({
      modelCode,
      machineType: preset.machineType,
      basePrice: preset.basePrice || 0,
      components: preset.components || [],
      addons: preset.addons || [],
    }))
    return res.status(200).json({ presets, total: presets.length })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
