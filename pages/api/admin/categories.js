// pages/api/admin/categories.js
// Authenticated CRUD for the CATEGORY KEYS themselves within a bucket (e.g.
// adding a whole new "Slitting Unit" addon category from scratch) —
// components.js handles items *within* an existing category, this route
// handles the category list itself.
import { mutateCatalog } from "../../../src/lib/catalogStore";
import { httpError } from "../../../src/lib/httpError";

const VALID_BUCKETS = ["components", "addons"];

// "Extruder" has bespoke per-position (A/B/C/D/E) selection logic in
// pages/selection.jsx keyed off this exact category name — renaming or
// deleting it would silently break that feature, not just lose data.
const PROTECTED_CATEGORIES = { components: ["Extruder"] };

export default async function handler(req, res) {
  try {
    const { bucket } = req.body || {};
    if (!VALID_BUCKETS.includes(bucket)) {
      return res.status(400).json({ error: `bucket must be one of: ${VALID_BUCKETS.join(", ")}` });
    }

    if (req.method === "POST") {
      const { category } = req.body || {};
      if (!category || typeof category !== "string" || !category.trim()) {
        return res.status(400).json({ error: "category name is required" });
      }

      await mutateCatalog((catalog) => {
        const bucketData = { ...(catalog[bucket] || {}) };
        if (bucketData[category]) {
          throw httpError(409, `Category "${category}" already exists in ${bucket}`);
        }
        bucketData[category] = [];
        catalog[bucket] = bucketData;
        return catalog;
      });
      return res.status(201).json({ success: true, category });
    }

    if (req.method === "PUT") {
      const { category, newCategory } = req.body || {};
      if (!category || !newCategory || typeof newCategory !== "string" || !newCategory.trim()) {
        return res.status(400).json({ error: "category and newCategory are required" });
      }
      if (category === newCategory) {
        return res.status(400).json({ error: "New name must be different." });
      }
      if ((PROTECTED_CATEGORIES[bucket] || []).includes(category)) {
        return res.status(400).json({ error: `"${category}" can't be renamed — the configurator has built-in logic tied to this exact name.` });
      }

      await mutateCatalog((catalog) => {
        const bucketData = { ...(catalog[bucket] || {}) };
        if (!bucketData[category]) {
          throw httpError(404, `Category "${category}" not found in ${bucket}`);
        }
        if (bucketData[newCategory]) {
          throw httpError(409, `Category "${newCategory}" already exists in ${bucket}`);
        }

        const items = bucketData[category];
        delete bucketData[category];
        bucketData[newCategory] = items;
        catalog[bucket] = bucketData;

        // Model presets store a copy of the category string on each
        // component/addon reference (not just an id) — keep those in sync so
        // existing models don't silently mismatch after the rename.
        catalog.models = (catalog.models || []).map((m) => ({
          ...m,
          components: (m.components || []).map((c) => (c.category === category ? { ...c, category: newCategory } : c)),
          addons: (m.addons || []).map((a) => (a.category === category ? { ...a, category: newCategory } : a)),
        }));

        return catalog;
      });
      return res.status(200).json({ success: true, category: newCategory });
    }

    if (req.method === "DELETE") {
      const { category } = req.body || {};
      if (!category) return res.status(400).json({ error: "category is required" });
      if ((PROTECTED_CATEGORIES[bucket] || []).includes(category)) {
        return res.status(400).json({ error: `"${category}" can't be deleted — the configurator has built-in logic tied to this exact name.` });
      }

      await mutateCatalog((catalog) => {
        const bucketData = { ...(catalog[bucket] || {}) };
        const items = bucketData[category];
        if (!items) {
          throw httpError(404, `Category "${category}" not found in ${bucket}`);
        }
        if (items.length > 0) {
          throw httpError(409, `Category "${category}" still has ${items.length} item(s) — delete them first.`);
        }

        delete bucketData[category];
        catalog[bucket] = bucketData;
        return catalog;
      });
      return res.status(200).json({ success: true, deleted: category });
    }

    res.setHeader("Allow", ["POST", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message, ...(err.details || {}) });
    }
    console.error("pages/api/admin/categories.js error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}
