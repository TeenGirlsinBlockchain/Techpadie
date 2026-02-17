'use client';

import React, { useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTranslation } from '@/app/lib/i18n/useTranslation';
import { SUPPORTED_LANGUAGES } from '@/app/lib/constants';
import {
  MagnifyingGlassIcon,
  BellIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import type { LanguageCode } from '@/app/types';

export default function DashboardHeader() {
  const { user } = useUser();
  const { locale, setLocale } = useLanguage();
  const { t } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === locale);

  return (
    <header className="flex items-center justify-between gap-4 py-4 mb-6">
      {/* Search — full on desktop, expandable icon on mobile */}
      <div className="flex-1 max-w-md">
        {/* Desktop search */}
        <div className="hidden md:block relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <input
            type="text"
            placeholder={t('explore.search')}
            className="w-full bg-surface-tertiary border-0 text-text-primary text-sm rounded-xl pl-10 pr-4 py-2.5 
              focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-text-tertiary"
          />
        </div>

        {/* Mobile search toggle */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="md:hidden p-2.5 rounded-xl bg-surface-tertiary text-text-tertiary hover:text-brand-500 transition-colors"
          aria-label={t('general.search')}
        >
          {isSearchOpen ? <XMarkIcon className="h-5 w-5" /> : <MagnifyingGlassIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile expanded search */}
      {isSearchOpen && (
        <div className="md:hidden absolute top-16 left-4 right-4 z-50">
          <input
            type="text"
            placeholder={t('explore.search')}
            autoFocus
            className="w-full bg-white border border-gray-200 text-text-primary text-sm rounded-xl pl-4 pr-4 py-3 
              shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-text-tertiary"
          />
        </div>
      )}

      {/* Right actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 px-2.5 py-2 md:px-3 rounded-xl bg-surface-tertiary text-text-secondary 
              hover:text-brand-500 transition-colors text-sm font-semibold"
            aria-label="Change language"
          >
            <GlobeAltIcon className="h-4 w-4" />
            <span className="hidden md:inline">{activeLang?.nativeName}</span>
            <ChevronDownIcon className="h-3 w-3 hidden md:block" />
          </button>

          {isLangOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 animate-scale-in">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLocale(lang.code as LanguageCode);
                      setIsLangOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm font-medium transition-colors
                      ${locale === lang.code
                        ? 'bg-brand-50 text-brand-500 font-bold'
                        : 'text-text-secondary hover:bg-surface-tertiary'
                      }
                    `}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-text-tertiary ml-2 text-xs">({lang.name})</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl bg-surface-tertiary text-text-tertiary hover:text-brand-500 transition-colors"
          aria-label="Notifications"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-feedback-error ring-2 ring-white" />
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-2.5 pl-2.5 md:pl-3 border-l border-gray-200">
          <div className="h-9 w-9 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
            <UserCircleIcon className="h-9 w-9" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-text-primary leading-tight">{user.name}</p>
            <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">Student</p>
          </div>
        </button>
      </div>
    </header>
  );
}