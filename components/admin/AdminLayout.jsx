// components/admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV = [
  { href: '/admin/machines', label: '🏠 Hub', exact: true },
  { href: '/admin/machines/models', label: '🏭 Machine Models' },
  { href: '/admin/machines/components', label: '🔧 Components' },
  { href: '/admin/machines/presets', label: '📋 Presets' },
];

export default function AdminLayout({ children, title }) {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('adroit_admin_auth') === 'true';
      setAuth(isAuth);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'adroit123' || password === 'admin') {
      sessionStorage.setItem('adroit_admin_auth', 'true');
      setAuth(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (!auth) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Admin Access</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Please enter the password to continue.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Password" 
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              autoFocus
            />
            {error && <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: '600' }}>{error}</div>}
            <button type="submit" style={{ width: '100%', padding: '12px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
              Login
            </button>
          </form>
          <div style={{ marginTop: '24px' }}>
            <Link href="/customer" style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>← Back to Configurator</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", background: '#f1f5f9' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px', minHeight: '100vh', background: 'linear-gradient(160deg,#0f172a 0%,#1e293b 100%)',
        padding: '24px 0', flexShrink: 0, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0
      }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #334155' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Adroit Admin
          </div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>
            Machine Manager
          </div>
        </div>
        <nav style={{ padding: '12px 10px', flex: 1 }}>
          {NAV.map(({ href, label, exact }) => {
            const active = exact ? router.pathname === href : router.pathname.startsWith(href) && href !== '/admin/machines';
            const isExactHub = exact && router.pathname === '/admin/machines';
            const isActive = exact ? isExactHub : router.pathname.startsWith(href);
            return (
              <Link key={href} href={href} style={{
                display: 'block', padding: '9px 12px', borderRadius: '8px',
                marginBottom: '2px', textDecoration: 'none', fontSize: '13px', fontWeight: isActive ? '700' : '500',
                color: isActive ? '#f8fafc' : '#94a3b8',
                background: isActive ? 'rgba(99,102,241,0.25)' : 'transparent',
                borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                transition: 'all 0.15s'
              }}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: '12px 20px', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="/customer" style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'none' }}>
            ← Back to Configurator
          </Link>
          <Link href="/admin/leads" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none' }}>
            ← Leads Dashboard
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px', maxWidth: '1200px' }}>
        {title && (
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 24px', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
