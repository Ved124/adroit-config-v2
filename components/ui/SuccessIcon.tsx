import React from 'react';
import { motion } from 'framer-motion';
import { SPRING } from '../motionConfig';

export const SuccessIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    initial={{ scale: 0, rotate: -90, opacity: 0 }}
    animate={{ scale: 1, rotate: 0, opacity: 1 }}
  transition={{ type: 'spring', stiffness: SPRING.pop.stiffness, damping: SPRING.pop.damping }}
    className="text-green-500"
    aria-hidden="true"
  >
    <motion.circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    />
    <motion.path
      d="M8 12l3 3 5-5"
      stroke="currentColor"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.45, ease: 'easeInOut' }}
    />
  </motion.svg>
);

export default SuccessIcon;