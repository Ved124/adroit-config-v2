// pages/api/catalog.js
// Public, unauthenticated read endpoint for the live machine/component catalog.
// Intentionally NOT gated by any admin-auth middleware (see middleware.js) —
// the configurator itself needs this with no login, exactly like it could
// already read the static .ts files with no login.
import { getCatalog } from "../../src/lib/catalogStore";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");

  // Short edge cache so repeated app loads (e.g. kiosk resets on exhibition
  // wifi) don't hit blob storage every time, while staying fresh enough that
  // an admin edit still feels "immediate".
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=300");

  try {
    const catalog = await getCatalog();
    return res.status(200).json(catalog);
  } catch (err) {
    console.error("GET /api/catalog failed:", err);
    return res.status(500).json({ error: "Failed to load catalog" });
  }
}
