'use client';

import React, { useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTranslation } from '@/app/lib/i18n/useTranslation';
import { SUPPORTED_LANGUAGES } from '@/app/lib/constants';
import Drawer from '@/app/components/ui/Drawer';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  XMarkIcon,
  HomeIcon,
  BookOpenIcon,
  TrophyIcon,
  Cog6ToothIcon,
  UserCircleIcon as UserCircleOutline,
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import type { LanguageCode } from '@/app/types';

const DRAWER_NAV = [
  { href: '/dashboard', icon: HomeIcon, labelKey: 'nav.dashboard' as const },
  { href: '/dashboard/explore', icon: MagnifyingGlassIcon, labelKey: 'nav.explore' as const },
  { href: '/dashboard/my-courses', icon: BookOpenIcon, labelKey: 'nav.myCourses' as const },
  { href: '/dashboard/achievements', icon: TrophyIcon, labelKey: 'nav.achievements' as const },
  { href: '/dashboard/settings', icon: Cog6ToothIcon, labelKey: 'nav.settings' as const },
];

export default function DashboardHeader() {
  const { user } = useUser();
  const { locale, setLocale } = useLanguage();
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === locale);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="relative flex items-center justify-between gap-3 py-3 md:py-4 mb-4 md:mb-6">
        {/* Left side: Hamburger (mobile) + Search */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Hamburger menu — visible below lg */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden flex-shrink-0 p-2 rounded-xl bg-surface-tertiary text-text-secondary hover:text-brand-500 transition-colors"
            aria-label="Open menu"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          {/* Desktop search */}
          <div className="hidden md:block relative flex-1 max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              placeholder={t('explore.search')}
              className="w-full bg-surface-tertiary border-0 text-text-primary text-sm rounded-xl pl-10 pr-4 py-2.5 
                focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-text-tertiary"
            />
          </div>

          {/* Mobile search icon */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden flex-shrink-0 p-2 rounded-xl bg-surface-tertiary text-text-tertiary hover:text-brand-500 transition-colors"
            aria-label={t('general.search')}
          >
            {isSearchOpen ? <XMarkIcon className="h-5 w-5" /> : <MagnifyingGlassIcon className="h-5 w-5" />}
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 md:gap-2.5 flex-shrink-0">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2 py-2 md:px-3 rounded-xl bg-surface-tertiary text-text-secondary 
                hover:text-brand-500 transition-colors text-sm font-semibold"
              aria-label="Change language"
            >
              <GlobeAltIcon className="h-4 w-4" />
              <span className="hidden sm:inline text-xs md:text-sm">{activeLang?.nativeName}</span>
              <ChevronDownIcon className="h-3 w-3 hidden sm:block" />
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
                      {lang.nativeName}
                      <span className="text-text-tertiary ml-1.5 text-xs">({lang.name})</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-xl bg-surface-tertiary text-text-tertiary hover:text-brand-500 transition-colors"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-feedback-error ring-2 ring-surface-tertiary" />
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-2 pl-2 md:pl-2.5 border-l border-gray-200 ml-0.5">
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 flex-shrink-0">
              <UserCircleIcon className="h-8 w-8 md:h-9 md:w-9" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-text-primary leading-tight">{user.name}</p>
              <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">Student</p>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile expanded search overlay */}
      {isSearchOpen && (
        <div className="md:hidden absolute top-[4.5rem] left-3 right-3 z-50 animate-fade-in">
          <input
            type="text"
            placeholder={t('explore.search')}
            autoFocus
            className="w-full bg-white border border-gray-200 text-text-primary text-sm rounded-xl pl-4 pr-4 py-3 
              shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-text-tertiary"
          />
        </div>
      )}

      {/* Hamburger Drawer — mobile sidebar */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} side="left" title="Techpadie">
        <nav className="p-3 space-y-1">
          {DRAWER_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsDrawerOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors
                  ${active
                    ? 'bg-brand-50 text-brand-500'
                    : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                  }
                `}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info in drawer */}
        <div className="mt-auto p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
              <UserCircleOutline className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{user.name}</p>
              <p className="text-xs text-text-tertiary">Student · Lvl 3</p>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}