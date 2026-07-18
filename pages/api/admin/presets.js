// pages/api/admin/presets.js
import clientPromise from '../../../src/lib/mongodb';

const DB_NAME = process.env.MONGODB_DB || 'adroit_configurator';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('presets');

    if (req.method === 'GET') {
      const { key } = req.query;
      if (key) {
        const preset = await collection.findOne({ _id: key });
        if (!preset) return res.status(404).json({ error: `Preset "${key}" not found` });
        delete preset._id;
        return res.status(200).json({ key, preset });
      }

      const allPresets = await collection.find({}).toArray();
      const data = {};
      allPresets.forEach(p => {
        data[p._id] = { ...p };
        delete data[p._id]._id;
      });
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { key, preset } = req.body;
      if (!key || !preset) {
        return res.status(400).json({ error: 'key and preset are required' });
      }

      const existing = await collection.findOne({ _id: key });
      if (existing) {
        return res.status(409).json({ error: `Preset "${key}" already exists` });
      }

      await collection.insertOne({ _id: key, ...preset });
      return res.status(201).json({ success: true, key, preset });
    }

    if (req.method === 'PUT') {
      const { key, updates } = req.body;
      if (!key || !updates) {
        return res.status(400).json({ error: 'key and updates are required' });
      }

      const existing = await collection.findOne({ _id: key });
      if (!existing) {
        return res.status(404).json({ error: `Preset "${key}" not found` });
      }

      const newDoc = { ...existing, ...updates };
      delete newDoc._id;

      await collection.updateOne({ _id: key }, { $set: newDoc });
      return res.status(200).json({ success: true, key, preset: newDoc });
    }

    if (req.method === 'DELETE') {
      const { key } = req.body;
      if (!key) return res.status(400).json({ error: 'key is required' });

      const result = await collection.deleteOne({ _id: key });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: `Preset "${key}" not found` });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Presets API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
