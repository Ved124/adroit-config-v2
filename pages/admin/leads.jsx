import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

function parseFilename(filename) {
  // Expected: AE_DOM_MIX_01_fghj_NoCity_992337.json  →  ref=AE_DOM_MIX_01, company=fghj, city=NoCity, ts=992337
  const base = filename.replace(/\.(json|pdf)$/, '');
  const parts = base.split('_');
  // Last part is timestamp (6 digits), second-to-last is city, the one before that is company
  const ts = parts[parts.length - 1];
  const city = parts[parts.length - 2] === 'NoCity' ? '—' : parts[parts.length - 2];
  const company = parts[parts.length - 3] || '—';
  const ref = parts.slice(0, parts.length - 3).join('_');
  return { ref, company, city, ts };
}

export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serverInfo, setServerInfo] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/server-info')
      .then(res => res.json())
      .then(setServerInfo)
      .catch(e => console.error("Server Info Error:", e));

    fetch('/api/list-leads')
      .then(res => res.json())
      .then(data => {
        if (data.error && data.blobs?.length === 0) {
          setError(data.error);
        } else {
          setLeads(data.blobs || []);
        }
      })
      .catch(() => setError('Failed to load leads'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = leads.filter(b => {
    const name = b.pathname || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ padding: '32px 40px', fontFamily: "'Inter', system-ui, sans-serif", maxWidth: '1100px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh' }}>
      <Head>
        <title>Exhibition Leads — Adroit Configurator</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#0f172a', margin: 0, fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Exhibition Leads
          </h1>
          <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '13px' }}>
            All JSON configurations auto-saved during the exhibition
          </p>
        </div>
        <Link href="/customer" style={{
          textDecoration: 'none', color: '#0f172a', fontWeight: '700',
          fontSize: '13px', padding: '8px 18px',
          border: '1.5px solid #cbd5e1', borderRadius: '8px',
          background: 'white', transition: 'all 0.15s'
        }}>
          ← Back to Configurator
        </Link>
      </div>

      {/* Server info banner */}
      {serverInfo && (
        serverInfo.mode === 'local' ? (
          <div style={{
            background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px',
            padding: '16px 20px', marginBottom: '24px'
          }}>
            <p style={{ margin: '0 0 6px', fontWeight: '700', color: '#1e40af', fontSize: '14px' }}>
              📡 Exhibition WiFi Mode — Local Server
            </p>
            <p style={{ margin: '0 0 8px', color: '#1e3a8a', fontSize: '13px' }}>
              Open this URL on any device connected to the same WiFi:
            </p>
            <code style={{
              background: 'white', padding: '6px 14px', borderRadius: '6px',
              fontSize: '17px', fontWeight: '800', color: '#1e40af',
              border: '1px solid #bfdbfe', display: 'inline-block'
            }}>
              {serverInfo.url}
            </code>
            <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '11px', fontStyle: 'italic' }}>
              Keep this laptop running. Leads are stored locally and will not be lost on refresh.
            </p>
          </div>
        ) : (
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px',
            padding: '12px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>☁️</span>
            <p style={{ fontSize: '13px', margin: 0, color: '#166534', fontWeight: '600' }}>
              Connected to <strong>Vercel Cloud Storage</strong> — leads sync across all devices globally.
            </p>
          </div>
        )
      )}

      {/* Search */}
      <input
        placeholder="Search by company name, ref no, or city…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', padding: '10px 14px', marginBottom: '20px',
          border: '1.5px solid #e2e8f0', borderRadius: '8px',
          fontSize: '13px', background: 'white', boxSizing: 'border-box',
          outline: 'none', fontFamily: 'inherit'
        }}
      />

      {loading && <p style={{ color: '#64748b' }}>Loading leads…</p>}
      {error && <p style={{ color: '#dc2626', fontWeight: '600' }}>{error}</p>}

      {!loading && filtered.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
          <p style={{ fontWeight: '600', fontSize: '15px' }}>No leads found yet.</p>
          <p style={{ fontSize: '13px' }}>Leads will appear here after visitors scan their QR flyers.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>{filtered.length} lead{filtered.length !== 1 ? 's' : ''} found</p>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                {['Date / Time', 'Company', 'City', 'Quote Ref', 'Size', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '8px 12px', color: '#64748b', fontWeight: '700',
                    fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em',
                    borderBottom: '1.5px solid #e2e8f0'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((blob) => {
                const filename = blob.pathname.replace('data/', '');
                const { ref, company, city } = parseFilename(filename);
                const downloadUrl = `${blob.url}?download=1`;
                const dateObj = new Date(blob.uploadedAt);
                const dateStr = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                // Detect machine type from ref prefix
                const isMixer = ref.toLowerCase().includes('mix');
                const machineTag = isMixer ? 'MIXER' : 'EXTRUSION';
                const tagColor = isMixer ? '#7c3aed' : '#dc2626';
                const tagBg = isMixer ? '#f5f3ff' : '#fef2f2';

                return (
                  <tr key={blob.url} style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '12px 12px', fontSize: '12px', color: '#475569', whiteSpace: 'nowrap' }}>
                      <strong style={{ display: 'block', color: '#0f172a', fontSize: '13px' }}>{dateStr}</strong>
                      {timeStr}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                      {company}
                      <span style={{
                        marginLeft: '8px', fontSize: '9px', fontWeight: '800',
                        background: tagBg, color: tagColor,
                        padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>{machineTag}</span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#64748b' }}>{city}</td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#334155', fontFamily: 'monospace', fontWeight: '600' }}>{ref}</td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#94a3b8' }}>{(blob.size / 1024).toFixed(1)} KB</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          href={`/customer?loadUrl=${encodeURIComponent(blob.url)}`}
                          style={{
                            background: '#10b981', color: 'white',
                            padding: '6px 14px', borderRadius: '6px',
                            textDecoration: 'none', fontSize: '12px', fontWeight: '700',
                            display: 'inline-block', whiteSpace: 'nowrap'
                          }}
                        >
                          ✎ Fill Lead
                        </Link>
                        <a
                          href={downloadUrl}
                          download={filename}
                          style={{
                            background: '#0f172a', color: 'white',
                            padding: '6px 14px', borderRadius: '6px',
                            textDecoration: 'none', fontSize: '12px', fontWeight: '700',
                            display: 'inline-block', whiteSpace: 'nowrap'
                          }}
                        >
                          ↓ JSON
                        </a>
                        {/* PDF link — same base name but .pdf extension */}
                        <a
                          href={blob.url.replace('.json', '.pdf').replace('?download=1', '')}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            background: '#dc2626', color: 'white',
                            padding: '6px 14px', borderRadius: '6px',
                            textDecoration: 'none', fontSize: '12px', fontWeight: '700',
                            display: 'inline-block', whiteSpace: 'nowrap'
                          }}
                        >
                          ↗ PDF
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      <div style={{ marginTop: '40px', textAlign: 'center', color: '#cbd5e1', fontSize: '11px', fontWeight: '600' }}>
        ADROIT EXTRUSION © {new Date().getFullYear()}
      </div>
    </div>
  );
}
