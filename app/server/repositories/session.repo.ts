import { db } from '@/app/lib/db';

// ─── OTP Codes ──────────────────────────────────────────────────

export const otpRepo = {
  /**
   * Create a new OTP code entry.
   * Invalidates any existing unused OTPs for the same user+purpose first.
   */
  async create(data: {
    userId: string;
    codeHash: string;
    purpose: string;
    expiresAt: Date;
  }) {
    // Invalidate old unused OTPs for this user+purpose
    await db.otpCode.updateMany({
      where: {
        userId: data.userId,
        purpose: data.purpose,
        usedAt: null,
      },
      data: {
        usedAt: new Date(), // Mark as used so they can't be reused
      },
    });

    return db.otpCode.create({ data });
  },

  /**
   * Find the latest valid (unused, unexpired) OTP for a user+purpose.
   */
  async findLatestValid(userId: string, purpose: string) {
    return db.otpCode.findFirst({
      where: {
        userId,
        purpose,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Increment attempt count. Returns updated record.
   */
  async incrementAttempts(otpId: string) {
    return db.otpCode.update({
      where: { id: otpId },
      data: { attempts: { increment: 1 } },
    });
  },

  /**
   * Mark OTP as used.
   */
  async markUsed(otpId: string) {
    return db.otpCode.update({
      where: { id: otpId },
      data: { usedAt: new Date() },
    });
  },

  /**
   * Delete expired OTPs (cleanup).
   */
  async cleanExpired(): Promise<number> {
    const result = await db.otpCode.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return result.count;
  },
};

// ─── Sessions ───────────────────────────────────────────────────

export const sessionRepo = {
  async findByToken(token: string) {
    return db.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            role: true,
            isActive: true,
          },
        },
      },
    });
  },

  async deleteByToken(token: string) {
    return db.session.deleteMany({ where: { token } });
  },

  async deleteAllForUser(userId: string) {
    return db.session.deleteMany({ where: { userId } });
  },

  async cleanExpired(): Promise<number> {
    const result = await db.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return result.count;
  },
};