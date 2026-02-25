import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SPRING } from '../motionConfig';
import SuccessIcon from './SuccessIcon';
import { motion as m } from 'framer-motion';

type Toast = { id: string; title?: string; description?: string; variant?: 'success' | 'error' | 'info' | 'loading'; persist?: boolean; durationMs?: number };

type ToastCtx = {
  push: (t: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
  update: (id: string, patch: Partial<Omit<Toast, 'id'>>) => void;
};

const ToastContext = createContext<ToastCtx | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems(prev => prev.filter(t => t.id !== id));
  }, []);

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const toast: Toast = { id, ...t };
    setItems(prev => {
      // keep max 1 toast; replace existing
      if (prev.length === 0) return [toast];
      return [toast];
    });
    if (!toast.persist) {
      const delay = typeof toast.durationMs === 'number' ? toast.durationMs : 3000;
      setTimeout(() => dismiss(id), delay);
    }
    return id;
  }, [dismiss]);

  const update = useCallback((id: string, patch: Partial<Omit<Toast, 'id'>>) => {
    setItems(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  }, []);

  // accessibility: announce via aria-live region hidden
  useEffect(() => {
    if (items.length === 0) return;
    const last = items[items.length - 1];
    const region = document.getElementById('toast-aria-region');
    if (region) region.textContent = `${last.title || ''} ${last.description || ''}`.trim();
  }, [items]);

  return (
    <ToastContext.Provider value={{ push, dismiss, update }}>
      {children}
      <div id="toast-aria-region" className="sr-only" aria-live="polite" />
      <div className="fixed top-3 right-3 z-[200] flex flex-col gap-2 w-[280px]">
        <AnimatePresence initial={false}>
          {items.map((t) => {
            const base = 'rounded-xl px-4 py-3 shadow-lg border flex items-start gap-3';
            const styles = t.variant === 'error'
              ? 'bg-red-600 text-white border-red-700'
              : t.variant === 'success'
              ? 'bg-green-600 text-white border-green-700'
              : t.variant === 'loading'
              ? 'bg-gray-700 text-white border-gray-600'
              : 'bg-gray-900 text-white border-gray-800';
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: SPRING.soft.stiffness, damping: SPRING.soft.damping }}
                layout
                role="status"
                aria-live="polite"
                className={`${base} ${styles}`}
              >
                <div className="pt-0.5 relative">
                  {t.variant === 'success' && <SuccessIcon size={20} />}
                  {t.variant === 'error' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12" y2="16" />
                    </svg>
                  )}
                  {t.variant === 'loading' && (
                    <motion.div
                      className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    />
                  )}
                  {!t.persist && (
                    <m.svg
                      width={20}
                      height={20}
                      viewBox="0 0 36 36"
                      className="absolute -top-1 -right-6 text-white/30"
                      aria-hidden="true"
                    >
                      <m.circle
                        cx="18"
                        cy="18"
                        r="16"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 1 }}
                        animate={{ pathLength: 0 }}
                        transition={{ duration: (t.durationMs ?? 3500)/1000, ease: 'linear' }}
                      />
                    </m.svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {t.title && <div className="text-sm font-semibold truncate">{t.title}</div>}
                  {t.description && <div className="text-xs opacity-90 mt-0.5 break-words leading-relaxed">{t.description}</div>}
                  {t.persist && (
                    <button
                      onClick={() => dismiss(t.id)}
                      className="mt-2 text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md transition"
                      aria-label="Dismiss notification"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
