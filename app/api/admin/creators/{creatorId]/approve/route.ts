
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { approveCreator } from '@/app/server/services/admin.service';
import { success, errorResponse } from '@/app/lib/api-response';
import { getRequestMeta } from '@/app/lib/auth';

/**
 * POST /api/admin/creators/[creatorId]/approve
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

    const meta = getRequestMeta(request);
    const profile = await approveCreator(creatorId, user.id, meta);

    return success({
      message: 'Creator approved successfully',
      profile,
    });
  } catch (error) {
    return errorResponse(error);
  }
});