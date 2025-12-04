import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

/**
 * Provide dark/light theme state via context.  On initial load it reads the
 * preference from localStorage or falls back to the browser’s preference.
 */
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Initialise dark mode based on local storage or media query
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) {
        setDarkMode(stored === 'true');
      } else {
        // Fallback to user’s OS preference
        setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode);
      // Toggle the `dark` class on the html element.  Tailwind uses this
      // class to switch colours globally.
      const root = window.document.documentElement;
      if (darkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);