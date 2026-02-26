
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { approveCourse } from '@/app/server/services/admin.service';
import { success, errorResponse } from '@/app/lib/api-response';
import { getRequestMeta } from '@/app/lib/auth';

/**
 * POST /api/admin/courses/[courseId]/approve
 * Publishes the course and enqueues AI generation + audio jobs.
 */
export const POST = withRole('ADMIN')(async (request, { user, params }) => {
  try {
    const meta = getRequestMeta(request);
    const course = await approveCourse(params!.courseId, user.id, meta);

    return success({
      message: 'Course approved and published. AI generation jobs enqueued.',
      course,
    });
  } catch (error) {
    return errorResponse(error);
  }
});