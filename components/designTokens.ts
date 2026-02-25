// Central place to define design tokens used by chat UI.
// Could be expanded or mapped to Tailwind theme extensions; kept lightweight for now.

export const CHAT_LAYOUT = {
  sidebarWidth: 256,
  inputMinHeight: 40,
  bubbleMaxWidths: {
    base: '85%',
    sm: '75%',
    md: '65%'
  }
};

export const COLORS = {
  userGradientFrom: 'from-blue-600',
  userGradientTo: 'to-violet-600',
  userGradientDarkFrom: 'dark:from-blue-500',
  userGradientDarkTo: 'dark:to-violet-500',
  assistantBg: 'bg-gray-100 dark:bg-gray-800',
};

export const TIMING = {
  transition: 'transition-all duration-300 ease-in-out'
};

export const ANIMATION = {
  messageEnter: { opacity: 0, y: 8 },
  messageVisible: { opacity: 1, y: 0 }
};

// Simple utility to compose gradient classes
export const userGradient = `${COLORS.userGradientFrom} ${COLORS.userGradientTo} ${COLORS.userGradientDarkFrom} ${COLORS.userGradientDarkTo}`;
