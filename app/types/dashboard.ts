
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