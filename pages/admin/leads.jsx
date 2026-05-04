import React, { useEffect, useState } from 'react';
import Head from 'next/head';

export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
