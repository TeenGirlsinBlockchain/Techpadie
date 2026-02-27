
import { NextRequest } from 'next/server';
import { courseRepo } from '@/app/server/repositories/course.repo';
import { paginationSchema, paginate, paginatedResult } from '@/app/server/validators/common.validators';
import { success, errorResponse } from '@/app/lib/api-response';
import type { CourseCategory, CourseLevel, Language } from '@prisma/client';

/**
 * GET /api/courses?page=1&limit=20&category=DEFI&level=BEGINNER&language=EN&q=blockchain
 * Public endpoint — no auth required.
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    const pagination = paginationSchema.parse({
      page: url.searchParams.get('page'),
      limit: url.searchParams.get('limit'),
    });

    const category = url.searchParams.get('category') as CourseCategory | null;
    const level = url.searchParams.get('level') as CourseLevel | null;
    const language = url.searchParams.get('language')?.toUpperCase() as Language | null;
    const search = url.searchParams.get('q') || undefined;

    const { items, total } = await courseRepo.findPublished({
      ...paginate(pagination),
      category: category || undefined,
      level: level || undefined,
      language: language || undefined,
      search,
    });

    return success(paginatedResult(items, total, pagination));
  } catch (error) {
    return errorResponse(error);
  }
}