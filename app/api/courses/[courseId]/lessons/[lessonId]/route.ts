import { NextRequest } from 'next/server';
import { withAuth } from '@/app/middleware/with-auth';
import { courseRepo } from '@/app/server/repositories/course.repo';
import { enrollmentRepo } from '@/app/server/repositories/enrollment.repo';
import { progressRepo } from '@/app/server/repositories/progress.repo';
import { success, errorResponse } from '@/app/lib/api-response';
import { NotFoundError, ForbiddenError } from '@/app/lib/api-error';

/**
 * GET /api/courses/[courseId]/lessons/[lessonId]?language=EN
 * Returns lesson content + student progress for enrolled users.
 */
export const GET = withAuth(async (request, { user, params }) => {
  try {
    const courseId = params!.courseId;
    const lessonId = params!.lessonId;

    // Check enrollment
    const enrollment = await enrollmentRepo.findByUserAndCourse(user.id, courseId);
    if (!enrollment) {
      throw new ForbiddenError('You must be enrolled to access this lesson');
    }

    // Get lesson with translations
    const lesson = await courseRepo.findLesson(lessonId);
    if (!lesson) throw new NotFoundError('Lesson not found');

    // Get preferred language (from query or enrollment)
    const url = new URL(request.url);
    const requestedLang = url.searchParams.get('language')?.toUpperCase();
    const language = requestedLang || enrollment.language;

    // Find translation for requested language, fallback to any available
    const translation =
      lesson.translations.find((t: { language: any; }) => t.language === language) ||
      lesson.translations[0];

    if (!translation) {
      throw new NotFoundError('No content available for this lesson');
    }

    // Get student progress
    const progress = await progressRepo.findByUserAndLesson(user.id, lessonId);

    return success({
      lesson: {
        id: lesson.id,
        moduleId: lesson.moduleId,
        sortOrder: lesson.sortOrder,
        duration: lesson.duration,
        title: translation.title,
        content: translation.content,
        language: translation.language,
        availableLanguages: lesson.translations.map((t: { language: any; }) => t.language),
      },
      progress: progress || {
        isCompleted: false,
        audioPositionSecs: 0,
        lastAccessedAt: null,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
});