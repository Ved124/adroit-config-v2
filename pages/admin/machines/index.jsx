// pages/admin/machines/index.jsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '../../../components/admin/AdminLayout';

const CARDS = [
  {
    href: '/admin/machines/models',
    icon: '🏭',
    title: 'Machine Models',
    desc: 'Add, edit, or remove Mono, ABA, and 3-Layer machine models. Manage specs like output, motor, die size, and dimensions.',
    color: '#6366f1',
    bg: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)',
    stat: 'mono + aba + 3layer',
  },
  {
    href: '/admin/machines/components',
    icon: '🔧',
    title: 'Component Library',
    desc: 'Manage all 29 component categories — extruders, bubble cages, hauloffs, dies, winders, panels, and more.',
    color: '#0891b2',
    bg: 'linear-gradient(135deg,#0891b2 0%,#0e7490 100%)',
    stat: '29 categories',
  },
  {
    href: '/admin/machines/presets',
    icon: '📋',
    title: 'Model Presets',
    desc: 'Define the default component configuration for each machine model — including sizes, prices, and tech specs.',
    color: '#059669',
    bg: 'linear-gradient(135deg,#059669 0%,#047857 100%)',
    stat: 'preset builder',
  },
];

export default function MachinesHub() {
  const [stats, setStats] = useState({ models: 0, components: 0, presets: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/models').then(r => r.json()).catch(() => null),
      fetch('/api/admin/components').then(r => r.json()).catch(() => null),
      fetch('/api/admin/presets').then(r => r.json()).catch(() => null),
    ]).then(([models, components, presets]) => {
      const modelCount = models ? (models.mono?.length || 0) + (models.aba?.length || 0) + (models.threeLayer?.length || 0) : 0;
      const compCount = components ? Object.values(components).reduce((s, a) => s + a.length, 0) : 0;
      const presetCount = presets ? Object.keys(presets).length : 0;
      setStats({ models: modelCount, components: compCount, presets: presetCount });
    });
  }, []);

  return (
    <AdminLayout title="">
      <Head>
        <title>Machine Manager — Adroit Admin</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)',
        borderRadius: '20px', padding: '36px 40px', marginBottom: '32px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '200px', height: '200px', background: 'rgba(99,102,241,0.15)',
          borderRadius: '50%'
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#6366f1', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
            ADROIT EXTRUSION — ADMIN
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#f8fafc', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
            Machine & Component Manager
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: '0 0 24px' }}>
            Full CRUD control over machine models, component libraries, model presets, and price tables.
          </p>
          {/* Live stats */}
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { label: 'Machine Models', value: stats.models },
              { label: 'Components', value: stats.components },
              { label: 'Presets', value: stats.presets },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#f8fafc' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {CARDS.map(card => (
          <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white', borderRadius: '16px', padding: '28px',
              border: '1.5px solid #e2e8f0', cursor: 'pointer',
              transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.12)`;
                e.currentTarget.style.borderColor = card.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  background: card.bg, width: '52px', height: '52px', borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', flexShrink: 0
                }}>
                  {card.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      {card.title}
                    </h2>
                    <span style={{
                      fontSize: '10px', fontWeight: '800', color: card.color,
                      background: `${card.color}15`, padding: '3px 8px', borderRadius: '20px',
                      textTransform: 'uppercase', letterSpacing: '0.06em'
                    }}>
                      {card.stat}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick tips */}
      <div style={{
        marginTop: '24px', background: '#fffbeb', border: '1px solid #fde68a',
        borderRadius: '12px', padding: '16px 20px'
      }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#92400e', fontWeight: '600' }}>
          💡 <strong>Tip:</strong> Changes to components and prices are applied immediately. Changes to presets affect new configurator sessions. No redeploy needed.
        </p>
      </div>
    </AdminLayout>
  );
}
