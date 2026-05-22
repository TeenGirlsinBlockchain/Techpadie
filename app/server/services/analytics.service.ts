import { db } from '@/app/lib/db';
import { getLevelProgress, calculateNewStreak } from '@/app/lib/gamification';
import { getWalletBalance } from '@/app/lib/chain/flare';
import { UserRole, CreatorStatus, CourseStatus, JobStatus } from '@prisma/client';

/**
 * Interface for student learning stats.
 */
export interface StudentStats {
  xp: number;
  level: number;
  rank: string;
  percentProgress: number;
  streak: number;
  coursesEnrolled: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  quizzesAttempted: number;
  quizzesPassed: number;
  averageQuizScore: number;
}

/**
 * Interface for creator stats.
 */
export interface CreatorStats {
  totalCourses: number;
  publishedCourses: number;
  pendingCourses: number;
  draftCourses: number;
  totalEnrollments: number;
  totalStudents: number;
  averageQuizScore: number;
}

/**
 * Interface for global admin dashboard stats.
 */
export interface AdminStats {
  users: {
    total: number;
    active: number;
    students: number;
    creators: {
      total: number;
      pending: number;
      approved: number;
    };
    admins: number;
  };
  courses: {
    total: number;
    published: number;
    pending: number;
    draft: number;
  };
  completions: {
    enrollments: number;
    certificatesIssued: number;
  };
  jobs: {
    total: number;
    queued: number;
    processing: number;
    completed: number;
    failed: number;
  };
  wallet: {
    address: string;
    balance: string;
  };
}

/**
 * Computes learning statistics for a student.
 */
