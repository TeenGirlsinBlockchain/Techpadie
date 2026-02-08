
export type CourseCategory = 'all' | 'blockchain' | 'defi' | 'nfts' | 'development' | 'security';

export interface ExploreCourse {
  id: number;
  title: string;
  category: CourseCategory;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string; // e.g., "5 hours"
  rating: number; // 1.0 to 5.0
  enrolledCount: number;
  isNew: boolean;
}



export interface Lesson {
  id: number;
  title: string;
  durationMinutes: number;
}

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface DetailedCourse {
  id: number;
  title: string;
  description: string;
  priceUSD: number;
  modules: Module[];
  totalModules: number;
  totalDurationHours: number;
  isCertified: boolean;
  imageUrl: string; // For the enrollment card
}

export interface CourseCardProps {
  courseTitle: string;
  nextLesson: string;
  progressPercentage: number;
  timeRemaining: string;
  onContinue: () => void; 
  imageUrl: string;
  priceUSD: number;
  isEnrolled?: boolean;
}

export interface CourseContent {
  id: number;
  lessonId: number;
  title: string;
  contentType: 'text' | 'quiz' | 'video'; // Only text for now
  content: string; // The translated course text
  isCompleted: boolean;
}

// src/types/dashboard.ts

// --- Dashboard Home and Exploration ---

export interface StatData {
  title: string;
  value: string;
  icon: React.ElementType; // For Heroicons component
}

export interface CourseData {
  courseTitle: string;
  nextLesson: string;
  progressPercentage: number;
  timeRemaining: string;
  id: number;
}

export interface CourseCardProps extends CourseData {
  onContinue: () => void;
  imageUrl: string;
  priceUSD: number;
}


export interface ExploreCourse {
  id: number;
  title: string;
  category: CourseCategory;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string; // e.g., "5 hours"
  rating: number; // 1.0 to 5.0
  enrolledCount: number;
  isNew: boolean;
}

// --- Course Detail and Learning ---

export interface Lesson {
  id: number;
  title: string;
  durationMinutes: number;
}

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface DetailedCourse {
  id: number;
  title: string;
  description: string;
  priceUSD: number;
  modules: Module[];
  totalModules: number;
  totalDurationHours: number;
  isCertified: boolean;
  imageUrl: string;
}

export interface CourseContent {
  id: number;
  lessonId: number;
  title: string;
  contentType: 'text' | 'quiz' | 'video';
  content: string; // The translated course text
  isCompleted: boolean;
}