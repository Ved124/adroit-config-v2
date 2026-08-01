// pages/api/downloads/[filename].js
// Serves locally-saved lead PDFs/JSONs at request time, straight from disk.
//
// Next.js's built-in static `public/` serving only recognizes files that
// existed in `public/` at `next build` time — a file written to
// public/downloads/ by save-kiosk.js's local mode WHILE the production
// server is already running (the entire point of "Exhibition WiFi Mode":
// new leads get saved continuously throughout the show) 404s if served
// through the static /downloads/ path, no matter how many times the server
// is restarted, because that requires an actual rebuild to pick up. This
// route reads the file fresh on every request instead, so newly-created
// files are always reachable immediately.
import fs from "fs";
import path from "path";

const CONTENT_TYPES = {
  ".pdf": "application/pdf",
  ".json": "application/json",
};

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");

  const { filename } = req.query;
  if (!filename || typeof filename !== "string") {
    return res.status(400).send("filename is required");
  }
  // filename comes from a single dynamic path segment, but guard against
  // path traversal explicitly rather than trusting that.
  if (filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
    return res.status(400).send("Invalid filename");
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    return res.status(400).send("Unsupported file type");
  }

  const filePath = path.join(process.cwd(), "public", "downloads", filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Not found");
  }

  res.setHeader("Content-Type", contentType);
  if (req.query.download === "1") {
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  }
  fs.createReadStream(filePath).pipe(res);
}
