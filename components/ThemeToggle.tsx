import React from 'react';
import { useTheme } from 'next-themes';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle dark mode"
      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-soft hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
    >
      {isDark ? (
        <>
          <span>Light</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        </>
      ) : (
        <>
          <span>Dark</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;