// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferredLanguage: LanguageCode;
  role: 'student' | 'instructor' | 'admin';
  createdAt: string;
}

// types/course.ts
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseCategory = 
  | 'fundamentals' 
  | 'smart-contracts' 
  | 'defi' 
  | 'security' 
  | 'trading-markets' 
  | 'development';

export interface Course {
  id: string;
  title: string;                    // Default language
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  price: number;
  currency: string;
  imageUrl: string;
  duration: string;                 // e.g. "6h 30m"
  rating: number;
  studentCount: number;
  availableLanguages: LanguageCode[];
  author: CourseAuthor;
  modules: CourseModule[];
  // Translations (keyed by language code)
  translations?: Record<LanguageCode, {
    title: string;
    description: string;
  }>;
}

export interface CourseAuthor {
  id: string;
  name: string;
  avatar: string;
}

export interface CourseModule {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'text' | 'video' | 'quiz';
  duration: string;
  content: string;                  // HTML or markdown
  audioUrl?: string;
  transcript?: string;
  isFree: boolean;
  order: number;
  translations?: Record<LanguageCode, {
    title: string;
    content: string;
    audioUrl?: string;
    transcript?: string;
  }>;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progressPercentage: number;
  completedLessonIds: string[];
  lastLessonId?: string;
  lastAudioTimestamp?: number;      // seconds
  enrolledAt: string;
  completedAt?: string;
}

// types/gamification.ts
export interface GamificationState {
  xp: number;
  level: number;
  rank: string;                     // e.g. "Blockchain Rookie"
  currentStreak: number;
  longestStreak: number;
  weeklyLearningMinutes: number;
  coursesCompleted: number;
  quizzesCompleted: number;
  achievements: Achievement[];
  weeklyHistory: DayStatus[];       // Last 7 days
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  category: 'streak' | 'completion' | 'quiz' | 'social' | 'milestone';
}

export interface DayStatus {
  date: string;
  goalMet: boolean;
  xpEarned: number;
  minutesLearned: number;
}

export interface LevelThreshold {
  level: number;
  rank: string;
  xpRequired: number;
}

// types/audio.ts
export interface AudioPlayerState {
  isPlaying: boolean;
  currentLessonId: string | null;
  currentCourseId: string | null;
  currentTime: number;
  duration: number;
  playbackSpeed: number;            // 0.5, 0.75, 1, 1.25, 1.5, 2
  audioUrl: string | null;
  lessonTitle: string;
  courseTitle: string;
}

// types/activity.ts
export type ActivityType = 
  | 'lesson_completed' 
  | 'xp_earned' 
  | 'quiz_completed' 
  | 'achievement_unlocked'
  | 'course_enrolled'
  | 'streak_milestone'
  | 'audio_completed';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  xpEarned?: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// types/i18n.ts
export type LanguageCode = 'en' | 'fr' | 'sw' | 'ar' | 'ha' | 'pt';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';        // Arabic is RTL
}

export interface TranslationKeys {
  // Navigation
  'nav.dashboard': string;
  'nav.explore': string;
  'nav.myCourses': string;
  'nav.achievements': string;
  'nav.settings': string;
  // Dashboard
  'dashboard.welcome': string;
  'dashboard.welcomeBack': string;
  'dashboard.continueLearning': string;
  'dashboard.coursesForYou': string;
  'dashboard.recentActivity': string;
  'dashboard.dailyTip': string;
  // Stats
  'stats.currentStreak': string;
  'stats.totalXP': string;
  'stats.coursesCompleted': string;
  'stats.currentLevel': string;
  'stats.weeklyTime': string;
  // Course
  'course.enroll': string;
  'course.resume': string;
  'course.completed': string;
  'course.lessons': string;
  'course.hours': string;
  'course.students': string;
  // Audio
  'audio.play': string;
  'audio.pause': string;
  'audio.speed': string;
  'audio.listenToLesson': string;
  // General
  'general.viewAll': string;
  'general.search': string;
  'general.noResults': string;
  'general.loading': string;
}