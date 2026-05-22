import { z } from 'zod';
import { languageSchema } from './common.validators';

export const createLessonSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200).trim(),
  content: z.string().min(10, 'Content must be at least 10 characters').max(100000).trim(),
  language: languageSchema.default('EN'),
  sortOrder: z.number().int().min(0).optional(),
  duration: z.string().max(50).optional(),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;

export const updateLessonSchema = z.object({
  title: z.string().min(2).max(200).trim().optional(),
  content: z.string().min(10).max(100000).trim().optional(),
  sortOrder: z.number().int().min(0).optional(),
  duration: z.string().max(50).optional(),
});

export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;

export const lessonTranslationSchema = z.object({
  title: z.string().min(2).max(200).trim(),
  content: z.string().min(10).max(100000).trim(),
});

export type LessonTranslationInput = z.infer<typeof lessonTranslationSchema>;
