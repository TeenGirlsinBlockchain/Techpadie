import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { getCreatorStats } from '@/app/server/services/analytics.service';
import { success, errorResponse } from '@/app/lib/api-response';

/**
 * GET /api/creator/courses/analytics
 * Returns aggregate stats for all courses created by the authenticated creator.
 */
export const GET = withRole('CREATOR', 'ADMIN')(async (_request, { user }) => {
  try {
    const stats = await getCreatorStats(user.id);
    return success(stats);
  } catch (error) {
    return errorResponse(error);
  }
});
