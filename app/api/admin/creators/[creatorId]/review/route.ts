import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { approveCreator, rejectCreator } from '@/app/server/services/admin.service';
import { reviewCreatorSchema } from '@/app/server/validators/admin.validator';
import { success, errorResponse } from '@/app/lib/api-response';
import { getRequestMeta } from '@/app/lib/auth';
import { CreatorStatus } from '@prisma/client';

/**
 * POST /api/admin/creators/[creatorId]/review
 * Body: { status: "APPROVED" | "REJECTED", rejectionReason?: "..." }
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
    const input = reviewCreatorSchema.parse(body);
    const meta = getRequestMeta(request);

    let profile;
    if (input.status === CreatorStatus.APPROVED) {
      profile = await approveCreator(creatorId, user.id, meta);
    } else {
      profile = await rejectCreator(creatorId, user.id, input.rejectionReason || '', meta);
    }

    return success({
      message: `Creator status updated to ${input.status}`,
      profile,
    });
  } catch (error) {
    return errorResponse(error);
  }
});
