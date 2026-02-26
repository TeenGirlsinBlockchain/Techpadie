
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { rejectCourse } from '@/app/server/services/admin.service';
import { reviewActionSchema } from '@/app/server/validators/course.validator';
import { success, errorResponse } from '@/app/lib/api-response';
import { getRequestMeta } from '@/app/lib/auth';
import { BadRequestError } from '@/app/lib/api-error';

/**
 * POST /api/admin/courses/[courseId]/reject
 * Body: { reason: "..." }
 */
export const POST = withRole('ADMIN')(async (request, { user, params }) => {
  try {
    const body = await request.json();
    const input = reviewActionSchema.parse(body);

    if (!input.reason) {
      throw new BadRequestError('Rejection reason is required');
    }

    const meta = getRequestMeta(request);
    const course = await rejectCourse(params!.courseId, user.id, input.reason, meta);

    return success({
      message: 'Course rejected',
      course,
    });
  } catch (error) {
    return errorResponse(error);
  }
});