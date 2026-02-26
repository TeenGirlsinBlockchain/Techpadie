'use client';

import React from 'react';
import type { ActivityItem as ActivityItemType } from '@/app/types';
import { formatRelativeTime } from '@/app/lib/utils';
import Badge from '@/app/components/ui/Badge';
import {
  BookOpenIcon,
  BoltIcon,
  ClipboardDocumentCheckIcon,
  TrophyIcon,
  AcademicCapIcon,
  FireIcon,
  MusicalNoteIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/solid';

const ACTIVITY_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  lesson_completed: { icon: BookOpenIcon, color: 'bg-brand-50 text-brand-500' },
  xp_earned: { icon: BoltIcon, color: 'bg-violet-50 text-gamification-xp' },
  quiz_completed: { icon: ClipboardDocumentCheckIcon, color: 'bg-emerald-50 text-feedback-success' },
  achievement_unlocked: { icon: TrophyIcon, color: 'bg-amber-50 text-gamification-achievement' },
  course_enrolled: { icon: AcademicCapIcon, color: 'bg-sky-50 text-sky-500' },
  course_completed: { icon: AcademicCapIcon, color: 'bg-emerald-50 text-feedback-success' },
  streak_milestone: { icon: FireIcon, color: 'bg-orange-50 text-gamification-streak' },
  audio_completed: { icon: MusicalNoteIcon, color: 'bg-purple-50 text-purple-500' },
  level_up: { icon: ArrowTrendingUpIcon, color: 'bg-brand-50 text-brand-500' },
};

export default function ActivityItem({ activity }: { activity: ActivityItemType }) {
  const config = ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.xp_earned;
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 py-3 px-1 group">
      <div className={`shrink-0 h-9 w-9 rounded-xl flex items-center justify-center ${config.color}`}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary leading-snug truncate">
          {activity.title}
        </p>
        <p className="text-xs text-text-tertiary mt-0.5">{activity.description}</p>
      </div>

      <div className="flex-shrink-0 flex flex-col items-end gap-1">
        <span className="text-[11px] text-text-tertiary font-medium">
          {formatRelativeTime(activity.timestamp)}
        </span>
        {activity.xpEarned && activity.xpEarned > 0 && (
          <Badge variant="xp" size="sm">+{activity.xpEarned} XP</Badge>
        )}
      </div>
    </div>
  );
}