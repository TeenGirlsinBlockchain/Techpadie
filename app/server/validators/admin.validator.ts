import { z } from 'zod';
import { CourseStatus, CreatorStatus } from '@prisma/client';

export const reviewCourseSchema = z.object({
  status: z.enum([CourseStatus.PUBLISHED, CourseStatus.REJECTED]),
  rejectionReason: z.string().max(1000).optional(),
}).refine(
  (data) => data.status !== CourseStatus.REJECTED || (data.rejectionReason && data.rejectionReason.trim().length > 0),
  {
    message: 'Rejection reason is required when rejecting a course',
    path: ['rejectionReason'],
  }
);

export type ReviewCourseInput = z.infer<typeof reviewCourseSchema>;

export const reviewCreatorSchema = z.object({
  status: z.enum([CreatorStatus.APPROVED, CreatorStatus.REJECTED]),
  rejectionReason: z.string().max(1000).optional(),
}).refine(
  (data) => data.status !== CreatorStatus.REJECTED || (data.rejectionReason && data.rejectionReason.trim().length > 0),
  {
    message: 'Rejection reason is required when rejecting a creator',
    path: ['rejectionReason'],
  }
);

export type ReviewCreatorInput = z.infer<typeof reviewCreatorSchema>;
