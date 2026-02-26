
import { courseRepo } from '@/app/server/repositories/course.repo';
import { auditRepo } from '@/app/server/repositories/audit.repo';
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from '@/app/lib/api-error';
import type {
  CreateCourseInput,
  UpdateCourseInput,
  CreateModuleInput,
  UpdateModuleInput,
  CreateLessonInput,
  UpdateLessonInput,
  CourseTranslationInput,
} from '@/app/server/validators/course.validator';
import type { Language } from '@prisma/client';

// ─── Ownership Check ────────────────────────────────────────────

async function verifyCourseOwner(courseId: string, userId: string) {
  const course = await courseRepo.findById(courseId);
  if (!course) throw new NotFoundError('Course not found');
  if (course.creatorId !== userId) {
    throw new ForbiddenError('You do not own this course');
  }
  return course;
}

async function verifyModuleOwner(moduleId: string, userId: string) {
  const mod = await courseRepo.findModule(moduleId);
  if (!mod) throw new NotFoundError('Module not found');
  if (mod.course.creatorId !== userId) {
    throw new ForbiddenError('You do not own this module');
  }
  return mod;
}

async function verifyLessonOwner(lessonId: string, userId: string) {
  const lesson = await courseRepo.findLesson(lessonId);
  if (!lesson) throw new NotFoundError('Lesson not found');
  if (lesson.module.course.creatorId !== userId) {
    throw new ForbiddenError('You do not own this lesson');
  }
  return lesson;
}

// ─── Course CRUD ────────────────────────────────────────────────

export async function createCourse(
  creatorId: string,
  input: CreateCourseInput,
  meta: { ipAddress: string; userAgent: string }
) {
  const course = await courseRepo.create({
    creatorId,
    title: input.title,
    description: input.description,
    language: input.language as Language,
    level: input.level,
    category: input.category,
    thumbnailUrl: input.thumbnailUrl,
    estimatedHours: input.estimatedHours,
    tags: input.tags,
  });

  await auditRepo.log({
    userId: creatorId,
    action: 'COURSE_CREATED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    metadata: { courseId: course.id },
  });

  return course;
}

export async function getCourse(courseId: string) {
  const course = await courseRepo.findById(courseId);
  if (!course) throw new NotFoundError('Course not found');
  return course;
}

export async function listCreatorCourses(
  creatorId: string,
  pagination: { skip: number; take: number }
) {
  return courseRepo.findByCreator(creatorId, pagination);
}

export async function updateCourse(
  courseId: string,
  userId: string,
  input: UpdateCourseInput
) {
  const course = await verifyCourseOwner(courseId, userId);

  // Only DRAFT and REJECTED courses can be edited
  if (!['DRAFT', 'REJECTED'].includes(course.status)) {
    throw new BadRequestError(
      `Cannot edit a course with status: ${course.status}`
    );
  }

  const updateData: Record<string, unknown> = {};
  if (input.level) updateData.level = input.level;
  if (input.category) updateData.category = input.category;
  if (input.thumbnailUrl !== undefined) updateData.thumbnailUrl = input.thumbnailUrl;
  if (input.estimatedHours !== undefined) updateData.estimatedHours = input.estimatedHours;

  // Update base course fields
  const updated = await courseRepo.update(courseId, updateData);

  // Update default language translation if title/description provided
  if (input.title || input.description) {
    const existing = course.translations.find(
      (t: { language: any; }) => t.language === course.defaultLanguage
    );
    await courseRepo.upsertTranslation(courseId, course.defaultLanguage, {
      title: input.title || existing?.title || '',
      description: input.description || existing?.description || '',
      tags: input.tags,
    });
  }

  return updated;
}

export async function deleteCourse(courseId: string, userId: string) {
  const course = await verifyCourseOwner(courseId, userId);

  if (course.status === 'PUBLISHED') {
    throw new BadRequestError(
      'Cannot delete a published course. Archive it first.'
    );
  }

  await courseRepo.delete(courseId);
}

