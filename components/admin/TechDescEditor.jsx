// components/admin/TechDescEditor.jsx
// Dynamic key-value pair editor for techDesc fields
import React from 'react';

export default function TechDescEditor({ value = {}, onChange }) {
  const rows = Object.entries(value);

  const updateKey = (oldKey, newKey) => {
    const updated = {};
    for (const [k, v] of Object.entries(value)) {
      updated[k === oldKey ? newKey : k] = v;
    }
    onChange(updated);
  };

  const updateVal = (key, newVal) => {
    onChange({ ...value, [key]: newVal });
  };

  const addRow = () => {
    const newKey = `Spec ${rows.length + 1}`;
    onChange({ ...value, [newKey]: '' });
  };

  const removeRow = (key) => {
    const updated = { ...value };
    delete updated[key];
    onChange(updated);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Tech Specifications
        </span>
        <button
          type="button"
          onClick={addRow}
          style={{
            background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px',
            padding: '4px 10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', color: '#475569'
          }}
        >
          + Add Row
        </button>
      </div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        {rows.length === 0 && (
          <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            No specs yet. Click "+ Add Row" to add specifications.
          </div>
        )}
        {rows.map(([key, val], i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 2fr auto',
            gap: '0', borderBottom: i < rows.length - 1 ? '1px solid #f1f5f9' : 'none',
            background: i % 2 === 0 ? '#fafafa' : 'white'
          }}>
            <input
              value={key}
              onChange={e => updateKey(key, e.target.value)}
              placeholder="Spec name"
              style={{
                border: 'none', borderRight: '1px solid #e2e8f0',
                padding: '8px 12px', fontSize: '12px', fontWeight: '600',
                color: '#334155', background: 'transparent', outline: 'none', width: '100%', boxSizing: 'border-box'
              }}
            />
            <input
              value={val}
              onChange={e => updateVal(key, e.target.value)}
              placeholder="Value"
              style={{
                border: 'none', borderRight: '1px solid #e2e8f0',
                padding: '8px 12px', fontSize: '12px', color: '#475569',
                background: 'transparent', outline: 'none', width: '100%', boxSizing: 'border-box'
              }}
            />
            <button
              type="button"
              onClick={() => removeRow(key)}
              style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                padding: '8px 12px', color: '#f87171', fontSize: '16px', lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
