import { enrollmentRepo } from '@/app/server/repositories/enrollment.repo';
import { courseRepo } from '@/app/server/repositories/course.repo';
import { progressRepo } from '@/app/server/repositories/progress.repo';
import { auditRepo } from '@/app/server/repositories/audit.repo';
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from '@/app/lib/api-error';
import type { Language } from '@prisma/client';

export async function enrollInCourse(
  userId: string,
  courseId: string,
  language: Language,
  meta: { ipAddress: string; userAgent: string }
) {
  // Verify course exists and is published
  const course = await courseRepo.findById(courseId);
  if (!course) throw new NotFoundError('Course not found');
  if (course.status !== 'PUBLISHED') {
    throw new BadRequestError('This course is not available for enrollment');
  }

  // Check if already enrolled
  const existing = await enrollmentRepo.findByUserAndCourse(userId, courseId);
  if (existing) {
    throw new ConflictError('You are already enrolled in this course');
  }

  // Verify requested language translation exists
  const hasTranslation = course.translations.some(
    (t: { language: any; }) => t.language === language
  );
  if (!hasTranslation) {
    throw new BadRequestError(
      `This course is not available in ${language}. Available: ${course.translations.map((t: { language: any; }) => t.language).join(', ')}`
    );
  }

  const enrollment = await enrollmentRepo.create(userId, courseId, language);

  await auditRepo.log({
    userId,
    action: 'ENROLLMENT_CREATED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    metadata: { courseId, language },
  });

  return enrollment;
}

/**
 * Get course progress summary for a student.
 */
export async function getCourseProgress(userId: string, courseId: string) {
  const enrollment = await enrollmentRepo.findByUserAndCourse(userId, courseId);
  if (!enrollment) throw new NotFoundError('Not enrolled in this course');

  const [completedLessons, totalLessons, lessonProgress] = await Promise.all([
    progressRepo.countCompletedInCourse(userId, courseId),
    progressRepo.countTotalLessonsInCourse(courseId),
    progressRepo.findByCourseAndUser(userId, courseId),
  ]);

  const progressPercentage =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

  return {
    enrollment,
    completedLessons,
    totalLessons,
    progressPercentage,
    lessonProgress,
    isComplete: completedLessons === totalLessons && totalLessons > 0,
  };
}