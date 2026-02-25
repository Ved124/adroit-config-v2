// Central motion configuration for consistent animation parameters across the app.
// Keeps spring physics & durations unified; extend as needed.

export const SPRING = {
  soft: { type: 'spring', stiffness: 180, damping: 24 }, // gentle UI entrances
  medium: { type: 'spring', stiffness: 240, damping: 26 }, // default for overlays, panels
  pop: { type: 'spring', stiffness: 300, damping: 20 }, // badges, pop-in feedback
  spinner: { type: 'spring', stiffness: 120, damping: 18 }, // subtle loader scaling
};

export const FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const SCALE_FADE = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

export const TRANSITION = {
  fast: { duration: 0.15, ease: 'easeOut' },
  base: { duration: 0.25, ease: 'easeOut' },
  slow: { duration: 0.5, ease: 'easeInOut' },
};

// Radial pulse keyframes reused by Card and potential future components
export const PULSE_KEYFRAMES = {
  opacity: [0.35, 0.15, 0],
  scale: [0.96, 1.05, 1.12],
};

export const PULSE_TIMING = { duration: 1.0, ease: 'easeOut', times: [0, 0.7, 1] };

export type SpringName = keyof typeof SPRING;
export const spring = (name: SpringName) => SPRING[name];
