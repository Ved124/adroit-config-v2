import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminLayout from "../../../components/admin/AdminLayout";
import TechDescEditor from "../../../components/admin/TechDescEditor";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";
import ImageUploader from "../../../components/admin/ImageUploader";
import { generateScopeDesc } from "../../../src/utils/generateScopeDesc";
import { resolveTechDesc, toTechRows } from "../../../src/utils/mergeCatalogItem";

const MACHINE_TYPES = ["mono", "aba", "3layer", "5layer"];

const FORM_SECTIONS = [
  {
    label: "Basic Info",
    fields: [
      { key: "code", label: "Code (unique)", required: true },
      { key: "label", label: "Display Label", required: true },
      { key: "family", label: "Family" },
      { key: "machineType", label: "Machine Type", type: "select", options: MACHINE_TYPES },
      { key: "isIbc", label: "Is IBC model", type: "checkbox" },
      { key: "basePrice", label: "Base Price", type: "number" },
    ],
  },
  {
    label: "Extruder",
    fields: [
      { key: "screwDiameter", label: "Screw Diameter" },
      { key: "screwLdRatio", label: "L/D Ratio" },
      { key: "extruderMotorRating", label: "Extruder Motor Rating (HP)" },
    ],
  },
  {
    label: "Die & Air Ring",
    fields: [
      { key: "dieSizeHmLd", label: "Die Size" },
      { key: "airRingBlowerRating", label: "Air Ring Blower Rating" },
    ],
  },
  {
    label: "Output & Layflat",
    fields: [
      { key: "layflatWidthMm", label: "Layflat Width (mm)", type: "number" },
      { key: "thicknessRange", label: "Thickness Range" },
      { key: "thicknessVariation", label: "Thickness Variation" },
      { key: "maxOutputKgHr", label: "Max Output (kg/hr)" },
    ],
  },
  {
    label: "Main Nip / Winder",
    fields: [
      { key: "mainNipDrive", label: "Main Nip Drive" },
      { key: "mainNipLineSpeed", label: "Main Nip Line Speed" },
      { key: "winderType", label: "Winder Type" },
      { key: "winderDrive", label: "Winder Drive" },
    ],
  },
  {
    label: "3-Layer Specifics",
    fields: [
      { key: "bubbleCage", label: "Bubble Cage" },
      { key: "collapsingFrame", label: "Collapsing Frame" },
      { key: "additionalNip", label: "Additional Nip" },
      { key: "trimBlower", label: "Trim Blower" },
      { key: "rollCapacity", label: "Roll Capacity" },
      { key: "controlPanel", label: "Control Panel" },
      { key: "tensionControl", label: "Tension Control" },
    ],
  },
  {
    label: "Electrical / Misc",
    fields: [
      { key: "totalConnectedLoadKw", label: "Total Connected Load" },
      { key: "totalHeatingLoadKw", label: "Total Heating Load" },
      { key: "specificPowerConsumption", label: "Specific Power Consumption" },
      { key: "overallDimensions", label: "Overall Dimensions" },
    ],
  },
];

const EMPTY_MODEL = {
  code: "",
  family: "",
  label: "",
  machineType: "mono",
  components: [],
  addons: [],
};

