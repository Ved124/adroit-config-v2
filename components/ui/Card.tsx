import React, { useState, useEffect } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { SPRING, PULSE_KEYFRAMES, PULSE_TIMING } from '../motionConfig';

type CardProps = HTMLMotionProps<'div'> & {
  interactive?: boolean;
  padding?: string; // tailwind padding classes
  added?: boolean; // show added badge
  justAdded?: boolean; // pulse glow when just added
  onQtyChange?: (delta:number)=>void; // optional inline quantity bumpers
};

export const Card: React.FC<CardProps> = ({
  interactive = false,
  padding = 'p-4',
  className = '',
  children,
  added = false,
  justAdded = false,
  onQtyChange,
  ...rest
}) => {
  const base = 'rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md';
  const interactiveClasses = interactive
    ? 'transition-all duration-200 ease-in-out hover:shadow-lg focus-within:shadow-lg'
    : '';
  return (
    <motion.div
      role="group"
      whileHover={interactive ? { y: -2 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      className={`${base} ${interactiveClasses} ${padding} ${className}`}
      {...rest}
    >
      <div className="relative">
        {justAdded && (
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0.35, scale: 0.96 }}
            animate={PULSE_KEYFRAMES as any}
            transition={PULSE_TIMING as any}
            style={{
              background:
                'radial-gradient(140px 140px at 90% 8%, rgba(34,197,94,0.35), transparent 70%)',
            }}
          />
        )}
        {added && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: -90 }}
            transition={SPRING.pop as any}
            aria-label="Item already added"
            className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] font-semibold px-2 py-1 rounded-full shadow-lg shadow-green-500/30 flex items-center gap-1"
          >
            <motion.svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            >
              <path d="M20 6L9 17l-5-5" />
            </motion.svg>
            Added
          </motion.div>
        )}
        {children as React.ReactNode}
        {/* {added && onQtyChange && (
          <div className="absolute inset-0 pointer-events-none flex items-start justify-end p-2">
            <button
              type="button"
              onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); onQtyChange(1); }}
              className="pointer-events-auto inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white shadow-md hover:bg-green-500"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        )} */}
      </div>
    </motion.div>
  );
};

export default Card;