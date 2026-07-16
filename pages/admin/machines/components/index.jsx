// pages/admin/machines/components/index.jsx
// Full CRUD for all component categories

import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import TechDescEditor from '../../../../components/admin/TechDescEditor';
import ConfirmDialog from '../../../../components/admin/ConfirmDialog';

const CATEGORIES = [
  { key: 'extruders', label: 'Extruders' },
  { key: 'bubbleCages', label: 'Bubble Cages' },
  { key: 'hauloffs', label: 'Hauloffs / Main Nip' },
  { key: 'dies', label: 'Die Heads' },
  { key: 'winders', label: 'Winders' },
  { key: 'airRing', label: 'Air Rings' },
  { key: 'collapsingFrame', label: 'Collapsing Frames' },
  { key: 'tower', label: 'Tower / Platform' },
  { key: 'electricalPanel', label: 'Electrical Panels' },
  { key: 'materialHandling', label: 'Material Handling' },
  { key: 'optionalFeatures', label: 'Optional Features' },
  { key: 'gauge', label: 'Gauge / Measurement' },
  { key: 'corona', label: 'Corona Treatment' },
  { key: 'ibc', label: 'IBC (Internal Bubble)' },
  { key: 'epc', label: 'EPC / Web Guide' },
  { key: 'mdo', label: 'MDO' },
  { key: 'chiller', label: 'Chiller' },
  { key: 'heatExchanger', label: 'Heat Exchanger' },
  { key: 'trim', label: 'Trim / Edge' },
  { key: 'webGuide', label: 'Web Guide' },
  { key: 'hydraulicUnloader', label: 'Hydraulic Unloader' },
  { key: 'printer', label: 'Printer' },
  { key: 'bimetallic', label: 'Bimetallic' },
  { key: 'dieAddons', label: 'Die Addons' },
  { key: 'extruderAddons', label: 'Extruder Addons' },
  { key: 'winderAddons', label: 'Winder Addons' },
];

const MACHINE_TYPES = ['mono', 'aba', '3layer', '5layer'];

const EMPTY_COMPONENT = {
  id: '', name: '', price: 0, image: '', cardDesc: '', shortDesc: '',
  machineTypes: ['mono'], techDesc: {}, isDynamic: false,
};

function inp(s = {}) {
  return {
    width: '100%', padding: '8px 12px', border: '1.5px solid #e2e8f0',
    borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box', color: '#0f172a', ...s
  };
}

function Label({ children, required }) {
  return (
    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {children}{required && <span style={{ color: '#dc2626' }}> *</span>}
    </label>
  );
}

