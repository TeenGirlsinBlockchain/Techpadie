
import { db } from '@/app/lib/db';

export const progressRepo = {
  async findByUserAndLesson(userId: string, lessonId: string) {
    return db.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });
  },

  /**
   * Upsert lesson progress. Uses conflict handling on (userId, lessonId).
   */
  async upsert(
    userId: string,
    lessonId: string,
    data: {
      isCompleted?: boolean;
      audioPositionSecs?: number;
    }
  ) {
    const now = new Date();

    return db.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        isCompleted: data.isCompleted || false,
        completedAt: data.isCompleted ? now : null,
        audioPositionSecs: data.audioPositionSecs || 0,
        lastAccessedAt: now,
      },
      update: {
        ...(data.isCompleted !== undefined && {
          isCompleted: data.isCompleted,
          completedAt: data.isCompleted ? now : undefined,
        }),
        ...(data.audioPositionSecs !== undefined && {
          audioPositionSecs: data.audioPositionSecs,
        }),
        lastAccessedAt: now,
      },
    });
  },

  /**
   * Get all lesson progress for a user within a course.
   * Joins through lesson → module → course.
   */
  async findByCourseAndUser(userId: string, courseId: string) {
    return db.lessonProgress.findMany({
      where: {
        userId,
        lesson: {
          module: { courseId },
        },
      },
      include: {
        lesson: {
          select: { id: true, moduleId: true, sortOrder: true },
        },
      },
    });
  },

  /**
   * Count completed lessons for a user in a course.
   */
  async countCompletedInCourse(userId: string, courseId: string) {
    return db.lessonProgress.count({
      where: {
        userId,
        isCompleted: true,
        lesson: {
          module: { courseId },
        },
      },
    });
  },

  /**
   * Count total lessons in a course.
   */
  async countTotalLessonsInCourse(courseId: string) {
    return db.lesson.count({
      where: { module: { courseId } },
    });
  },
};