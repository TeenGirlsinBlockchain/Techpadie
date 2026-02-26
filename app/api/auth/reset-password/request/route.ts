
import { NextRequest } from 'next/server';
import { resetPasswordRequestSchema } from '@/app/server/validators/auth.validator';
import { requestPasswordReset } from '@/app/server/services/auth.service';
import { success, errorResponse } from '@/app/lib/api-response';
import { enforceRateLimit, LOGIN_LIMIT } from '@/app/lib/rate-limit';
import { getRequestMeta } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const meta = getRequestMeta(request);
    const body = await request.json();
    const input = resetPasswordRequestSchema.parse(body);

    // Rate limit by email
    await enforceRateLimit(input.email, LOGIN_LIMIT);

    await requestPasswordReset(input.email, meta);

    // Anti-enumeration: always same response
    return success({
      message: 'If the account exists, a reset code has been sent to your email',
    });
  } catch (error) {
    return errorResponse(error);
  }
}