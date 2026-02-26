
import { db } from '@/app/lib/db';
import { hashContent } from '@/app/lib/crypto';
import type { CourseStatus, Language, CourseLevel, CourseCategory } from '@prisma/client';

// ─── Slug Helper ────────────────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

async function uniqueSlug(title: string): Promise<string> {
  let slug = generateSlug(title);
  let counter = 0;

  while (true) {
    const candidate = counter === 0 ? slug : `${slug}-${counter}`;
    const exists = await db.course.findUnique({ where: { slug: candidate } });
    if (!exists) return candidate;
    counter++;
  }
}

// ─── Full Course Include (for detail views) ─────────────────────

const COURSE_FULL_INCLUDE = {
  translations: true,
  modules: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      translations: true,
      lessons: {
        orderBy: { sortOrder: 'asc' as const },
        include: {
          translations: true,
        },
      },
    },
  },
  rewardConfig: true,
  _count: {
    select: { enrollments: true },
  },
} as const;

// ─── Repository ─────────────────────────────────────────────────

export const courseRepo = {
  // ── Create ──────────────────────────────────────────────────

  async create(data: {
    creatorId: string;
    title: string;
    description: string;
    language: Language;
    level: CourseLevel;
    category: CourseCategory;
    thumbnailUrl?: string;
    estimatedHours?: number;
    tags?: string[];
  }) {
    const slug = await uniqueSlug(data.title);

    return db.course.create({
      data: {
        creatorId: data.creatorId,
        slug,
        defaultLanguage: data.language,
        level: data.level,
        category: data.category,
        thumbnailUrl: data.thumbnailUrl || null,
        estimatedHours: data.estimatedHours || null,
        translations: {
          create: {
            language: data.language,
            title: data.title,
            description: data.description,
            tags: data.tags || [],
          },
        },
      },
      include: COURSE_FULL_INCLUDE,
    });
  },

  // ── Find ────────────────────────────────────────────────────

  async findById(courseId: string) {
    return db.course.findUnique({
      where: { id: courseId },
      include: COURSE_FULL_INCLUDE,
    });
  },

  async findBySlug(slug: string) {
    return db.course.findUnique({
      where: { slug },
      include: COURSE_FULL_INCLUDE,
    });
  },

  // ── List (creator's courses) ────────────────────────────────

  async findByCreator(
    creatorId: string,
    pagination: { skip: number; take: number }
  ) {
    const [items, total] = await Promise.all([
      db.course.findMany({
        where: { creatorId },
        include: {
          translations: true,
          _count: { select: { enrollments: true, modules: true } },
        },
        orderBy: { updatedAt: 'desc' },
        ...pagination,
      }),
      db.course.count({ where: { creatorId } }),
    ]);
    return { items, total };
  },

  // ── List (public / browse) ─────────────────────────────────

  async findPublished(options: {
    skip: number;
    take: number;
    category?: CourseCategory;
    level?: CourseLevel;
    language?: Language;
    search?: string;
  }) {
    const where: Record<string, unknown> = { status: 'PUBLISHED' as CourseStatus };

    if (options.category) where.category = options.category;
    if (options.level) where.level = options.level;

    // Search in translations
    if (options.search) {
      where.translations = {
        some: {
          OR: [
            { title: { contains: options.search, mode: 'insensitive' } },
            { description: { contains: options.search, mode: 'insensitive' } },
          ],
          ...(options.language ? { language: options.language } : {}),
        },
      };
    } else if (options.language) {
      where.translations = { some: { language: options.language } };
    }

    const [items, total] = await Promise.all([
      db.course.findMany({
        where,
        include: {
          translations: true,
          _count: { select: { enrollments: true, modules: true } },
        },
        orderBy: { publishedAt: 'desc' },
        skip: options.skip,
        take: options.take,
      }),
      db.course.count({ where }),
    ]);

    return { items, total };
  },

  // ── List (admin: by status) ─────────────────────────────────

  async findByStatus(
    status: CourseStatus,
    pagination: { skip: number; take: number }
  ) {
    const [items, total] = await Promise.all([
      db.course.findMany({
        where: { status },
        include: {
          translations: true,
          _count: { select: { enrollments: true, modules: true } },
        },
        orderBy: { updatedAt: 'desc' },
        ...pagination,
      }),
      db.course.count({ where: { status } }),
    ]);
    return { items, total };
  },

  // ── Update ──────────────────────────────────────────────────

  async update(courseId: string, data: Partial<{
    level: CourseLevel;
    category: CourseCategory;
    thumbnailUrl: string;
    estimatedHours: number;
    status: CourseStatus;
    rejectionReason: string;
    publishedAt: Date;
  }>) {
    return db.course.update({
      where: { id: courseId },
      data,
      include: COURSE_FULL_INCLUDE,
    });
  },

  async updateStatus(courseId: string, status: CourseStatus, extra?: {
    rejectionReason?: string;
    publishedAt?: Date;
  }) {
    return db.course.update({
      where: { id: courseId },
      data: {
        status,
        ...extra,
      },
      include: COURSE_FULL_INCLUDE,
    });
  },

  async delete(courseId: string) {
    return db.course.delete({ where: { id: courseId } });
  },

  // ── Translations ────────────────────────────────────────────

  async upsertTranslation(courseId: string, language: Language, data: {
    title: string;
    description: string;
    tags?: string[];
  }) {
    return db.courseTranslation.upsert({
      where: { courseId_language: { courseId, language } },
      create: {
        courseId,
        language,
        title: data.title,
        description: data.description,
        tags: data.tags || [],
      },
      update: {
        title: data.title,
        description: data.description,
        tags: data.tags || [],
      },
    });
  },

  // ── Modules ─────────────────────────────────────────────────

  async createModule(courseId: string, data: {
    title: string;
    language: Language;
    sortOrder: number;
  }) {
    return db.module.create({
      data: {
        courseId,
        sortOrder: data.sortOrder,
        translations: {
          create: {
            language: data.language,
            title: data.title,
          },
        },
      },
      include: {
        translations: true,
        lessons: { include: { translations: true } },
      },
    });
  },

  async updateModule(moduleId: string, data: {
    title?: string;
    language?: Language;
    sortOrder?: number;
  }) {
    const updateData: Record<string, unknown> = {};
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    const mod = await db.module.update({
      where: { id: moduleId },
      data: updateData,
      include: { translations: true, lessons: { include: { translations: true } } },
    });

    // Update translation title if provided
    if (data.title && data.language) {
      await db.moduleTranslation.upsert({
        where: { moduleId_language: { moduleId, language: data.language } },
        create: { moduleId, language: data.language, title: data.title },
        update: { title: data.title },
      });
    }

    return mod;
  },

  async deleteModule(moduleId: string) {
    return db.module.delete({ where: { id: moduleId } });
  },

  async findModule(moduleId: string) {
    return db.module.findUnique({
      where: { id: moduleId },
      include: {
        translations: true,
        lessons: {
          orderBy: { sortOrder: 'asc' },
          include: { translations: true },
        },
        course: { select: { id: true, creatorId: true, status: true } },
      },
    });
  },

  // ── Lessons ─────────────────────────────────────────────────

  async createLesson(moduleId: string, data: {
    title: string;
    content: string;
    language: Language;
    sortOrder: number;
    duration?: string;
  }) {
    const contentHash = hashContent(data.content);

    return db.lesson.create({
      data: {
        moduleId,
        sortOrder: data.sortOrder,
        duration: data.duration || null,
        translations: {
          create: {
            language: data.language,
            title: data.title,
            content: data.content,
            contentHash,
          },
        },
      },
      include: { translations: true },
    });
  },

  async updateLesson(lessonId: string, data: {
    title?: string;
    content?: string;
    language?: Language;
    sortOrder?: number;
    duration?: string;
  }) {
    const updateData: Record<string, unknown> = {};
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.duration !== undefined) updateData.duration = data.duration;

    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: updateData,
      include: { translations: true },
    });

    // Update translation if content or title changed
    if ((data.title || data.content) && data.language) {
      const existing = await db.lessonTranslation.findUnique({
        where: { lessonId_language: { lessonId, language: data.language } },
      });

      const newTitle = data.title || existing?.title || '';
      const newContent = data.content || existing?.content || '';
      const contentHash = hashContent(newContent);

      await db.lessonTranslation.upsert({
        where: { lessonId_language: { lessonId, language: data.language } },
        create: {
          lessonId,
          language: data.language,
          title: newTitle,
          content: newContent,
          contentHash,
        },
        update: {
          title: newTitle,
          content: newContent,
          contentHash,
        },
      });
    }

    return lesson;
  },

  async deleteLesson(lessonId: string) {
    return db.lesson.delete({ where: { id: lessonId } });
  },

  async findLesson(lessonId: string) {
    return db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        translations: true,
        module: {
          select: {
            id: true,
            courseId: true,
            course: { select: { id: true, creatorId: true, status: true } },
          },
        },
      },
    });
  },

  // ── Counts (for analytics) ──────────────────────────────────

  async countByCreator(creatorId: string) {
    return db.course.count({ where: { creatorId } });
  },

  async countPublished() {
    return db.course.count({ where: { status: 'PUBLISHED' } });
  },
};