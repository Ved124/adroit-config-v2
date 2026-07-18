// pages/api/admin/components.js
import clientPromise from '../../../src/lib/mongodb';

const DB_NAME = process.env.MONGODB_DB || 'adroit_configurator';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('components');

    if (req.method === 'GET') {
      const { category } = req.query;
      const dataDoc = await collection.findOne({ _id: 'all_components' }) || {};
      
      if (category) {
        return res.status(200).json({ category, items: dataDoc[category] || [] });
      }
      
      const responseData = { ...dataDoc };
      delete responseData._id;
      return res.status(200).json(responseData);
    }

    if (req.method === 'POST') {
      const { category, component } = req.body;
      if (!category || !component || !component.id) {
        return res.status(400).json({ error: 'category and component.id are required' });
      }

      const dataDoc = await collection.findOne({ _id: 'all_components' }) || {};
      if (!dataDoc[category]) dataDoc[category] = [];

      if (dataDoc[category].find(c => c.id === component.id)) {
        return res.status(409).json({ error: `Component "${component.id}" already exists in "${category}"` });
      }
      
      dataDoc[category].push(component);
      
      await collection.updateOne(
        { _id: 'all_components' },
        { $set: { [category]: dataDoc[category] } },
        { upsert: true }
      );
      
      return res.status(201).json({ success: true, component });
    }

    if (req.method === 'PUT') {
      const { category, id, updates } = req.body;
      if (!category || !id || !updates) {
        return res.status(400).json({ error: 'category, id, and updates are required' });
      }
      
      const dataDoc = await collection.findOne({ _id: 'all_components' }) || {};
      if (!dataDoc[category]) return res.status(404).json({ error: `Category "${category}" not found` });

      const idx = dataDoc[category].findIndex(c => c.id === id);
      if (idx === -1) return res.status(404).json({ error: `Component "${id}" not found` });

      dataDoc[category][idx] = { ...dataDoc[category][idx], ...updates, id };
      
      await collection.updateOne(
        { _id: 'all_components' },
        { $set: { [category]: dataDoc[category] } },
        { upsert: true }
      );
      
      return res.status(200).json({ success: true, component: dataDoc[category][idx] });
    }

    if (req.method === 'DELETE') {
      const { category, id } = req.body;
      if (!category || !id) {
        return res.status(400).json({ error: 'category and id are required' });
      }
      
      const dataDoc = await collection.findOne({ _id: 'all_components' }) || {};
      if (!dataDoc[category]) return res.status(404).json({ error: `Category "${category}" not found` });

      const idx = dataDoc[category].findIndex(c => c.id === id);
      if (idx === -1) {
        return res.status(404).json({ error: `Component "${id}" not found` });
      }
      
      dataDoc[category].splice(idx, 1);
      
      await collection.updateOne(
        { _id: 'all_components' },
        { $set: { [category]: dataDoc[category] } },
        { upsert: true }
      );
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Components API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
