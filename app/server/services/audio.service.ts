import { db } from '@/app/lib/db';
import { audioRepo } from '@/app/server/repositories/audio.repo';
import { jobRepo } from '@/app/server/repositories/job.repo';
import { Language, AudioStatus } from '@prisma/client';
import { NotFoundError } from '@/app/lib/api-error';

/**
 * Retrieves the latest ready audio asset for a given lesson and language.
 */
export async function getLessonAudio(lessonId: string, language: Language) {
  return audioRepo.findLatestReady(lessonId, language);
}

/**
 * Checks or triggers text-to-speech audio generation for a specific lesson content version.
 * Idempotently enqueues a background GENERATE_AUDIO job if one is not already pending/processing.
 */
export async function getAudioStatus(
  lessonId: string,
  language: Language,
  contentHash: string
) {
  const asset = await audioRepo.findOrCreate({
    lessonId,
    language,
    contentHash,
  });

  if (asset.status === 'QUEUED') {
    // Check if there is an active job in flight for this exact payload
    const activeJobs = await db.job.findMany({
      where: {
        type: 'GENERATE_AUDIO',
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
      await jobRepo.enqueue('GENERATE_AUDIO', {
        lessonId,
        language,
        contentHash,
      });
    }
  }

  return asset;
}

/**
 * Force trigger/re-request audio generation for a lesson content version.
 */
export async function triggerAudioGeneration(
  lessonId: string,
  language: Language,
  contentHash: string
) {
  const asset = await audioRepo.findOrCreate({
    lessonId,
    language,
    contentHash,
  });

  // If failed or ready but we want to regenerate, reset status to QUEUED
  if (asset.status === 'FAILED' || asset.status === 'READY') {
    await audioRepo.updateStatus(asset.id, 'QUEUED', { errorMsg: '' });
  }

  // Ensure active job is enqueued
  const activeJobs = await db.job.findMany({
    where: {
      type: 'GENERATE_AUDIO',
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
    await jobRepo.enqueue('GENERATE_AUDIO', {
      lessonId,
      language,
      contentHash,
    });
  }

  return audioRepo.findOrCreate({ lessonId, language, contentHash });
}
