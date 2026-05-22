import { z } from 'zod';

export const updateProgressSchema = z.object({
  isCompleted: z.boolean().optional(),
  audioPositionSecs: z.number().min(0).default(0),
});

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
