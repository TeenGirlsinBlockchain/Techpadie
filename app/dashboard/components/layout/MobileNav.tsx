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
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  TrophyIcon as TrophyIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    icon: HomeIcon,
    iconActive: HomeIconSolid,
    labelKey: 'nav.dashboard' as const,
  },
  {
    href: '/dashboard/explore',
    icon: MagnifyingGlassIcon,
    iconActive: MagnifyingGlassIconSolid,
    labelKey: 'nav.explore' as const,
  },
  {
    href: '/dashboard/my-courses',
    icon: BookOpenIcon,
    iconActive: BookOpenIconSolid,
    labelKey: 'nav.myCourses' as const,
  },
  {
    href: '/dashboard/achievements',
    icon: TrophyIcon,
    iconActive: TrophyIconSolid,
    labelKey: 'nav.achievements' as const,
  },
  {
    href: '/dashboard/settings',
    icon: Cog6ToothIcon,
    iconActive: Cog6ToothIconSolid,
    labelKey: 'nav.settings' as const,
  },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around h-mobile-nav px-2 safe-area-pb">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = active ? item.iconActive : item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-0.5 min-w-[3rem] py-1 px-2
                transition-colors duration-200
                ${active ? 'text-brand-500' : 'text-text-tertiary'}
              `}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold leading-tight truncate max-w-[4rem]">
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}