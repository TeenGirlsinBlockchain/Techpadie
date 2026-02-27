
import { NextRequest } from 'next/server';
import { withAuth } from '@/app/middleware/with-auth';
import { claimReward } from '@/app/server/services/reward.service';
import { rewardRepo } from '@/app/server/repositories/reward.repo';
import { success, created, errorResponse } from '@/app/lib/api-response';
import { getRequestMeta } from '@/app/lib/auth';

/**
 * POST /api/rewards/[courseId]/claim
 * Body: { walletAddress?: "0x..." }
 * IDEMPOTENT: Returns existing reward if already claimed.
 */
export const POST = withAuth(async (request, { user, params }) => {
  try {
    const meta = getRequestMeta(request);
    const body = await request.json().catch(() => ({}));
    const walletAddress = (body as { walletAddress?: string }).walletAddress;

    const result = await claimReward(user.id, params!.courseId, walletAddress, meta);

    if (result.alreadyClaimed) {
      return success({
        message: 'Reward already claimed',
        reward: result.reward,
      });
    }

    return created({
      message: 'Reward claimed! Token transfer has been queued.',
      reward: result.reward,
    });
  } catch (error) {
    return errorResponse(error);
  }
});