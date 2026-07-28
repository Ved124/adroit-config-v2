import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import AdminLayout from "../../../components/admin/AdminLayout";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";

export default function ComponentsHub() {
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [newCategoryName, setNewCategoryName] = useState({ components: "", addons: "" });
  const [renaming, setRenaming] = useState(null); // { bucket, category }
  const [renameValue, setRenameValue] = useState("");
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState(null); // { bucket, category }
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then(setCatalog)
      .catch(() => setError("Failed to load catalog"));
  }, []);

  const handleCreateCategory = async (bucket) => {
    const category = (newCategoryName[bucket] || "").trim();
    if (!category) return;
    setActionError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket, category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create category");
      // Same read-after-write propagation lag as everywhere else in the admin
      // panel — update local state directly rather than re-fetching.
      setCatalog((prev) => ({ ...prev, [bucket]: { ...(prev[bucket] || {}), [category]: [] } }));
      setNewCategoryName((prev) => ({ ...prev, [bucket]: "" }));
    } catch (e) {
      setActionError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const startRename = (bucket, category) => {
    setActionError("");
    setRenaming({ bucket, category });
    setRenameValue(category);
  };

  const handleRenameCategory = async () => {
    if (!renaming) return;
    const { bucket, category } = renaming;
    const newCategory = renameValue.trim();
    if (!newCategory || newCategory === category) {
      setRenaming(null);
      return;
    }
    setActionError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket, category, newCategory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rename category");
      setCatalog((prev) => {
        const bucketData = { ...(prev[bucket] || {}) };
        const items = bucketData[category];
        delete bucketData[category];
        bucketData[newCategory] = items;
        return { ...prev, [bucket]: bucketData };
      });
      setRenaming(null);
    } catch (e) {
      setActionError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!confirmDeleteCategory) return;
    const { bucket, category } = confirmDeleteCategory;
    setActionError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket, category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category");
      setCatalog((prev) => {
        const bucketData = { ...(prev[bucket] || {}) };
        delete bucketData[category];
        return { ...prev, [bucket]: bucketData };
      });
      setConfirmDeleteCategory(null);
    } catch (e) {
      setActionError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <AdminLayout title="Components & Addons">
        <div style={{ color: "#dc2626" }}>{error}</div>
      </AdminLayout>
    );
  }
  if (!catalog) {
    return (
      <AdminLayout title="Components & Addons">
        <div style={{ color: "#64748b" }}>Loading...</div>
      </AdminLayout>
    );
  }

  const renderGroup = (bucketKey, bucketLabel, data) => (
    <section style={{ marginBottom: "28px" }} key={bucketKey}>
      <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#334155", marginBottom: "10px" }}>{bucketLabel}</h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <input
          value={newCategoryName[bucketKey] || ""}
          onChange={(e) => setNewCategoryName((prev) => ({ ...prev, [bucketKey]: e.target.value }))}
          onKeyDown={(e) => { if (e.key === "Enter") handleCreateCategory(bucketKey); }}
          placeholder="New category name..."
          style={{ flex: 1, maxWidth: "280px", padding: "8px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "13px" }}
        />
        <button
          disabled={busy || !(newCategoryName[bucketKey] || "").trim()}
          onClick={() => handleCreateCategory(bucketKey)}
          style={{ padding: "8px 14px", borderRadius: "6px", background: "#2563eb", color: "#fff", border: "none", fontWeight: 700, fontSize: "13px", cursor: busy ? "not-allowed" : "pointer" }}
        >
          + New Category
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
        {Object.entries(data || {}).map(([category, items]) => {
          const isRenamingThis = renaming && renaming.bucket === bucketKey && renaming.category === category;
          return (
            <div key={category} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px" }}>
              {isRenamingThis ? (
                <div>
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleRenameCategory(); if (e.key === "Escape") setRenaming(null); }}
                    style={{ width: "100%", boxSizing: "border-box", padding: "6px 8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "13px", marginBottom: "8px" }}
                  />
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button disabled={busy} onClick={handleRenameCategory} style={{ fontSize: "12px", fontWeight: 700, color: "#fff", background: "#2563eb", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: busy ? "not-allowed" : "pointer" }}>
                      Save
                    </button>
                    <button onClick={() => setRenaming(null)} style={{ fontSize: "12px", fontWeight: 700, color: "#475569", background: "#f1f5f9", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href={`/admin/components/${bucketKey}/${encodeURIComponent(category)}`}
                    style={{ display: "block", textDecoration: "none" }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>{category}</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{(items || []).length} item{(items || []).length === 1 ? "" : "s"}</div>
                  </Link>
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                    <button
                      onClick={() => startRename(bucketKey, category)}
                      style={{ fontSize: "12px", fontWeight: 700, color: "#475569", background: "#f1f5f9", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer" }}
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => setConfirmDeleteCategory({ bucket: bucketKey, category })}
                      style={{ fontSize: "12px", fontWeight: 700, color: "#dc2626", background: "#fef2f2", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <AdminLayout title="Components & Addons">
      <Head>
        <title>Components & Addons — Machine Manager</title>
      </Head>

      {actionError && (
        <div style={{ color: "#dc2626", marginBottom: "16px", padding: "10px 14px", background: "#fef2f2", borderRadius: "8px", fontSize: "13px" }}>
          {actionError}
        </div>
      )}

      {renderGroup("components", "Components (core, always included)", catalog.components)}
      {renderGroup("addons", "Addons (optional, priced extras)", catalog.addons)}

      <ConfirmDialog
        open={!!confirmDeleteCategory}
        title="Delete this category?"
        message={confirmDeleteCategory ? `"${confirmDeleteCategory.category}" will be permanently removed. This only works while it has no items left in it.` : ""}
        onCancel={() => setConfirmDeleteCategory(null)}
        onConfirm={handleDeleteCategory}
      />
    </AdminLayout>
  );
}
