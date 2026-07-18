const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

async function fixImages() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('adroit_configurator');
  const componentsCollection = db.collection('components');

  const doc = await componentsCollection.findOne({ _id: 'all_components' });
  const imageMap = {};

  for (const [category, items] of Object.entries(doc)) {
    if (Array.isArray(items)) {
      items.forEach(item => {
        if (item.image && item.image.includes('cloudinary.com')) {
          imageMap[item.id] = item.image;
        }
      });
    }
  }

  const dataDir = path.join(__dirname, 'src/data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  let totalReplaced = 0;

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    for (const [id, cloudinaryUrl] of Object.entries(imageMap)) {
      // Regex explanation:
      // Match `id: "the-id"` anywhere, then matching characters until `image: "/images/...something.png"`
      // It handles single or double quotes.
      const regex = new RegExp(`(id\\s*:\\s*['"]${id}['"][\\s\\S]*?image\\s*:\\s*['"])\\/images\\/[^'"]+(['"])`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `$1${cloudinaryUrl}$2`);
        changed = true;
        totalReplaced++;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }

  await client.close();
  console.log(`Done! Replaced ${totalReplaced} images.`);
}

require('dotenv').config({ path: path.join(__dirname, '.env.local') });
fixImages().catch(console.error);
