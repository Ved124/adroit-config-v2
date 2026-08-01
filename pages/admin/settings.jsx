import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [markupPercent, setMarkupPercent] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => {
        const s = data.settings || { exportMarkup: 1.3 };
        setSettings(s);
        setMarkupPercent((((s.exportMarkup ?? 1.3) - 1) * 100).toFixed(0));
      })
      .catch(() => setError("Failed to load settings"));
  }, []);

  const handleSave = async () => {
    setError("");
    setSaved(false);
    const pct = parseFloat(markupPercent);
    if (isNaN(pct) || pct < 0) {
      setError("Enter a valid, non-negative percentage.");
      return;
    }
    const exportMarkup = 1 + pct / 100;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: { exportMarkup } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSettings(data.settings);
      setSaved(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      <Head>
        <title>Settings — Machine Manager</title>
      </Head>

      {error && (
        <div style={{ color: "#dc2626", marginBottom: "16px", padding: "10px 14px", background: "#fef2f2", borderRadius: "8px", fontSize: "13px" }}>
          {error}
        </div>
      )}

      {!settings ? (
        <div style={{ color: "#64748b" }}>Loading...</div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "24px", maxWidth: "480px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
            Export Pricing
          </h2>
          <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px" }}>
            When a customer's region is set to Export, every price (machine, addons, components) is priced at this
            much more than the domestic (INR) value, before converting to USD at the exchange rate entered on the
            quote itself.
          </p>

          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "6px" }}>
            Export Markup (%)
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <input
              type="number"
              min="0"
              step="1"
              value={markupPercent}
              onChange={(e) => setMarkupPercent(e.target.value)}
              style={{ width: "120px", padding: "8px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px" }}
            />
            <span style={{ fontSize: "13px", color: "#64748b" }}>
              % more than domestic (e.g. 30 = export price is 1.3× domestic)
            </span>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              marginTop: "12px", padding: "9px 18px", borderRadius: "8px",
              background: saving ? "#93c5fd" : "#2563eb", color: "#fff", border: "none",
              fontWeight: 700, fontSize: "13px", cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {saved && (
            <span style={{ marginLeft: "12px", fontSize: "12px", color: "#166534", fontWeight: 700 }}>
              ✓ Saved
            </span>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
