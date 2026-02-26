
import { NextRequest } from 'next/server';
import { resetPasswordConfirmSchema } from '@/app/server/validators/auth.validator';
import { confirmPasswordReset } from '@/app/server/services/auth.service';
import { success, errorResponse } from '@/app/lib/api-response';
import { enforceRateLimit, OTP_LIMIT } from '@/app/lib/rate-limit';
import { getRequestMeta } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const meta = getRequestMeta(request);
    const body = await request.json();
    const input = resetPasswordConfirmSchema.parse(body);

    // Rate limit OTP verification
    await enforceRateLimit(input.email, OTP_LIMIT);

    await confirmPasswordReset(input, meta);

    return success({
      message: 'Password reset successful. Please log in with your new password.',
    });
  } catch (error) {
    return errorResponse(error);
  }
}