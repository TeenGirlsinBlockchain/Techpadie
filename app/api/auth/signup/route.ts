import { NextRequest } from 'next/server';
import { signupSchema } from '@/app/server/validators/auth.validator';
import { signup } from '@/app/server/services/auth.service';
import { created, errorResponse } from '@/app/lib/api-response';
import { enforceRateLimit, API_LIMIT } from '@/app/lib/rate-limit';
import { getRequestMeta } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const meta = getRequestMeta(request);

    // Rate limit by IP
    await enforceRateLimit(meta.ipAddress, API_LIMIT);

    // Parse and validate body
    const body = await request.json();
    const input = signupSchema.parse(body);

    // Create user
    const user = await signup(input, meta);

    return created({
      message: 'Account created successfully',
      user,
    });
  } catch (error) {
    return errorResponse(error);
  }
}