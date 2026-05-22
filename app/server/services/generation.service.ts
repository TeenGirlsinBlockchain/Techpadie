import { db } from '@/app/lib/db';
import { generatedContentRepo } from '@/app/server/repositories/generated-content.repo';
import { jobRepo } from '@/app/server/repositories/job.repo';
import { Language, GeneratedContentType, JobType } from '@prisma/client';
import { BadRequestError } from '@/app/lib/api-error';

/**
 * Maps GeneratedContentType to corresponding JobType.
 */
function getJobTypeForContent(type: GeneratedContentType): JobType {
  switch (type) {
    case 'QUIZ':
      return JobType.GENERATE_QUIZ;
    case 'FLASHCARDS':
      return JobType.GENERATE_FLASHCARDS;
    case 'SUMMARY':
      return JobType.GENERATE_SUMMARY;
    default:
      throw new BadRequestError(`Unsupported content type: ${type}`);
  }
}

/**
 * Idempotently fetches or creates a generated content record, and enqueues a background job if needed.
 */
export async function getGeneratedContent(
  lessonId: string,
  language: Language,
  type: GeneratedContentType,
  contentHash: string
) {
  const record = await generatedContentRepo.findOrCreate({
    lessonId,
    language,
    type,
    contentHash,
  });

  if (record.status === 'QUEUED') {
    const jobType = getJobTypeForContent(type);

    // Check if there is an active job in flight for this exact payload
    const activeJobs = await db.job.findMany({
      where: {
        type: jobType,
        status: { in: ['QUEUED', 'PROCESSING'] },
      },
    });

    const jobInFlight = activeJobs.some((job) => {
      const p = job.payload as Record<string, unknown> | null;
      return (
        p &&
        p.lessonId === lessonId &&
        p.language === language &&
        p.contentHash === contentHash
      );
    });

    if (!jobInFlight) {
      await jobRepo.enqueue(jobType, {
        lessonId,
        language,
        contentHash,
      });
    }
  }

  return record;
}

/**
 * Returns all ready generated content for a lesson.
 */
export async function getLessonContentReady(lessonId: string, language: Language) {
  return generatedContentRepo.findAllForLesson(lessonId, language);
}

/**
 * Forces triggering of content generation for a specific type.
 */
export async function triggerContentGeneration(
  lessonId: string,
  language: Language,
  type: GeneratedContentType,
  contentHash: string
) {
  const record = await generatedContentRepo.findOrCreate({
    lessonId,
    language,
    type,
    contentHash,
  });

  // Reset status to QUEUED if it was failed or ready (to allow regeneration)
  if (record.status === 'FAILED' || record.status === 'READY') {
    await generatedContentRepo.updateStatus(record.id, 'QUEUED', undefined, '');
  }

  const jobType = getJobTypeForContent(type);

  // Ensure active job is enqueued
  const activeJobs = await db.job.findMany({
    where: {
      type: jobType,
      status: { in: ['QUEUED', 'PROCESSING'] },
    },
  });

  const jobInFlight = activeJobs.some((job) => {
    const p = job.payload as Record<string, unknown> | null;
    return (
      p &&
      p.lessonId === lessonId &&
      p.language === language &&
      p.contentHash === contentHash
    );
  });

  if (!jobInFlight) {
    await jobRepo.enqueue(jobType, {
      lessonId,
      language,
      contentHash,
    });
  }

  return generatedContentRepo.findOrCreate({
    lessonId,
    language,
    type,
    contentHash,
  });
}