function labelStyle() {
  return { display: "block", fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "4px" };
}
function inputStyle() {
  return { width: "100%", boxSizing: "border-box", padding: "8px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "13px" };
}

function buildPreviewItem(row, catalogBucket) {
  const catItem = (catalogBucket[row.category] || []).find((c) => c.id === row.id) || {};
  const metadata = row.metadata || {};
  return {
    ...catItem,
    ...metadata,
    id: row.id,
    category: row.category,
    qty: row.qty || 1,
    name: metadata.customName || catItem.name || row.id,
  };
}

function RowEditor({ title, rows, onChange, catalogBuckets, otherBucketLabel }) {
  const categories = Object.keys(catalogBuckets).sort();

  const updateRow = (idx, patch) => {
    const next = rows.map((r, i) => (i === idx ? { ...r, ...patch } : r));
    onChange(next);
  };
  const updateMetadata = (idx, patch) => {
    const next = rows.map((r, i) => (i === idx ? { ...r, metadata: { ...(r.metadata || {}), ...patch } } : r));
    onChange(next);
  };
  const removeRow = (idx) => onChange(rows.filter((_, i) => i !== idx));
  const addRow = () => {
    const firstCat = categories[0] || "";
    const firstId = (catalogBuckets[firstCat] || [])[0]?.id || "";
    onChange([...rows, { category: firstCat, id: firstId, qty: 1, metadata: {} }]);
  };

  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>{title}</h3>
        <button type="button" onClick={addRow} style={{ fontSize: "12px", fontWeight: 700, background: "#eef2ff", color: "#4338ca", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer" }}>
          + Add {otherBucketLabel}
        </button>
      </div>
      {rows.length === 0 && <div style={{ color: "#94a3b8", fontSize: "13px", padding: "8px 0" }}>None yet.</div>}
      {rows.map((row, idx) => {
        const idsForCategory = catalogBuckets[row.category] || [];
        const previewItem = buildPreviewItem(row, catalogBuckets);
        let previewScope = "";
        try {
          previewScope = generateScopeDesc(previewItem, [], null, []);
        } catch (e) {
          previewScope = `(preview error: ${e.message})`;
        }
        const catItem = idsForCategory.find((c) => c.id === row.id) || {};
        const previewTechRows = toTechRows(
          resolveTechDesc({ category: row.category, baseTechDesc: catItem.techDesc, metadataTechDesc: row.metadata?.techDesc })
        );

        return (
          <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", marginBottom: "10px", background: "#fff" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px auto", gap: "8px", marginBottom: "10px" }}>
              <select
                value={row.category}
                onChange={(e) => {
                  const newCat = e.target.value;
                  const newId = (catalogBuckets[newCat] || [])[0]?.id || "";
                  updateRow(idx, { category: newCat, id: newId });
                }}
                style={inputStyle()}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select value={row.id} onChange={(e) => updateRow(idx, { id: e.target.value })} style={inputStyle()}>
                {idsForCategory.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                ))}
              </select>
              <input
                type="number"
                value={row.qty || 1}
                onChange={(e) => updateRow(idx, { qty: parseInt(e.target.value) || 1 })}
                style={inputStyle()}
              />
              <button type="button" onClick={() => removeRow(idx)} style={{ background: "none", border: "none", color: "#f87171", fontSize: "18px", cursor: "pointer" }}>×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
              <div>
                <label style={labelStyle()}>Custom Name (override)</label>
                <input
                  value={row.metadata?.customName || ""}
                  onChange={(e) => updateMetadata(idx, { customName: e.target.value })}
                  placeholder={catItem.name || ""}
                  style={inputStyle()}
                />
              </div>
              <div>
                <label style={labelStyle()}>Price override</label>
                <input
                  type="number"
                  value={row.metadata?.price ?? ""}
                  onChange={(e) => updateMetadata(idx, { price: e.target.value === "" ? undefined : parseFloat(e.target.value) })}
                  style={inputStyle()}
                />
              </div>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={labelStyle()}>Scope of Supply override</label>
              <textarea
                value={row.metadata?.scopeDesc || ""}
                onChange={(e) => updateMetadata(idx, { scopeDesc: e.target.value })}
                rows={2}
                style={{ ...inputStyle(), resize: "vertical" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <ImageUploader
                value={row.metadata?.image || catItem.image || ""}
                onChange={(url) => updateMetadata(idx, { image: url })}
              />
            </div>
            <TechDescEditor value={row.metadata?.techDesc || {}} onChange={(v) => updateMetadata(idx, { techDesc: v })} />

            <div style={{ marginTop: "12px", padding: "10px", background: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
                Live Preview — exactly what the proposal will print
              </div>
              <div style={{ fontSize: "12px", color: "#334155", marginBottom: "6px" }}>
                <strong>Scope line:</strong> {previewScope || "(empty)"}
              </div>
              {previewTechRows.length > 0 && (
                <table style={{ width: "100%", fontSize: "12px" }}>
                  <tbody>
                    {previewTechRows.map((r, i) => (
                      <tr key={i}>
                        <td style={{ color: "#64748b", fontWeight: 600, padding: "2px 8px 2px 0", verticalAlign: "top", whiteSpace: "nowrap" }}>{r.label}</td>
                        <td style={{ color: "#334155" }}>{r.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ModelEditor() {
  const router = useRouter();
  const { code } = router.query;
  const isNew = code === "new";

  const [catalog, setCatalog] = useState(null);
  const [model, setModel] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Vercel Blob has real read-after-write propagation lag (observed up to
  // several seconds) — re-fetching /api/catalog right after this page itself
  // just wrote to it can come back without the change, showing a false
  // "not found". loadedCodeRef tracks which code our in-memory `model` state
  // is already authoritative for (freshly created/saved locally); the effect
  // skips re-fetching entirely in that case instead of racing the backend.
  const loadedCodeRef = useRef(null);

  useEffect(() => {
    if (!router.isReady) return;
    if (loadedCodeRef.current === code) return;
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => {
        setCatalog(data);
        if (isNew) {
          setModel({ ...EMPTY_MODEL });
          loadedCodeRef.current = "new";
        } else {
          const found = (data.models || []).find((m) => m.code === code);
          if (!found) {
            setError(`Model "${code}" not found.`);
            return;
          }
          setModel({ ...found, components: found.components || [], addons: found.addons || [] });
          loadedCodeRef.current = code;
        }
      })
      .catch(() => setError("Failed to load catalog"));
  }, [router.isReady, code, isNew]);

  const updateField = (key, value) => setModel((m) => ({ ...m, [key]: value }));

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      if (isNew) {
        const res = await fetch("/api/admin/models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Save failed");
        // Mark this code as already-authoritative in memory before navigating
        // so the effect above doesn't race a not-yet-propagated re-fetch.
        loadedCodeRef.current = model.code;
        router.push(`/admin/models/${encodeURIComponent(model.code)}`);
      } else {
        const res = await fetch("/api/admin/models", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, updates: model }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Save failed");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/models", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Delete failed");
      router.push("/admin/models");
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  if (error && !model) {
    return (
      <AdminLayout title="Machine Models">
        <div style={{ color: "#dc2626" }}>{error}</div>
      </AdminLayout>
    );
  }
  if (!model || !catalog) {
    return (
      <AdminLayout title="Machine Models">
        <div style={{ color: "#64748b" }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isNew ? "New Machine Model" : `Edit — ${model.label || model.code}`}>
      <Head>
        <title>{isNew ? "New Model" : model.code} — Machine Manager</title>
      </Head>

      {error && <div style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</div>}

      {FORM_SECTIONS.map((section) => (
        <div key={section.label} style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", padding: "16px", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            {section.label}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            {section.fields.map((f) => (
              <div key={f.key}>
                <label style={labelStyle()}>{f.label}{f.required ? " *" : ""}</label>
                {f.type === "select" ? (
                  <select value={model[f.key] || ""} onChange={(e) => updateField(f.key, e.target.value)} style={inputStyle()}>
                    {f.options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : f.type === "checkbox" ? (
                  <input type="checkbox" checked={!!model[f.key]} onChange={(e) => updateField(f.key, e.target.checked)} />
                ) : (
                  <input
                    type={f.type === "number" ? "number" : "text"}
                    value={model[f.key] ?? ""}
                    onChange={(e) => updateField(f.key, f.type === "number" ? (e.target.value === "" ? undefined : parseFloat(e.target.value)) : e.target.value)}
                    disabled={f.key === "code" && !isNew}
                    style={inputStyle()}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <RowEditor
        title="Components (core, always included)"
        rows={model.components || []}
        onChange={(rows) => updateField("components", rows)}
        catalogBuckets={catalog.components || {}}
        otherBucketLabel="Component"
      />
      <RowEditor
        title="Addons (optional, priced extras)"
        rows={model.addons || []}
        onChange={(rows) => updateField("addons", rows)}
        catalogBuckets={catalog.addons || {}}
        otherBucketLabel="Addon"
      />

      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: "10px 20px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}
        >
          {saving ? "Saving..." : isNew ? "Create Model" : "Save Changes"}
        </button>
        {!isNew && (
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={saving}
            style={{ padding: "10px 20px", borderRadius: "8px", background: "#fef2f2", color: "#dc2626", border: "none", fontWeight: 700, cursor: "pointer" }}
          >
            Delete Model
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this model?"
        message={`"${model.code}" will be removed from the live catalog immediately.`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}
