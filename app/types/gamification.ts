export interface LevelThreshold {
  level: number;
  rank: string;
  xpRequired: number;
}

export interface DayStatus {
  date: string;
  goalMet: boolean;
  xpEarned: number;
  minutesLearned: number;
}

export type AchievementCategory = 'streak' | 'completion' | 'quiz' | 'social' | 'milestone' | 'audio';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  category: AchievementCategory;
  xpReward: number;
}

export interface GamificationState {
  xp: number;
  level: number;
  rank: string;
  xpToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  dailyGoalMet: boolean;
  weeklyLearningMinutes: number;
  coursesCompleted: number;
  quizzesCompleted: number;
  achievements: Achievement[];
  weeklyHistory: DayStatus[];
}

export type StatMetricKey = 'streak' | 'xp' | 'courses-completed' | 'level' | 'weekly-time';

export interface StatCardData {
  metricKey: StatMetricKey;
  label: string;
  value: number | string;
  unit?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
}