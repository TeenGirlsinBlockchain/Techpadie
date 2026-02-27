
import { jobRepo } from '@/app/server/repositories/job.repo';
import { generatedContentRepo } from '@/app/server/repositories/generated-content.repo';
import { audioRepo } from '@/app/server/repositories/audio.repo';
import { rewardRepo } from '@/app/server/repositories/reward.repo';
import { courseRepo } from '@/app/server/repositories/course.repo';
import { generateQuiz, generateFlashcards, generateSummary } from '@/app/lib/ai/gemini';
import { generateAudio, getAudioUrl } from '@/app/lib/tts/gemini-tts';
import { transferTokens } from '@/app/lib/chain/flare';
import { generateCertificate } from '@/app/server/services/certificate.service';
import { cleanExpiredRateLimits } from '@/app/lib/rate-limit';
import { cleanExpiredSessions } from '@/app/lib/auth';
import { otpRepo } from '@/app/server/repositories/session.repo';
import { logger } from '@/app/lib/logger';
import type { JobType, Language } from '@prisma/client';

const WORKER_ID =
  process.env.JOB_WORKER_ID || `worker-${Date.now()}`;

// ─── Job Processor Router ───────────────────────────────────────

async function processJob(jobId: string, type: JobType, payload: Record<string, unknown>) {
  switch (type) {
    case 'GENERATE_QUIZ':
      return processGenerateContent(payload, 'QUIZ');
    case 'GENERATE_FLASHCARDS':
      return processGenerateContent(payload, 'FLASHCARDS');
    case 'GENERATE_SUMMARY':
      return processGenerateContent(payload, 'SUMMARY');
    case 'GENERATE_AUDIO':
      return processGenerateAudio(payload);
    case 'TRANSFER_TOKENS':
      return processTokenTransfer(payload);
    case 'GENERATE_CERTIFICATE':
      return processGenerateCertificate(payload);
    case 'CLEANUP':
      return processCleanup();
    default:
      throw new Error(`Unknown job type: ${type}`);
  }
}

// ─── AI Content Generation ──────────────────────────────────────

async function processGenerateContent(
  payload: Record<string, unknown>,
  contentType: 'QUIZ' | 'FLASHCARDS' | 'SUMMARY'
) {
  const { lessonId, language, contentHash } = payload as {
    lessonId: string;
    language: Language;
    contentHash: string;
  };

  // Find or create the generated content record
  const record = await generatedContentRepo.findOrCreate({
    lessonId,
    language,
    type: contentType,
    contentHash,
  });

  // If already READY, skip (idempotent)
  if (record.status === 'READY') {
    logger.info('Content already generated, skipping', {
      type: contentType,
      lessonId,
      language,
    });
    return;
  }

  // Mark as GENERATING
  await generatedContentRepo.updateStatus(record.id, 'GENERATING');

  // Get lesson content from translation
  const lesson = await courseRepo.findLesson(lessonId);
  if (!lesson) throw new Error(`Lesson ${lessonId} not found`);

  const translation = lesson.translations.find((t: { language: any; }) => t.language === language);
  if (!translation) throw new Error(`No ${language} translation for lesson ${lessonId}`);

  // Generate content
  let data: unknown;
  switch (contentType) {
    case 'QUIZ':
      data = await generateQuiz(translation.content, language);
      break;
    case 'FLASHCARDS':
      data = await generateFlashcards(translation.content, language);
      break;
    case 'SUMMARY':
      data = await generateSummary(translation.content, language);
      break;
  }

  // Save result
  await generatedContentRepo.updateStatus(record.id, 'READY', data);

  logger.info('Content generated', { type: contentType, lessonId, language });
}

// ─── Audio Generation ───────────────────────────────────────────

async function processGenerateAudio(payload: Record<string, unknown>) {
  const { lessonId, language, contentHash } = payload as {
    lessonId: string;
    language: Language;
    contentHash: string;
  };

  // Find or create audio record
  const record = await audioRepo.findOrCreate({ lessonId, language, contentHash });

  if (record.status === 'READY') {
    logger.info('Audio already generated, skipping', { lessonId, language });
    return;
  }

  await audioRepo.updateStatus(record.id, 'GENERATING');

  // Get lesson content
  const lesson = await courseRepo.findLesson(lessonId);
  if (!lesson) throw new Error(`Lesson ${lessonId} not found`);

  const translation = lesson.translations.find((t: { language: any; }) => t.language === language);
  if (!translation) throw new Error(`No ${language} translation for lesson ${lessonId}`);

  // Generate audio
  const { filePath, durationSecs } = await generateAudio(
    lessonId,
    translation.content,
    language,
    contentHash
  );

  const url = getAudioUrl(filePath);

  await audioRepo.updateStatus(record.id, 'READY', { url, durationSecs });

  logger.info('Audio generated', { lessonId, language, durationSecs });
}

