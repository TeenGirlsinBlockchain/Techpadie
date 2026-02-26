export interface AudioPlayerState {
  isPlaying: boolean;
  isVisible: boolean;
  isMinimized: boolean;
  currentLessonId: string | null;
  currentCourseId: string | null;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  audioUrl: string | null;
  lessonTitle: string;
  courseTitle: string;
}

export type AudioAction =
  | { type: 'PLAY'; payload: AudioTrack }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'SEEK'; payload: number }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'MINIMIZE' }
  | { type: 'MAXIMIZE' };

export interface AudioTrack {
  lessonId: string;
  courseId: string;
  audioUrl: string;
  lessonTitle: string;
  courseTitle: string;
  startTime?: number;
}

export interface AudioProgress {
  lessonId: string;
  courseId: string;
  lastTimestamp: number;
  completed: boolean;
  completedAt?: string;
}