// pages/api/admin/components.js
// Authenticated CRUD for catalog entries in either bucket — COMPONENTS_DATA
// (core parts: Extruder, Die Head, Bubble Cage, ...) or ADDONS_DATA (optional
// extras: Bimetallic, Corona, Chiller, ...). Same storage shape in both
// buckets (id, name, machineTypes, image, cardDesc, techDesc, scopeDesc,
// price or a size->price table), so one route handles both rather than
// duplicating this logic per bucket.
import { getCatalog, saveCatalog } from "../../../src/lib/catalogStore";

const VALID_BUCKETS = ["components", "addons"];

function validateItem(item, { partial = false } = {}) {
  if (!item || typeof item !== "object") return "Item payload is required.";
  if (!partial || item.id !== undefined) {
    if (!item.id || typeof item.id !== "string") return "Item id is required.";
  }
  if (!partial || item.name !== undefined) {
    if (!item.name || typeof item.name !== "string") return "Item name is required.";
  }
  if (item.machineTypes !== undefined && !Array.isArray(item.machineTypes)) {
    return "machineTypes must be an array.";
  }
  if (item.prices !== undefined && (typeof item.prices !== "object" || Array.isArray(item.prices))) {
    return "prices must be an object map of size -> price.";
  }
  return null;
}

export default async function handler(req, res) {
  try {
    const { bucket, category } = req.body || {};
    if (!VALID_BUCKETS.includes(bucket)) {
      return res.status(400).json({ error: `bucket must be one of: ${VALID_BUCKETS.join(", ")}` });
    }
    if (!category || typeof category !== "string") {
      return res.status(400).json({ error: "category is required" });
    }

    if (req.method === "POST") {
      const { item } = req.body || {};
      const validationError = validateItem(item);
      if (validationError) return res.status(400).json({ error: validationError });

      const catalog = await getCatalog();
      const bucketData = { ...(catalog[bucket] || {}) };
      const list = bucketData[category] || [];
      if (list.some((c) => c.id === item.id)) {
        return res.status(409).json({ error: `An item with id "${item.id}" already exists in ${category}` });
      }
      bucketData[category] = [...list, item];
      catalog[bucket] = bucketData;
      await saveCatalog(catalog);
      return res.status(201).json({ success: true, item });
    }

    if (req.method === "PUT") {
      const { id, updates } = req.body || {};
      if (!id) return res.status(400).json({ error: "id is required" });
      if (updates && updates.id !== undefined && updates.id !== id) {
        return res.status(400).json({ error: "Renaming an item's id isn't supported — delete and re-create instead." });
      }
      const validationError = validateItem(updates, { partial: true });
      if (validationError) return res.status(400).json({ error: validationError });

      const catalog = await getCatalog();
      const bucketData = { ...(catalog[bucket] || {}) };
      const list = bucketData[category] || [];
      const idx = list.findIndex((c) => c.id === id);
      if (idx === -1) return res.status(404).json({ error: `Item "${id}" not found in ${category}` });

      const merged = { ...list[idx], ...updates, id };
      bucketData[category] = list.map((c, i) => (i === idx ? merged : c));
      catalog[bucket] = bucketData;
      await saveCatalog(catalog);
      return res.status(200).json({ success: true, item: merged });
    }

    if (req.method === "DELETE") {
      const { id, force } = req.body || {};
      if (!id) return res.status(400).json({ error: "id is required" });

      const catalog = await getCatalog();
      const bucketData = { ...(catalog[bucket] || {}) };
      const list = bucketData[category] || [];
      if (!list.some((c) => c.id === id)) {
        return res.status(404).json({ error: `Item "${id}" not found in ${category}` });
      }

      // Deleting a component/addon that a live model's preset still
      // references would leave that model showing a missing-component error
      // — the non-coder editing this needs a clear warning before it happens,
      // not a silent break discovered later (e.g. at an exhibition).
      const usedByModels = (catalog.models || [])
        .filter((m) =>
          [...(m.components || []), ...(m.addons || [])].some((c) => c.id === id)
        )
        .map((m) => m.code);

      if (usedByModels.length > 0 && !force) {
        return res.status(409).json({
          error: `"${id}" is used by ${usedByModels.length} model(s): ${usedByModels.join(", ")}. Pass force to delete anyway.`,
          usedByModels,
        });
      }

      bucketData[category] = list.filter((c) => c.id !== id);
      catalog[bucket] = bucketData;
      await saveCatalog(catalog);
      return res.status(200).json({ success: true, deleted: id, usedByModels });
    }

    res.setHeader("Allow", ["POST", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("pages/api/admin/components.js error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}
