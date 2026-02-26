'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/app/lib/i18n/useTranslation';
import { useGamification } from '@/app/context/GamificationContext';
import Badge from '@/app/components/ui/Badge';
import ProgressBar from '@/app/components/ui/ProgressBar';
import { getLevelProgress } from '@/app/lib/utils';
import type { AchievementCategory } from '@/app/types';
import {
  TrophyIcon,
  FireIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  MusicalNoteIcon,
  StarIcon,
  LockClosedIcon,
  CheckCircleIcon,
  BoltIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';

const CATEGORY_CONFIG: Record<AchievementCategory, { icon: React.ElementType; color: string; label: string }> = {
  streak: { icon: FireIcon, color: 'bg-orange-50 text-gamification-streak', label: 'Streak' },
  completion: { icon: AcademicCapIcon, color: 'bg-emerald-50 text-feedback-success', label: 'Completion' },
  quiz: { icon: ClipboardDocumentCheckIcon, color: 'bg-violet-50 text-gamification-xp', label: 'Quiz' },
  social: { icon: UserGroupIcon, color: 'bg-sky-50 text-sky-500', label: 'Social' },
  milestone: { icon: StarIcon, color: 'bg-amber-50 text-gamification-achievement', label: 'Milestone' },
  audio: { icon: MusicalNoteIcon, color: 'bg-purple-50 text-purple-500', label: 'Audio' },
};

const ALL_CATEGORIES: (AchievementCategory | 'all')[] = ['all', 'streak', 'completion', 'quiz', 'milestone', 'audio'];

export default function AchievementsPage() {
  const { t } = useTranslation();
  const { state } = useGamification();
  const [activeFilter, setActiveFilter] = useState<AchievementCategory | 'all'>('all');

  const filtered = activeFilter === 'all'
    ? state.achievements
    : state.achievements.filter((a) => a.category === activeFilter);

  const unlocked = state.achievements.filter((a) => a.isUnlocked).length;
  const total = state.achievements.length;
  const progressPercent = Math.round((unlocked / total) * 100);
  const levelProgress = getLevelProgress(state.xp);

  return (
    <div className="space-y-6 md:space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{t('achievements.title')}</h1>
        <p className="text-text-tertiary text-sm mt-1">Track your milestones and unlock rewards.</p>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Level Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center">
              <BoltIcon className="h-5 w-5 text-brand-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">Level {state.level}</p>
              <p className="text-xs text-text-tertiary">{state.rank}</p>
            </div>
          </div>
          <ProgressBar value={levelProgress} variant="brand" size="md" showLabel label="XP to next level" />
          <p className="text-xs text-text-tertiary mt-2">{state.xp} XP · {state.xpToNextLevel} to go</p>
        </div>

        {/* Achievements Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <TrophyIcon className="h-5 w-5 text-gamification-achievement" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{unlocked} / {total}</p>
              <p className="text-xs text-text-tertiary">Achievements unlocked</p>
            </div>
          </div>
          <ProgressBar value={progressPercent} variant="streak" size="md" showLabel />
        </div>

        {/* Streak */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <FireIcon className="h-5 w-5 text-gamification-streak" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{state.currentStreak} day streak</p>
              <p className="text-xs text-text-tertiary">Longest: {state.longestStreak} days</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {state.weeklyHistory.map((day, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${day.goalMet ? 'bg-gamification-streak' : 'bg-gray-100'}`}
              />
            ))}
          </div>
          <p className="text-[10px] text-text-tertiary mt-2 text-center">Last 7 days</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="-mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:pb-0">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`
                flex-shrink-0 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border
                ${activeFilter === cat
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white text-text-secondary border-gray-200 hover:border-brand-500 hover:text-brand-500'
                }
              `}
            >
              {cat === 'all' ? 'All' : CATEGORY_CONFIG[cat]?.label || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((achievement) => {
          const config = CATEGORY_CONFIG[achievement.category];
          const Icon = config?.icon || StarIcon;

          return (
            <div
              key={achievement.id}
              className={`
                relative bg-white rounded-2xl border p-5 transition-all
                ${achievement.isUnlocked
                  ? 'border-gray-100 hover:shadow-md'
                  : 'border-gray-100 opacity-60'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  achievement.isUnlocked ? config?.color || 'bg-gray-50 text-gray-400' : 'bg-gray-100 text-gray-300'
                }`}>
                  {achievement.isUnlocked ? (
                    <Icon className="h-6 w-6" />
                  ) : (
                    <LockClosedIcon className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-text-primary truncate">{achievement.title}</h3>
                    {achievement.isUnlocked && (
                      <CheckCircleIcon className="h-4 w-4 text-feedback-success flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-text-tertiary leading-relaxed">{achievement.description}</p>

                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant={achievement.isUnlocked ? 'xp' : 'default'} size="sm">
                      +{achievement.xpReward} XP
                    </Badge>
                    {achievement.isUnlocked && achievement.unlockedAt && (
                      <span className="text-[10px] text-text-tertiary">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <TrophyIcon className="h-10 w-10 text-text-tertiary mx-auto mb-3" />
          <p className="text-sm text-text-tertiary">No achievements in this category yet.</p>
        </div>
      )}
    </div>
  );
}