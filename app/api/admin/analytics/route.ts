
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { db } from '@/app/lib/db';
import { jobRepo } from '@/app/server/repositories/job.repo';
import { success, errorResponse } from '@/app/lib/api-response';

/**
 * GET /api/admin/analytics
 * Platform-wide stats for admin dashboard.
 */
export const GET = withRole('ADMIN')(async (_request, { user: _user }) => {
  try {
    const [
      totalUsers,
      totalCreators,
      totalCourses,
      publishedCourses,
      pendingCourses,
      totalEnrollments,
      totalCertificates,
      jobCounts,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: 'CREATOR' } }),
      db.course.count(),
      db.course.count({ where: { status: 'PUBLISHED' } }),
      db.course.count({ where: { status: 'PENDING_REVIEW' } }),
      db.enrollment.count(),
      db.certificate.count(),
      jobRepo.countByStatus(),
    ]);

    return success({
      users: {
        total: totalUsers,
        creators: totalCreators,
        students: totalUsers - totalCreators,
      },
      courses: {
        total: totalCourses,
        published: publishedCourses,
        pendingReview: pendingCourses,
      },
      enrollments: totalEnrollments,
      certificates: totalCertificates,
      jobs: jobCounts,
    });
  } catch (error) {
    return errorResponse(error);
  }
});