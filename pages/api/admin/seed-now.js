// pages/api/admin/seed-now.js
import fs from 'fs';
import path from 'path';
import clientPromise from '../../../src/lib/mongodb';

const DB_NAME = process.env.MONGODB_DB || 'adroit_configurator';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const publicAdminDataPath = path.join(process.cwd(), 'public', 'admin-data');

    // 1. Models
    const modelsData = JSON.parse(fs.readFileSync(path.join(publicAdminDataPath, 'models.json'), 'utf8'));
    await db.collection('models').updateOne(
      { _id: 'all_models' },
      { $set: { _id: 'all_models', ...modelsData } },
      { upsert: true }
    );

    // 2. Presets
    const presetsData = JSON.parse(fs.readFileSync(path.join(publicAdminDataPath, 'presets.json'), 'utf8'));
    const presetsCollection = db.collection('presets');
    await presetsCollection.deleteMany({}); // clear existing
    const presetsDocs = Object.keys(presetsData || {}).map(key => ({
      _id: key,
      ...presetsData[key]
    }));
    if (presetsDocs.length > 0) {
      await presetsCollection.insertMany(presetsDocs);
    }

    // 3. Components
    const componentsData = JSON.parse(fs.readFileSync(path.join(publicAdminDataPath, 'components.json'), 'utf8'));
    await db.collection('components').updateOne(
      { _id: 'all_components' },
      { $set: { _id: 'all_components', ...componentsData } },
      { upsert: true }
    );

    return res.status(200).json({
      success: true,
      seeded: {
        models: Object.keys(modelsData).length,
        presets: Object.keys(presetsData).length,
        components: Object.keys(componentsData).length,
      }
    });
  } catch (err) {
    console.error('[seed-now]', err);
    return res.status(500).json({ error: err.message });
  }
}
