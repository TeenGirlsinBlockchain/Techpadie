
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { updateLessonSchema } from '@/app/server/validators/course.validator';
import { updateLesson, deleteLesson } from '@/app/server/services/course.service';
import { courseRepo } from '@/app/server/repositories/course.repo';
import { success, noContent, errorResponse } from '@/app/lib/api-response';
import { NotFoundError } from '@/app/lib/api-error';

/**
 * GET /api/creator/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]
 */
export const GET = withRole('CREATOR', 'ADMIN')(async (_request, { user, params }) => {
  try {
    const lesson = await courseRepo.findLesson(params!.lessonId);
    if (!lesson) throw new NotFoundError('Lesson not found');

    return success({ lesson });
  } catch (error) {
    return errorResponse(error);
  }
});

/**
 * PUT /api/creator/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]
 */
export const PUT = withRole('CREATOR', 'ADMIN')(async (request, { user, params }) => {
  try {
    const body = await request.json();
    const input = updateLessonSchema.parse(body);

    const lesson = await updateLesson(params!.lessonId, user.id, input);

    return success({
      message: 'Lesson updated successfully',
      lesson,
    });
  } catch (error) {
    return errorResponse(error);
  }
});

/**
 * DELETE /api/creator/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]
 */
export const DELETE = withRole('CREATOR', 'ADMIN')(async (_request, { user, params }) => {
  try {
    await deleteLesson(params!.lessonId, user.id);
    return noContent();
  } catch (error) {
    return errorResponse(error);
  }
});