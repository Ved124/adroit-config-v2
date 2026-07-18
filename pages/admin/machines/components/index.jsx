// pages/admin/machines/components/index.jsx
// Full CRUD for all component categories

import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import TechDescEditor from '../../../../components/admin/TechDescEditor';
import ConfirmDialog from '../../../../components/admin/ConfirmDialog';

const CATEGORIES = [
  { key: 'extruders', label: 'Extruder', group: 'Basic Components' },
  { key: 'bubbleCages', label: 'Bubble Cage', group: 'Basic Components' },
  { key: 'hauloffs', label: 'Haul-Off / Main Nip', group: 'Basic Components' },
  { key: 'dies', label: 'Die Head', group: 'Basic Components' },
  { key: 'winders', label: 'Winder', group: 'Basic Components' },
  { key: 'airRing', label: 'Air Ring', group: 'Basic Components' },
  { key: 'collapsingFrame', label: 'Collapsing Frame', group: 'Basic Components' },
  { key: 'tower', label: 'Tower / Platform', group: 'Basic Components' },
  { key: 'electricalPanel', label: 'Electrical & Control Panel', group: 'Basic Components' },
  { key: 'ibc', label: 'IBC', group: 'Basic Components' },
  { key: 'materialHandling', label: 'Material Handling', group: 'Addons' },
  { key: 'optionalFeatures', label: 'Optional Features', group: 'Addons' },
  { key: 'corona', label: 'Corona', group: 'Addons' },
  { key: 'epc', label: 'EPC', group: 'Addons' },
  { key: 'chiller', label: 'Chiller', group: 'Addons' },
  { key: 'heatExchanger', label: 'Heat Exchanger', group: 'Addons' },
  { key: 'webGuide', label: 'Web Guide', group: 'Addons' },
  { key: 'printer', label: 'Printer', group: 'Addons' },
];

const MACHINE_TYPES = ['mono', 'aba', '3layer', '5layer'];

