import type { LevelThreshold } from '@/app/types';

// Ranks based on learning progress in Blockchain
const RANKS = [
  { maxLevel: 2, name: 'Blockchain Rookie' },
  { maxLevel: 4, name: 'Token Cadet' },
  { maxLevel: 6, name: 'Node Operator' },
  { maxLevel: 8, name: 'Smart Contract Apprentice' },
  { maxLevel: 10, name: 'DeFi Practitioner' },
  { maxLevel: 15, name: 'Consensus Architect' },
  { maxLevel: Infinity, name: 'Web3 Pioneer' },
];

/**
 * Calculates total XP required to reach a specific level.
 */
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  // Level 2: 100 XP, Level 3: 300 XP, Level 4: 600 XP, etc.
  // Formula: Sum_{i=1}^{level-1} (i * 100) = (level * (level - 1) / 2) * 100
  return ((level * (level - 1)) / 2) * 100;
}

/**
 * Returns the rank title for a specific level.
 */
export function getRankForLevel(level: number): string {
  const rank = RANKS.find((r) => level <= r.maxLevel);
  return rank ? rank.name : 'Web3 Pioneer';
}

/**
 * Computes level, rank, and progress metrics from a user's total XP.
 */
export function getLevelProgress(totalXp: number) {
  let level = 1;
  while (totalXp >= getXpRequiredForLevel(level + 1)) {
    level++;
  }

  const currentLevelXpStart = getXpRequiredForLevel(level);
  const nextLevelXpStart = getXpRequiredForLevel(level + 1);
  const xpNeededForNextLevel = nextLevelXpStart - currentLevelXpStart;
  const xpInCurrentLevel = totalXp - currentLevelXpStart;
  const percentProgress = Math.min(
    100,
    Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100))
  );

  return {
    level,
    rank: getRankForLevel(level),
    xpInCurrentLevel,
    xpNeededForNextLevel,
    percentProgress,
  };
}

/**
 * Validates and updates a user's login/activity streak.
 * Returns the new streak and whether the streak was reset.
 */
export function calculateNewStreak(
  lastActivityAt: Date | string | null,
  currentStreak: number
): { newStreak: number; streakReset: boolean } {
  if (!lastActivityAt) {
    return { newStreak: 1, streakReset: false };
  }

  const now = new Date();
  const lastActivityDate = new Date(lastActivityAt);

  // Normalize dates to midnight UTC to compare days
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const last = Date.UTC(
    lastActivityDate.getUTCFullYear(),
    lastActivityDate.getUTCMonth(),
    lastActivityDate.getUTCDate()
  );

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysDiff = Math.floor((today - last) / msPerDay);

  if (daysDiff === 0) {
    // Already did an activity today, streak is maintained but not incremented twice
    return { newStreak: Math.max(1, currentStreak), streakReset: false };
  } else if (daysDiff === 1) {
    // Consecutive day, increment streak
    return { newStreak: currentStreak + 1, streakReset: false };
  } else {
    // Missed a day (daysDiff > 1), streak resets to 1 (counting today's activity)
    return { newStreak: 1, streakReset: true };
  }
}

/**
 * Returns level thresholds for the level-up progress display.
 */
export function getLevelThresholds(maxLevel = 20): LevelThreshold[] {
  const thresholds: LevelThreshold[] = [];
  for (let lvl = 1; lvl <= maxLevel; lvl++) {
    thresholds.push({
      level: lvl,
      rank: getRankForLevel(lvl),
      xpRequired: getXpRequiredForLevel(lvl),
    });
  }
  return thresholds;
}
