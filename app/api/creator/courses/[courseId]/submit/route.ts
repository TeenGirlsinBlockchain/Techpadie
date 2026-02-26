
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { submitCourseForReview } from '@/app/server/services/course.service';
import { success, errorResponse } from '@/app/lib/api-response';
import { getRequestMeta } from '@/app/lib/auth';

/**
 * POST /api/creator/courses/[courseId]/submit
 * Submits a DRAFT or REJECTED course for admin review.
 */
export const POST = withRole('CREATOR', 'ADMIN')(async (request, { user, params }) => {
  try {
    const meta = getRequestMeta(request);
    const course = await submitCourseForReview(params!.courseId, user.id, meta);

    return success({
      message: 'Course submitted for review',
      course,
    });
  } catch (error) {
    return errorResponse(error);
  }
});