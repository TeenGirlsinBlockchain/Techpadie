
import { creatorRepo } from '@/app/server/repositories/creator.repo';
import { courseRepo } from '@/app/server/repositories/course.repo';
import { userRepo } from '@/app/server/repositories/user.repo';
import { auditRepo } from '@/app/server/repositories/audit.repo';
import { jobRepo } from '@/app/server/repositories/job.repo';
import { NotFoundError, BadRequestError } from '@/app/lib/api-error';
import {
  sendCreatorApprovedEmail,
  sendCreatorRejectedEmail,
} from '@/app/lib/email';
import { logger } from '@/app/lib/logger';
import type { Language } from '@prisma/client';

// ─── Creator Review ─────────────────────────────────────────────

export async function approveCreator(
  profileId: string,
  adminUserId: string,
  meta: { ipAddress: string; userAgent: string }
) {
  const profile = await creatorRepo.findById(profileId);
  if (!profile) throw new NotFoundError('Creator profile not found');
  if (profile.status !== 'PENDING') {
    throw new BadRequestError(`Cannot approve a creator with status: ${profile.status}`);
  }

  // Update profile status
  const updated = await creatorRepo.updateStatus(
    profileId,
    'APPROVED',
    adminUserId
  );

  // Upgrade user role to CREATOR
  await userRepo.updateRole(profile.userId, 'CREATOR');

  await auditRepo.log({
    userId: adminUserId,
    action: 'CREATOR_APPROVED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    metadata: {
      creatorProfileId: profileId,
      creatorUserId: profile.userId,
    },
  });

  // Send approval email (fire-and-forget)
  sendCreatorApprovedEmail(
    profile.user.email,
    profile.user.displayName
  ).catch((err) => {
    logger.error('Creator approval email failed', err instanceof Error ? err : new Error(String(err)));
  });

  return updated;
}

export async function rejectCreator(
  profileId: string,
  adminUserId: string,
  reason: string,
  meta: { ipAddress: string; userAgent: string }
) {
  const profile = await creatorRepo.findById(profileId);
  if (!profile) throw new NotFoundError('Creator profile not found');
  if (profile.status !== 'PENDING') {
    throw new BadRequestError(`Cannot reject a creator with status: ${profile.status}`);
  }

  const updated = await creatorRepo.updateStatus(
    profileId,
    'REJECTED',
    adminUserId,
    reason
  );

  await auditRepo.log({
    userId: adminUserId,
    action: 'CREATOR_REJECTED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    metadata: {
      creatorProfileId: profileId,
      creatorUserId: profile.userId,
      reason,
    },
  });

  // Send rejection email
  sendCreatorRejectedEmail(
    profile.user.email,
    profile.user.displayName,
    reason
  ).catch((err) => {
    logger.error('Creator rejection email failed', err instanceof Error ? err : new Error(String(err)));
  });

  return updated;
}

export async function listPendingCreators(pagination: { skip: number; take: number }) {
  return creatorRepo.findManyByStatus('PENDING', pagination);
}

// ─── Course Review ──────────────────────────────────────────────

/**
 * Approve a course → status PUBLISHED → enqueue AI generation + audio jobs
 * for every lesson in every available language.
 */
export async function approveCourse(
  courseId: string,
  adminUserId: string,
  meta: { ipAddress: string; userAgent: string }
) {
  const course = await courseRepo.findById(courseId);
  if (!course) throw new NotFoundError('Course not found');
  if (course.status !== 'PENDING_REVIEW') {
    throw new BadRequestError(`Cannot approve a course with status: ${course.status}`);
  }

  // Publish
  const updated = await courseRepo.updateStatus(courseId, 'PUBLISHED', {
    publishedAt: new Date(),
  });

  await auditRepo.log({
    userId: adminUserId,
    action: 'COURSE_APPROVED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    metadata: { courseId },
  });

  // Enqueue AI generation + audio jobs for all lessons × languages
  await enqueueGenerationJobs(course);

  return updated;
}

export async function rejectCourse(
  courseId: string,
  adminUserId: string,
  reason: string,
  meta: { ipAddress: string; userAgent: string }
) {
  const course = await courseRepo.findById(courseId);
  if (!course) throw new NotFoundError('Course not found');
  if (course.status !== 'PENDING_REVIEW') {
    throw new BadRequestError(`Cannot reject a course with status: ${course.status}`);
  }

  const updated = await courseRepo.updateStatus(courseId, 'REJECTED', {
    rejectionReason: reason,
  });

  await auditRepo.log({
    userId: adminUserId,
    action: 'COURSE_REJECTED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    metadata: { courseId, reason },
  });

  return updated;
}

export async function listPendingCourses(pagination: { skip: number; take: number }) {
  return courseRepo.findByStatus('PENDING_REVIEW', pagination);
}

// ─── Job Enqueueing (triggered on course approval) ──────────────

/**
 * For each lesson in the course, for each available language translation,
 * enqueue: GENERATE_QUIZ, GENERATE_FLASHCARDS, GENERATE_SUMMARY, GENERATE_AUDIO.
 *
 * This is the critical path where background jobs get created.
 */
async function enqueueGenerationJobs(course: Awaited<ReturnType<typeof courseRepo.findById>>) {
  if (!course) return;

  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      for (const translation of lesson.translations) {
        const basePayload = {
          courseId: course.id,
          lessonId: lesson.id,
          language: translation.language as Language,
          contentHash: translation.contentHash,
        };

        // Enqueue AI content generation jobs
        await jobRepo.enqueue('GENERATE_QUIZ', basePayload);
        await jobRepo.enqueue('GENERATE_FLASHCARDS', basePayload);
        await jobRepo.enqueue('GENERATE_SUMMARY', basePayload);

        // Enqueue audio generation job
        await jobRepo.enqueue('GENERATE_AUDIO', basePayload);
      }
    }
  }

  logger.info('Generation jobs enqueued', {
    courseId: course.id,
    moduleCount: course.modules.length,
  });
}