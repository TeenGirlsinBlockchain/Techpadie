import type { LanguageCode, Language } from '@/app/types';
import { SUPPORTED_LANGUAGES } from '@/app/lib/constants';

export const DEFAULT_LOCALE: LanguageCode = 'en';
export const LANGUAGES: Language[] = SUPPORTED_LANGUAGES;

export function isValidLocale(code: string): code is LanguageCode {
  return LANGUAGES.some((lang) => lang.code === code);
}

export function getLanguage(code: LanguageCode): Language {
  return LANGUAGES.find((lang) => lang.code === code) || LANGUAGES[0];
}

export function getDirection(code: LanguageCode): 'ltr' | 'rtl' {
  return getLanguage(code).direction;
}