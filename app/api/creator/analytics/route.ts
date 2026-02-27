
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { db } from '@/app/lib/db';
import { success, errorResponse } from '@/app/lib/api-response';

/**
 * GET /api/creator/analytics
 * Stats for the current creator's courses.
 */
export const GET = withRole('CREATOR', 'ADMIN')(async (_request, { user }) => {
  try {
    const [
      totalCourses,
      publishedCourses,
      totalEnrollments,
      topCourses,
    ] = await Promise.all([
      db.course.count({ where: { creatorId: user.id } }),
      db.course.count({ where: { creatorId: user.id, status: 'PUBLISHED' } }),
      db.enrollment.count({
        where: { course: { creatorId: user.id } },
      }),
      db.course.findMany({
        where: { creatorId: user.id, status: 'PUBLISHED' },
        include: {
          translations: { take: 1 },
          _count: { select: { enrollments: true } },
        },
        orderBy: { enrollments: { _count: 'desc' } },
        take: 5,
      }),
    ]);

    return success({
      totalCourses,
      publishedCourses,
      totalEnrollments,
      topCourses: topCourses.map((c: { id: any; translations: { title: any; }[]; _count: { enrollments: any; }; status: any; }) => ({
        id: c.id,
        title: c.translations[0]?.title || 'Untitled',
        enrollments: c._count.enrollments,
        status: c.status,
      })),
    });
  } catch (error) {
    return errorResponse(error);
  }
});