// pages/api/admin/components.js
// CRUD for component library (all categories)

import { seedComponents, readAdminJson, writeAdminJson } from './seed';

export default function handler(req, res) {
  try {
    seedComponents();

    if (req.method === 'GET') {
      const { category } = req.query;
      const data = readAdminJson('components.json') || {};
      if (category) {
        return res.status(200).json({ category, items: data[category] || [] });
      }
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { category, component } = req.body;
      if (!category || !component || !component.id) {
        return res.status(400).json({ error: 'category and component.id are required' });
      }
      const data = readAdminJson('components.json') || {};
      if (!data[category]) data[category] = [];

      if (data[category].find(c => c.id === component.id)) {
        return res.status(409).json({ error: `Component "${component.id}" already exists in "${category}"` });
      }
      data[category].push(component);
      writeAdminJson('components.json', data);
      return res.status(201).json({ success: true, component });
    }

    if (req.method === 'PUT') {
      const { category, id, updates } = req.body;
      if (!category || !id || !updates) {
        return res.status(400).json({ error: 'category, id, and updates are required' });
      }
      const data = readAdminJson('components.json') || {};
      if (!data[category]) return res.status(404).json({ error: `Category "${category}" not found` });

      const idx = data[category].findIndex(c => c.id === id);
      if (idx === -1) return res.status(404).json({ error: `Component "${id}" not found` });

      data[category][idx] = { ...data[category][idx], ...updates, id };
      writeAdminJson('components.json', data);
      return res.status(200).json({ success: true, component: data[category][idx] });
    }

    if (req.method === 'DELETE') {
      const { category, id } = req.body;
      if (!category || !id) {
        return res.status(400).json({ error: 'category and id are required' });
      }
      const data = readAdminJson('components.json') || {};
      if (!data[category]) return res.status(404).json({ error: `Category "${category}" not found` });

      const before = data[category].length;
      data[category] = data[category].filter(c => c.id !== id);
      if (data[category].length === before) {
        return res.status(404).json({ error: `Component "${id}" not found` });
      }
      writeAdminJson('components.json', data);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[admin/components]', err);
    return res.status(500).json({ error: err.message });
  }
}
