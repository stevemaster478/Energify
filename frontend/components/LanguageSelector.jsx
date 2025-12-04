import React from 'react';
import { useLanguage } from './LanguageContext';

/**
 * Render a language selector dropdown.  When the user selects a new language
 * the application context updates and the change is persisted to localStorage.
 */
const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="language-select" className="text-sm font-medium">
        {t('language')}:
      </label>
      <select
        id="language-select"
        className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="en">EN</option>
        <option value="it">IT</option>
        <option value="ar">AR</option>
      </select>
    </div>
  );
};

export default LanguageSelector;