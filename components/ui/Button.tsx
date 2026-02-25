import React, { useRef, useState } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { radii, shadows, motion as motionTokens } from './designSystem';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = HTMLMotionProps<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white',
  secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 h-8',
  md: 'text-sm px-4 h-10',
  lg: 'text-base px-5 h-12'
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  iconLeft,
  iconRight,
  loading,
  children,
  disabled,
  ...rest
}) => {
  const [pulse, setPulse] = useState<{x:number;y:number}|null>(null);
  const containerRef = useRef<HTMLButtonElement>(null);

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    if (disabled || loading) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPulse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    // clear pulse after animation
    setTimeout(()=> setPulse(null), 450);
    rest.onPointerDown?.(e);
  }

  return (
    <motion.button
      ref={containerRef}
      onPointerDown={handlePointerDown}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 font-medium ${radii.button} ${shadows.base} ${shadows.hover} ${motionTokens.base} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-brand-400 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {pulse && (
        <motion.span
          aria-hidden
          initial={{ opacity: 0.35, scale: 0 }}
          animate={{ opacity: 0, scale: 2.2 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="absolute rounded-full pointer-events-none"
          style={{ left: pulse.x, top: pulse.y, width: 140, height: 140, transformOrigin: 'center', translate: '-50% -50%', background: 'radial-gradient(80px 80px at center, rgba(255,255,255,0.35), transparent 70%)' }}
        />
      )}
      {iconLeft && <span className="flex items-center" aria-hidden="true">{iconLeft}</span>}
      <span className="truncate">{loading ? 'Loading…' : (children as React.ReactNode)}</span>
      {iconRight && <span className="flex items-center" aria-hidden="true">{iconRight}</span>}
    </motion.button>
  );
};

export default Button;