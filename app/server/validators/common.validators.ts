
import { z } from 'zod';

// ─── Pagination ─────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/** Build skip/take from pagination input */
export function paginate(input: PaginationInput) {
  return {
    skip: (input.page - 1) * input.limit,
    take: input.limit,
  };
}

/** Standard paginated response shape */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function paginatedResult<T>(
  items: T[],
  total: number,
  input: PaginationInput
): PaginatedResult<T> {
  return {
    items,
    total,
    page: input.page,
    limit: input.limit,
    totalPages: Math.ceil(total / input.limit),
  };
}

// ─── ID Params ──────────────────────────────────────────────────

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const courseIdParamSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
});

export const lessonIdParamSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
});

export const moduleIdParamSchema = z.object({
  moduleId: z.string().min(1, 'Module ID is required'),
});

// ─── Language ───────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = ['EN', 'FR', 'AR', 'SW', 'HA', 'PT'] as const;

export const languageSchema = z.enum(SUPPORTED_LANGUAGES);

export const languageQuerySchema = z.object({
  language: languageSchema.default('EN'),
});

// ─── Sort / Filter ──────────────────────────────────────────────

export const sortOrderSchema = z.enum(['asc', 'desc']).default('desc');

export const searchSchema = z.object({
  q: z.string().max(200).optional(),
});