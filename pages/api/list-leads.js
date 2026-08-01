import { list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');

  try {
    const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
    const VERCEL_ENV = process.env.VERCEL;

    if (BLOB_TOKEN && VERCEL_ENV) {
      // === CLOUD MODE ===
      const { blobs } = await list({ prefix: 'data/', limit: 1000 });
      const sorted = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      return res.status(200).json({ blobs: sorted, mode: 'cloud' });
    } else {
      // === LOCAL MODE ===
      const downloadDir = path.join(process.cwd(), 'public', 'downloads');
      if (!fs.existsSync(downloadDir)) {
        return res.status(200).json({ blobs: [], mode: 'local' });
      }

      const files = fs.readdirSync(downloadDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      const blobs = jsonFiles.map(file => {
        const stats = fs.statSync(path.join(downloadDir, file));
        return {
          url: `/api/downloads/${file}`,
          pathname: `data/${file}`,
          size: stats.size,
          uploadedAt: stats.mtime,
        };
      });

      const sorted = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      return res.status(200).json({ blobs: sorted, mode: 'local' });
    }
  } catch (err) {
    console.error("List Error:", err);
    res.status(500).json({ error: 'Failed to list leads' });
  }
}
