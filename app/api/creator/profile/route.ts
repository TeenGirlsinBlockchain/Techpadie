
import { NextRequest } from 'next/server';
import { withAuth } from '@/app/middleware/with-auth';
import { creatorProfileSchema } from '@/app/server/validators/course.validator';
import {
  applyAsCreator,
  updateCreatorProfile,
  getCreatorProfile,
} from '@/app/server/services/creator.service';
import { success, created, errorResponse } from '@/app/lib/api-response';
import { getRequestMeta } from '@/app/lib/auth';

/**
 * GET /api/creator/profile — View own creator profile
 */
export const GET = withAuth(async (_request, { user }) => {
  try {
    const profile = await getCreatorProfile(user.id);
    return success({ profile });
  } catch (error) {
    return errorResponse(error);
  }
});

/**
 * POST /api/creator/profile — Apply to become a creator
 */
export const POST = withAuth(async (request, { user }) => {
  try {
    const meta = getRequestMeta(request);
    const body = await request.json();
    const input = creatorProfileSchema.parse(body);

    const profile = await applyAsCreator(user.id, input, meta);

    return created({
      message: 'Creator application submitted successfully',
      profile,
    });
  } catch (error) {
    return errorResponse(error);
  }
});

/**
 * PUT /api/creator/profile — Update creator profile
 */
export const PUT = withAuth(async (request, { user }) => {
  try {
    const body = await request.json();
    const input = creatorProfileSchema.parse(body);

    const profile = await updateCreatorProfile(user.id, input);

    return success({
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    return errorResponse(error);
  }
});