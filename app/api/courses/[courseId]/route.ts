
import { NextRequest } from 'next/server';
import { courseRepo } from '@/app/server/repositories/course.repo';
import { success, errorResponse } from '@/app/lib/api-response';
import { NotFoundError } from '@/app/lib/api-error';

/**
 * GET /api/courses/[courseId]
 * Public — returns published course with full structure.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const course = await courseRepo.findById(courseId);

    if (!course || course.status !== 'PUBLISHED') {
      throw new NotFoundError('Course not found');
    }

    return success({ course });
  } catch (error) {
    return errorResponse(error);
  }
}