import { CourseCategory, LevelThreshold } from "../types/user";
import { Language } from "../types/i18n";

export const COLORS = {
  brand: { DEFAULT: '#227FA1', 50: '#EBF5F9', 500: '#227FA1', 600: '#1B6681', 700: '#154C61' },
  text: { primary: '#0F172A', secondary: '#475569', tertiary: '#94A3B8', inverse: '#FFFFFF' },
  gamification: { xp: '#8B5CF6', streak: '#F97316', achievement: '#EAB308', level: '#227FA1' },
} as const;

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

export const COURSE_CATEGORIES: {
  labelKey: string; key: CourseCategory; label: string; apiKey: string;
}[] = [
  { key: 'fundamentals', label: 'Fundamentals', labelKey: 'category.fundamentals', apiKey: 'BLOCKCHAIN_BASICS' },
  { key: 'smart-contracts', label: 'Smart Contracts', labelKey: 'category.smartContracts', apiKey: 'SMART_CONTRACTS' },
  { key: 'defi', label: 'DeFi', labelKey: 'category.defi', apiKey: 'DEFI' },
  { key: 'security', label: 'Security', labelKey: 'category.security', apiKey: 'SECURITY' },
  { key: 'trading-markets', label: 'Trading & Markets', labelKey: 'category.tradingMarkets', apiKey: 'TRADING' },
  { key: 'development', label: 'Development', labelKey: 'category.development', apiKey: 'WEB3_DEV' },
];

export const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const LAYOUT = {
  sidebarWidth: 256,
  mobileNavHeight: 72,
  headerHeight: 80,
} as const;