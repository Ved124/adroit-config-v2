// pages/admin/machines/presets/index.jsx
// Full CRUD preset builder — visually define default components per machine model

import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import TechDescEditor from '../../../../components/admin/TechDescEditor';
import ConfirmDialog from '../../../../components/admin/ConfirmDialog';

const MACHINE_TYPES = ['mono', 'aba', '3layer', '5layer'];

const CATEGORIES = [
  'Extruder', 'Die Head', 'Bubble Cage', 'Collapsing Frame', 'Air Ring',
  'Haul-Off', 'Main Nip', 'Tower / Platform', 'Winder',
  'Electrical & Control Panel', 'Die Addons', 'Optional Features',
  'Material Handling', 'Chiller', 'Corona', 'Gauge', 'IBC', 'MDO',
  'EPC', 'Heat Exchanger', 'Trim', 'Web Guide', 'Hydraulic Unloader',
  'Printer', 'Extruder Addons', 'Winder Addons',
];

function inp(s = {}) {
  return {
    padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px',
    fontSize: '13px', fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box', color: '#0f172a', ...s
  };
}

function Label({ children, required }) {
  return (
    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {children}{required && <span style={{ color: '#dc2626' }}> *</span>}
    </label>
  );
}

// A single component row in the preset editor
function ComponentRow({ comp, index, components, onUpdate, onRemove, isAddon }) {
  const [expanded, setExpanded] = useState(false);

  const set = (key, val) => onUpdate(index, { ...comp, [key]: val });
  const setMeta = (key, val) => onUpdate(index, { ...comp, metadata: { ...(comp.metadata || {}), [key]: val } });

  const hasMeta = comp.metadata && (comp.metadata.size || comp.metadata.price || comp.metadata.customName || Object.keys(comp.metadata.techDesc || {}).length > 0);

  return (
    <div style={{ border: '1.5px solid #e2e8f0', borderRadius: '10px', marginBottom: '8px', overflow: 'hidden', background: 'white' }}>
      {/* Row header */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px 12px', background: isAddon ? '#f0fdf4' : '#f8fafc' }}>
        <span style={{ fontSize: '12px', fontWeight: '800', color: isAddon ? '#059669' : '#6366f1', background: isAddon ? '#dcfce7' : '#ede9fe', padding: '2px 8px', borderRadius: '4px', flexShrink: 0 }}>
          {isAddon ? 'Addon' : `#${index + 1}`}
        </span>

        <select value={comp.category || ''} onChange={e => set('category', e.target.value)} style={{ ...inp(), flex: '0 0 200px' }}>
          <option value="">-- Category --</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <input value={comp.id || ''} onChange={e => set('id', e.target.value)} placeholder="component-id" style={{ ...inp(), flex: 1 }} />

        <input type="number" value={comp.qty || 1} onChange={e => set('qty', Number(e.target.value))} min="1" style={{ ...inp({ width: '64px', flexShrink: 0, textAlign: 'center' }) }} />

        <button onClick={() => setExpanded(x => !x)} style={{
          padding: '5px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white',
          cursor: 'pointer', fontSize: '11px', fontWeight: '700', color: '#6366f1', flexShrink: 0
        }}>
          {expanded ? '▲ Hide Meta' : hasMeta ? '▼ Meta ★' : '▼ Meta'}
        </button>

        <button onClick={() => onRemove(index)} style={{
          padding: '5px 8px', border: '1px solid #fecaca', borderRadius: '6px',
          background: '#fef2f2', cursor: 'pointer', fontSize: '13px', color: '#dc2626', flexShrink: 0
        }}>✕</button>
      </div>

      {/* Metadata expander */}
      {expanded && (
        <div style={{ padding: '14px 14px 14px', borderTop: '1px solid #f1f5f9', background: 'white' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <Label>Size</Label>
              <input value={comp.metadata?.size || ''} onChange={e => setMeta('size', e.target.value)} placeholder="1370" style={{ ...inp(), width: '100%' }} />
            </div>
            <div>
              <Label>Override Price (₹)</Label>
              <input type="number" value={comp.metadata?.price ?? ''} onChange={e => setMeta('price', Number(e.target.value))} placeholder="0" style={{ ...inp(), width: '100%' }} />
            </div>
            <div>
              <Label>Custom Name</Label>
              <input value={comp.metadata?.customName || ''} onChange={e => setMeta('customName', e.target.value)} placeholder="MAIN NIP - 1370 mm" style={{ ...inp(), width: '100%' }} />
            </div>
          </div>
          <TechDescEditor
            value={comp.metadata?.techDesc || {}}
            onChange={td => setMeta('techDesc', td)}
          />
        </div>
      )}
    </div>
  );
}

// Full preset editor panel
function PresetEditor({ presetKey, preset, allComponents, onSave, onDelete }) {
  const [form, setForm] = useState({
    machineType: preset.machineType || 'mono',
    basePrice: preset.basePrice || 0,
    components: JSON.parse(JSON.stringify(preset.components || [])),
    addons: JSON.parse(JSON.stringify(preset.addons || [])),
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [err, setErr] = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const updateComp = (idx, val, list) => {
    const arr = [...form[list]];
    arr[idx] = val;
    setForm(f => ({ ...f, [list]: arr }));
  };
  const removeComp = (idx, list) => setForm(f => ({ ...f, [list]: f[list].filter((_, i) => i !== idx) }));
  const addComp = (list) => setForm(f => ({ ...f, [list]: [...f[list], { category: '', id: '', qty: 1 }] }));

  const handleSave = async () => {
    setSaving(true); setErr('');
    try {
      const r = await fetch('/api/admin/presets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: presetKey, updates: { ...form, basePrice: Number(form.basePrice) } }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Save failed');
      onSave();
      showToast('Preset saved!');
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ flex: 1 }}>
      {/* Toolbar */}
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          ✓ {toast}
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '20px 24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Editing Preset</div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#0f172a', fontFamily: 'monospace' }}>{presetKey}</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onDelete} style={{ padding: '8px 16px', border: '1px solid #fecaca', borderRadius: '8px', background: '#fef2f2', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#dc2626' }}>
              Delete Preset
            </button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '8px 20px', border: 'none', borderRadius: '8px', background: '#6366f1', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '700', color: 'white', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : '💾 Save Preset'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <Label>Machine Type</Label>
            <select value={form.machineType} onChange={e => setForm(f => ({ ...f, machineType: e.target.value }))} style={{ ...inp(), width: '100%' }}>
              {MACHINE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <Label>Base Price (₹)</Label>
            <input type="number" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))} placeholder="6125000" style={{ ...inp(), width: '100%' }} />
          </div>
        </div>

        {err && <div style={{ marginTop: '12px', color: '#dc2626', fontSize: '13px', fontWeight: '600', padding: '10px 14px', background: '#fef2f2', borderRadius: '8px' }}>{err}</div>}
      </div>

      {/* Components section */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '20px 24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
            📦 Components
            <span style={{ marginLeft: '8px', fontSize: '12px', color: '#6366f1', fontWeight: '700' }}>({form.components.length})</span>
          </div>
          <button onClick={() => addComp('components')} style={{ padding: '6px 14px', background: '#ede9fe', color: '#6366f1', border: '1px solid #c4b5fd', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
            + Add Component
          </button>
        </div>

        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '50px 200px 1fr 64px auto auto', gap: '8px', padding: '0 12px 6px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <span>#</span><span>Category</span><span>Component ID</span><span>Qty</span><span>Meta</span><span></span>
        </div>

        {form.components.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px', border: '1.5px dashed #e2e8f0', borderRadius: '8px' }}>
            No components. Click "+ Add Component" to start.
          </div>
        ) : (
          form.components.map((comp, i) => (
            <ComponentRow
              key={i} comp={comp} index={i}
              onUpdate={(idx, val) => updateComp(idx, val, 'components')}
              onRemove={(idx) => removeComp(idx, 'components')}
              isAddon={false}
            />
          ))
        )}
      </div>

      {/* Addons section */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
            ➕ Addons
            <span style={{ marginLeft: '8px', fontSize: '12px', color: '#059669', fontWeight: '700' }}>({form.addons.length})</span>
          </div>
          <button onClick={() => addComp('addons')} style={{ padding: '6px 14px', background: '#dcfce7', color: '#059669', border: '1px solid #86efac', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
            + Add Addon
          </button>
        </div>

        {form.addons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px', border: '1.5px dashed #e2e8f0', borderRadius: '8px' }}>
            No addons yet.
          </div>
        ) : (
          form.addons.map((comp, i) => (
            <ComponentRow
              key={i} comp={comp} index={i}
              onUpdate={(idx, val) => updateComp(idx, val, 'addons')}
              onRemove={(idx) => removeComp(idx, 'addons')}
              isAddon={true}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Add preset modal
function AddPresetModal({ existingKeys, onAdd, onClose }) {
  const [key, setKey] = useState('');
  const [machineType, setMachineType] = useState('mono');
  const [copyFrom, setCopyFrom] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const handle = async () => {
    if (!key.trim()) { setErr('Preset key is required'); return; }
    if (existingKeys.includes(key.trim())) { setErr('A preset with this key already exists'); return; }
    setSaving(true); setErr('');
    try {
      const basePreset = copyFrom ? null : null; // copyFrom logic handled below
      const r = await fetch('/api/admin/presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: key.trim(),
          preset: {
            machineType,
            basePrice: 0,
            components: [],
            addons: [],
            _copiedFrom: copyFrom || undefined,
          }
        })
      });
      // If copying, do a second call to fetch the source and then update
      if (copyFrom) {
        const srcR = await fetch(`/api/admin/presets?key=${encodeURIComponent(copyFrom)}`);
        const srcD = await srcR.json();
        if (srcD.preset) {
          await fetch('/api/admin/presets', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key: key.trim(),
              updates: { ...srcD.preset, machineType, _copiedFrom: undefined }
            })
          });
        }
      }
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      onAdd(key.trim());
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '480px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Add New Preset</h2>

        <div style={{ marginBottom: '14px' }}>
          <Label required>Preset Key</Label>
          <input value={key} onChange={e => setKey(e.target.value)} placeholder="INNOFLEX-1620 DR" style={{ ...inp(), width: '100%' }} />
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>This is the exact key used in the configurator (e.g. "INNOFLEX-1370 DR")</div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <Label>Machine Type</Label>
          <select value={machineType} onChange={e => setMachineType(e.target.value)} style={{ ...inp(), width: '100%' }}>
            {MACHINE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Label>Copy From (optional)</Label>
          <select value={copyFrom} onChange={e => setCopyFrom(e.target.value)} style={{ ...inp(), width: '100%' }}>
            <option value="">— Start empty —</option>
            {existingKeys.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        {err && <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: '600', marginBottom: '12px', padding: '10px 14px', background: '#fef2f2', borderRadius: '8px' }}>{err}</div>}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#475569' }}>Cancel</button>
          <button onClick={handle} disabled={saving} style={{ flex: 2, padding: '11px', border: 'none', borderRadius: '10px', background: '#6366f1', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '700', color: 'white', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Creating…' : 'Create Preset'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PresetsManager() {
  const [presets, setPresets] = useState({});
  const [components, setComponents] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState(null);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [pr, cr] = await Promise.all([
      fetch('/api/admin/presets').then(r => r.json()),
      fetch('/api/admin/components').then(r => r.json()),
    ]);
    setPresets(pr);
    setComponents(cr);
    setActiveKey(k => k && pr[k] ? k : Object.keys(pr)[0] || null);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    await fetch('/api/admin/presets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: deleteTarget }),
    });
    setDeleteTarget(null);
    setActiveKey(null);
    load();
  };

  const keys = Object.keys(presets).filter(k => !search || k.toLowerCase().includes(search.toLowerCase()));

  // Group by machine type
  const grouped = {};
  for (const k of keys) {
    const mt = presets[k]?.machineType || 'other';
    if (!grouped[mt]) grouped[mt] = [];
    grouped[mt].push(k);
  }

  const MT_COLORS = { mono: '#6366f1', aba: '#0891b2', '3layer': '#059669', '5layer': '#d97706', other: '#94a3b8' };
  const MT_LABELS = { mono: 'Monolayer', aba: 'ABA', '3layer': '3-Layer', '5layer': '5-Layer', other: 'Other' };

  return (
    <AdminLayout title="Model Presets">
      <Head><title>Model Presets — Admin</title></Head>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading presets…</div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {/* Left: Preset list */}
          <div style={{ width: '260px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search presets…"
                style={{ ...inp({ flex: 1, fontSize: '12px' }) }}
              />
              <button onClick={() => setShowAdd(true)} style={{ padding: '8px 12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>+</button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', border: '1.5px solid #e2e8f0', overflow: 'hidden' }}>
              {Object.entries(grouped).map(([mt, ks]) => (
                <div key={mt}>
                  <div style={{ padding: '7px 12px', fontSize: '10px', fontWeight: '800', color: MT_COLORS[mt] || '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', background: `${MT_COLORS[mt] || '#94a3b8'}10`, borderBottom: '1px solid #f1f5f9' }}>
                    {MT_LABELS[mt] || mt} ({ks.length})
                  </div>
                  {ks.map(k => (
                    <button key={k} onClick={() => setActiveKey(k)} style={{
                      width: '100%', textAlign: 'left', padding: '10px 14px',
                      border: 'none', borderBottom: '1px solid #f1f5f9',
                      background: activeKey === k ? '#eff6ff' : 'transparent',
                      color: activeKey === k ? '#1d4ed8' : '#334155',
                      fontWeight: activeKey === k ? '800' : '500',
                      fontSize: '12px', cursor: 'pointer',
                      borderLeft: activeKey === k ? `3px solid ${MT_COLORS[mt]}` : '3px solid transparent',
                      transition: 'all 0.1s'
                    }}>
                      <div>{k}</div>
                      {presets[k]?.basePrice > 0 && (
                        <div style={{ fontSize: '10px', color: '#059669', fontWeight: '700', marginTop: '2px' }}>
                          ₹{Number(presets[k].basePrice).toLocaleString('en-IN')}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ))}
              {keys.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                  No presets found.
                </div>
              )}
            </div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
              {Object.keys(presets).length} total presets
            </div>
          </div>

          {/* Right: Editor */}
          {activeKey && presets[activeKey] ? (
            <PresetEditor
              key={activeKey}
              presetKey={activeKey}
              preset={presets[activeKey]}
              allComponents={components}
              onSave={load}
              onDelete={() => setDeleteTarget(activeKey)}
            />
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: '12px', border: '1.5px dashed #e2e8f0', padding: '60px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <p style={{ color: '#94a3b8', fontWeight: '600', fontSize: '15px' }}>Select a preset from the left to edit it</p>
                <p style={{ color: '#cbd5e1', fontSize: '13px' }}>or click + to create a new one</p>
              </div>
            </div>
          )}
        </div>
      )}

      {showAdd && (
        <AddPresetModal
          existingKeys={Object.keys(presets)}
          onAdd={(key) => { setShowAdd(false); load().then(() => setActiveKey(key)); }}
          onClose={() => setShowAdd(false)}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Preset?"
        message={`"${deleteTarget}" will be permanently removed. Any machine using this preset in the configurator will lose its defaults.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
