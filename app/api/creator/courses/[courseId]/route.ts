import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { updateCourseSchema } from '@/app/server/validators/course.validator';
import { getCourse, updateCourse, deleteCourse } from '@/app/server/services/course.service';
import { success, noContent, errorResponse } from '@/app/lib/api-response';

/**
 * GET /api/creator/courses/[courseId]
 */
export const GET = withRole('CREATOR', 'ADMIN')(async (_request, { user, params }) => {
  try {
    const course = await getCourse(params!.courseId);
    return success({ course });
  } catch (error) {
    return errorResponse(error);
  }
});

/**
 * PUT /api/creator/courses/[courseId]
 */
export const PUT = withRole('CREATOR', 'ADMIN')(async (request, { user, params }) => {
  try {
    const body = await request.json();
    const input = updateCourseSchema.parse(body);

    const course = await updateCourse(params!.courseId, user.id, input);

    return success({
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    return errorResponse(error);
  }
});

/**
 * DELETE /api/creator/courses/[courseId]
 */
export const DELETE = withRole('CREATOR', 'ADMIN')(async (_request, { user, params }) => {
  try {
    await deleteCourse(params!.courseId, user.id);
    return noContent();
  } catch (error) {
    return errorResponse(error);
  }
});