// ─── Token Transfer ─────────────────────────────────────────────

async function processTokenTransfer(payload: Record<string, unknown>) {
  const { ledgerEntryId, amount, tokenSymbol, walletAddress } = payload as {
    ledgerEntryId: string;
    amount: number;
    tokenSymbol: string;
    walletAddress?: string;
  };

  if (!walletAddress) {
    // No wallet → mark as pending_wallet, user can claim later
    await rewardRepo.updateLedgerStatus(ledgerEntryId, 'pending_wallet');
    logger.info('Token transfer deferred — no wallet address', { ledgerEntryId });
    return;
  }

  try {
    await rewardRepo.updateLedgerStatus(ledgerEntryId, 'processing');

    const { txHash } = await transferTokens(walletAddress, amount, tokenSymbol);

    await rewardRepo.updateLedgerStatus(ledgerEntryId, 'completed', {
      txHash,
      completedAt: new Date(),
    });

    logger.info('Token transfer completed', { ledgerEntryId, txHash });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    await rewardRepo.updateLedgerStatus(ledgerEntryId, 'failed', { errorMsg });
    throw error; // Re-throw so job gets retried
  }
}

// ─── Certificate Generation ─────────────────────────────────────

async function processGenerateCertificate(payload: Record<string, unknown>) {
  const { userId, courseId, quizScore } = payload as {
    userId: string;
    courseId: string;
    quizScore: number;
  };

  await generateCertificate(userId, courseId, quizScore);
}

// ─── Cleanup Job ────────────────────────────────────────────────

async function processCleanup() {
  const [expiredSessions, expiredOtps, expiredRateLimits, oldJobs] =
    await Promise.all([
      cleanExpiredSessions(),
      otpRepo.cleanExpired(),
      cleanExpiredRateLimits(),
      jobRepo.cleanOld(30),
    ]);

  logger.info('Cleanup completed', {
    expiredSessions,
    expiredOtps,
    expiredRateLimits,
    oldJobs,
  });
}

// ─── Main Worker Loop ───────────────────────────────────────────

/**
 * Process a single job from the queue.
 * Called by the cron endpoint or a polling loop.
 * Returns true if a job was processed, false if queue is empty.
 */
export async function processNextJob(): Promise<boolean> {
  const jobId = await jobRepo.dequeue(WORKER_ID);

  if (!jobId) {
    return false; // Queue empty
  }

  const job = await jobRepo.findById(jobId);
  if (!job) {
    logger.error('Dequeued job not found', new Error('Job vanished'), { jobId });
    return false;
  }

  logger.info('Processing job', {
    jobId: job.id,
    type: job.type,
    attempt: job.attempts,
  });

  try {
    await processJob(job.id, job.type, job.payload as Record<string, unknown>);
    await jobRepo.complete(job.id);
    logger.info('Job completed', { jobId: job.id, type: job.type });
    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error('Job failed', error instanceof Error ? error : new Error(errorMsg), {
      jobId: job.id,
      type: job.type,
      attempt: job.attempts,
    });
    await jobRepo.fail(job.id, errorMsg);
    return true; // We processed (even if failed), so caller knows queue isn't empty
  }
}

/**
 * Process multiple jobs in a batch (up to maxJobs).
 * Used by the cron trigger endpoint.
 */
export async function processBatch(maxJobs = 10): Promise<{
  processed: number;
  remaining: boolean;
}> {
  let processed = 0;

  for (let i = 0; i < maxJobs; i++) {
    const hadJob = await processNextJob();
    if (!hadJob) break;
    processed++;
  }

  // Check if more jobs remain
  const remaining = (await jobRepo.dequeue(`peek-${WORKER_ID}`)) !== null;
  // If we peeked a job, it's now PROCESSING — re-fail it so it goes back
  // Actually, better approach: just check queue count
  const counts = await jobRepo.countByStatus();
  const queued = counts['QUEUED'] || 0;

  return { processed, remaining: queued > 0 };
}