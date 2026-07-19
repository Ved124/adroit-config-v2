// pages/admin/machines/models/index.jsx
import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import ConfirmDialog from '../../../../components/admin/ConfirmDialog';

const FAMILIES = [
  { key: 'mono', label: 'Monolayer', color: '#6366f1' },
  { key: 'aba', label: 'ABA / Co-ex', color: '#0891b2' },
  { key: 'threeLayer', label: '3-Layer', color: '#059669' },
];

const EMPTY_MODEL = {
  code: '', family: '', label: '', machineType: 'mono',
  screwDiameter: '', layflatWidthMm: '', thicknessRange: '',
  maxOutputKgHr: '', screwLdRatio: '30:1',
  extruderMotorKw: '',
  dieSizeHmLd: '', airRingBlowerKw: '',
  mainNipLineSpeed: '', mainNipKw: '',
  winderType: '', winderMotorKw: '',
  totalHeatingLoadKw: '', totalConnectedLoadKw: '',
  specificPowerConsumption: '', spaceRequired: '',
};

const MONO_ABA_FORM_SECTIONS = [
  {
    label: 'Basic Info',
    fields: [
      { key: 'code', label: 'Code (unique)', placeholder: 'UNOFLEX-32', required: true },
      { key: 'family', label: 'Family', placeholder: 'Monolayer' },
      { key: 'label', label: 'Display Label', placeholder: 'Unoflex_32"_45mm' },
      { key: 'machineType', label: 'Machine Type', type: 'select', options: ['mono', 'aba', '3layer', '5layer'] },
    ]
  },
  {
    label: 'Extruder',
    fields: [
      { key: 'screwDiameter', label: 'Screw Diameter', placeholder: '45 MM' },
      { key: 'screwLdRatio', label: 'L/D Ratio', placeholder: '30:1' },
      { key: 'extruderMotorKw', label: 'Extruder Motor (kW)', placeholder: '11.2' },
    ]
  },
  {
    label: 'Die & Air Ring',
    fields: [
      { key: 'dieSizeHmLd', label: 'Die Size (HM/LD)', placeholder: '200 MM' },
      { key: 'airRingBlowerKw', label: 'Air Ring Blower (kW)', placeholder: '2.2' },
    ]
  },
  {
    label: 'Main Nip / Haul-Off',
    fields: [
      { key: 'mainNipLineSpeed', label: 'Line Speed', placeholder: '6–60 MPM' },
      { key: 'mainNipKw', label: 'Main Nip Drive (kW)', placeholder: '0.75' },
    ]
  },
  {
    label: 'Output & Layflat',
    fields: [
      { key: 'layflatWidthMm', label: 'Layflat Width (mm)', placeholder: '750', type: 'number' },
      { key: 'thicknessRange', label: 'Thickness Range', placeholder: '20–100 µ' },
      { key: 'maxOutputKgHr', label: 'Max Output (kg/hr)', placeholder: '45–50 KG/HR' },
    ]
  },
  {
    label: 'Winder',
    fields: [
      { key: 'winderType', label: 'Winder Type', placeholder: 'Single Manual' },
      { key: 'winderMotorKw', label: 'Winder Motor (kW)', placeholder: '0.37' },
    ]
  },
  {
    label: 'Power & Space',
    fields: [
      { key: 'totalHeatingLoadKw', label: 'Total Heating Load (kW)', placeholder: '14' },
      { key: 'totalConnectedLoadKw', label: 'Total Connected Load', placeholder: '37 KW' },
      { key: 'specificPowerConsumption', label: 'Specific Power Consump.', placeholder: '0.45 kW/KG/HR' },
      { key: 'spaceRequired', label: 'Space Required', placeholder: '3.5 × 3.0 × 4.5 m' },
    ]
  },
];

