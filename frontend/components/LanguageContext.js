import React, { createContext, useState, useContext } from 'react';
// Import translation files.  These JSON files are bundled at build time.
import en from '../locales/en.json';
import it from '../locales/it.json';
import ar from '../locales/ar.json';

// Map of supported translations.
const translations = {
  en,
  it,
  ar,
};

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }) => {
  // Default language is 'en'.  Persist the selection in localStorage so it
  // survives page reloads.
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lang') || 'en';
    }
    return 'en';
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  };

  const t = (key) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  const contextValue = { language, setLanguage: changeLanguage, t };
  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);