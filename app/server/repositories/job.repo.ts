
import { db } from '@/app/lib/db';
import type { JobType, JobStatus } from '@prisma/client';

const LOCK_TIMEOUT_MINUTES = parseInt(
  process.env.JOB_LOCK_TIMEOUT_MINUTES || '10',
  10
);

export const jobRepo = {
  /**
   * Enqueue a new job.
   */
  async enqueue(
    type: JobType,
    payload: Record<string, unknown>,
    options?: { maxAttempts?: number; scheduledAt?: Date }
  ) {
    return db.job.create({
      data: {
        type,
        payload,
        maxAttempts: options?.maxAttempts || 3,
        scheduledAt: options?.scheduledAt || new Date(),
      },
    });
  },

  /**
   * Dequeue the next available job using row locking.
   * Uses raw SQL: FOR UPDATE SKIP LOCKED to prevent double-processing.
   *
   * Returns null if no jobs available.
   */
  async dequeue(workerId: string): Promise<string | null> {
    const now = new Date();
    const lockExpiry = new Date(
      now.getTime() - LOCK_TIMEOUT_MINUTES * 60 * 1000
    );

    // Use raw SQL for FOR UPDATE SKIP LOCKED (Prisma doesn't support this natively)
    const result = await db.$queryRaw<{ id: string }[]>`
      UPDATE jobs
      SET
        status = 'PROCESSING',
        locked_at = ${now},
        locked_by = ${workerId},
        started_at = COALESCE(started_at, ${now}),
        attempts = attempts + 1
      WHERE id = (
        SELECT id FROM jobs
        WHERE
          (status = 'QUEUED' AND scheduled_at <= ${now})
          OR
          (status = 'PROCESSING' AND locked_at < ${lockExpiry})
        ORDER BY scheduled_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING id
    `;

    return result.length > 0 ? result[0].id : null;
  },

  /**
   * Get a job by ID (for the worker to read payload).
   */
  async findById(jobId: string) {
    return db.job.findUnique({ where: { id: jobId } });
  },

  /**
   * Mark job as completed.
   */
  async complete(jobId: string) {
    return db.job.update({
      where: { id: jobId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        lockedAt: null,
        lockedBy: null,
      },
    });
  },

  /**
   * Mark job as failed. If attempts < maxAttempts, reset to QUEUED for retry.
   * If attempts >= maxAttempts, mark as DEAD.
   */
  async fail(jobId: string, error: string) {
    const job = await db.job.findUnique({ where: { id: jobId } });
    if (!job) return;

    const isDead = job.attempts >= job.maxAttempts;

    return db.job.update({
      where: { id: jobId },
      data: {
        status: isDead ? 'DEAD' : 'QUEUED',
        lastError: error,
        lockedAt: null,
        lockedBy: null,
        // If retrying, delay by exponential backoff: 30s, 60s, 120s...
        ...(!isDead && {
          scheduledAt: new Date(
            Date.now() + Math.pow(2, job.attempts) * 30 * 1000
          ),
        }),
      },
    });
  },

  /**
   * Get jobs by status (for monitoring/admin).
   */
  async findByStatus(
    status: JobStatus,
    pagination: { skip: number; take: number }
  ) {
    const [items, total] = await Promise.all([
      db.job.findMany({
        where: { status },
        orderBy: { createdAt: 'desc' },
        ...pagination,
      }),
      db.job.count({ where: { status } }),
    ]);
    return { items, total };
  },

  /**
   * Count jobs by status (for health check / dashboard).
   */
  async countByStatus() {
    const results = await db.$queryRaw<{ status: string; count: bigint }[]>`
      SELECT status, COUNT(*) as count FROM jobs GROUP BY status
    `;

    return results.reduce(
      (acc, row) => {
        acc[row.status] = Number(row.count);
        return acc;
      },
      {} as Record<string, number>
    );
  },

  /**
   * Clean up old completed/dead jobs (older than 30 days).
   */
  async cleanOld(olderThanDays = 30): Promise<number> {
    const cutoff = new Date(
      Date.now() - olderThanDays * 24 * 60 * 60 * 1000
    );

    const result = await db.job.deleteMany({
      where: {
        status: { in: ['COMPLETED', 'DEAD'] },
        createdAt: { lt: cutoff },
      },
    });
    return result.count;
  },
};