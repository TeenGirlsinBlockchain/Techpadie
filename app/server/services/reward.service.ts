import { rewardRepo } from '@/app/server/repositories/reward.repo';
import { enrollmentRepo } from '@/app/server/repositories/enrollment.repo';
import { progressRepo } from '@/app/server/repositories/progress.repo';
import { quizRepo } from '@/app/server/repositories/quiz.repo';
import { jobRepo } from '@/app/server/repositories/job.repo';
import { auditRepo } from '@/app/server/repositories/audit.repo';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '@/app/lib/api-error';

/**
 * Claim reward for completing a course.
 * IDEMPOTENT: If already claimed, returns existing entry (no error).
 *
 * Eligibility:
 * 1. Must be enrolled
 * 2. All lessons must be completed
 * 3. Must have passed quiz threshold (per course config)
 * 4. Reward config must be active
 */
export async function claimReward(
  userId: string,
  courseId: string,
  walletAddress: string | undefined,
  meta: { ipAddress: string; userAgent: string }
) {
  // 1. Check enrollment
  const enrollment = await enrollmentRepo.findByUserAndCourse(userId, courseId);
  if (!enrollment) {
    throw new ForbiddenError('You are not enrolled in this course');
  }

  // 2. Check reward config exists and is active
  const config = await rewardRepo.findRewardConfig(courseId);
  if (!config || !config.isActive) {
    throw new NotFoundError('No active reward configured for this course');
  }

  // 3. Check all lessons completed
  const [completedCount, totalCount] = await Promise.all([
    progressRepo.countCompletedInCourse(userId, courseId),
    progressRepo.countTotalLessonsInCourse(courseId),
  ]);

  if (totalCount === 0) {
    throw new BadRequestError('This course has no lessons');
  }

  if (completedCount < totalCount) {
    throw new BadRequestError(
      `You must complete all lessons first. Progress: ${completedCount}/${totalCount}`
    );
  }

  // 4. Check quiz pass threshold
  const { averageScore } = await quizRepo.getBestScoreForCourse(userId, courseId);
  const hasPassedAll = await quizRepo.hasPassedAllLessons(userId, courseId);

  if (!hasPassedAll) {
    throw new BadRequestError(
      'You must pass all lesson quizzes before claiming rewards'
    );
  }

  if (averageScore < config.quizPassThreshold) {
    throw new BadRequestError(
      `Average quiz score (${averageScore.toFixed(1)}%) is below the required threshold (${config.quizPassThreshold}%)`
    );
  }

  // 5. Create ledger entry (idempotent)
  const { entry, alreadyClaimed } = await rewardRepo.createLedgerEntry({
    userId,
    courseId,
    amount: config.tokensAmount,
    tokenSymbol: config.tokenSymbol,
    chainNetwork: config.chainNetwork,
    walletAddress,
  });

  if (alreadyClaimed) {
    // Already claimed — return existing (idempotent, no error)
    return { reward: entry, alreadyClaimed: true };
  }

  // 6. Enqueue token transfer job
  await jobRepo.enqueue('TRANSFER_TOKENS', {
    ledgerEntryId: entry.id,
    userId,
    courseId,
    amount: config.tokensAmount,
    tokenSymbol: config.tokenSymbol,
    walletAddress,
  });

  // 7. Enqueue certificate generation job
  await jobRepo.enqueue('GENERATE_CERTIFICATE', {
    userId,
    courseId,
    quizScore: averageScore,
  });

  await auditRepo.log({
    userId,
    action: 'REWARD_CLAIMED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    metadata: {
      courseId,
      amount: config.tokensAmount,
      tokenSymbol: config.tokenSymbol,
    },
  });

  return { reward: entry, alreadyClaimed: false };
}