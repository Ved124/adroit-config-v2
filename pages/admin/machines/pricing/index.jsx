// pages/admin/machines/pricing/index.jsx
// Edit all price lookup tables (bubble cage, hauloff, winder, etc.)

import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import ConfirmDialog from '../../../../components/admin/ConfirmDialog';

const TABLE_META = {
  MANUAL_BC_PRICES:            { label: 'Manual Bubble Cage', icon: '🧺', color: '#6366f1' },
  OPEN_CLOSE_BC_PRICES:        { label: 'Open-Close Bubble Cage', icon: '⚙️', color: '#8b5cf6' },
  UP_DOWN_BC_PRICES:           { label: 'Up-Down Bubble Cage', icon: '↕️', color: '#a855f7' },
  HAULOFF_PRICES:              { label: 'Hauloff / Main Nip', icon: '🔩', color: '#0891b2' },
  MANUAL_BACK_TO_BACK_PRICES:  { label: 'Manual Back-to-Back Winder', icon: '🎞️', color: '#059669' },
  SURFACE_WINDER_PRICES:       { label: 'Surface Winder', icon: '🌀', color: '#d97706' },
  AUTOMATIC_WINDER_PRICES:     { label: 'Automatic Winder', icon: '🤖', color: '#dc2626' },
};

function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function PriceTable({ tableName, prices, meta, onUpdate, onAdd, onDelete }) {
  const [editCell, setEditCell] = useState(null); // { sizeKey, value }
  const [addRow, setAddRow] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sorted = Object.entries(prices).sort((a, b) => Number(a[0]) - Number(b[0]));

  const handleEdit = async () => {
    if (!editCell) return;
    await onUpdate(tableName, editCell.sizeKey, Number(editCell.value));
    setEditCell(null);
  };

  const handleAdd = async () => {
    if (!newSize || !newPrice) return;
    await onAdd(tableName, newSize, Number(newPrice));
    setAddRow(false); setNewSize(''); setNewPrice('');
  };

  return (
    <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e2e8f0', overflow: 'hidden', marginBottom: '24px' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${meta.color}08` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>{meta.icon}</span>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{meta.label}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{tableName}</div>
          </div>
        </div>
        <button onClick={() => setAddRow(r => !r)} style={{
          padding: '6px 14px', background: meta.color, color: 'white',
          border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer'
        }}>
          + Add Size
        </button>
      </div>

      {/* Add row */}
      {addRow && (
        <div style={{ padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input value={newSize} onChange={e => setNewSize(e.target.value)} placeholder="Size (mm)" type="number" style={{ width: '120px', padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit' }} />
          <input value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="Price (₹)" type="number" style={{ width: '160px', padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: '7px', fontSize: '13px', fontFamily: 'inherit' }} />
          <button onClick={handleAdd} style={{ padding: '7px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '7px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
            Add
          </button>
          <button onClick={() => setAddRow(false)} style={{ padding: '7px 12px', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '7px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      )}

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#fafafa' }}>
            <th style={{ padding: '9px 20px', fontSize: '11px', fontWeight: '800', color: '#64748b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e2e8f0' }}>Size (mm)</th>
            <th style={{ padding: '9px 20px', fontSize: '11px', fontWeight: '800', color: '#64748b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e2e8f0' }}>Price</th>
            <th style={{ padding: '9px 20px', borderBottom: '1px solid #e2e8f0', width: '120px' }}></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(([size, price], i) => {
            const isEditing = editCell?.sizeKey === size;
            return (
              <tr key={size} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                <td style={{ padding: '10px 20px', fontWeight: '700', fontSize: '14px', color: '#334155', fontFamily: 'monospace' }}>
                  {size} mm
                </td>
                <td style={{ padding: '10px 20px' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="number"
                        value={editCell.value}
                        onChange={e => setEditCell(c => ({ ...c, value: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter') handleEdit(); if (e.key === 'Escape') setEditCell(null); }}
                        autoFocus
                        style={{ width: '160px', padding: '6px 10px', border: '1.5px solid #6366f1', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit' }}
                      />
                      <button onClick={handleEdit} style={{ padding: '5px 12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>Save</button>
                      <button onClick={() => setEditCell(null)} style={{ padding: '5px 8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#059669', cursor: 'pointer' }}
                      onClick={() => setEditCell({ sizeKey: size, value: String(price) })}
                      title="Click to edit"
                    >
                      {fmt(price)}
                    </span>
                  )}
                </td>
                <td style={{ padding: '10px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    {!isEditing && (
                      <button onClick={() => setEditCell({ sizeKey: size, value: String(price) })} style={{ padding: '4px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                        ✎
                      </button>
                    )}
                    <button onClick={() => setDeleteTarget({ table: tableName, sizeKey: size })} style={{ padding: '4px 8px', border: '1px solid #fecaca', borderRadius: '6px', background: '#fef2f2', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: '#dc2626' }}>
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Price Entry?"
        message={`Remove ${deleteTarget?.sizeKey} mm from ${meta.label}?`}
        onConfirm={() => { onDelete(deleteTarget.table, deleteTarget.sizeKey); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default function PricingManager() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [activeTable, setActiveTable] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/admin/pricing');
    const d = await r.json();
    setData(d);
    setActiveTable(t => t || Object.keys(d)[0]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleUpdate = async (table, sizeKey, price) => {
    await fetch('/api/admin/pricing', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table, sizeKey, price }) });
    showToast('Price updated!'); load();
  };
  const handleAdd = async (table, sizeKey, price) => {
    await fetch('/api/admin/pricing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table, sizeKey, price }) });
    showToast('Size added!'); load();
  };
  const handleDelete = async (table, sizeKey) => {
    await fetch('/api/admin/pricing', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table, sizeKey }) });
    showToast('Entry removed.'); load();
  };

  const tableKeys = Object.keys(TABLE_META).filter(k => data[k]);

  return (
    <AdminLayout title="Price Tables">
      <Head><title>Price Tables — Admin</title></Head>

      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          ✓ {toast}
        </div>
      )}

      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', marginTop: '-12px' }}>
        Click any price to edit inline. Changes apply immediately to new quotations.
      </p>

      {/* Tab picker */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {tableKeys.map(key => {
          const m = TABLE_META[key];
          const isActive = activeTable === key;
          return (
            <button key={key} onClick={() => setActiveTable(key)} style={{
              padding: '7px 14px', borderRadius: '8px', border: '1.5px solid',
              borderColor: isActive ? m.color : '#e2e8f0',
              background: isActive ? m.color : 'white',
              color: isActive ? 'white' : '#475569',
              fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <span>{m.icon}</span> {m.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading price tables…</div>
      ) : activeTable && data[activeTable] && (
        <PriceTable
          tableName={activeTable}
          prices={data[activeTable]}
          meta={TABLE_META[activeTable]}
          onUpdate={handleUpdate}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      )}
    </AdminLayout>
  );
}
