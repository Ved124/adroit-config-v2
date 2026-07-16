// pages/api/admin/presets.js
// CRUD for MODEL_PRESETS (the per-model default component configurations)

import { seedPresets, readAdminJson, writeAdminJson } from './seed';

export default function handler(req, res) {
  try {
    seedPresets();

    if (req.method === 'GET') {
      const data = readAdminJson('presets.json') || {};
      const { key } = req.query;
      if (key) {
        if (!data[key]) return res.status(404).json({ error: `Preset "${key}" not found` });
        return res.status(200).json({ key, preset: data[key] });
      }
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { key, preset } = req.body;
      if (!key || !preset) {
        return res.status(400).json({ error: 'key and preset are required' });
      }
      const data = readAdminJson('presets.json') || {};
      if (data[key]) {
        return res.status(409).json({ error: `Preset "${key}" already exists` });
      }
      data[key] = preset;
      writeAdminJson('presets.json', data);
      return res.status(201).json({ success: true, key, preset });
    }

    if (req.method === 'PUT') {
      const { key, updates } = req.body;
      if (!key || !updates) {
        return res.status(400).json({ error: 'key and updates are required' });
      }
      const data = readAdminJson('presets.json') || {};
      if (!data[key]) {
        return res.status(404).json({ error: `Preset "${key}" not found` });
      }
      data[key] = { ...data[key], ...updates };
      writeAdminJson('presets.json', data);
      return res.status(200).json({ success: true, key, preset: data[key] });
    }

    if (req.method === 'DELETE') {
      const { key } = req.body;
      if (!key) return res.status(400).json({ error: 'key is required' });
      const data = readAdminJson('presets.json') || {};
      if (!data[key]) return res.status(404).json({ error: `Preset "${key}" not found` });
      delete data[key];
      writeAdminJson('presets.json', data);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[admin/presets]', err);
    return res.status(500).json({ error: err.message });
  }
}
