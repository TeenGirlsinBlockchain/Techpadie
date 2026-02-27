import { z } from 'zod';
import { languageSchema } from './common.validators';

export const submitQuizSchema = z.object({
  language: languageSchema.default('EN'),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        selectedOptionId: z.string().min(1),
      })
    )
    .min(1, 'At least one answer is required'),
});

export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;

export const progressUpdateSchema = z.object({
  isCompleted: z.boolean().optional(),
  audioPositionSecs: z.number().min(0).optional(),
});

export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>;