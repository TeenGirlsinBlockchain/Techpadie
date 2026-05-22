import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { db } from '@/app/lib/db';
import { success, errorResponse } from '@/app/lib/api-response';

/**
 * GET /api/creator/courses/[courseId]/analytics
 * Returns performance stats for a single course, verifying ownership.
 */
export const GET = withRole('CREATOR', 'ADMIN')(async (request, { user, params }) => {
  try {
    const courseId = params?.courseId;
    if (!courseId) {
      return Response.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Verify course exists and belongs to the creator (unless admin)
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        creatorId: user.role === 'ADMIN' ? undefined : user.id,
      },
      include: {
        translations: true,
        _count: {
          select: {
            enrollments: true,
            modules: true,
            certificates: true,
          },
        },
      },
    });

    if (!course) {
      return Response.json(
        { success: false, error: 'Course not found or unauthorized' },
        { status: 404 }
      );
    }

    // Calculate completions
    const completionsCount = await db.enrollment.count({
      where: {
        courseId,
        completedAt: { not: null },
      },
    });

    // Calculate average quiz score across all lessons in this course
    const quizAttempts = await db.quizAttempt.findMany({
      where: {
        lesson: {
          module: {
            courseId,
          },
        },
      },
      select: {
        score: true,
      },
    });

    const averageQuizScore =
      quizAttempts.length > 0
        ? quizAttempts.reduce((sum, qa) => sum + qa.score, 0) / quizAttempts.length
        : 0;

    const title = course.translations[0]?.title || 'Untitled';

    return success({
      courseId,
      title,
      slug: course.slug,
      status: course.status,
      enrollmentsCount: course._count.enrollments,
      completionsCount,
      certificatesCount: course._count.certificates,
      averageQuizScore,
    });
  } catch (error) {
    return errorResponse(error);
  }
});
