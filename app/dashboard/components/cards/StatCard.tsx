'use client';

import React from 'react';
import { useTranslation } from '@/app/lib/i18n/useTranslation';
import type { StatCardData } from '@/app/types';
import {
  FireIcon,
  BoltIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/solid';

const ICON_MAP: Record<string, React.ElementType> = {
  streak: FireIcon,
  xp: BoltIcon,
  'courses-completed': AcademicCapIcon,
  level: ChartBarIcon,
  'weekly-time': ClockIcon,
};

const ICON_COLOR_MAP: Record<string, string> = {
  streak: 'bg-orange-50 text-gamification-streak',
  xp: 'bg-violet-50 text-gamification-xp',
  'courses-completed': 'bg-emerald-50 text-feedback-success',
  level: 'bg-brand-50 text-brand-500',
  'weekly-time': 'bg-sky-50 text-sky-500',
};

export default function StatCard({ metricKey, label, value, unit, change, changeType }: StatCardData) {
  const { t } = useTranslation();
  const Icon = ICON_MAP[metricKey] || BoltIcon;
  const iconColor = ICON_COLOR_MAP[metricKey] || 'bg-gray-50 text-gray-500';

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 hover:shadow-md transition-shadow duration-200 cursor-default">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
          {t(label as any)}
        </p>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <p className="text-2xl md:text-3xl font-bold text-text-primary leading-none mb-1">
        {value}
        {unit && <span className="text-sm font-medium text-text-tertiary ml-1">{unit}</span>}
      </p>

      {change && (
        <div className={`flex items-center gap-1 text-xs font-medium mt-2 ${
          changeType === 'positive' ? 'text-feedback-success' :
          changeType === 'negative' ? 'text-feedback-error' :
          'text-text-tertiary'
        }`}>
          {changeType === 'positive' && <ArrowTrendingUpIcon className="h-3 w-3" />}
          {changeType === 'negative' && <ArrowTrendingDownIcon className="h-3 w-3" />}
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}