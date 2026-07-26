// components/admin/PriceTableEditor.jsx
// Simple add/remove-row editor for a size -> price map, used by dynamic
// components/addons priced with pricingType: "size" (e.g. bubble cages,
// tower, bimetallic upgrades).
import React from "react";

export default function PriceTableEditor({ value = {}, onChange }) {
  const rows = Object.entries(value);

  const updateSize = (oldSize, newSize) => {
    const updated = {};
    for (const [k, v] of Object.entries(value)) {
      updated[k === oldSize ? newSize : k] = v;
    }
    onChange(updated);
  };
  const updatePrice = (size, newPrice) => {
    onChange({ ...value, [size]: Number(newPrice) || 0 });
  };
  const addRow = () => {
    let newSize = "0";
    let n = 1;
    while (value[newSize] !== undefined) {
      newSize = String(n);
      n += 1;
    }
    onChange({ ...value, [newSize]: 0 });
  };
  const removeRow = (size) => {
    const updated = { ...value };
    delete updated[size];
    onChange(updated);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Size → Price Table
        </span>
        <button
          type="button"
          onClick={addRow}
          style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", fontWeight: 700, cursor: "pointer", color: "#475569" }}
        >
          + Add Size
        </button>
      </div>
      <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
        {rows.length === 0 && (
          <div style={{ padding: "16px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
            No sizes yet. Click "+ Add Size" to add pricing tiers.
          </div>
        )}
        {rows.map(([size, price], i) => (
          <div
            key={i}
            style={{
              display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 0,
              borderBottom: i < rows.length - 1 ? "1px solid #f1f5f9" : "none",
              background: i % 2 === 0 ? "#fafafa" : "white",
            }}
          >
            <input
              value={size}
              onChange={(e) => updateSize(size, e.target.value)}
              placeholder="Size (mm)"
              style={{ border: "none", borderRight: "1px solid #e2e8f0", padding: "8px 12px", fontSize: "12px", fontWeight: 600, color: "#334155", background: "transparent", outline: "none", width: "100%", boxSizing: "border-box" }}
            />
            <input
              type="number"
              value={price}
              onChange={(e) => updatePrice(size, e.target.value)}
              placeholder="Price"
              style={{ border: "none", borderRight: "1px solid #e2e8f0", padding: "8px 12px", fontSize: "12px", color: "#475569", background: "transparent", outline: "none", width: "100%", boxSizing: "border-box" }}
            />
            <button type="button" onClick={() => removeRow(size)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: "8px 12px", color: "#f87171", fontSize: "16px", lineHeight: 1 }}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
