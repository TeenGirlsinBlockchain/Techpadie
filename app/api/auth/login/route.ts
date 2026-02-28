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

    // Rate limit by email
    await enforceRateLimit(input.email, LOGIN_LIMIT);

    const result = await loginStep1(input, meta);

    // Admin: session created directly, return user
    if (!result.otpRequired && result.user) {
      return success({
        message: 'Login successful',
        otpRequired: false,
        user: result.user,
      });
    }

    // Student/Creator: OTP sent (or anti-enumeration response)
    return success({
      message: 'If the account exists, a verification code has been sent to your email',
      otpRequired: true,
    });
  } catch (error) {
    return errorResponse(error);
  }
}