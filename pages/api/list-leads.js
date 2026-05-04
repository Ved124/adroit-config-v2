import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');

  try {
    const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
    if (!BLOB_TOKEN) {
      return res.status(200).json({ blobs: [], error: 'No Blob token configured (Running locally without cloud)' });
    }

    // List all files in the 'data/' prefix (JSONs)
    const { blobs } = await list({ prefix: 'data/', limit: 1000 });
    
    // Sort by uploadedAt descending
    const sorted = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return res.status(200).json({ blobs: sorted });
  } catch (err) {
    console.error("List Error:", err);
    res.status(500).json({ error: 'Failed to list blobs' });
  }
}
