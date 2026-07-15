export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-cache')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    // CORRECT PATH: pages/api/catalog/ → go up 2 levels to reach src/
    const [monoMod, abaMod, threeMod] = await Promise.allSettled([
      import('../../src/data/monoModels'),
      import('../../src/data/abaModels'),
      import('../../src/data/threeLayerModels'),
    ])
    const MONO = monoMod.status === 'fulfilled' ? (monoMod.value.MONO_MODELS || []) : []
    const ABA = abaMod.status === 'fulfilled' ? (abaMod.value.ABA_MODELS || []) : []
    const THREE = threeMod.status === 'fulfilled' ? (threeMod.value.THREE_LAYER_MODELS || []) : []
    const mono = MONO.map(m => ({ ...m, machineType: 'mono' }))
    const aba = ABA.map(m => ({ ...m, machineType: 'aba' }))
    const threeLayer = THREE.map(m => ({ ...m, machineType: '3layer' }))
    const { type } = req.query
    const models = type === 'mono' ? mono : type === 'aba' ? aba : type === '3layer' ? threeLayer : [...mono, ...aba, ...threeLayer]
    return res.status(200).json({
      models,
      total: models.length,
      counts: { mono: mono.length, aba: aba.length, '3layer': threeLayer.length, total: mono.length + aba.length + threeLayer.length }
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
