import path from 'path'
import fs from 'fs'

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-cache')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const filePath = path.join(process.cwd(), 'public', 'catalog', 'components.json')
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Catalog not generated. Run: node scripts/generate-catalog-json.js' })
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const { category } = req.query
    if (category) {
      const filtered = data.components.filter(c => c.category === category)
      return res.status(200).json({ components: filtered, total: filtered.length })
    }
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
