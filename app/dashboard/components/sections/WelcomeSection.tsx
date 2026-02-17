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

  const dailyTip = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
  }, []);

  const weeklyProgress = Math.round((state.weeklyLearningMinutes / (7 * 30)) * 100);

  return (
    <section className="relative bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 md:p-8 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-brand-50 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl opacity-50 pointer-events-none" />

      <div className="relative z-10">
        {/* Top row: greeting + streak — always stacks on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          {/* Greeting */}
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-text-primary leading-tight">
              {t('dashboard.welcomeBack', { name: user.name })}
            </h1>
            <p className="text-text-secondary text-sm mt-1.5 leading-relaxed">
              {t('dashboard.weeklyGoalProgress', { progress: String(weeklyProgress) })}
            </p>
          </div>

          {/* Streak + Level — horizontal on mobile, vertical on desktop */}
          <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5">
              <FireIcon
                className={`h-5 w-5 sm:h-6 sm:w-6 ${state.dailyGoalMet ? 'text-gamification-streak' : 'text-gray-300'}`}
              />
              <div>
                <p className="text-lg sm:text-xl font-bold text-text-primary leading-none">{state.currentStreak}</p>
                <p className="text-[9px] sm:text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
                  {t('stats.days')} streak
                </p>
              </div>
            </div>
            <Badge variant="level" size="sm">
              Lvl {state.level} · {state.rank}
            </Badge>
          </div>
        </div>

        {/* Daily Tip */}
        <div className="flex items-start gap-3 bg-brand-50 rounded-xl p-3 sm:p-3.5">
          <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <LightBulbIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold text-brand-600 uppercase tracking-wider mb-0.5">
              {t('dashboard.dailyTip')}
            </p>
            <p className="text-xs sm:text-sm text-brand-700 font-medium leading-snug">{dailyTip}</p>
          </div>
        </div>
      </div>
    </section>
  );
}