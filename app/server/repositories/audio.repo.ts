import { db } from '@/app/lib/db';
import type { Language, AudioStatus } from '@prisma/client';

export const audioRepo = {
  /**
   * Get the latest READY audio asset for a lesson+language.
   */
  async findLatestReady(lessonId: string, language: Language) {
    return db.audioAsset.findFirst({
      where: {
        lessonId,
        language,
        status: 'READY',
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Find or create an audio asset record.
   */
  async findOrCreate(data: {
    lessonId: string;
    language: Language;
    contentHash: string;
  }) {
    const existing = await db.audioAsset.findUnique({
      where: {
        lessonId_language_contentHash: {
          lessonId: data.lessonId,
          language: data.language,
          contentHash: data.contentHash,
        },
      },
    });

    if (existing) return existing;

    return db.audioAsset.create({
      data: {
        lessonId: data.lessonId,
        language: data.language,
        contentHash: data.contentHash,
        status: 'QUEUED',
      },
    });
  },

  /**
   * Update status, URL, and duration.
   */
  async updateStatus(
    id: string,
    status: AudioStatus,
    extra?: { url?: string; durationSecs?: number; errorMsg?: string }
  ) {
    return db.audioAsset.update({
      where: { id },
      data: {
        status,
        ...(extra?.url && { url: extra.url }),
        ...(extra?.durationSecs !== undefined && { durationSecs: extra.durationSecs }),
        ...(extra?.errorMsg !== undefined && { errorMsg: extra.errorMsg }),
      },
    });
  },
};