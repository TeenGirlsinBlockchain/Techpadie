// ─── AI-Generated Learning Content Types ────────────────────────

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LessonGeneratedContent {
  lessonId: string;
  language: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  generatedAt: string;
  version: number;
}

export type LessonTab = 'read' | 'listen' | 'flashcards' | 'quiz';

export interface LessonProgress {
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
  completedAt?: string;
  audioTimestamp?: number;
  quizScore?: number;
  quizAttempts?: number;
  flashcardsReviewed?: number;
  lastAccessedAt: string;
}

export interface TTSState {
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  rate: number;
  voice: SpeechSynthesisVoice | null;
  availableVoices: SpeechSynthesisVoice[];
}
