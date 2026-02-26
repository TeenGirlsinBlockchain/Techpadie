
import { NextRequest } from 'next/server';
import { enforceRateLimit, type RateLimitConfig } from '@/app/lib/rate-limit';
import { errorResponse } from '@/app/lib/api-response';

type Handler = (
  request: NextRequest,
  context?: unknown
) => Promise<Response>;

/**
 * Wraps a route handler with rate limiting.
 * Extracts the identifier from the request (IP or custom extractor).
 *
 * Usage:
 *   export const POST = withRateLimit(LOGIN_LIMIT, getEmailFromBody)(handler);
 *
 * Or with IP-based limiting:
 *   export const GET = withRateLimit(API_LIMIT)(handler);
 */
export function withRateLimit(
  config: RateLimitConfig,
  /** Custom identifier extractor. Defaults to IP address. */
  getIdentifier?: (request: NextRequest) => Promise<string> | string
) {
  return (handler: Handler) => {
    return async (
      request: NextRequest,
      routeContext?: unknown
    ): Promise<Response> => {
      try {
        const identifier = getIdentifier
          ? await getIdentifier(request)
          : request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown';

        await enforceRateLimit(identifier, config);

        return await handler(request, routeContext);
      } catch (error) {
        return errorResponse(error);
      }
    };
  };
}