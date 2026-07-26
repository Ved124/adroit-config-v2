// components/admin/ConfirmDialog.jsx
import React from 'react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = true, confirmTestId }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', padding: '28px 32px', maxWidth: '420px',
        width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px', textAlign: 'center' }}>
          {danger ? '⚠️' : '❓'}
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: '#0f172a', textAlign: 'center' }}>
          {title || 'Are you sure?'}
        </h2>
        <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b', textAlign: 'center', lineHeight: '1.6' }}>
          {message || 'This action cannot be undone.'}
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px',
              background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#475569'
            }}
          >
            Cancel
          </button>
          <button
            data-testid={confirmTestId}
            onClick={onConfirm}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '8px',
              background: danger ? '#dc2626' : '#6366f1', cursor: 'pointer',
              fontSize: '14px', fontWeight: '700', color: 'white'
            }}
          >
            {danger ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
