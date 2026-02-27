
import { db } from '@/app/lib/db';

export const rewardRepo = {
  async findRewardConfig(courseId: string) {
    return db.rewardConfig.findUnique({ where: { courseId } });
  },

  async findLedgerEntry(userId: string, courseId: string) {
    return db.tokenLedger.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
  },

  /**
   * Create a ledger entry (idempotent — unique on userId+courseId).
   * Returns existing entry if already claimed.
   */
  async createLedgerEntry(data: {
    userId: string;
    courseId: string;
    amount: number;
    tokenSymbol: string;
    chainNetwork: string;
    walletAddress?: string;
  }) {
    // Check existing first (idempotent)
    const existing = await db.tokenLedger.findUnique({
      where: { userId_courseId: { userId: data.userId, courseId: data.courseId } },
    });
    if (existing) return { entry: existing, alreadyClaimed: true };

    const entry = await db.tokenLedger.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        amount: data.amount,
        tokenSymbol: data.tokenSymbol,
        chainNetwork: data.chainNetwork,
        walletAddress: data.walletAddress || null,
        status: 'pending',
      },
    });

    return { entry, alreadyClaimed: false };
  },

  async updateLedgerStatus(
    id: string,
    status: string,
    extra?: { txHash?: string; errorMsg?: string; completedAt?: Date }
  ) {
    return db.tokenLedger.update({
      where: { id },
      data: {
        status,
        ...(extra?.txHash && { txHash: extra.txHash }),
        ...(extra?.errorMsg !== undefined && { errorMsg: extra.errorMsg }),
        ...(extra?.completedAt && { completedAt: extra.completedAt }),
      },
    });
  },

  async findByUser(userId: string) {
    return db.tokenLedger.findMany({
      where: { userId },
      include: {
        course: {
          include: { translations: { take: 1 } },
        },
      },
      orderBy: { claimedAt: 'desc' },
    });
  },
};