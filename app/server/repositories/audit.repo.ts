import { db } from '@/app/lib/db';
import { logger } from '@/app/lib/logger';
import type { AuditAction } from '@prisma/client';

interface AuditEntry {
  userId?: string;
  action: AuditAction;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export const auditRepo = {
  /**
   * Write an audit log entry. Fire-and-forget — never throws.
   * Failures are logged but don't break the calling operation.
   */
  async log(entry: AuditEntry): Promise<void> {
    try {
      await db.auditLog.create({
        data: {
          userId: entry.userId || null,
          action: entry.action,
          metadata: entry.metadata || null,
          ipAddress: entry.ipAddress || null,
          userAgent: entry.userAgent || null,
        },
      });
    } catch (err) {
      // Audit logging should never break the main flow
      logger.error(
        'Audit log write failed',
        err instanceof Error ? err : new Error(String(err)),
        { action: entry.action, userId: entry.userId }
      );
    }
  },

  /**
   * Query audit logs (admin use).
   */
  async findMany(filters: {
    userId?: string;
    action?: AuditAction;
    limit?: number;
    offset?: number;
  }) {
    return db.auditLog.findMany({
      where: {
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.action && { action: filters.action }),
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0,
    });
  },
};