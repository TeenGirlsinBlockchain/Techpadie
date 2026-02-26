
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { createCourseSchema } from '@/app/server/validators/course.validator';
import { paginationSchema, paginate, paginatedResult } from '@/app/server/validators/common.validators';
import { createCourse, listCreatorCourses } from '@/app/server/services/course.service';
import { success, created, errorResponse } from '@/app/lib/api-response';
import { getRequestMeta } from '@/app/lib/auth';

/**
 * GET /api/creator/courses?page=1&limit=20
 */
export const GET = withRole('CREATOR', 'ADMIN')(async (request, { user }) => {
  try {
    const url = new URL(request.url);
    const input = paginationSchema.parse({
      page: url.searchParams.get('page'),
      limit: url.searchParams.get('limit'),
    });

    const { items, total } = await listCreatorCourses(user.id, paginate(input));

    return success(paginatedResult(items, total, input));
  } catch (error) {
    return errorResponse(error);
  }
});

/**
 * POST /api/creator/courses
 */
export const POST = withRole('CREATOR', 'ADMIN')(async (request, { user }) => {
  try {
    const meta = getRequestMeta(request);
    const body = await request.json();
    const input = createCourseSchema.parse(body);

    const course = await createCourse(user.id, input, meta);

    return created({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    return errorResponse(error);
  }
});