// Define the StatCard data structure
export interface StatData {
  metricKey: 'courses' | 'hours' | 'streak' | 'quizzes';
  title: string;
  value: number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  unit?: string;
}

// Define the CourseCard data structure
export interface CourseData {
  courseTitle: string;
  nextLesson: string;
  progressPercentage: number;
  timeRemaining: string;
  id: number;
}

export interface CourseCardProps {
  courseTitle: string;
  nextLesson: string;
  progressPercentage: number;
  timeRemaining: string;
  onContinue: () => void; 
  imageUrl: string;
  priceUSD: boolean;
}