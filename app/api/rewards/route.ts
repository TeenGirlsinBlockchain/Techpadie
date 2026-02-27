
import { NextRequest } from 'next/server';
import { withAuth } from '@/app/middleware/with-auth';
import { rewardRepo } from '@/app/server/repositories/reward.repo';
import { success, errorResponse } from '@/app/lib/api-response';

/**
 * GET /api/rewards
 * Returns all token ledger entries for the current user.
 */
export const GET = withAuth(async (_request, { user }) => {
  try {
    const rewards = await rewardRepo.findByUser(user.id);
    return success({ rewards });
  } catch (error) {
    return errorResponse(error);
  }
});