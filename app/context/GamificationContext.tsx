'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { GamificationState, Achievement, DayStatus } from '@/app/types';
import { XP_REWARDS } from '@/app/lib/constants';
import { getLevelFromXP, getXPToNextLevel } from '@/app/lib/utils';

interface GamificationContextValue {
  state: GamificationState;
  addXP: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  incrementStreak: () => void;
}

const GamificationContext = createContext<GamificationContextValue | undefined>(undefined);

// ─── Mock Achievements ───────────────────────────────────────────
const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'BookOpen',
    isUnlocked: true,
    unlockedAt: '2025-01-16T10:00:00Z',
    category: 'milestone',
    xpReward: 50,
  },
  {
    id: 'ach_streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: 'Fire',
    isUnlocked: true,
    unlockedAt: '2025-01-22T10:00:00Z',
    category: 'streak',
    xpReward: 100,
  },
  {
    id: 'ach_streak_30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day learning streak',
    icon: 'Fire',
    isUnlocked: false,
    category: 'streak',
    xpReward: 500,
  },
  {
    id: 'ach_quiz_perfect',
    title: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: 'Star',
    isUnlocked: false,
    category: 'quiz',
    xpReward: 100,
  },
  {
    id: 'ach_first_course',
    title: 'Course Champion',
    description: 'Complete your first course',
    icon: 'Trophy',
    isUnlocked: false,
    category: 'completion',
    xpReward: 250,
  },
  {
    id: 'ach_audio_10',
    title: 'Audio Learner',
    description: 'Complete 10 lessons via audio',
    icon: 'Headphones',
    isUnlocked: false,
    category: 'audio',
    xpReward: 150,
  },
];

// ─── Mock Weekly History ─────────────────────────────────────────
const MOCK_WEEKLY_HISTORY: DayStatus[] = [
  { date: '2025-02-10', goalMet: true, xpEarned: 75, minutesLearned: 45 },
  { date: '2025-02-11', goalMet: true, xpEarned: 50, minutesLearned: 30 },
  { date: '2025-02-12', goalMet: true, xpEarned: 100, minutesLearned: 60 },
  { date: '2025-02-13', goalMet: false, xpEarned: 10, minutesLearned: 5 },
  { date: '2025-02-14', goalMet: true, xpEarned: 75, minutesLearned: 40 },
  { date: '2025-02-15', goalMet: true, xpEarned: 50, minutesLearned: 35 },
  { date: '2025-02-16', goalMet: false, xpEarned: 0, minutesLearned: 0 },
];

// ─── Initial State ───────────────────────────────────────────────
const INITIAL_STATE: GamificationState = {
  xp: 450,
  level: 3,
  rank: 'Chain Explorer',
  xpToNextLevel: 150,
  currentStreak: 7,
  longestStreak: 14,
  dailyGoalMet: false,
  weeklyLearningMinutes: 215,
  coursesCompleted: 1,
  quizzesCompleted: 5,
  achievements: MOCK_ACHIEVEMENTS,
  weeklyHistory: MOCK_WEEKLY_HISTORY,
};

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GamificationState>(INITIAL_STATE);

  const addXP = useCallback((amount: number) => {
    setState((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = getLevelFromXP(newXP);
      return {
        ...prev,
        xp: newXP,
        level: newLevel.level,
        rank: newLevel.rank,
        xpToNextLevel: getXPToNextLevel(newXP),
      };
    });
    // When backend arrives: POST /api/gamification/xp { amount, source }
  }, []);

  const unlockAchievement = useCallback((achievementId: string) => {
    setState((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) =>
        a.id === achievementId
          ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() }
          : a
      ),
    }));
    // When backend arrives: POST /api/gamification/achievements/unlock { achievementId }
  }, []);

  const incrementStreak = useCallback(() => {
    setState((prev) => {
      const newStreak = prev.currentStreak + 1;
      return {
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        dailyGoalMet: true,
      };
    });
  }, []);

  return (
    <GamificationContext.Provider
      value={{ state, addXP, unlockAchievement, incrementStreak }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}