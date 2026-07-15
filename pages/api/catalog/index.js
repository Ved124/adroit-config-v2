// pages/api/catalog/index.js
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  return res.status(200).json({
    name: 'Adroit Extrusion Machine Catalog API',
    version: '2.0',
    endpoints: {
      models:     { url: '/api/catalog/models',     description: 'All machine models', params: '?type=mono|aba|3layer' },
      components: { url: '/api/catalog/components', description: 'All components',     params: '?category=Extruder|Die Head|...' },
      presets:    { url: '/api/catalog/presets',    description: 'Model presets with component lists' },
    },
    updated: new Date().toISOString(),
  })
}
