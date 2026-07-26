import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminLayout from "../../../../components/admin/AdminLayout";
import ConfirmDialog from "../../../../components/admin/ConfirmDialog";
import TechDescEditor from "../../../../components/admin/TechDescEditor";
import PriceTableEditor from "../../../../components/admin/PriceTableEditor";
import ImageUploader from "../../../../components/admin/ImageUploader";
import { generateScopeDesc } from "../../../../src/utils/generateScopeDesc";
import { resolveTechDesc, toTechRows } from "../../../../src/utils/mergeCatalogItem";

const MACHINE_TYPES = ["mono", "aba", "3layer", "5layer"];

function inputStyle() {
  return { width: "100%", boxSizing: "border-box", padding: "8px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "13px" };
}
function labelStyle() {
  return { display: "block", fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "4px" };
}

const EMPTY_ITEM = { id: "", name: "", machineTypes: [], image: "", cardDesc: "", scopeDesc: "", techDesc: {}, price: 0 };

function ItemCard({ item, category, onSave, onDelete, isNewCard, onCancelNew }) {
  const [draft, setDraft] = useState(item);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const toggleMachineType = (mt) => {
    const current = draft.machineTypes || [];
    update({ machineTypes: current.includes(mt) ? current.filter((x) => x !== mt) : [...current, mt] });
  };

  const previewItem = { ...draft, category };
  let previewScope = "";
  try {
    previewScope = generateScopeDesc(previewItem, [], null, []);
  } catch (e) {
    previewScope = `(preview error: ${e.message})`;
  }
  const previewTechRows = toTechRows(resolveTechDesc({ category, baseTechDesc: draft.techDesc }));

  const isSizePriced = draft.pricingType === "size";

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      await onSave(draft);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
        <div>
          <label style={labelStyle()}>ID (unique) *</label>
          <input value={draft.id || ""} onChange={(e) => update({ id: e.target.value })} disabled={!isNewCard} style={inputStyle()} />
        </div>
        <div>
          <label style={labelStyle()}>Name *</label>
          <input value={draft.name || ""} onChange={(e) => update({ name: e.target.value })} style={inputStyle()} />
        </div>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle()}>Machine Types</label>
        <div style={{ display: "flex", gap: "12px" }}>
          {MACHINE_TYPES.map((mt) => (
            <label key={mt} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px" }}>
              <input type="checkbox" checked={(draft.machineTypes || []).includes(mt)} onChange={() => toggleMachineType(mt)} />
              {mt}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <ImageUploader value={draft.image || ""} onChange={(url) => update({ image: url })} />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle()}>Card Description</label>
        <input value={draft.cardDesc || ""} onChange={(e) => update({ cardDesc: e.target.value })} style={inputStyle()} />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle()}>Scope of Supply override</label>
        <textarea value={draft.scopeDesc || ""} onChange={(e) => update({ scopeDesc: e.target.value })} rows={2} style={{ ...inputStyle(), resize: "vertical" }} />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <TechDescEditor value={draft.techDesc || {}} onChange={(v) => update({ techDesc: v })} />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle()}>Pricing Type</label>
        <select
          value={isSizePriced ? "size" : "flat"}
          onChange={(e) => update({ pricingType: e.target.value === "size" ? "size" : undefined })}
          style={{ ...inputStyle(), maxWidth: "200px", marginBottom: "10px" }}
        >
          <option value="flat">Flat price</option>
          <option value="size">Size-based price table</option>
        </select>
        {isSizePriced ? (
          <PriceTableEditor value={draft.prices || {}} onChange={(v) => update({ prices: v })} />
        ) : (
          <input type="number" value={draft.price ?? 0} onChange={(e) => update({ price: parseFloat(e.target.value) || 0 })} style={{ ...inputStyle(), maxWidth: "200px" }} />
        )}
      </div>

      <div style={{ padding: "10px", background: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1", marginBottom: "12px" }}>
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

      {error && <div style={{ color: "#dc2626", fontSize: "13px", marginBottom: "10px" }}>{error}</div>}

      <div style={{ display: "flex", gap: "10px" }}>
        <button data-testid={`save-${item.id || "new"}`} onClick={handleSave} disabled={saving || !draft.id || !draft.name} style={{ padding: "8px 16px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
          {saving ? "Saving..." : isNewCard ? "Create" : "Save Changes"}
        </button>
        {isNewCard ? (
          <button onClick={onCancelNew} style={{ padding: "8px 16px", borderRadius: "8px", background: "#f1f5f9", color: "#475569", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
            Cancel
          </button>
        ) : (
          <button data-testid={`delete-trigger-${item.id}`} onClick={() => setConfirmDelete(true)} style={{ padding: "8px 16px", borderRadius: "8px", background: "#fef2f2", color: "#dc2626", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
            Delete
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this item?"
        message={`"${draft.id}" will be removed from the live catalog immediately. Any model referencing it will show a missing-component error.`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          setConfirmDelete(false);
          try {
            await onDelete(draft.id);
          } catch (e) {
            setError(e.message);
          }
        }}
        confirmTestId={`delete-confirm-${draft.id}`}
      />
    </div>
  );
}

export default function CategoryEditor() {
  const router = useRouter();
  const { bucket, category: rawCategory } = router.query;
  const category = rawCategory ? decodeURIComponent(rawCategory) : null;

  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const loadedKeyRef = useRef(null);

  const load = () => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => {
        const list = (data[bucket] || {})[category] || [];
        setItems(list);
        loadedKeyRef.current = `${bucket}:${category}`;
      })
      .catch(() => setError("Failed to load catalog"));
  };

  useEffect(() => {
    if (!router.isReady || !bucket || !category) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, bucket, category]);

  const handleSaveItem = async (draft, wasNew) => {
    const res = await fetch("/api/admin/components", {
      method: wasNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        wasNew ? { bucket, category, item: draft } : { bucket, category, id: draft.id, updates: draft }
      ),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Save failed");
    // Vercel Blob has real read-after-write propagation lag — update local
    // state directly with what we just saved rather than re-fetching.
    setItems((prev) => {
      const list = prev || [];
      const idx = list.findIndex((c) => c.id === draft.id);
      return idx === -1 ? [...list, draft] : list.map((c, i) => (i === idx ? draft : c));
    });
    if (wasNew) setShowNew(false);
  };

  const handleDeleteItem = async (id) => {
    const res = await fetch("/api/admin/components", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket, category, id }),
    });
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 409 && data.usedByModels?.length) {
        const proceed = window.confirm(
          `"${id}" is used by ${data.usedByModels.length} model(s): ${data.usedByModels.join(", ")}.\n\nDeleting it will make those models show a missing-component error until fixed. Delete anyway?`
        );
        if (!proceed) return;
        const forcedRes = await fetch("/api/admin/components", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bucket, category, id, force: true }),
        });
        const forcedData = await forcedRes.json();
        if (!forcedRes.ok) throw new Error(forcedData.error || "Delete failed");
        setItems((prev) => (prev || []).filter((c) => c.id !== id));
        return;
      }
      throw new Error(data.error || "Delete failed");
    }
    setItems((prev) => (prev || []).filter((c) => c.id !== id));
  };

  if (error) {
    return (
      <AdminLayout title="Components & Addons">
        <div style={{ color: "#dc2626" }}>{error}</div>
      </AdminLayout>
    );
  }
  if (!items) {
    return (
      <AdminLayout title="Components & Addons">
        <div style={{ color: "#64748b" }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`${category} (${bucket === "addons" ? "Addons" : "Components"})`}>
      <Head>
        <title>{category} — Machine Manager</title>
      </Head>

      <div style={{ marginBottom: "16px" }}>
        <button
          onClick={() => setShowNew(true)}
          disabled={showNew}
          style={{ padding: "10px 18px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontWeight: 700, fontSize: "14px", cursor: showNew ? "not-allowed" : "pointer" }}
        >
          + New Item
        </button>
      </div>

      {showNew && (
        <ItemCard
          item={{ ...EMPTY_ITEM }}
          category={category}
          isNewCard
          onSave={(draft) => handleSaveItem(draft, true)}
          onCancelNew={() => setShowNew(false)}
          onDelete={() => {}}
        />
      )}

      {items.length === 0 && !showNew && <div style={{ color: "#94a3b8" }}>No items in this category yet.</div>}

      {items.map((item) => (
        <ItemCard key={item.id} item={item} category={category} onSave={(draft) => handleSaveItem(draft, false)} onDelete={handleDeleteItem} />
      ))}
    </AdminLayout>
  );
}
