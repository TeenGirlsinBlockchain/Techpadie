'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { LanguageCode } from '@/app/types';
import { DEFAULT_LOCALE, getDirection, isValidLocale } from '@/app/lib/i18n/config';

interface LanguageContextValue {
  locale: LanguageCode;
  direction: 'ltr' | 'rtl';
  setLocale: (code: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'techpadie_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LanguageCode>(DEFAULT_LOCALE);

  // Hydrate from localStorage on mount (will be replaced by backend user prefs)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && isValidLocale(stored)) {
        setLocaleState(stored);
      }
    } catch {
      // SSR or localStorage unavailable — use default
    }
  }, []);

  // Update document direction when locale changes
  useEffect(() => {
    const dir = getDirection(locale);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  const setLocale = useCallback((code: LanguageCode) => {
    setLocaleState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Silently fail if localStorage unavailable
    }
    // When backend arrives: POST /api/user/preferences { preferredLanguage: code }
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, direction: getDirection(locale), setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}