// pages/api/backup-leads.js
// One-click backup of locally-stored exhibition leads (PDF + JSON pairs under
// public/downloads/) to Vercel Blob — covers the one real weakness of running
// "Exhibition WiFi Mode" locally: if this laptop is lost, damaged, or its
// disk fails, leads captured during the show would be gone with it. Uploads
// go to the same data//downloads/ prefixes save-kiosk.js already uses in
// cloud mode, so a backed-up lead is indistinguishable from a natively
// cloud-saved one if this app is ever run on Vercel later. Safe to run
// repeatedly — already-backed-up files (matched by filename) are skipped,
// and uploads use a fixed path (no random suffix) so even a re-upload of the
// same file just overwrites itself rather than creating a duplicate.
//
// Lives outside /api/admin/* (unauthenticated, like its siblings
// list-leads.js and save-kiosk.js) because /admin/leads — the only page that
// calls this — is itself a pre-existing, deliberately public page with no
// login barrier (see middleware.js). Gating just this one action would be
// inconsistent with the rest of that page, which already lets anyone view
// and download every lead with no login.
import fs from "fs";
import path from "path";
import { put, list } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(400).json({ error: "BLOB_READ_WRITE_TOKEN is not configured — can't back up to the cloud from here." });
  }

  try {
    const downloadDir = path.join(process.cwd(), "public", "downloads");
    if (!fs.existsSync(downloadDir)) {
      return res.status(200).json({ uploaded: 0, skipped: 0, total: 0 });
    }

    const files = fs.readdirSync(downloadDir).filter((f) => f.endsWith(".json") || f.endsWith(".pdf"));

    const [{ blobs: existingData }, { blobs: existingDownloads }] = await Promise.all([
      list({ prefix: "data/", limit: 1000 }),
      list({ prefix: "downloads/", limit: 1000 }),
    ]);
    const existingNames = new Set([
      ...existingData.map((b) => b.pathname.replace(/^data\//, "")),
      ...existingDownloads.map((b) => b.pathname.replace(/^downloads\//, "")),
    ]);

    const toUpload = files.filter((f) => !existingNames.has(f));
    const skipped = files.length - toUpload.length;

    // Uploading one file at a time made a full-day backup (hundreds of
    // leads) take minutes and risked the request just timing out. Blob
    // uploads are network-bound, not CPU-bound, so a bounded concurrency
    // batch (not unbounded — hundreds of simultaneous connections would just
    // trade one bottleneck for another) gets this down to seconds.
    const CONCURRENCY = 8;
    let uploaded = 0;
    for (let i = 0; i < toUpload.length; i += CONCURRENCY) {
      const batch = toUpload.slice(i, i + CONCURRENCY);
      await Promise.all(
        batch.map(async (file) => {
          const prefix = file.endsWith(".json") ? "data/" : "downloads/";
          const buffer = fs.readFileSync(path.join(downloadDir, file));
          await put(`${prefix}${file}`, buffer, {
            access: "public",
            contentType: file.endsWith(".json") ? "application/octet-stream" : "application/pdf",
            addRandomSuffix: false,
            allowOverwrite: true,
          });
          uploaded++;
        })
      );
    }

    return res.status(200).json({ uploaded, skipped, total: files.length });
  } catch (err) {
    console.error("pages/api/backup-leads.js error:", err);
    return res.status(500).json({ error: err.message || "Backup failed" });
  }
}
