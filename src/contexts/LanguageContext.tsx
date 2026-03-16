'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, zh } from '@/i18n/locales';
import { Locale, Translations } from '@/types/i18n';

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh');
  const [t, setT] = useState<Translations>(zh);

  // Load saved language preference
  useEffect(() => {
    const savedLocale = localStorage.getItem('app-locale') as Locale;
    if (savedLocale && (savedLocale === 'zh' || savedLocale === 'en')) {
      setLocaleState(savedLocale);
      setT(translations[savedLocale]);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setT(translations[newLocale]);
    localStorage.setItem('app-locale', newLocale);
  };

  const toggleLocale = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    setLocale(newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
