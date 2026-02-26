
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { createModuleSchema } from '@/app/server/validators/course.validator';
import { createModule, getCourse } from '@/app/server/services/course.service';
import { success, created, errorResponse } from '@/app/lib/api-response';

/**
 * GET /api/creator/courses/[courseId]/modules
 * Returns the course with all modules (modules are included in course detail).
 */
export const GET = withRole('CREATOR', 'ADMIN')(async (_request, { user, params }) => {
  try {
    const course = await getCourse(params!.courseId);
    return success({
      modules: course.modules,
    });
  } catch (error) {
    return errorResponse(error);
  }
});

/**
 * POST /api/creator/courses/[courseId]/modules
 */
export const POST = withRole('CREATOR', 'ADMIN')(async (request, { user, params }) => {
  try {
    const body = await request.json();
    const input = createModuleSchema.parse(body);

    const mod = await createModule(params!.courseId, user.id, input);

    return created({
      message: 'Module created successfully',
      module: mod,
    });
  } catch (error) {
    return errorResponse(error);
  }
});