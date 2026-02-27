import { NextRequest } from 'next/server';
import { withAuth } from '@/app/middleware/with-auth';
import { progressUpdateSchema } from '@/app/server/validators/quiz.validator';
import { updateLessonProgress } from '@/app/server/services/progress.service';
import { success, errorResponse } from '@/app/lib/api-response';
import { getRequestMeta } from '@/app/lib/auth';

/**
 * PUT /api/courses/[courseId]/lessons/[lessonId]/progress
 * Body: { isCompleted?: boolean, audioPositionSecs?: number }
 */
export const PUT = withAuth(async (request, { user, params }) => {
  try {
    const meta = getRequestMeta(request);
    const body = await request.json();
    const input = progressUpdateSchema.parse(body);

    const progress = await updateLessonProgress(
      user.id,
      params!.lessonId,
      input,
      meta
    );

    return success({ progress });
  } catch (error) {
    return errorResponse(error);
  }
});