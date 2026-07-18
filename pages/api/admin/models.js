// pages/api/admin/models.js
import clientPromise from '../../../src/lib/mongodb';

const DB_NAME = process.env.MONGODB_DB || 'adroit_configurator';

function familyKey(machineFamily) {
  if (machineFamily === 'mono') return 'mono';
  if (machineFamily === 'aba') return 'aba';
  if (machineFamily === '3layer' || machineFamily === 'threeLayer') return 'threeLayer';
  return 'mono';
}

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('models');

    if (req.method === 'GET') {
      // Return a single document that has mono, aba, threeLayer arrays
      const dataDoc = await collection.findOne({ _id: 'all_models' });
      return res.status(200).json(dataDoc || { mono: [], aba: [], threeLayer: [] });
    }

    if (req.method === 'POST') {
      const { machineFamily, model } = req.body;
      if (!machineFamily || !model || !model.code) {
        return res.status(400).json({ error: 'machineFamily and model.code are required' });
      }
      
      const key = familyKey(machineFamily);
      const dataDoc = await collection.findOne({ _id: 'all_models' }) || { mono: [], aba: [], threeLayer: [] };
      if (!dataDoc[key]) dataDoc[key] = [];

      if (dataDoc[key].find(m => m.code === model.code)) {
        return res.status(409).json({ error: `Model with code "${model.code}" already exists` });
      }
      
      dataDoc[key].push(model);
      await collection.updateOne(
        { _id: 'all_models' },
        { $set: { [key]: dataDoc[key] } },
        { upsert: true }
      );
      
      return res.status(201).json({ success: true, model });
    }

    if (req.method === 'PUT') {
      const { machineFamily, code, updates } = req.body;
      if (!machineFamily || !code || !updates) {
        return res.status(400).json({ error: 'machineFamily, code, and updates are required' });
      }
      
      const key = familyKey(machineFamily);
      const dataDoc = await collection.findOne({ _id: 'all_models' }) || { mono: [], aba: [], threeLayer: [] };
      if (!dataDoc[key]) dataDoc[key] = [];
      
      const idx = dataDoc[key].findIndex(m => m.code === code);
      if (idx === -1) {
        return res.status(404).json({ error: `Model "${code}" not found` });
      }
      
      dataDoc[key][idx] = { ...dataDoc[key][idx], ...updates, code }; // preserve code
      
      await collection.updateOne(
        { _id: 'all_models' },
        { $set: { [key]: dataDoc[key] } },
        { upsert: true }
      );
      
      return res.status(200).json({ success: true, model: dataDoc[key][idx] });
    }

    if (req.method === 'DELETE') {
      const { machineFamily, code } = req.body;
      if (!machineFamily || !code) {
        return res.status(400).json({ error: 'machineFamily and code are required' });
      }
      
      const key = familyKey(machineFamily);
      const dataDoc = await collection.findOne({ _id: 'all_models' }) || { mono: [], aba: [], threeLayer: [] };
      if (!dataDoc[key]) dataDoc[key] = [];
      
      const idx = dataDoc[key].findIndex(m => m.code === code);
      if (idx === -1) {
        return res.status(404).json({ error: `Model "${code}" not found` });
      }
      
      dataDoc[key].splice(idx, 1);
      
      await collection.updateOne(
        { _id: 'all_models' },
        { $set: { [key]: dataDoc[key] } },
        { upsert: true }
      );
      
      return res.status(200).json({ success: true, deleted: code });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Models API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
