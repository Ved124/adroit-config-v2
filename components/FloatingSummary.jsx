import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useContext } from 'react';
import { ConfigContext } from '../src/ConfigContext';
import { motion } from 'framer-motion';
import { spring } from './motionConfig';
import AnimatedNumber from './AnimatedNumber';

export default function FloatingSummary() {
  const { selected, selectedAddons, discount, markup } = useContext(ConfigContext);

  const prevTotalRef = useRef(0);
  const [delta, setDelta] = useState(0);
  const [direction, setDirection] = useState('none');
  const { count, subtotal, total, final } = useMemo(() => {
    const base = (selected || []).reduce((a,b)=> a + (b.price||0) * (b.qty||1), 0);
    const addon = (selectedAddons || []).reduce((a,b)=> a + (b.price||0) * (b.qty||1), 0);
    const subtotal = base + addon;
    const total = subtotal + (subtotal * (markup || 0))/100;
    const final = total - (total * (typeof discount === 'number' ? discount : 0))/100;
    const count = (selected || []).length + (selectedAddons || []).length;
    return { count, subtotal, total, final };
  }, [selected, selectedAddons, discount, markup]);

  // compute delta when total changes (up or down)
  useEffect(() => {
    const prev = prevTotalRef.current;
    const diff = total - prev;
    if (diff !== 0) {
      setDelta(Math.abs(diff));
      setDirection(diff > 0 ? 'up' : 'down');
      const t = setTimeout(()=> { setDelta(0); setDirection('none'); }, 1300);
      prevTotalRef.current = total;
      return () => clearTimeout(t);
    }
    prevTotalRef.current = total;
  }, [total]);

  const fmt = (n)=> `₹${Number(Math.round(n||0)).toLocaleString('en-IN')}`;

  if (count === 0) return null;

  return (
    <motion.aside
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={spring('medium')}
      className="fixed bottom-4 right-4 z-40 backdrop-blur bg-gray-900/70 text-white border border-gray-800 rounded-2xl shadow-xl p-3 sm:p-4 min-w-[260px]"
      role="status"
      aria-live="polite"
    >
      <div className="text-xs opacity-80">Build Summary</div>
      <div className="mt-1 grid grid-cols-3 gap-3 text-sm">
        <div className="relative">
          <div className="opacity-70">Total</div>
          <AnimatedNumber value={total} prefix="₹" className="font-semibold" />
          {delta > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.9 }}
              animate={{ opacity: 1, y: -10, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.9 }}
              transition={{ type:'spring', stiffness:240, damping:20 }}
              className={`absolute -top-2 right-0 flex flex-col items-center gap-0.5`}
            >
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${direction==='down' ? 'bg-red-600' : 'bg-green-600'} text-white shadow-md`}>{direction==='down' ? '−' : '+'}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${direction==='down' ? 'bg-red-600' : 'bg-green-600'} text-white shadow-md`}>₹{Math.round(delta).toLocaleString('en-IN')}</span>
            </motion.div>
          )}
        </div>
        <div>
          <div className="opacity-70">Discount</div>
          <AnimatedNumber value={discount||0} suffix="%" className="font-semibold" />
        </div>
        <div>
          <div className="opacity-70">Final</div>
          <AnimatedNumber value={final} prefix="₹" className="font-semibold text-green-400" />
        </div>
      </div>
    </motion.aside>
  );
}
