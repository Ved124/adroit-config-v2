// pages/api/admin/models.js
// Authenticated CRUD for machine models (gated by middleware.js). Reads for the
// admin UI go through the public GET /api/catalog (no need to duplicate that
// here) — this route is the write path only: create, update, delete.
import { getCatalog, saveCatalog } from "../../../src/lib/catalogStore";

const VALID_MACHINE_TYPES = ["mono", "aba", "3layer", "5layer"];

function validateModel(model, { partial = false } = {}) {
  if (!model || typeof model !== "object") return "Model payload is required.";
  if (!partial || model.code !== undefined) {
    if (!model.code || typeof model.code !== "string") return "Model code is required.";
  }
  if (!partial || model.label !== undefined) {
    if (!model.label || typeof model.label !== "string") return "Model label is required.";
  }
  if (!partial || model.machineType !== undefined) {
    if (!VALID_MACHINE_TYPES.includes(model.machineType)) {
      return `machineType must be one of: ${VALID_MACHINE_TYPES.join(", ")}`;
    }
  }
  if (model.components !== undefined && !Array.isArray(model.components)) {
    return "components must be an array.";
  }
  if (model.addons !== undefined && !Array.isArray(model.addons)) {
    return "addons must be an array.";
  }
  return null;
}

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { model } = req.body || {};
      const validationError = validateModel(model);
      if (validationError) return res.status(400).json({ error: validationError });

      const catalog = await getCatalog();
      if (catalog.models.some((m) => m.code === model.code)) {
        return res.status(409).json({ error: `Model with code "${model.code}" already exists` });
      }

      catalog.models = [...catalog.models, model];
      await saveCatalog(catalog);
      return res.status(201).json({ success: true, model });
    }

    if (req.method === "PUT") {
      const { code, updates } = req.body || {};
      if (!code) return res.status(400).json({ error: "code is required" });
      if (updates && updates.code !== undefined && updates.code !== code) {
        return res.status(400).json({ error: "Renaming a model's code isn't supported — delete and re-create instead." });
      }
      const validationError = validateModel(updates, { partial: true });
      if (validationError) return res.status(400).json({ error: validationError });

      const catalog = await getCatalog();
      const idx = catalog.models.findIndex((m) => m.code === code);
      if (idx === -1) return res.status(404).json({ error: `Model "${code}" not found` });

      const merged = { ...catalog.models[idx], ...updates, code };
      catalog.models = catalog.models.map((m, i) => (i === idx ? merged : m));
      await saveCatalog(catalog);
      return res.status(200).json({ success: true, model: merged });
    }

    if (req.method === "DELETE") {
      const { code } = req.body || {};
      if (!code) return res.status(400).json({ error: "code is required" });

      const catalog = await getCatalog();
      const idx = catalog.models.findIndex((m) => m.code === code);
      if (idx === -1) return res.status(404).json({ error: `Model "${code}" not found` });

      catalog.models = catalog.models.filter((m) => m.code !== code);
      await saveCatalog(catalog);
      return res.status(200).json({ success: true, deleted: code });
    }

    res.setHeader("Allow", ["POST", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("pages/api/admin/models.js error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}
