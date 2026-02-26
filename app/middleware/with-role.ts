
import { NextRequest } from 'next/server';
import { requireRole, type SessionUser } from '@/app/lib/auth';
import { errorResponse } from '@/app/lib/api-response';
import type { UserRole } from '@prisma/client';

type RoleHandler = (
  request: NextRequest,
  context: { user: SessionUser; params?: Record<string, string> }
) => Promise<Response>;

/**
 * Wraps a route handler to require authentication + specific role(s).
 *
 * Usage:
 *   export const GET = withRole('ADMIN')(async (req, { user }) => {
 *     // user is guaranteed to be ADMIN
 *   });
 *
 *   export const POST = withRole('ADMIN', 'CREATOR')(async (req, { user }) => {
 *     // user is ADMIN or CREATOR
 *   });
 */
export function withRole(...roles: UserRole[]) {
  return (handler: RoleHandler) => {
    return async (
      request: NextRequest,
      routeContext?: { params?: Promise<Record<string, string>> }
    ): Promise<Response> => {
      try {
        const user = await requireRole(...roles);
        const params = routeContext?.params
          ? await routeContext.params
          : undefined;
        return await handler(request, { user, params });
      } catch (error) {
        return errorResponse(error);
      }
    };
  };
}