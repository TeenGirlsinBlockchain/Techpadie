
import { db } from '@/app/lib/db';
import type { CreatorStatus } from '@prisma/client';

// ─── Types ──────────────────────────────────────────────────────

export interface CreateCreatorProfileData {
  userId: string;
  bio?: string;
  expertise?: string[];
  website?: string;
  socialLinks?: Record<string, string>;
}

export interface UpdateCreatorProfileData {
  bio?: string;
  expertise?: string[];
  website?: string;
  socialLinks?: Record<string, string>;
}

// ─── Repository ─────────────────────────────────────────────────

export const creatorRepo = {
  async findByUserId(userId: string) {
    return db.creatorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });
  },

  async findById(id: string) {
    return db.creatorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });
  },

  async create(data: CreateCreatorProfileData) {
    return db.creatorProfile.create({
      data: {
        userId: data.userId,
        bio: data.bio || null,
        expertise: data.expertise || [],
        website: data.website || null,
        socialLinks: data.socialLinks || null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            role: true,
          },
        },
      },
    });
  },

  async update(userId: string, data: UpdateCreatorProfileData) {
    return db.creatorProfile.update({
      where: { userId },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            role: true,
          },
        },
      },
    });
  },

  async updateStatus(
    profileId: string,
    status: CreatorStatus,
    reviewedBy: string,
    rejectionReason?: string
  ) {
    return db.creatorProfile.update({
      where: { id: profileId },
      data: {
        status,
        reviewedBy,
        reviewedAt: new Date(),
        rejectionReason: rejectionReason || null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            role: true,
          },
        },
      },
    });
  },

  async findManyByStatus(
    status: CreatorStatus,
    pagination: { skip: number; take: number }
  ) {
    const [items, total] = await Promise.all([
      db.creatorProfile.findMany({
        where: { status },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              displayName: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        ...pagination,
      }),
      db.creatorProfile.count({ where: { status } }),
    ]);

    return { items, total };
  },
};