import React, { useEffect, useState } from 'react';
import Head from 'next/head';

export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serverInfo, setServerInfo] = useState(null);

  useEffect(() => {
    // Fetch Server Info
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
      .catch(err => setError('Failed to load leads'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <Head>
        <title>Exhibition Leads Dashboard</title>
      </Head>
      
      <h1 style={{ color: '#0F4761', borderBottom: '3px solid #DC2626', paddingBottom: '10px' }}>
        Exhibition Leads (JSON Configurations)
      </h1>
      
      <p style={{ color: '#555', marginBottom: '30px' }}>
        Below are all the JSON configuration files automatically saved during the exhibition. 
        Click "Download JSON" to safely download them to your computer.
      </p>

      {serverInfo && (
        serverInfo.mode === 'local' ? (
          <div style={{ 
            background: '#F0F9FF', 
            border: '1px solid #BAE6FD', 
            borderRadius: '12px', 
            padding: '20px', 
            marginBottom: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <h2 style={{ fontSize: '16px', margin: 0, color: '#0369A1' }}>📱 Multi-Device Setup</h2>
            <p style={{ fontSize: '14px', margin: 0, color: '#0C4A6E' }}>
              To use other tablets or phones, ensure they are on the same WiFi and open:
            </p>
            <code style={{ 
              background: 'white', 
              padding: '8px 12px', 
              borderRadius: '6px', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#0F4761',
              border: '1px solid #E0F2FE',
              width: 'fit-content'
            }}>
              {serverInfo.url}
            </code>
            <p style={{ fontSize: '12px', margin: 0, color: '#64748B', fontStyle: 'italic' }}>
              Note: This device must stay on and the app must be running for other devices to work.
            </p>
          </div>
        ) : (
          <div style={{ 
            background: '#F0FDF4', 
            border: '1px solid #BBF7D0', 
            borderRadius: '12px', 
            padding: '12px 20px', 
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '18px' }}>☁️</span>
            <p style={{ fontSize: '14px', margin: 0, color: '#166534', fontWeight: '500' }}>
              Connected to <strong>Vercel Cloud Storage</strong>. All leads are synced globally across all devices.
            </p>
          </div>
        )
      )}

      {loading && <p>Loading leads...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && leads.length === 0 && !error && (
        <p>No leads found in Vercel Storage.</p>
      )}

      {!loading && leads.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#f4f6f7', textAlign: 'left' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Date/Time</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>File Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Size</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((blob) => {
              // The blob.url is the direct vercel URL. 
              // We append ?download=1 to bypass any Chrome rendering bugs!
              const downloadUrl = `${blob.url}?download=1`;
              
              // Format date nicely
              const dateObj = new Date(blob.uploadedAt);
              const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
              
              return (
                <tr key={blob.url}>
                  <td style={{ padding: '12px', border: '1px solid #ddd', fontSize: '14px' }}>
                    {dateStr}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>
                    {blob.pathname.replace('data/', '')}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', fontSize: '14px', color: '#666' }}>
                    {(blob.size / 1024).toFixed(1)} KB
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <a 
                      href={downloadUrl} 
                      style={{
                        background: '#0F4761',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}
                    >
                      Download JSON
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
