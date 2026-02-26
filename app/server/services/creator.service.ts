
import { creatorRepo } from '@/app/server/repositories/creator.repo';
import { userRepo } from '@/app/server/repositories/user.repo';
import { auditRepo } from '@/app/server/repositories/audit.repo';
import { ConflictError, BadRequestError, ForbiddenError } from '@/app/lib/api-error';
import type { CreatorProfileInput } from '@/app/server/validators/course.validator';

/**
 * Apply to become a course creator.
 * Creates a creator profile with PENDING status.
 * User role stays STUDENT until admin approves.
 */
export async function applyAsCreator(
  userId: string,
  input: CreatorProfileInput,
  meta: { ipAddress: string; userAgent: string }
) {
  // Check if already has a creator profile
  const existing = await creatorRepo.findByUserId(userId);

  if (existing) {
    if (existing.status === 'APPROVED') {
      throw new ConflictError('You are already an approved creator');
    }
    if (existing.status === 'PENDING') {
      throw new ConflictError('Your creator application is already pending review');
    }
    if (existing.status === 'SUSPENDED') {
      throw new ForbiddenError('Your creator account has been suspended');
    }

    // REJECTED — allow re-application by updating the existing profile
    const updated = await creatorRepo.update(userId, {
      bio: input.bio,
      expertise: input.expertise,
      website: input.website || undefined,
      socialLinks: input.socialLinks,
    });

    // Reset status to PENDING
    await creatorRepo.updateStatus(updated.id, 'PENDING', userId);

    await auditRepo.log({
      userId,
      action: 'CREATOR_APPLIED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      metadata: { reapplication: true },
    });

    return updated;
  }

  // New application
  const profile = await creatorRepo.create({
    userId,
    bio: input.bio,
    expertise: input.expertise,
    website: input.website || undefined,
    socialLinks: input.socialLinks,
  });

  await auditRepo.log({
    userId,
    action: 'CREATOR_APPLIED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return profile;
}

/**
 * Update creator profile (only if user has one).
 */
export async function updateCreatorProfile(
  userId: string,
  input: CreatorProfileInput
) {
  const existing = await creatorRepo.findByUserId(userId);
  if (!existing) {
    throw new BadRequestError('No creator profile found. Apply first.');
  }

  return creatorRepo.update(userId, {
    bio: input.bio,
    expertise: input.expertise,
    website: input.website || undefined,
    socialLinks: input.socialLinks,
  });
}

/**
 * Get creator profile for the current user.
 */
export async function getCreatorProfile(userId: string) {
  const profile = await creatorRepo.findByUserId(userId);
  if (!profile) {
    return null;
  }
  return profile;
}