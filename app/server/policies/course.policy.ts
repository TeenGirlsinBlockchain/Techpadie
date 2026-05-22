import { SessionUser } from '@/app/lib/auth';
import { ForbiddenError } from '@/app/lib/api-error';
import { UserRole } from '@prisma/client';

/**
 * Asserts that the user is allowed to create courses (must be CREATOR or ADMIN).
 */
export function assertCanCreateCourse(user: SessionUser): void {
  if (user.role !== UserRole.CREATOR && user.role !== UserRole.ADMIN) {
    throw new ForbiddenError('Only creators and administrators can create courses');
  }
}

/**
 * Asserts that the user is the creator of the course or an administrator.
 */
export function assertCanModifyCourse(
  user: SessionUser,
  course: { creatorId: string }
): void {
  if (user.id !== course.creatorId && user.role !== UserRole.ADMIN) {
    throw new ForbiddenError('You do not have permission to modify this course');
  }
}

/**
 * Checks if the user is the creator of the course or an administrator.
 */
export function canModifyCourse(
  user: SessionUser,
  course: { creatorId: string }
): boolean {
  return user.id === course.creatorId || user.role === UserRole.ADMIN;
}
