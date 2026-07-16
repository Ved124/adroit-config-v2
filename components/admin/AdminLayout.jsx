// components/admin/AdminLayout.jsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV = [
  { href: '/admin/machines', label: '🏠 Hub', exact: true },
  { href: '/admin/machines/models', label: '🏭 Machine Models' },
  { href: '/admin/machines/components', label: '🔧 Components' },
  { href: '/admin/machines/presets', label: '📋 Presets' },
  { href: '/admin/machines/pricing', label: '💰 Price Tables' },
];

export default function AdminLayout({ children, title }) {
  const router = useRouter();

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
        <div style={{ padding: '12px 20px', borderTop: '1px solid #334155' }}>
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
