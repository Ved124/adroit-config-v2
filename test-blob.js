import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

// Load env vars manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

async function run() {
  try {
    const jsonString = JSON.stringify({ hello: "world" }, null, 2);
    const blob = await put(`data/test-file.json`, jsonString, { 
      access: 'public', 
      contentType: 'application/json' 
    });
    console.log("Uploaded! URL:", blob.url);
  } catch (err) {
    console.error(err);
  }
}

run();
