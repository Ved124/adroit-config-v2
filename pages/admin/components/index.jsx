import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import AdminLayout from "../../../components/admin/AdminLayout";

export default function ComponentsHub() {
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then(setCatalog)
      .catch(() => setError("Failed to load catalog"));
  }, []);

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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
        {Object.entries(data || {}).map(([category, items]) => (
          <Link
            key={category}
            href={`/admin/components/${bucketKey}/${encodeURIComponent(category)}`}
            style={{
              display: "block", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px",
              padding: "16px", textDecoration: "none",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>{category}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{(items || []).length} item{(items || []).length === 1 ? "" : "s"}</div>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <AdminLayout title="Components & Addons">
      <Head>
        <title>Components & Addons — Machine Manager</title>
      </Head>
      {renderGroup("components", "Components (core, always included)", catalog.components)}
      {renderGroup("addons", "Addons (optional, priced extras)", catalog.addons)}
    </AdminLayout>
  );
}
