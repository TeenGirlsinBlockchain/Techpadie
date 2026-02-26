'use client';

import { useCallback } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import type { TranslationKeys } from '@/app/types';

// Import translation files statically.
// When backend i18n arrives, this becomes a dynamic fetch.
import en from './en.json';
import fr from './fr.json';

type Translations = Record<string, string>;

const translationMap: Record<string, Translations> = {
  en,
  fr,
  // Add more as they're created:
  // sw: sw,
  // ar: ar,
  // ha: ha,
  // pt: pt,
};

/**
 * Translation hook.
 *
 * Usage:
 *   const { t } = useTranslation();
 *   t('dashboard.welcomeBack', { name: 'Daniel' })
 *   // → "Welcome back, Daniel"
 *
 * Falls back to English if key is missing in active locale.
 * Falls back to the raw key if missing entirely.
 */
export function useTranslation() {
  const { locale } = useLanguage();

  const t = useCallback(
    (key: keyof TranslationKeys, params?: Record<string, string | number>): string => {
      const translations = translationMap[locale] || translationMap.en;
      let text = translations[key] || translationMap.en[key] || key;

      // Replace {param} placeholders
      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
        });
      }

      return text;
    },
    [locale]
  );

  return { t, locale };
}