function ComponentModal({ component, categoryKey, existingComponents, onSave, onClose }) {
  const isEdit = !!component?.id;

  const getInitialForm = () => {
    if (isEdit) return { ...component };
    
    let defaultTechDesc = {};
    if (existingComponents && existingComponents.length > 0) {
      const sibling = existingComponents.find(c => c.techDesc && Object.keys(c.techDesc).length > 0);
      if (sibling) {
        Object.keys(sibling.techDesc).forEach(key => {
          defaultTechDesc[key] = '';
        });
      }
    }
    return { ...EMPTY_COMPONENT, techDesc: defaultTechDesc };
  };

  const [form, setForm] = useState(getInitialForm);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggleMachineType = (mt) => {
    const cur = form.machineTypes || [];
    set('machineTypes', cur.includes(mt) ? cur.filter(x => x !== mt) : [...cur, mt]);
  };

  const handleSave = async () => {
    if (!form.id.trim()) { setErr('ID is required'); return; }
    if (!form.name.trim()) { setErr('Name is required'); return; }
    setSaving(true); setErr('');
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit
        ? { category: categoryKey, id: component.id, updates: form }
        : { category: categoryKey, component: { ...form, price: Number(form.price) } };
      const r = await fetch('/api/admin/components', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Save failed');
      onSave();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '32px 20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '640px', padding: '32px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            {isEdit ? `Edit: ${component.id}` : 'Add Component'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div>
            <Label required>ID</Label>
            <input value={form.id} onChange={e => set('id', e.target.value)} placeholder="ext-45-mono-short" style={inp(isEdit ? { background: '#f8fafc', color: '#94a3b8' } : {})} readOnly={isEdit} />
          </div>
          <div>
            <Label required>Name</Label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Extruder 45 mm" style={inp()} />
          </div>
          <div>
            <Label>Price (₹)</Label>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" style={inp()} />
          </div>
          <div>
            <Label>Image Path</Label>
            <input value={form.image || ''} onChange={e => set('image', e.target.value)} placeholder="/images/Extruder/Extruder Mono.png" style={inp()} />
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <Label>Card Description</Label>
          <textarea value={form.cardDesc || ''} onChange={e => set('cardDesc', e.target.value)} placeholder="Short description shown on the selection card…" rows={2} style={{ ...inp(), resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <Label>Short Description (PDF / modal)</Label>
          <textarea value={form.shortDesc || ''} onChange={e => set('shortDesc', e.target.value)} placeholder="Detailed spec for the quotation…" rows={2} style={{ ...inp(), resize: 'vertical' }} />
        </div>

        {/* Machine types */}
        <div style={{ marginBottom: '16px' }}>
          <Label>Compatible Machine Types</Label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {MACHINE_TYPES.map(mt => {
              const active = (form.machineTypes || []).includes(mt);
              return (
                <button key={mt} type="button" onClick={() => toggleMachineType(mt)} style={{
                  padding: '5px 14px', borderRadius: '20px', border: '1.5px solid',
                  borderColor: active ? '#6366f1' : '#e2e8f0',
                  background: active ? '#6366f1' : 'white',
                  color: active ? 'white' : '#64748b',
                  fontWeight: '700', fontSize: '12px', cursor: 'pointer'
                }}>
                  {mt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic toggle */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="checkbox" id="isDynamic" checked={!!form.isDynamic} onChange={e => set('isDynamic', e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
          <label htmlFor="isDynamic" style={{ fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
            Dynamic component (size selected by user at configuration time)
          </label>
        </div>

        {/* TechDesc */}
        <div style={{ marginBottom: '20px' }}>
          <TechDescEditor value={form.techDesc || {}} onChange={td => set('techDesc', td)} />
        </div>

        {err && <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: '600', marginBottom: '12px', padding: '10px 14px', background: '#fef2f2', borderRadius: '8px' }}>{err}</div>}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#475569' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '11px', border: 'none', borderRadius: '10px', background: '#0891b2', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '700', color: 'white', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Component'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ComponentsManager() {
  const [activeCategory, setActiveCategory] = useState('extruders');
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/admin/components');
    const d = await r.json();
    setAllData(d);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleDelete = async () => {
    await fetch('/api/admin/components', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: activeCategory, id: deleteTarget }),
    });
    setDeleteTarget(null);
    showToast('Component deleted.');
    load();
  };

  const catLabel = CATEGORIES.find(c => c.key === activeCategory)?.label || activeCategory;
  const items = (allData[activeCategory] || []).filter(c =>
    !search || [c.id, c.name, c.cardDesc].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout title="Component Library">
      <Head><title>Component Library — Admin</title></Head>

      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          ✓ {toast}
        </div>
      )}

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar: category picker */}
        <div style={{ width: '200px', flexShrink: 0 }}>
          <div style={{ background: 'white', borderRadius: '12px', border: '1.5px solid #e2e8f0', overflow: 'hidden' }}>
            {CATEGORIES.map(cat => {
              const count = (allData[cat.key] || []).length;
              const isActive = cat.key === activeCategory;
              return (
                <button key={cat.key} onClick={() => { setActiveCategory(cat.key); setSearch(''); }} style={{
                  width: '100%', textAlign: 'left', padding: '10px 14px',
                  border: 'none', borderBottom: '1px solid #f1f5f9',
                  background: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#1d4ed8' : '#475569',
                  fontWeight: isActive ? '700' : '500', fontSize: '12px', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                  transition: 'all 0.1s'
                }}>
                  <span>{cat.label}</span>
                  <span style={{ background: isActive ? '#dbeafe' : '#f1f5f9', color: isActive ? '#1d4ed8' : '#94a3b8', padding: '1px 6px', borderRadius: '10px', fontSize: '10px', fontWeight: '800' }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main panel */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{catLabel}</div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              style={{ ...inp({ maxWidth: '240px' }) }}
            />
            <button onClick={() => setModal({ mode: 'add' })} style={{
              marginLeft: 'auto', padding: '8px 18px', background: '#0891b2', color: 'white',
              border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer'
            }}>
              + Add Component
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading…</div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', background: 'white', borderRadius: '12px', border: '1.5px dashed #e2e8f0' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔧</div>
              <p style={{ fontWeight: '600' }}>No components in {catLabel} yet.</p>
              <button onClick={() => setModal({ mode: 'add' })} style={{ marginTop: '8px', padding: '8px 18px', background: '#0891b2', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                + Add First Component
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {items.map(comp => (
                <div key={comp.id} style={{ background: 'white', borderRadius: '12px', border: '1.5px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  {comp.image && (
                    <div style={{ height: '100px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img src={comp.image} alt={comp.name} style={{ maxHeight: '90px', maxWidth: '100%', objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} />
                    </div>
                  )}
                  <div style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{comp.name}</div>
                      {comp.isDynamic && <span style={{ fontSize: '9px', fontWeight: '800', background: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '4px' }}>DYNAMIC</span>}
                    </div>
                    <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8', marginBottom: '6px' }}>{comp.id}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', lineHeight: '1.5' }}>
                      {comp.cardDesc?.slice(0, 80)}{comp.cardDesc?.length > 80 ? '…' : ''}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {(comp.machineTypes || []).map(mt => (
                        <span key={mt} style={{ fontSize: '9px', fontWeight: '800', background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>{mt}</span>
                      ))}
                    </div>
                    {comp.price > 0 && (
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#059669', marginBottom: '10px' }}>
                        ₹{Number(comp.price).toLocaleString('en-IN')}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setModal({ mode: 'edit', component: comp })} style={{ flex: 1, padding: '6px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                        ✎ Edit
                      </button>
                      <button onClick={() => setDeleteTarget(comp.id)} style={{ padding: '6px 10px', border: '1px solid #fecaca', borderRadius: '6px', background: '#fef2f2', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: '#dc2626' }}>
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <ComponentModal
          component={modal.mode === 'edit' ? modal.component : null}
          categoryKey={activeCategory}
          existingComponents={items}
          onSave={() => { setModal(null); showToast(modal.mode === 'edit' ? 'Component updated!' : 'Component added!'); load(); }}
          onClose={() => setModal(null)}
        />
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Component?"
        message={`"${deleteTarget}" will be removed from ${catLabel}.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
