
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { courseTranslationSchema } from '@/app/server/validators/course.validator';
import { languageSchema } from '@/app/server/validators/common.validators';
import { upsertCourseTranslation } from '@/app/server/services/course.service';
import { success, errorResponse } from '@/app/lib/api-response';
import type { Language } from '@prisma/client';

/**
 * PUT /api/creator/courses/[courseId]/translations/[language]
 * Upserts a translation for the given language.
 */
export const PUT = withRole('CREATOR', 'ADMIN')(async (request, { user, params }) => {
  try {
    const language = languageSchema.parse(params!.language?.toUpperCase()) as Language;

    const body = await request.json();
    const input = courseTranslationSchema.parse(body);

    const translation = await upsertCourseTranslation(
      params!.courseId,
      user.id,
      language,
      input
    );

    return success({
      message: 'Translation saved successfully',
      translation,
    });
  } catch (error) {
    return errorResponse(error);
  }
});