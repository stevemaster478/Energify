import '../styles/globals.css';
import React, { useEffect } from 'react';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import { ThemeProvider } from '../components/ThemeContext';

/**
 * Inner component used to set the document direction based on the current
 * language.  Arabic uses RTL while other languages use LTR.  This ensures
 * that the UI adapts automatically when the user switches languages.
 */
const DirectionController = ({ children }) => {
  const { language } = useLanguage();
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language]);
  return children;
};

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DirectionController>
          <Component {...pageProps} />
        </DirectionController>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default MyApp;