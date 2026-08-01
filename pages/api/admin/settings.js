// pages/api/admin/settings.js
// Authenticated CRUD for business-rule settings that used to be hardcoded
// constants (e.g. the export price markup) — stored on catalog.settings so
// they follow the same admin-editable-with-history-snapshot infrastructure
// as everything else, rather than needing a separate store.
import { mutateCatalog } from "../../../src/lib/catalogStore";
import { httpError } from "../../../src/lib/httpError";

function validateSettings(updates) {
  if (!updates || typeof updates !== "object") return "Settings payload is required.";
  if (updates.exportMarkup !== undefined) {
    if (typeof updates.exportMarkup !== "number" || !Number.isFinite(updates.exportMarkup) || updates.exportMarkup < 0) {
      return "exportMarkup must be a non-negative number (e.g. 1.3 for +30%).";
    }
  }
  return null;
}

export default async function handler(req, res) {
  try {
    if (req.method === "PUT") {
      const { updates } = req.body || {};
      const validationError = validateSettings(updates);
      if (validationError) return res.status(400).json({ error: validationError });

      let merged;
      await mutateCatalog((catalog) => {
        merged = { ...(catalog.settings || {}), ...updates };
        catalog.settings = merged;
        return catalog;
      });
      return res.status(200).json({ success: true, settings: merged });
    }

    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message, ...(err.details || {}) });
    }
    console.error("pages/api/admin/settings.js error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}
