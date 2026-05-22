import { db } from '@/app/lib/db';
import { jobRepo } from '@/app/server/repositories/job.repo';
import { NotFoundError, BadRequestError } from '@/app/lib/api-error';
import { JobType, JobStatus } from '@prisma/client';

/**
 * Enqueues a new background job.
 */
export async function enqueueJob(
  type: JobType,
  payload: Record<string, unknown>,
  options?: { maxAttempts?: number; scheduledAt?: Date }
) {
  return jobRepo.enqueue(type, payload, options);
}

/**
 * Retrieves a job's details and current status.
 */
export async function getJobStatus(jobId: string) {
  const job = await jobRepo.findById(jobId);
  if (!job) {
    throw new NotFoundError('Job not found');
  }
  return {
    id: job.id,
    type: job.type,
    status: job.status,
    attempts: job.attempts,
    maxAttempts: job.maxAttempts,
    lastError: job.lastError,
    scheduledAt: job.scheduledAt,
    startedAt: job.startedAt,
    completedAt: job.completedAt,
    createdAt: job.createdAt,
  };
}

/**
 * Lists jobs filtered by status with pagination.
 */
export async function getJobsByStatus(
  status: JobStatus,
  skip = 0,
  take = 10
) {
  return jobRepo.findByStatus(status, { skip, take });
}

/**
 * Gathers aggregate count statistics for the job queue.
 */
export async function getJobQueueMetrics() {
  const counts = await jobRepo.countByStatus();
  return {
    QUEUED: counts.QUEUED || 0,
    PROCESSING: counts.PROCESSING || 0,
    COMPLETED: counts.COMPLETED || 0,
    FAILED: counts.FAILED || 0,
    DEAD: counts.DEAD || 0,
  };
}

/**
 * Cancels a job if it is still in the queue.
 */
export async function cancelJob(jobId: string): Promise<void> {
  const job = await db.job.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new NotFoundError('Job not found');
  }

  if (job.status !== JobStatus.QUEUED) {
    throw new BadRequestError(`Cannot cancel a job in ${job.status} status`);
  }

  await db.job.delete({ where: { id: jobId } });
}

/**
 * Manually clean old finished/dead jobs.
 */
export async function cleanCompletedAndDeadJobs(olderThanDays = 30): Promise<number> {
  return jobRepo.cleanOld(olderThanDays);
}
