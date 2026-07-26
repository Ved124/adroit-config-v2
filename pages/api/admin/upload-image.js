// pages/api/admin/upload-image.js
// Uploads a catalog component/addon image to Vercel Blob (same store as the
// catalog JSON and lead PDFs) instead of a third-party service — no extra
// credentials needed since BLOB_READ_WRITE_TOKEN is already configured.
import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { dataUrl, filename } = req.body || {};
    if (!dataUrl || typeof dataUrl !== "string") {
      return res.status(400).json({ error: "dataUrl is required" });
    }

    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: "dataUrl must be a base64-encoded image data URL" });
    }
    const contentType = match[1];
    const buffer = Buffer.from(match[2], "base64");

    const safeName = (filename || "image").replace(/[^a-zA-Z0-9._-]/g, "_");
    const pathname = `images/catalog/${Date.now()}-${safeName}`;

    const blob = await put(pathname, buffer, {
      access: "public",
      contentType,
    });

    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error("pages/api/admin/upload-image.js error:", err);
    return res.status(500).json({ error: err.message || "Upload failed" });
  }
}
