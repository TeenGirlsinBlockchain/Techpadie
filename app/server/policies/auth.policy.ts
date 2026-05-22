import { SessionUser } from '@/app/lib/auth';
import { ForbiddenError } from '@/app/lib/api-error';
import { UserRole } from '@prisma/client';

/**
 * Asserts that the authenticated user is the owner of the resource.
 */
export function assertOwner(user: SessionUser, resourceUserId: string): void {
  if (user.id !== resourceUserId) {
    throw new ForbiddenError('You are not authorized to access this resource');
  }
}

/**
 * Asserts that the authenticated user is either the owner of the resource or an administrator.
 */
export function assertOwnerOrAdmin(user: SessionUser, resourceUserId: string): void {
  if (user.id !== resourceUserId && user.role !== UserRole.ADMIN) {
    throw new ForbiddenError('You do not have permission to access or modify this resource');
  }
}

/**
 * Returns true if the user is the owner of the resource.
 */
export function isOwner(user: SessionUser, resourceUserId: string): boolean {
  return user.id === resourceUserId;
}

/**
 * Returns true if the user is either the owner or an administrator.
 */
export function isOwnerOrAdmin(user: SessionUser, resourceUserId: string): boolean {
  return user.id === resourceUserId || user.role === UserRole.ADMIN;
}
