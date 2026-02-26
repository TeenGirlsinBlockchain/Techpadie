
import { NextRequest } from 'next/server';
import { requireAuth, getRequestMeta } from '@/app/lib/auth';
import { logout } from '@/app/server/services/auth.service';
import { success, errorResponse } from '@/app/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const meta = getRequestMeta(request);

    await logout(user.id, meta);

    return success({ message: 'Logged out successfully' });
  } catch (error) {
    return errorResponse(error);
  }
}