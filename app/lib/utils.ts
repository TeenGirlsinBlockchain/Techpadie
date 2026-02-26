import { LEVELS } from './constants';
import type { LevelThreshold } from '@/app/types';

export function getLevelFromXP(xp: number): LevelThreshold {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) currentLevel = level;
    else break;
  }
  return currentLevel;
}

export function getXPToNextLevel(xp: number): number {
  const currentLevel = getLevelFromXP(xp);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel) return 0;
  return nextLevel.xpRequired - xp;
}

export function getLevelProgress(xp: number): number {
  const currentLevel = getLevelFromXP(xp);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel) return 100;
  const xpInCurrentLevel = xp - currentLevel.xpRequired;
  const xpRange = nextLevel.xpRequired - currentLevel.xpRequired;
  return Math.round((xpInCurrentLevel / xpRange) * 100);
}

export function formatLearningTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

export function formatAudioTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}