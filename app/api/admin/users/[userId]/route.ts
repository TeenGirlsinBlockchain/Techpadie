
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { db } from '@/app/lib/db';
import { success, errorResponse } from '@/app/lib/api-response';
import { NotFoundError } from '@/app/lib/api-error';

/**
 * GET /api/admin/users/[userId]
 * Full user profile with enrollments, certificates, rewards, and sessions.
 */
export const GET = withRole('ADMIN')(async (request, { user: _admin, params }) => {
  try {
    const userId = params!.userId;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        creatorProfile: {
          select: {
            id: true,
            status: true,
            bio: true,
            expertise: true,
            website: true,
            socialLinks: true,
            reviewedAt: true,
            createdAt: true,
          },
        },
        enrollments: {
          select: {
            id: true,
            language: true,
            isCompleted: true,
            completedAt: true,
            createdAt: true,
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                level: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        certificates: {
          select: {
            id: true,
            certificateNo: true,
            verificationUrl: true,
            issuedAt: true,
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
          orderBy: { issuedAt: 'desc' },
          take: 50,
        },
        rewardLedger: {
          select: {
            id: true,
            tokenAmount: true,
            status: true,
            txHash: true,
            createdAt: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        sessions: {
          select: {
            id: true,
            ipAddress: true,
            userAgent: true,
            createdAt: true,
            expiresAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            enrollments: true,
            certificates: true,
            rewardLedger: true,
            sessions: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundError('User not found');

    return success({ user });
  } catch (error) {
    return errorResponse(error);
  }
});