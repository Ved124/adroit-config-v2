// GET /api/catalog
// Returns summary of all catalog data

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  return res.status(200).json({
    endpoints: {
      models: '/api/catalog/models',
      components: '/api/catalog/components',
      presets: '/api/catalog/presets',
    },
    version: '2.0',
    updated: new Date().toISOString(),
  })
}
