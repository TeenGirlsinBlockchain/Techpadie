import { db } from '@/app/lib/db';
import type { Language } from '@prisma/client';

export const quizRepo = {
  async create(data: {
    userId: string;
    lessonId: string;
    language: Language;
    answers: unknown;
    score: number;
    totalQs: number;
    correctQs: number;
    passed: boolean;
  }) {
    return db.quizAttempt.create({
      data: {
        userId: data.userId,
        lessonId: data.lessonId,
        language: data.language,
        answers: data.answers as object,
        score: data.score,
        totalQs: data.totalQs,
        correctQs: data.correctQs,
        passed: data.passed,
      },
    });
  },

  async findByUserAndLesson(userId: string, lessonId: string) {
    return db.quizAttempt.findMany({
      where: { userId, lessonId },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Get best quiz score for a user across all lessons in a course.
   * Used for reward eligibility check.
   */
  async getBestScoreForCourse(userId: string, courseId: string) {
    const result = await db.quizAttempt.aggregate({
      where: {
        userId,
        lesson: { module: { courseId } },
      },
      _avg: { score: true },
      _max: { score: true },
    });
    return {
      averageScore: result._avg.score || 0,
      bestScore: result._max.score || 0,
    };
  },

  /**
   * Check if user has passed at least one quiz per lesson in a course.
   */
  async hasPassedAllLessons(userId: string, courseId: string) {
    // Get all lessons in the course that have quizzes
    const lessonsWithQuiz = await db.lesson.findMany({
      where: {
        module: { courseId },
        generatedContent: {
          some: { type: 'QUIZ', status: 'READY' },
        },
      },
      select: { id: true },
    });

    if (lessonsWithQuiz.length === 0) return true; // No quizzes = auto-pass

    // Check each lesson has at least one passed attempt
    for (const lesson of lessonsWithQuiz) {
      const passed = await db.quizAttempt.findFirst({
        where: {
          userId,
          lessonId: lesson.id,
          passed: true,
        },
      });
      if (!passed) return false;
    }

    return true;
  },
};