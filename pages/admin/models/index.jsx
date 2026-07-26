import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import AdminLayout from "../../../components/admin/AdminLayout";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";

const FAMILY_LABELS = {
  mono: "Monolayer",
  aba: "ABA / Co-ex",
  "3layer": "3-Layer",
  "5layer": "5-Layer",
};

export default function ModelsList() {
  const [models, setModels] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyCode, setBusyCode] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = () => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => setModels(data.models || []))
      .catch(() => setError("Failed to load catalog"));
  };

  useEffect(load, []);

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = (models || []).filter(
      (m) => !q || m.code.toLowerCase().includes(q) || (m.label || "").toLowerCase().includes(q)
    );
    const groups = { mono: [], aba: [], "3layer": [], "5layer": [] };
    filtered.forEach((m) => {
      if (!groups[m.machineType]) groups[m.machineType] = [];
      groups[m.machineType].push(m);
    });
    return groups;
  }, [models, search]);

  const handleDuplicate = async (model) => {
    let n = 2;
    let newCode = `${model.code}-COPY`;
    // avoid clobbering an existing duplicate
    while ((models || []).some((m) => m.code === newCode)) {
      newCode = `${model.code}-COPY${n}`;
      n += 1;
    }
    setBusyCode(model.code);
    try {
      const duplicated = { ...model, code: newCode, label: `${model.label} (Copy)` };
      const res = await fetch("/api/admin/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: duplicated }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Duplicate failed");
      // Vercel Blob has real read-after-write propagation lag (observed up to
      // several seconds) — re-fetching /api/catalog immediately here can come
      // back without the model we just created. Add it to local state
      // directly instead of relying on a re-fetch to reflect our own write.
      setModels((prev) => [...(prev || []), duplicated]);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyCode(null);
    }
  };

  const handleDelete = async (code) => {
    setBusyCode(code);
    try {
      const res = await fetch("/api/admin/models", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Delete failed");
      setConfirmDelete(null);
      // Same propagation-lag reasoning as duplicate above — remove locally
      // rather than trusting an immediate re-fetch to reflect our own delete.
      setModels((prev) => (prev || []).filter((m) => m.code !== code));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyCode(null);
    }
  };

  return (
    <AdminLayout title="Machine Models">
      <Head>
        <title>Machine Models — Manager</title>
      </Head>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or label..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px" }}
        />
        <Link
          href="/admin/models/new"
          style={{
            padding: "10px 18px", borderRadius: "8px", background: "#2563eb", color: "#fff",
            fontWeight: 700, fontSize: "14px", textDecoration: "none", whiteSpace: "nowrap",
          }}
        >
          + New Model
        </Link>
      </div>

      {error && <div style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</div>}
      {!models && !error && <div style={{ color: "#64748b" }}>Loading...</div>}

      {models &&
        Object.entries(grouped).map(([type, list]) =>
          list.length === 0 ? null : (
            <section key={type} style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#334155", marginBottom: "10px" }}>
                {FAMILY_LABELS[type] || type} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({list.length})</span>
              </h2>
              <div style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                {list.map((m, i) => (
                  <div
                    key={m.code}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 16px", borderBottom: i < list.length - 1 ? "1px solid #f1f5f9" : "none",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>{m.label || m.code}</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>{m.code}</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link
                        href={`/admin/models/${encodeURIComponent(m.code)}`}
                        style={{ fontSize: "13px", fontWeight: 700, color: "#2563eb", textDecoration: "none", padding: "6px 10px" }}
                      >
                        Edit
                      </Link>
                      <button
                        disabled={busyCode === m.code}
                        onClick={() => handleDuplicate(m)}
                        style={{
                          fontSize: "13px", fontWeight: 700, color: "#475569", background: "#f1f5f9",
                          border: "none", borderRadius: "6px", padding: "6px 10px", cursor: "pointer",
                        }}
                      >
                        Duplicate
                      </button>
                      <button
                        disabled={busyCode === m.code}
                        onClick={() => setConfirmDelete(m.code)}
                        style={{
                          fontSize: "13px", fontWeight: 700, color: "#dc2626", background: "#fef2f2",
                          border: "none", borderRadius: "6px", padding: "6px 10px", cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete this model?"
        message={`"${confirmDelete}" will be removed from the live catalog immediately.`}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete)}
      />
    </AdminLayout>
  );
}
