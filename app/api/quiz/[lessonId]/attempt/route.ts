import { NextRequest } from 'next/server';
import { withAuth } from '@/app/middleware/with-auth';
import { submitQuizSchema } from '@/app/server/validators/quiz.validator';
import { submitQuizAttempt, getQuizAttempts } from '@/app/server/services/quiz.service';
import { success, created, errorResponse } from '@/app/lib/api-response';
import { getRequestMeta } from '@/app/lib/auth';
import type { Language } from '@prisma/client';

/**
 * POST /api/quiz/[lessonId]/attempt
 * Body: { language: "EN", answers: [{ questionId, selectedOptionId }] }
 */
export const POST = withAuth(async (request, { user, params }) => {
  try {
    const meta = getRequestMeta(request);
    const body = await request.json();
    const input = submitQuizSchema.parse(body);

    const result = await submitQuizAttempt(
      user.id,
      params!.lessonId,
      input.language as Language,
      input.answers,
      meta
    );

    return created({
      message: result.passed ? 'Quiz passed!' : 'Quiz not passed. Try again!',
      ...result,
    });
  } catch (error) {
    return errorResponse(error);
  }
});

/**
 * GET /api/quiz/[lessonId]/attempt
 * Returns quiz attempt history for the current user.
 */
export const GET = withAuth(async (_request, { user, params }) => {
  try {
    const attempts = await getQuizAttempts(user.id, params!.lessonId);
    return success({ attempts });
  } catch (error) {
    return errorResponse(error);
  }
});