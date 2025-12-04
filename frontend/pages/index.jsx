import React from 'react';
import Head from 'next/head';
import LanguageSelector from '../components/LanguageSelector';
import ThemeToggle from '../components/ThemeToggle';
import CalculatorForm from '../components/CalculatorForm';
import { useLanguage } from '../components/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('subtitle')} />
      </Head>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-8 px-4">
        <header className="w-full max-w-4xl mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <div className="flex space-x-4 items-center">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </header>
        <main className="w-full max-w-4xl flex-1">
          <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">{t('subtitle')}</p>
          <CalculatorForm />
        </main>
        <footer className="mt-8 text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Energy Calculator
        </footer>
      </div>
    </>
  );
}