// ─── Submit for Review ──────────────────────────────────────────

export async function submitCourseForReview(
  courseId: string,
  userId: string,
  meta: { ipAddress: string; userAgent: string }
) {
  const course = await verifyCourseOwner(courseId, userId);

  if (!['DRAFT', 'REJECTED'].includes(course.status)) {
    throw new BadRequestError(
      `Cannot submit a course with status: ${course.status}`
    );
  }

  // Validate: must have at least 1 module with at least 1 lesson
  const hasContent = course.modules.some((m: { lessons: string | any[]; }) => m.lessons.length > 0);
  if (!hasContent) {
    throw new BadRequestError(
      'Course must have at least one module with one lesson before submission'
    );
  }

  // Validate: must have at least one translation
  if (course.translations.length === 0) {
    throw new BadRequestError('Course must have at least one translation');
  }

  const updated = await courseRepo.updateStatus(courseId, 'PENDING_REVIEW');

  await auditRepo.log({
    userId,
    action: 'COURSE_SUBMITTED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    metadata: { courseId },
  });

  return updated;
}

// ─── Translations ───────────────────────────────────────────────

export async function upsertCourseTranslation(
  courseId: string,
  userId: string,
  language: Language,
  input: CourseTranslationInput
) {
  await verifyCourseOwner(courseId, userId);

  return courseRepo.upsertTranslation(courseId, language, {
    title: input.title,
    description: input.description,
    tags: input.tags,
  });
}

// ─── Module CRUD ────────────────────────────────────────────────

export async function createModule(
  courseId: string,
  userId: string,
  input: CreateModuleInput
) {
  const course = await verifyCourseOwner(courseId, userId);

  if (!['DRAFT', 'REJECTED'].includes(course.status)) {
    throw new BadRequestError(
      `Cannot modify a course with status: ${course.status}`
    );
  }

  // Auto sortOrder if not provided
  const sortOrder =
    input.sortOrder ?? course.modules.length;

  return courseRepo.createModule(courseId, {
    title: input.title,
    language: input.language as Language,
    sortOrder,
  });
}

export async function updateModule(
  moduleId: string,
  userId: string,
  input: UpdateModuleInput & { language?: Language }
) {
  await verifyModuleOwner(moduleId, userId);

  return courseRepo.updateModule(moduleId, {
    title: input.title,
    language: input.language,
    sortOrder: input.sortOrder,
  });
}

export async function deleteModule(moduleId: string, userId: string) {
  await verifyModuleOwner(moduleId, userId);
  return courseRepo.deleteModule(moduleId);
}

// ─── Lesson CRUD ────────────────────────────────────────────────

export async function createLesson(
  moduleId: string,
  userId: string,
  input: CreateLessonInput
) {
  const mod = await verifyModuleOwner(moduleId, userId);

  if (!['DRAFT', 'REJECTED'].includes(mod.course.status)) {
    throw new BadRequestError(
      `Cannot modify a course with status: ${mod.course.status}`
    );
  }

  const sortOrder = input.sortOrder ?? mod.lessons.length;

  return courseRepo.createLesson(moduleId, {
    title: input.title,
    content: input.content,
    language: input.language as Language,
    sortOrder,
    duration: input.duration,
  });
}

export async function updateLesson(
  lessonId: string,
  userId: string,
  input: UpdateLessonInput & { language?: Language }
) {
  await verifyLessonOwner(lessonId, userId);

  return courseRepo.updateLesson(lessonId, {
    title: input.title,
    content: input.content,
    language: input.language,
    sortOrder: input.sortOrder,
    duration: input.duration,
  });
}

export async function deleteLesson(lessonId: string, userId: string) {
  await verifyLessonOwner(lessonId, userId);
  return courseRepo.deleteLesson(lessonId);
}