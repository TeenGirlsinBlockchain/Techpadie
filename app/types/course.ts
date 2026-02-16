import type { LanguageCode } from './i18n';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export type CourseCategory =
  | 'fundamentals'
  | 'smart-contracts'
  | 'defi'
  | 'security'
  | 'trading-markets'
  | 'development';

export interface CourseAuthor {
  id: string;
  name: string;
  avatar: string;
  title?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'text' | 'video' | 'quiz';
  duration: string;
  content: string;
  audioUrl?: string;
  transcript?: string;
  isFree: boolean;
  order: number;
  translations?: Partial<Record<LanguageCode, {
    title: string;
    content: string;
    audioUrl?: string;
    transcript?: string;
  }>>;
}

export interface CourseModule {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl: string;
  duration: string;
  rating: number;
  studentCount: number;
  availableLanguages: LanguageCode[];
  author: CourseAuthor;
  modules: CourseModule[];
  isFeatured?: boolean;
  translations?: Partial<Record<LanguageCode, {
    title: string;
    description: string;
  }>>;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  progressPercentage: number;
  completedLessonIds: string[];
  lastLessonId?: string;
  lastAudioTimestamp?: number;
  enrolledAt: string;
  completedAt?: string;
}

export type CourseCardVariant = 'default' | 'enrolled' | 'explore' | 'sale';

export interface CourseCardProps {
  variant?: CourseCardVariant;
  courseId: string;
  courseTitle: string;
  imageUrl: string;
  level: CourseLevel;
  duration: string;
  rating: number;
  studentCount: number;
  author: CourseAuthor;
  availableLanguages?: LanguageCode[];
  progressPercentage?: number;
  price?: number;
  currency?: string;
  description?: string;
  href?: string;
  onAction?: () => void;
}