import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminLayout from "../../components/admin/AdminLayout";

const FAMILY_LABELS = {
  mono: "Monolayer",
  aba: "ABA / Co-ex",
  "3layer": "3-Layer",
  "5layer": "5-Layer",
};

function StatCard({ label, value }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px", minWidth: "140px" }}>
      <div style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then(setCatalog)
      .catch(() => setError("Failed to load catalog"));
  }, []);

  const modelsByFamily = {};
  (catalog?.models || []).forEach((m) => {
    modelsByFamily[m.machineType] = (modelsByFamily[m.machineType] || 0) + 1;
  });
  const componentCategoryCount = Object.keys(catalog?.components || {}).length;
  const addonCategoryCount = Object.keys(catalog?.addons || {}).length;

  return (
    <AdminLayout title="Machine Manager">
      <Head>
        <title>Machine Manager</title>
      </Head>

      {error && <div style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</div>}
      {!catalog && !error && <div style={{ color: "#64748b" }}>Loading...</div>}

      {catalog && (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
            <StatCard label="Total Models" value={catalog.models.length} />
            {Object.entries(modelsByFamily).map(([type, count]) => (
              <StatCard key={type} label={FAMILY_LABELS[type] || type} value={count} />
            ))}
            <StatCard label="Component Categories" value={componentCategoryCount} />
            <StatCard label="Addon Categories" value={addonCategoryCount} />
          </div>

          <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "24px" }}>
            Source: {catalog.source === "blob" ? "live catalog (admin-edited)" : "static defaults (no edits saved yet)"}
            {catalog.updatedAt && ` · last updated ${new Date(catalog.updatedAt).toLocaleString()}`}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <Link
              href="/admin/models"
              style={{ display: "block", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", textDecoration: "none" }}
            >
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>🏭 Machine Models</div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>Create, edit, duplicate, or delete machine model presets.</div>
            </Link>
            <Link
              href="/admin/components"
              style={{ display: "block", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", textDecoration: "none" }}
            >
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>🔧 Components & Addons</div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>Edit core components and optional addons across every category.</div>
            </Link>
            <Link
              href="/admin/leads"
              style={{ display: "block", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", textDecoration: "none" }}
            >
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>📋 Leads Dashboard</div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>View saved customer quotations and proposals.</div>
            </Link>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
