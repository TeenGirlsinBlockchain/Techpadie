'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/app/lib/i18n/useTranslation';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  TrophyIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const NAV_ITEMS = [
  { href: '/dashboard', icon: HomeIcon, labelKey: 'nav.dashboard' as const },
  { href: '/dashboard/explore', icon: MagnifyingGlassIcon, labelKey: 'nav.explore' as const },
  { href: '/dashboard/my-courses', icon: BookOpenIcon, labelKey: 'nav.myCourses' as const },
  { href: '/dashboard/achievements', icon: TrophyIcon, labelKey: 'nav.achievements' as const },
  { href: '/dashboard/settings', icon: Cog6ToothIcon, labelKey: 'nav.settings' as const },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 h-full w-sidebar flex-col bg-brand-500 text-white z-30">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-white/15">
        <Link href="/dashboard" className="text-2xl font-bold font-display tracking-tight">
          Techpadie
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                transition-all duration-200
                ${active
                  ? 'bg-white text-brand-500 shadow-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer - Level badge */}
      <div className="p-4 border-t border-white/15">
        <div className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl">
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
            3
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">Chain Explorer</p>
            <p className="text-[11px] text-white/60 font-medium">450 XP</p>
          </div>
        </div>
      </div>
    </aside>
  );
}