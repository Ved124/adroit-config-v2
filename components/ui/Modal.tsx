import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SPRING } from '../motionConfig';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  widthClass?: string; // e.g., 'max-w-3xl'
};

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, widthClass = 'max-w-3xl' }) => {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => setMounted(true), []);
  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ y: 24, opacity: 0, scale:0.98 }}
              animate={{ y: 0, opacity: 1, scale:1 }}
              exit={{ y: 24, opacity: 0, scale:0.98 }}
              transition={{ type:'spring', stiffness: SPRING.medium.stiffness, damping: SPRING.medium.damping }}
              className={`w-full ${widthClass} rounded-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-xl border border-gray-200/60 dark:border-gray-800/60`}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-sm sm:text-base font-semibold">{title}</h3>
                <button onClick={onClose} aria-label="Close modal" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
                </button>
              </div>
              <div className="p-4">
                {children}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
