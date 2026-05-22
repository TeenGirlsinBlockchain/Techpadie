import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { rejectCreator } from '@/app/server/services/admin.service';
import { reviewActionSchema } from '@/app/server/validators/course.validator';
import { success, errorResponse } from '@/app/lib/api-response';
import { getRequestMeta } from '@/app/lib/auth';
import { BadRequestError } from '@/app/lib/api-error';

/**
 * POST /api/admin/creators/[creatorId]/reject
 * Body: { reason: "..." }
 */
export const POST = withRole('ADMIN')(async (request, { user, params }) => {
  try {
    const creatorId = params?.creatorId;
    if (!creatorId) {
      return Response.json(
        { success: false, error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const input = reviewActionSchema.parse(body);

    if (!input.reason) {
      throw new BadRequestError('Rejection reason is required');
    }

    const meta = getRequestMeta(request);
    const profile = await rejectCreator(creatorId, user.id, input.reason, meta);

    return success({
      message: 'Creator rejected',
      profile,
    });
  } catch (error) {
    return errorResponse(error);
  }
});