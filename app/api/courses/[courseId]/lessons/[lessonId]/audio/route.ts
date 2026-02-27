import { NextRequest } from 'next/server';
import { withAuth } from '@/app/middleware/with-auth';
import { audioRepo } from '@/app/server/repositories/audio.repo';
import { enrollmentRepo } from '@/app/server/repositories/enrollment.repo';
import { success, errorResponse } from '@/app/lib/api-response';
import { ForbiddenError, NotFoundError } from '@/app/lib/api-error';
import type { Language } from '@prisma/client';

/**
 * GET /api/courses/[courseId]/lessons/[lessonId]/audio?language=EN
 * Returns the audio URL and metadata for the lesson.
 */
export const GET = withAuth(async (request, { user, params }) => {
  try {
    const enrollment = await enrollmentRepo.findByUserAndCourse(
      user.id,
      params!.courseId
    );
    if (!enrollment) {
      throw new ForbiddenError('You must be enrolled to access audio');
    }

    const url = new URL(request.url);
    const language = (
      url.searchParams.get('language')?.toUpperCase() || enrollment.language
    ) as Language;

    const audio = await audioRepo.findLatestReady(params!.lessonId, language);

    if (!audio) {
      throw new NotFoundError(
        'Audio is not available yet. It may still be generating.'
      );
    }

    return success({
      audio: {
        url: audio.url,
        durationSecs: audio.durationSecs,
        language: audio.language,
        provider: audio.provider,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
});