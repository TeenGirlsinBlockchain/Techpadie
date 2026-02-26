export type ActivityType =
  | 'lesson_completed'
  | 'xp_earned'
  | 'quiz_completed'
  | 'achievement_unlocked'
  | 'course_enrolled'
  | 'course_completed'
  | 'streak_milestone'
  | 'audio_completed'
  | 'level_up';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  xpEarned?: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}