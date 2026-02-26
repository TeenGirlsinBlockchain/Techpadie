
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { listPendingCourses } from '@/app/server/services/admin.service';
import { paginationSchema, paginate, paginatedResult } from '@/app/server/validators/common.validators';
import { success, errorResponse } from '@/app/lib/api-response';

/**
 * GET /api/admin/courses?page=1&limit=20
 */
export const GET = withRole('ADMIN')(async (request, { user: _user }) => {
  try {
    const url = new URL(request.url);
    const input = paginationSchema.parse({
      page: url.searchParams.get('page'),
      limit: url.searchParams.get('limit'),
    });

    const { items, total } = await listPendingCourses(paginate(input));

    return success(paginatedResult(items, total, input));
  } catch (error) {
    return errorResponse(error);
  }
});