const EMPTY_COMPONENT = {
  id: '', name: '', price: 0, pricingType: 'single', prices: {}, image: '', cardDesc: '', shortDesc: '',
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

function PricingEditor({ pricingType, price, prices, onPricingTypeChange, onPriceChange, onPricesChange }) {
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');

  const handleAdd = () => {
    if (!newKey.trim() || !newVal.trim()) return;
    onPricesChange({ ...prices, [newKey.trim()]: Number(newVal) });
    setNewKey('');
    setNewVal('');
  };

  const handleRemove = (k) => {
    const copy = { ...prices };
    delete copy[k];
    onPricesChange(copy);
  };

  return (
    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
        <div>
          <Label>Pricing Type</Label>
          <select value={pricingType || 'single'} onChange={e => onPricingTypeChange(e.target.value)} style={inp()}>
            <option value="single">Single Price (Fixed)</option>
            <option value="size">Size-based (e.g. 1200, 1500)</option>
            <option value="brand">Brand-wise (e.g. Siemens, ABB)</option>
            <option value="dropdown">Dropdown Options (e.g. Standard, Premium)</option>
          </select>
        </div>
        <div>
          {(!pricingType || pricingType === 'single') ? (
            <>
              <Label>Price (₹)</Label>
              <input type="number" value={price || 0} onChange={e => onPriceChange(Number(e.target.value))} placeholder="0" style={inp()} />
            </>
          ) : (
            <div style={{ padding: '8px 12px', background: '#e0f2fe', color: '#0369a1', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>
              Using dynamic table pricing below
            </div>
          )}
        </div>
      </div>

      {pricingType && pricingType !== 'single' && (
        <div style={{ marginTop: '16px', borderTop: '1px solid #cbd5e1', paddingTop: '16px' }}>
          <Label>Dynamic Prices ({pricingType})</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {Object.entries(prices || {}).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input value={k} readOnly style={{ ...inp(), background: '#f1f5f9', flex: 1 }} />
                <input value={v} onChange={e => onPricesChange({ ...prices, [k]: Number(e.target.value) })} type="number" style={{ ...inp(), flex: 1 }} />
                <button type="button" onClick={() => handleRemove(k)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontWeight: '700' }}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input value={newKey} onChange={e => setNewKey(e.target.value)} placeholder={`e.g. ${pricingType === 'size' ? '1200' : pricingType === 'brand' ? 'Siemens' : 'Premium'}`} style={{ ...inp(), flex: 1 }} />
            <input value={newVal} onChange={e => setNewVal(e.target.value)} placeholder="Price (₹)" type="number" style={{ ...inp(), flex: 1 }} />
            <button type="button" onClick={handleAdd} style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: '700' }}>+ Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ComponentModal({ component, categoryKey, existingComponents, onSave, onClose }) {
  const isEdit = !!component?.id;

  const sibling = (existingComponents && existingComponents.length > 0)
    ? (existingComponents.find(c => c.techDesc && Object.keys(c.techDesc).length > 0) || existingComponents[0])
    : null;

  const getInitialForm = () => {
    if (isEdit) return { ...component };
    
    let defaultForm = { ...EMPTY_COMPONENT };
    if (sibling) {
      defaultForm.cardDesc = sibling.cardDesc || '';
      defaultForm.shortDesc = sibling.shortDesc || '';
      defaultForm.image = sibling.image || '';
      if (sibling.techDesc) {
        defaultForm.techDesc = { ...sibling.techDesc }; // copy keys AND values
      }
      if (sibling.pricingType) {
        defaultForm.pricingType = sibling.pricingType;
      }
    }
    return defaultForm;
  };

  const [form, setForm] = useState(getInitialForm);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleMachineType = (mt) => {
    const cur = form.machineTypes || [];
    set('machineTypes', cur.includes(mt) ? cur.filter(x => x !== mt) : [...cur, mt]);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setErr('');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      set('image', data.url);
    } catch (err) {
      setErr(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
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
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '720px', padding: '32px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            {isEdit ? `Edit: ${component.id}` : 'Add Component'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div>
            <Label required>ID</Label>
            <input value={form.id} onChange={e => set('id', e.target.value)} placeholder={sibling ? `e.g. ${sibling.id}` : "ext-45-mono-short"} style={inp(isEdit ? { background: '#f8fafc', color: '#94a3b8' } : {})} readOnly={isEdit} />
          </div>
          <div>
            <Label required>Name</Label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder={sibling ? `e.g. ${sibling.name}` : "Extruder 45 mm"} style={inp()} />
          </div>
          <div>
            <Label>Image (Cloudinary URL or Upload)</Label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input value={form.image || ''} onChange={e => set('image', e.target.value)} placeholder="https://res.cloudinary.com/..." style={{ ...inp(), flex: 1 }} />
              <label style={{
                background: '#6366f1', color: 'white', padding: '0 12px', borderRadius: '8px', 
                fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {uploading ? '...' : 'Upload'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>
        </div>
        
        <PricingEditor 
          pricingType={form.pricingType} 
          price={form.price} 
          prices={form.prices || {}} 
          onPricingTypeChange={pt => set('pricingType', pt)}
          onPriceChange={p => set('price', p)}
          onPricesChange={p => set('prices', p)}
        />

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
            Dynamic component (legacy check, mainly for PDF rendering logic)
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
        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ background: 'white', borderRadius: '12px', border: '1.5px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Basic Components</div>
            {CATEGORIES.filter(c => c.group === 'Basic Components').map(cat => {
              const count = (allData[cat.key] || []).length;
              const isActive = cat.key === activeCategory;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                    padding: '10px 14px', border: 'none', background: isActive ? '#f8fafc' : 'white',
                    borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: isActive ? '700' : '500', color: isActive ? '#0f172a' : '#475569' }}>
                    {cat.label}
                  </span>
                  <span style={{ fontSize: '11px', background: isActive ? '#e0e7ff' : '#f1f5f9', color: isActive ? '#4f46e5' : '#64748b', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ background: 'white', borderRadius: '12px', border: '1.5px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Addons</div>
            {CATEGORIES.filter(c => c.group === 'Addons').map(cat => {
              const count = (allData[cat.key] || []).length;
              const isActive = cat.key === activeCategory;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                    padding: '10px 14px', border: 'none', background: isActive ? '#f8fafc' : 'white',
                    borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: isActive ? '700' : '500', color: isActive ? '#0f172a' : '#475569' }}>
                    {cat.label}
                  </span>
                  <span style={{ fontSize: '11px', background: isActive ? '#e0e7ff' : '#f1f5f9', color: isActive ? '#4f46e5' : '#64748b', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Main list */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>{catLabel}</h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Manage {catLabel.toLowerCase()} available for models</p>
            </div>
            <button onClick={() => setModal({ mode: 'add' })} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span>+</span> Add {catLabel}
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', maxWidth: '300px', ...inp({ padding: '10px 14px' }) }}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', fontWeight: '600' }}>Loading components...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {items.map(c => (
                <div key={c.id} style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e2e8f0', padding: '16px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                    <button onClick={() => setModal({ mode: 'edit', component: c })} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#0f172a' }}>✏️</button>
                    <button onClick={() => setDeleteTarget(c.id)} style={{ background: '#fee2e2', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#dc2626' }}>🗑️</button>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.id}</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '8px', paddingRight: '60px', lineHeight: '1.3' }}>{c.name}</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {(c.machineTypes || []).map(mt => (
                      <span key={mt} style={{ fontSize: '10px', background: '#f8fafc', color: '#64748b', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e2e8f0', fontWeight: '600', textTransform: 'uppercase' }}>
                        {mt}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#10b981' }}>
                    {c.pricingType && c.pricingType !== 'single' ? (
                      <span style={{ fontSize: '12px', color: '#0369a1', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>Dynamic ({c.pricingType})</span>
                    ) : (
                      <>₹ {Number(c.price || 0).toLocaleString('en-IN')}</>
                    )}
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px', border: '1.5px dashed #cbd5e1', color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>
                  No components found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <ComponentModal
          component={modal.component}
          categoryKey={activeCategory}
          existingComponents={allData[activeCategory] || []}
          onSave={() => { setModal(null); showToast('Saved successfully.'); load(); }}
          onClose={() => setModal(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Component"
          message={`Are you sure you want to delete ${deleteTarget}? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </AdminLayout>
  );
}
