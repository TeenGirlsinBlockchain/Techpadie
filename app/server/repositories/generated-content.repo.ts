import { db } from '@/app/lib/db';
import type { Language, GeneratedContentType, GeneratedContentStatus } from '@prisma/client';

export const generatedContentRepo = {
  /**
   * Get the latest READY generated content for a lesson+language+type.
   * Returns null if nothing is ready yet (still queued/generating).
   */
  async findLatestReady(
    lessonId: string,
    language: Language,
    type: GeneratedContentType
  ) {
    return db.generatedContent.findFirst({
      where: {
        lessonId,
        language,
        type,
        status: 'READY',
      },
      orderBy: { version: 'desc' },
    });
  },

  /**
   * Get all generated content for a lesson+language (all types).
   * Used by the student endpoint to return quiz + flashcards + summary together.
   */
  async findAllForLesson(lessonId: string, language: Language) {
    return db.generatedContent.findMany({
      where: {
        lessonId,
        language,
        status: 'READY',
      },
      orderBy: { version: 'desc' },
    });
  },

  /**
   * Find or create a generated content record.
   * Used by the generation service to avoid duplicate records.
   */
  async findOrCreate(data: {
    lessonId: string;
    language: Language;
    type: GeneratedContentType;
    contentHash: string;
  }) {
    const existing = await db.generatedContent.findUnique({
      where: {
        lessonId_language_type_contentHash: {
          lessonId: data.lessonId,
          language: data.language,
          type: data.type,
          contentHash: data.contentHash,
        },
      },
    });

    if (existing) return existing;

    // Get next version number
    const latest = await db.generatedContent.findFirst({
      where: {
        lessonId: data.lessonId,
        language: data.language,
        type: data.type,
      },
      orderBy: { version: 'desc' },
    });

    return db.generatedContent.create({
      data: {
        lessonId: data.lessonId,
        language: data.language,
        type: data.type,
        contentHash: data.contentHash,
        version: (latest?.version || 0) + 1,
        status: 'QUEUED',
      },
    });
  },

  /**
   * Update status and data for a generated content record.
   */
  async updateStatus(
    id: string,
    status: GeneratedContentStatus,
    data?: unknown,
    errorMsg?: string
  ) {
    return db.generatedContent.update({
      where: { id },
      data: {
        status,
        ...(data !== undefined && { data: data as object }),
        ...(errorMsg !== undefined && { errorMsg }),
      },
    });
  },
};