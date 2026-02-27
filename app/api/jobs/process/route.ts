
import { NextRequest } from 'next/server';
import { processBatch } from '@/app/server/services/worker.service';
import { success, errorResponse } from '@/app/lib/api-response';
import { UnauthorizedError } from '@/app/lib/api-error';

const CRON_SECRET = process.env.SESSION_SECRET; // Reuse as cron auth

/**
 * POST /api/jobs/process
 * Trigger background job processing.
 *
 * Protected by a secret header — call from:
 * - Vercel Cron Jobs (vercel.json: { "crons": [{ "path": "/api/jobs/process", ... }] })
 * - External cron service (curl -X POST -H "x-cron-secret: ...")
 * - Or internally via setInterval in a long-running worker
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const secret = request.headers.get('x-cron-secret');
    if (secret !== CRON_SECRET) {
      throw new UnauthorizedError('Invalid cron secret');
    }

    const maxJobs = parseInt(
      new URL(request.url).searchParams.get('max') || '10',
      10
    );

    const result = await processBatch(Math.min(maxJobs, 50));

    return success({
      message: `Processed ${result.processed} jobs`,
      ...result,
    });
  } catch (error) {
    return errorResponse(error);
  }
}