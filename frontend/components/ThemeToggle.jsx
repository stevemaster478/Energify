import React from 'react';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';

/**
 * Toggle between dark and light modes.  Uses the ThemeContext to update
 * state and Tailwind’s `dark` class.  The label reflects the current mode
 * and is translated according to the current language.
 */
const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { t } = useLanguage();
  return (
    <button
      onClick={toggleDarkMode}
      className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {t('theme')}: {darkMode ? t('dark') : t('light')}
    </button>
  );
};

export default ThemeToggle;