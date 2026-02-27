
import { NextRequest } from 'next/server';
import { withAuth } from '@/app/middleware/with-auth';
import { enrollInCourse } from '@/app/server/services/enrollment.service';
import { languageSchema } from '@/app/server/validators/common.validators';
import { created, errorResponse } from '@/app/lib/api-response';
import { getRequestMeta } from '@/app/lib/auth';
import type { Language } from '@prisma/client';

/**
 * POST /api/courses/[courseId]/enroll
 * Body: { language: "EN" }  (optional, defaults to EN)
 */
export const POST = withAuth(async (request, { user, params }) => {
  try {
    const meta = getRequestMeta(request);
    const body = await request.json().catch(() => ({}));
    const language = languageSchema.parse(
      (body as { language?: string }).language?.toUpperCase() || 'EN'
    ) as Language;

    const enrollment = await enrollInCourse(
      user.id,
      params!.courseId,
      language,
      meta
    );

    return created({
      message: 'Enrolled successfully',
      enrollment,
    });
  } catch (error) {
    return errorResponse(error);
  }
});