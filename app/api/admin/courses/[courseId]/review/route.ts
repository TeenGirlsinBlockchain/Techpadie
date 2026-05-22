import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { approveCourse, rejectCourse } from '@/app/server/services/admin.service';
import { reviewCourseSchema } from '@/app/server/validators/admin.validator';
import { success, errorResponse } from '@/app/lib/api-response';
import { getRequestMeta } from '@/app/lib/auth';
import { CourseStatus } from '@prisma/client';

/**
 * POST /api/admin/courses/[courseId]/review
 * Body: { status: "PUBLISHED" | "REJECTED", rejectionReason?: "..." }
 */
export const POST = withRole('ADMIN')(async (request, { user, params }) => {
  try {
    const courseId = params?.courseId;
    if (!courseId) {
      return Response.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const input = reviewCourseSchema.parse(body);
    const meta = getRequestMeta(request);

    let course;
    if (input.status === CourseStatus.PUBLISHED) {
      course = await approveCourse(courseId, user.id, meta);
    } else {
      course = await rejectCourse(courseId, user.id, input.rejectionReason || '', meta);
    }

    return success({
      message: `Course status updated to ${input.status}`,
      course,
    });
  } catch (error) {
    return errorResponse(error);
  }
});
