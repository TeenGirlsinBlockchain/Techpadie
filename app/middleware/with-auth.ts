import { NextRequest } from 'next/server';
import { requireAuth, type SessionUser } from '@/app/lib/auth';
import { errorResponse } from '@/app/lib/api-response';

type AuthHandler = (
  request: NextRequest,
  context: { user: SessionUser; params?: Record<string, string> }
) => Promise<Response>;

/**
 * Wraps a route handler to require authentication.
 * Injects the authenticated user into the handler context.
 *
 * Usage:
 *   export const GET = withAuth(async (req, { user }) => {
 *     // user is guaranteed to be authenticated
 *     return success({ userId: user.id });
 *   });
 */
export function withAuth(handler: AuthHandler) {
  return async (
    request: NextRequest,
    routeContext?: { params?: Promise<Record<string, string>> }
  ): Promise<Response> => {
    try {
      const user = await requireAuth();
      const params = routeContext?.params ? await routeContext.params : undefined;
      return await handler(request, { user, params });
    } catch (error) {
      return errorResponse(error);
    }
  };
}