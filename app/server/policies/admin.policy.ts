import { SessionUser } from '@/app/lib/auth';
import { ForbiddenError } from '@/app/lib/api-error';
import { UserRole } from '@prisma/client';

/**
 * Asserts that the authenticated user is an administrator.
 * Throws a ForbiddenError if not.
 */
export function assertAdmin(user: SessionUser): void {
  if (user.role !== UserRole.ADMIN) {
    throw new ForbiddenError('Only administrators are authorized to perform this action');
  }
}

/**
 * Returns true if the user is an administrator.
 */
export function isAdmin(user: SessionUser): boolean {
  return user.role === UserRole.ADMIN;
}
