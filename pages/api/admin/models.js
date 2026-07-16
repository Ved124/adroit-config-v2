// pages/api/admin/models.js
// CRUD for machine models (mono, aba, 3layer)

import { seedModels, readAdminJson, writeAdminJson } from './seed';

export default function handler(req, res) {
  try {
    seedModels(); // no-op if already seeded

    if (req.method === 'GET') {
      const data = readAdminJson('models.json') || { mono: [], aba: [], threeLayer: [] };
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { machineFamily, model } = req.body;
      if (!machineFamily || !model || !model.code) {
        return res.status(400).json({ error: 'machineFamily and model.code are required' });
      }
      const data = readAdminJson('models.json') || { mono: [], aba: [], threeLayer: [] };
      const key = familyKey(machineFamily);
      if (!data[key]) return res.status(400).json({ error: `Unknown family: ${machineFamily}` });

      if (data[key].find(m => m.code === model.code)) {
        return res.status(409).json({ error: `Model with code "${model.code}" already exists` });
      }
      data[key].push(model);
      writeAdminJson('models.json', data);
      return res.status(201).json({ success: true, model });
    }

    if (req.method === 'PUT') {
      const { machineFamily, code, updates } = req.body;
      if (!machineFamily || !code || !updates) {
        return res.status(400).json({ error: 'machineFamily, code, and updates are required' });
      }
      const data = readAdminJson('models.json') || { mono: [], aba: [], threeLayer: [] };
      const key = familyKey(machineFamily);
      const idx = data[key]?.findIndex(m => m.code === code);
      if (idx === -1 || idx === undefined) {
        return res.status(404).json({ error: `Model "${code}" not found` });
      }
      data[key][idx] = { ...data[key][idx], ...updates, code }; // preserve code
      writeAdminJson('models.json', data);
      return res.status(200).json({ success: true, model: data[key][idx] });
    }

    if (req.method === 'DELETE') {
      const { machineFamily, code } = req.body;
      if (!machineFamily || !code) {
        return res.status(400).json({ error: 'machineFamily and code are required' });
      }
      const data = readAdminJson('models.json') || { mono: [], aba: [], threeLayer: [] };
      const key = familyKey(machineFamily);
      const before = data[key]?.length || 0;
      data[key] = (data[key] || []).filter(m => m.code !== code);
      if (data[key].length === before) {
        return res.status(404).json({ error: `Model "${code}" not found` });
      }
      writeAdminJson('models.json', data);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[admin/models]', err);
    return res.status(500).json({ error: err.message });
  }
}

function familyKey(family) {
  if (family === 'mono') return 'mono';
  if (family === 'aba') return 'aba';
  if (family === '3layer' || family === 'threeLayer') return 'threeLayer';
  return family;
}
