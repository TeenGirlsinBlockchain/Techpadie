
import { db } from '@/app/lib/db';
import { NotFoundError } from '@/app/lib/api-error';

/**
 * Get a user's full profile.
 * Includes creator profile if the user is a creator.
 * Never exposes passwordHash.
 */
export async function getUserProfile(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      isActive: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      creatorProfile: {
        select: {
          id: true,
          bio: true,
          expertise: true,
          website: true,
          socialLinks: true,
          status: true,
          rejectionReason: true,
          reviewedAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Attach enrollment + certificate counts for students
  const [enrollmentCount, certificateCount] = await Promise.all([
    db.enrollment.count({ where: { userId } }),
    db.certificate.count({ where: { userId } }),
  ]);

  return {
    ...user,
    stats: {
      enrolledCourses: enrollmentCount,
      certificates: certificateCount,
    },
  };
}