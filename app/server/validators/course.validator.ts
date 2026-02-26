
import { z } from 'zod';
import { languageSchema } from './common.validators';

// ─── Course ─────────────────────────────────────────────────────

export const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200).trim(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000).trim(),
  language: languageSchema.default('EN'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
  category: z.enum([
    'BLOCKCHAIN_BASICS', 'DEFI', 'NFTS', 'SMART_CONTRACTS',
    'TRADING', 'SECURITY', 'WEB3_DEV', 'TOKENOMICS',
    'DIGITAL_SKILLS', 'OTHER',
  ]).default('BLOCKCHAIN_BASICS'),
  thumbnailUrl: z.string().url().optional(),
  estimatedHours: z.number().positive().optional(),
  tags: z.array(z.string().max(50)).max(10).default([]),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = createCourseSchema.partial().extend({
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  category: z.enum([
    'BLOCKCHAIN_BASICS', 'DEFI', 'NFTS', 'SMART_CONTRACTS',
    'TRADING', 'SECURITY', 'WEB3_DEV', 'TOKENOMICS',
    'DIGITAL_SKILLS', 'OTHER',
  ]).optional(),
});

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

// ─── Course Translation ─────────────────────────────────────────

export const courseTranslationSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  description: z.string().min(10).max(5000).trim(),
  tags: z.array(z.string().max(50)).max(10).default([]),
});

export type CourseTranslationInput = z.infer<typeof courseTranslationSchema>;

// ─── Module ─────────────────────────────────────────────────────

export const createModuleSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200).trim(),
  language: languageSchema.default('EN'),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateModuleInput = z.infer<typeof createModuleSchema>;

export const updateModuleSchema = z.object({
  title: z.string().min(2).max(200).trim().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;

// ─── Lesson ─────────────────────────────────────────────────────

export const createLessonSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200).trim(),
  content: z.string().min(10, 'Content must be at least 10 characters').max(100000).trim(),
  language: languageSchema.default('EN'),
  sortOrder: z.number().int().min(0).optional(),
  duration: z.string().max(50).optional(), // e.g. "15 min"
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;

export const updateLessonSchema = z.object({
  title: z.string().min(2).max(200).trim().optional(),
  content: z.string().min(10).max(100000).trim().optional(),
  sortOrder: z.number().int().min(0).optional(),
  duration: z.string().max(50).optional(),
});

export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;

// ─── Admin Review ───────────────────────────────────────────────

export const reviewActionSchema = z.object({
  reason: z.string().max(1000).optional(),
});

export type ReviewActionInput = z.infer<typeof reviewActionSchema>;

// ─── Creator Profile ────────────────────────────────────────────

export const creatorProfileSchema = z.object({
  bio: z.string().max(2000).trim().optional(),
  expertise: z.array(z.string().max(100)).max(20).default([]),
  website: z.string().url().optional().or(z.literal('')),
  socialLinks: z.object({
    twitter: z.string().max(200).optional(),
    linkedin: z.string().max(200).optional(),
    github: z.string().max(200).optional(),
  }).optional(),
});

export type CreatorProfileInput = z.infer<typeof creatorProfileSchema>;

// ─── Reward Config ──────────────────────────────────────────────

export const rewardConfigSchema = z.object({
  tokensAmount: z.number().positive('Token amount must be positive'),
  tokenSymbol: z.string().max(10).default('FLR'),
  quizPassThreshold: z.number().min(0).max(100).default(70),
  isActive: z.boolean().default(true),
});

export type RewardConfigInput = z.infer<typeof rewardConfigSchema>;