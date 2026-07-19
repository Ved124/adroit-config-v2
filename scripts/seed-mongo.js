const fs = require('fs');
const { MongoClient } = require('mongodb');

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('adroit_configurator');

  const componentsData = JSON.parse(fs.readFileSync('public/admin-data/components.json', 'utf8'));
  await db.collection('components').updateOne(
    { _id: 'all_components' },
    { $set: { _id: 'all_components', ...componentsData } },
    { upsert: true }
  );

  console.log('Seeded components successfully directly to MongoDB!');
  await client.close();
}

seed().catch(console.error);
