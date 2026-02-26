
import { NextRequest } from 'next/server';
import { loginSchema } from '@/app/server/validators/auth.validator';
import { loginStep1 } from '@/app/server/services/auth.service';
import { success, errorResponse } from '@/app/lib/api-response';
import { enforceRateLimit, LOGIN_LIMIT } from '@/app/lib/rate-limit';
import { getRequestMeta } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const meta = getRequestMeta(request);
    const body = await request.json();
    const input = loginSchema.parse(body);

    // Rate limit by email (prevents brute force on specific accounts)
    await enforceRateLimit(input.email, LOGIN_LIMIT);

    const result = await loginStep1(input, meta);

    // Anti-enumeration: same response whether email exists or not
    return success({
      message: 'If the account exists, a verification code has been sent to your email',
      otpRequired: result.otpRequired,
    });
  } catch (error) {
    return errorResponse(error);
  }
}