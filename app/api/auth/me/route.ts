import { NextRequest } from 'next/server';
import { requireAuth } from '@/app/lib/auth';
import { getUserProfile } from '@/app/server/services/user.service';
import { success, errorResponse } from '@/app/lib/api-response';

export async function GET(_request: NextRequest) {
  try {
    const sessionUser = await requireAuth();
    const profile = await getUserProfile(sessionUser.id);

    return success({ user: profile });
  } catch (error) {
    return errorResponse(error);
  }
}