
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