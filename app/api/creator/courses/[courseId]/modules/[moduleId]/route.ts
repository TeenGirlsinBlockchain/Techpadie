
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { updateModuleSchema } from '@/app/server/validators/course.validator';
import { updateModule, deleteModule } from '@/app/server/services/course.service';
import { courseRepo } from '@/app/server/repositories/course.repo';
import { success, noContent, errorResponse } from '@/app/lib/api-response';
import { NotFoundError } from '@/app/lib/api-error';

/**
 * GET /api/creator/courses/[courseId]/modules/[moduleId]
 */
export const GET = withRole('CREATOR', 'ADMIN')(async (_request, { user, params }) => {
  try {
    const mod = await courseRepo.findModule(params!.moduleId);
    if (!mod) throw new NotFoundError('Module not found');

    return success({ module: mod });
  } catch (error) {
    return errorResponse(error);
  }
});

/**
 * PUT /api/creator/courses/[courseId]/modules/[moduleId]
 */
export const PUT = withRole('CREATOR', 'ADMIN')(async (request, { user, params }) => {
  try {
    const body = await request.json();
    const input = updateModuleSchema.parse(body);

    const mod = await updateModule(params!.moduleId, user.id, input);

    return success({
      message: 'Module updated successfully',
      module: mod,
    });
  } catch (error) {
    return errorResponse(error);
  }
});

/**
 * DELETE /api/creator/courses/[courseId]/modules/[moduleId]
 */
export const DELETE = withRole('CREATOR', 'ADMIN')(async (_request, { user, params }) => {
  try {
    await deleteModule(params!.moduleId, user.id);
    return noContent();
  } catch (error) {
    return errorResponse(error);
  }
});