const THREE_LAYER_FORM_SECTIONS = [
  {
    label: 'Basic Info',
    fields: [
      { key: 'code', label: 'Code (unique)', placeholder: 'INNOFLEX-1120', required: true },
      { key: 'family', label: 'Family', placeholder: '3-Layer' },
      { key: 'label', label: 'Display Label', placeholder: 'INNOFLEX-1120' },
      { key: 'machineType', label: 'Machine Type', type: 'select', options: ['mono', 'aba', '3layer', '5layer'] },
    ]
  },
  {
    label: 'Extruder',
    fields: [
      { key: 'extruder', label: 'Extruder (mm)', placeholder: '40/40/40' },
      { key: 'ldRatio', label: 'L/D Ratio', placeholder: '30:1' },
      { key: 'motorsHp', label: 'Motors (HP)', placeholder: '15/15/15' },
    ]
  },
  {
    label: 'Die & Air Ring',
    fields: [
      { key: 'die', label: 'Die Size', placeholder: '225 mm' },
      { key: 'airRingBlower', label: 'Air Ring Blower', placeholder: '5 HP' },
    ]
  },
  {
    label: 'Main Nip / Haul-Off',
    fields: [
      { key: 'mainNipDrive', label: 'Main Nip Drive', placeholder: '1.5 HP' },
      { key: 'collapsingFrame', label: 'Collapsing Frame', placeholder: 'PBT ROLLERS' },
    ]
  },
  {
    label: 'Output & Layflat',
    fields: [
      { key: 'widthMm', label: 'Layflat Width (mm)', placeholder: '1000', type: 'number' },
      { key: 'thickness', label: 'Thickness Range', placeholder: '20–150 µ' },
      { key: 'outputKgHr', label: 'Max Output (kg/hr)', placeholder: '90-100 KG/HR' },
      { key: 'variation', label: 'Variation', placeholder: '+/- 8%' },
    ]
  },
  {
    label: 'Winder',
    fields: [
      { key: 'surfaceWinder', label: 'Winder Type', placeholder: 'MANUAL' },
      { key: 'winderDrive', label: 'Winder Drive', placeholder: '2 HP' },
      { key: 'rollCapacity', label: 'Roll Capacity', placeholder: '400 KG / 600 MM' },
    ]
  },
  {
    label: 'Power & Space',
    fields: [
      { key: 'totalConnectedLoad', label: 'Total Connected Load', placeholder: '67 KW' },
      { key: 'powerConsumption', label: 'Specific Power Consump.', placeholder: '0.35 kW/KG/HR' },
      { key: 'overallDimensions', label: 'Space Required', placeholder: '7.8m L x 5.1m W x 6.5m H' },
    ]
  },
];

function inp(style = {}) {
  return {
    width: '100%', padding: '8px 12px', border: '1.5px solid #e2e8f0',
    borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box', background: 'white', color: '#0f172a',
    transition: 'border-color 0.15s',
    ...style,
  };
}

