'use client';

import React, { useMemo } from 'react';
import { useUser } from '@/app/context/UserContext';
import { useGamification } from '@/app/context/GamificationContext';
import { useTranslation } from '@/app/lib/i18n/useTranslation';
import { DAILY_TIPS } from '@/app/lib/mockData';
import Badge from '@/app/components/ui/Badge';
import { FireIcon, LightBulbIcon } from '@heroicons/react/24/solid';

export default function WelcomeSection() {
  const { user } = useUser();
  const { state } = useGamification();
  const { t } = useTranslation();

  // Rotate daily tip based on day of year
  const dailyTip = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
  }, []);

  return (
    <section className="relative bg-white rounded-2xl lg:rounded-3xl border border-gray-100 p-5 md:p-8 overflow-hidden">
      {/* Subtle brand gradient accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-50 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left — Greeting + Tip */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-text-primary truncate">
              {t('dashboard.welcomeBack', { name: user.name })}
            </h1>
          </div>

          <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-xl mb-5">
            {t('dashboard.weeklyGoalProgress', {
              progress: String(
                Math.round(
                  (state.weeklyLearningMinutes / (7 * 30)) * 100 // 30 min/day goal × 7 days
                )
              ),
            })}
          </p>

          {/* Daily Tip */}
          <div className="flex items-start gap-3 bg-brand-50 rounded-xl p-3.5 max-w-lg">
            <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <LightBulbIcon className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-brand-600 uppercase tracking-wider mb-0.5">
                {t('dashboard.dailyTip')}
              </p>
              <p className="text-sm text-brand-700 font-medium leading-snug">{dailyTip}</p>
            </div>
          </div>
        </div>

        {/* Right — Streak + Quick Stats */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-3 flex-shrink-0">
          {/* Streak Badge */}
          <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-2xl px-5 py-3">
            <FireIcon
              className={`h-7 w-7 ${state.dailyGoalMet ? 'text-gamification-streak animate-pulse-soft' : 'text-gray-300'}`}
            />
            <div>
              <p className="text-2xl font-bold text-text-primary leading-none">{state.currentStreak}</p>
              <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                {t('stats.days')} streak
              </p>
            </div>
          </div>

          {/* Rank Badge */}
          <Badge variant="level" size="md">
            Lvl {state.level} · {state.rank}
          </Badge>
        </div>
      </div>
    </section>
  );
}