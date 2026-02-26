import { NextRequest } from 'next/server';
import { verifyOtpSchema } from '@/app/server/validators/auth.validator';
import { loginStep2 } from '@/app/server/services/auth.service';
import { success, errorResponse } from '@/app/lib/api-response';
import { enforceRateLimit, OTP_LIMIT } from '@/app/lib/rate-limit';
import { getRequestMeta } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const meta = getRequestMeta(request);
    const body = await request.json();
    const input = verifyOtpSchema.parse(body);

    // Rate limit OTP verification per email
    await enforceRateLimit(input.email, OTP_LIMIT);

    const result = await loginStep2(input, meta);

    return success({
      message: 'Login successful',
      user: result.user,
    });
  } catch (error) {
    return errorResponse(error);
  }
}