
import { progressRepo } from '@/app/server/repositories/progress.repo';
import { enrollmentRepo } from '@/app/server/repositories/enrollment.repo';
import { auditRepo } from '@/app/server/repositories/audit.repo';
import { NotFoundError } from '@/app/lib/api-error';

/**
 * Update lesson progress (completion state and/or audio position).
 * Creates the record if it doesn't exist (upsert).
 */
export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  data: {
    isCompleted?: boolean;
    audioPositionSecs?: number;
  },
  meta: { ipAddress: string; userAgent: string }
) {
  const progress = await progressRepo.upsert(userId, lessonId, data);

  // Audit only on first completion
  if (data.isCompleted && progress.isCompleted) {
    await auditRepo.log({
      userId,
      action: 'LESSON_COMPLETED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      metadata: { lessonId },
    });

    // Check if all lessons in the course are now complete
    await checkAndMarkCourseComplete(userId, lessonId);
  }

  return progress;
}

/**
 * If all lessons in a course are completed, mark the enrollment as complete.
 */
async function checkAndMarkCourseComplete(userId: string, lessonId: string) {
  // Get the courseId through the lesson chain
  const { db } = await import('@/app/lib/db');

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: { module: { select: { courseId: true } } },
  });

  if (!lesson) return;

  const courseId = lesson.module.courseId;

  const [completed, total] = await Promise.all([
    progressRepo.countCompletedInCourse(userId, courseId),
    progressRepo.countTotalLessonsInCourse(courseId),
  ]);

  if (completed >= total && total > 0) {
    const enrollment = await enrollmentRepo.findByUserAndCourse(userId, courseId);
    if (enrollment && !enrollment.completedAt) {
      await enrollmentRepo.markCompleted(userId, courseId);
    }
  }
}

/**
 * Get progress for a specific lesson.
 */
export async function getLessonProgress(userId: string, lessonId: string) {
  return progressRepo.findByUserAndLesson(userId, lessonId);
}