function ModelFormModal({ model, familyKey, onSave, onClose }) {
  const isEdit = !!model?.code;
  const [form, setForm] = useState(isEdit ? { ...model } : { ...EMPTY_MODEL, machineType: familyKey === 'threeLayer' ? '3layer' : familyKey });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.code.trim()) { setErr('Code is required'); return; }
    setSaving(true); setErr('');
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit
        ? { machineFamily: familyKey, code: model.code, updates: form }
        : { machineFamily: familyKey, model: form };
      const r = await fetch('/api/admin/models', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Save failed');
      onSave();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '680px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            {isEdit ? `Edit: ${model.code}` : 'Add New Machine Model'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>×</button>
        </div>

        {((form.machineType === '3layer' || form.machineType === '5layer') ? THREE_LAYER_FORM_SECTIONS : MONO_ABA_FORM_SECTIONS).map(group => (
          <div key={group.label} style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #f1f5f9' }}>
              {group.label}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {group.fields.map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {f.label}{f.required && <span style={{ color: '#dc2626' }}> *</span>}
                  </label>
                  {f.type === 'select' ? (
                    <select value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} style={inp()}>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={f.type || 'text'}
                      value={form[f.key] || ''}
                      onChange={e => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      style={inp(isEdit && f.key === 'code' ? { background: '#f8fafc', color: '#94a3b8' } : {})}
                      readOnly={isEdit && f.key === 'code'}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {err && <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: '600', marginBottom: '12px', padding: '10px 14px', background: '#fef2f2', borderRadius: '8px' }}>{err}</div>}

        <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#475569' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '11px', border: 'none', borderRadius: '10px', background: '#6366f1', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '700', color: 'white', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Model'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ModelsManager() {
  const [activeFamily, setActiveFamily] = useState('mono');
  const [data, setData] = useState({ mono: [], aba: [], threeLayer: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | { mode:'add' } | { mode:'edit', model }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/admin/models');
    const d = await r.json();
    setData(d);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async () => {
    await fetch('/api/admin/models', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ machineFamily: activeFamily, code: deleteTarget }),
    });
    setDeleteTarget(null);
    showToast('Model deleted.');
    load();
  };

  const models = (data[activeFamily] || []).filter(m =>
    !search || [m.code, m.family, m.label].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const fam = FAMILIES.find(f => f.key === activeFamily);

  return (
    <AdminLayout title="Machine Models">
      <Head><title>Machine Models — Admin</title></Head>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          ✓ {toast}
        </div>
      )}

      {/* Family tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {FAMILIES.map(f => (
          <button key={f.key} onClick={() => setActiveFamily(f.key)} style={{
            padding: '8px 18px', borderRadius: '8px', border: '1.5px solid',
            borderColor: activeFamily === f.key ? f.color : '#e2e8f0',
            background: activeFamily === f.key ? f.color : 'white',
            color: activeFamily === f.key ? 'white' : '#475569',
            fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s'
          }}>
            {f.label}
            <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.8 }}>
              ({(data[f.key] || []).length})
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by code, family, or label…"
          style={{ ...inp(), maxWidth: '320px' }}
        />
        <button onClick={() => setModal({ mode: 'add' })} style={{
          marginLeft: 'auto', padding: '9px 20px', background: '#6366f1', color: 'white',
          border: 'none', borderRadius: '9px', fontWeight: '700', fontSize: '13px', cursor: 'pointer'
        }}>
          + Add Model
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading…</div>
      ) : models.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', background: 'white', borderRadius: '12px', border: '1.5px dashed #e2e8f0' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📭</div>
          <p style={{ fontWeight: '600' }}>No {fam?.label} models yet.</p>
          <button onClick={() => setModal({ mode: 'add' })} style={{ marginTop: '8px', padding: '8px 18px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            + Add First Model
          </button>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', border: '1.5px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Code', 'Label', 'Screw Ø', 'Output', 'Layflat (mm)', 'Space', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', fontSize: '11px', fontWeight: '800', color: '#64748b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e2e8f0' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((m, i) => (
                <tr key={m.code} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontWeight: '800', fontSize: '13px', color: '#0f172a', fontFamily: 'monospace' }}>{m.code}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#475569', maxWidth: '180px' }}>
                    {m.label || <span style={{ color: '#cbd5e1' }}>—</span>}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                    {m.screwDiameter || m.extruder || '—'}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#64748b' }}>
                    {m.maxOutputKgHr || m.outputKgHr || '—'}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                    {m.layflatWidthMm ? `${m.layflatWidthMm} mm` : (m.widthMm ? `${m.widthMm} mm` : '—')}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#64748b' }}>
                    {m.spaceRequired || m.overallDimensions || '—'}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setModal({ mode: 'edit', model: m })} style={{ padding: '5px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                        ✎ Edit
                      </button>
                      <button onClick={() => setDeleteTarget(m.code)} style={{ padding: '5px 10px', border: '1px solid #fecaca', borderRadius: '6px', background: '#fef2f2', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: '#dc2626' }}>
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '10px 14px', fontSize: '12px', color: '#94a3b8', borderTop: '1px solid #f1f5f9' }}>
            {models.length} model{models.length !== 1 ? 's' : ''} in {fam?.label}
          </div>
        </div>
      )}

      {/* Modals */}
      {modal && (
        <ModelFormModal
          model={modal.mode === 'edit' ? modal.model : null}
          familyKey={activeFamily}
          onSave={() => { setModal(null); showToast(modal.mode === 'edit' ? 'Model updated!' : 'Model added!'); load(); }}
          onClose={() => setModal(null)}
        />
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Model?"
        message={`"${deleteTarget}" will be permanently removed. This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
