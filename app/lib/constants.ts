import { CourseCategory, Language, LevelThreshold } from "../types/user";

export const LEVELS: LevelThreshold[] = [
  { level: 1, rank: 'Blockchain Newbie', xpRequired: 0 },
  { level: 2, rank: 'Blockchain Rookie', xpRequired: 100 },
  { level: 3, rank: 'Chain Explorer', xpRequired: 300 },
  { level: 4, rank: 'Block Builder', xpRequired: 600 },
  { level: 5, rank: 'Smart Contractor', xpRequired: 1000 },
  { level: 6, rank: 'DeFi Navigator', xpRequired: 1500 },
  { level: 7, rank: 'Protocol Architect', xpRequired: 2500 },
  { level: 8, rank: 'Chain Master', xpRequired: 4000 },
  { level: 9, rank: 'Web3 Veteran', xpRequired: 6000 },
  { level: 10, rank: 'Blockchain Sage', xpRequired: 10000 },
];

export const XP_REWARDS = {
  lessonCompleted: 25,
  quizPassed: 50,
  quizPerfect: 100,
  courseCompleted: 250,
  streakDay: 10,
  streakWeek: 100,
  firstCourse: 50,
  audioLessonCompleted: 25,
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', direction: 'ltr' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', direction: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr' },
];

export const COURSE_CATEGORIES: { key: CourseCategory; label: string }[] = [
  { key: 'fundamentals', label: 'Fundamentals' },
  { key: 'smart-contracts', label: 'Smart Contracts' },
  { key: 'defi', label: 'DeFi' },
  { key: 'security', label: 'Security' },
  { key: 'trading-markets', label: 'Trading & Markets' },
  { key: 'development', label: 'Development' },
];