
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { createLessonSchema } from '@/app/server/validators/course.validator';
import { createLesson } from '@/app/server/services/course.service';
import { courseRepo } from '@/app/server/repositories/course.repo';
import { success, created, errorResponse } from '@/app/lib/api-response';
import { NotFoundError } from '@/app/lib/api-error';

/**
 * GET /api/creator/courses/[courseId]/modules/[moduleId]/lessons
 */
export const GET = withRole('CREATOR', 'ADMIN')(async (_request, { user, params }) => {
  try {
    const mod = await courseRepo.findModule(params!.moduleId);
    if (!mod) throw new NotFoundError('Module not found');

    return success({ lessons: mod.lessons });
  } catch (error) {
    return errorResponse(error);
  }
});

/**
 * POST /api/creator/courses/[courseId]/modules/[moduleId]/lessons
 */
export const POST = withRole('CREATOR', 'ADMIN')(async (request, { user, params }) => {
  try {
    const body = await request.json();
    const input = createLessonSchema.parse(body);

    const lesson = await createLesson(params!.moduleId, user.id, input);

    return created({
      message: 'Lesson created successfully',
      lesson,
    });
  } catch (error) {
    return errorResponse(error);
  }
});