export async function getStudentStats(userId: string): Promise<StudentStats> {
  const [enrollments, lessonProgress, quizAttempts, auditLogs] = await Promise.all([
    db.enrollment.findMany({ where: { userId } }),
    db.lessonProgress.findMany({ where: { userId, isCompleted: true } }),
    db.quizAttempt.findMany({ where: { userId } }),
    db.auditLog.findMany({
      where: { userId, action: 'USER_LOGIN' },
      orderBy: { createdAt: 'desc' },
      take: 30, // Get recent login logs
    }),
  ]);

  // Compute XP: 50 XP per completed lesson, 100 XP per passed quiz
  const passedQuizzes = quizAttempts.filter((q) => q.passed);
  const totalXp = lessonProgress.length * 50 + passedQuizzes.length * 100;

  // Use gamification helpers to compute level progress
  const levelProgress = getLevelProgress(totalXp);

  // Compute Streak: Traverse login audit logs to calculate streak
  let currentStreak = 0;
  if (auditLogs.length > 0) {
    // Basic calculation by examining consecutive login dates
    const uniqueDates = new Set<string>();
    for (const log of auditLogs) {
      uniqueDates.add(log.createdAt.toDateString());
    }
    const sortedDates = Array.from(uniqueDates)
      .map((d) => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    // Check if the user logged in today or yesterday to continue/start the streak
    const now = new Date();
    const todayStr = now.toDateString();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = yesterday.toDateString();

    const hasToday = uniqueDates.has(todayStr);
    const hasYesterday = uniqueDates.has(yesterdayStr);

    if (hasToday || hasYesterday) {
      currentStreak = 1;
      let checkDate = hasToday ? now : yesterday;
      
      while (true) {
        const nextPrevDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
        const nextPrevStr = nextPrevDate.toDateString();
        if (uniqueDates.has(nextPrevStr)) {
          currentStreak++;
          checkDate = nextPrevDate;
        } else {
          break;
        }
      }
    }
  }

  const coursesEnrolled = enrollments.length;
  const coursesCompleted = enrollments.filter((e) => e.completedAt !== null).length;
  const averageQuizScore =
    quizAttempts.length > 0
      ? quizAttempts.reduce((acc, q) => acc + q.score, 0) / quizAttempts.length
      : 0;

  return {
    xp: totalXp,
    level: levelProgress.level,
    rank: levelProgress.rank,
    percentProgress: levelProgress.percentProgress,
    streak: currentStreak,
    coursesEnrolled,
    coursesCompleted,
    lessonsCompleted: lessonProgress.length,
    quizzesAttempted: quizAttempts.length,
    quizzesPassed: passedQuizzes.length,
    averageQuizScore,
  };
}

/**
 * Computes course aggregation and performance statistics for a creator.
 */
export async function getCreatorStats(userId: string): Promise<CreatorStats> {
  const courses = await db.course.findMany({
    where: { creatorId: userId },
    include: {
      enrollments: true,
      translations: true,
      modules: {
        include: {
          lessons: {
            include: {
              quizAttempts: {
                select: {
                  score: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.status === CourseStatus.PUBLISHED).length;
  const pendingCourses = courses.filter((c) => c.status === CourseStatus.PENDING_REVIEW).length;
  const draftCourses = courses.filter((c) => c.status === CourseStatus.DRAFT).length;

  const totalEnrollments = courses.reduce((acc, c) => acc + c.enrollments.length, 0);

  // Unique users enrolled across all of the creator's courses
  const enrolledStudentIds = new Set<string>();
  courses.forEach((c) => {
    c.enrollments.forEach((e) => enrolledStudentIds.add(e.userId));
  });
  const totalStudents = enrolledStudentIds.size;

  // Average quiz scores across all course attempts
  let sumScore = 0;
  let totalAttemptsCount = 0;
  courses.forEach((c) => {
    c.modules.forEach((m) => {
      m.lessons.forEach((l) => {
        l.quizAttempts.forEach((qa) => {
          sumScore += qa.score;
          totalAttemptsCount++;
        });
      });
    });
  });

  const averageQuizScore = totalAttemptsCount > 0 ? sumScore / totalAttemptsCount : 0;

  return {
    totalCourses,
    publishedCourses,
    pendingCourses,
    draftCourses,
    totalEnrollments,
    totalStudents,
    averageQuizScore,
  };
}

/**
 * Gathers global metrics for admin monitoring.
 */
export async function getAdminStats(): Promise<AdminStats> {
  const [
    totalUsers,
    activeUsers,
    studentUsers,
    creatorProfiles,
    adminUsers,
    totalCourses,
    publishedCourses,
    pendingCourses,
    draftCourses,
    totalEnrollments,
    certificatesIssued,
    jobs,
    wallet,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { isActive: true } }),
    db.user.count({ where: { role: UserRole.STUDENT } }),
    db.creatorProfile.findMany({ select: { status: true } }),
    db.user.count({ where: { role: UserRole.ADMIN } }),
    db.course.count(),
    db.course.count({ where: { status: CourseStatus.PUBLISHED } }),
    db.course.count({ where: { status: CourseStatus.PENDING_REVIEW } }),
    db.course.count({ where: { status: CourseStatus.DRAFT } }),
    db.enrollment.count(),
    db.certificate.count(),
    db.job.findMany({ select: { status: true } }),
    getWalletBalance(),
  ]);

  const creatorsTotal = creatorProfiles.length;
  const creatorsPending = creatorProfiles.filter((c) => c.status === CreatorStatus.PENDING).length;
  const creatorsApproved = creatorProfiles.filter((c) => c.status === CreatorStatus.APPROVED).length;

  const jobsTotal = jobs.length;
  const jobsQueued = jobs.filter((j) => j.status === JobStatus.QUEUED).length;
  const jobsProcessing = jobs.filter((j) => j.status === JobStatus.PROCESSING).length;
  const jobsCompleted = jobs.filter((j) => j.status === JobStatus.COMPLETED).length;
  const jobsFailed = jobs.filter((j) => j.status === JobStatus.FAILED).length;

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      students: studentUsers,
      creators: {
        total: creatorsTotal,
        pending: creatorsPending,
        approved: creatorsApproved,
      },
      admins: adminUsers,
    },
    courses: {
      total: totalCourses,
      published: publishedCourses,
      pending: pendingCourses,
      draft: draftCourses,
    },
    completions: {
      enrollments: totalEnrollments,
      certificatesIssued,
    },
    jobs: {
      total: jobsTotal,
      queued: jobsQueued,
      processing: jobsProcessing,
      completed: jobsCompleted,
      failed: jobsFailed,
    },
    wallet: {
      address: wallet.address,
      balance: wallet.balance,
    },
  };
}
