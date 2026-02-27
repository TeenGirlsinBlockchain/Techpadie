import { NextRequest } from 'next/server';
import { withAuth } from '@/app/middleware/with-auth';
import { generatedContentRepo } from '@/app/server/repositories/generated-content.repo';
import { enrollmentRepo } from '@/app/server/repositories/enrollment.repo';
import { success, errorResponse } from '@/app/lib/api-response';
import { ForbiddenError } from '@/app/lib/api-error';
import type { Language } from '@prisma/client';

/**
 * GET /api/courses/[courseId]/lessons/[lessonId]/generated?language=EN
 * Returns all READY generated content (quiz, flashcards, summary) for the lesson.
 */
export const GET = withAuth(async (request, { user, params }) => {
  try {
    // Check enrollment
    const enrollment = await enrollmentRepo.findByUserAndCourse(
      user.id,
      params!.courseId
    );
    if (!enrollment) {
      throw new ForbiddenError('You must be enrolled to access this content');
    }

    const url = new URL(request.url);
    const language = (
      url.searchParams.get('language')?.toUpperCase() || enrollment.language
    ) as Language;

    const content = await generatedContentRepo.findAllForLesson(
      params!.lessonId,
      language
    );

    // Group by type for easy frontend consumption
    const quiz = content.find((c: { type: string; }) => c.type === 'QUIZ');
    const flashcards = content.find((c: { type: string; }) => c.type === 'FLASHCARDS');
    const summary = content.find((c: { type: string; }) => c.type === 'SUMMARY');

    return success({
      quiz: quiz ? { status: quiz.status, data: quiz.data } : null,
      flashcards: flashcards
        ? { status: flashcards.status, data: flashcards.data }
        : null,
      summary: summary
        ? { status: summary.status, data: summary.data }
        : null,
      language,
    });
  } catch (error) {
    return errorResponse(error);
  }
});