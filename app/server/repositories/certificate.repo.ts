
import { db } from '@/app/lib/db';

export const certificateRepo = {
  async findByUserAndCourse(userId: string, courseId: string) {
    return db.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
  },

  async findById(id: string) {
    return db.certificate.findUnique({ where: { id } });
  },

  async findByCertificateNo(certificateNo: string) {
    return db.certificate.findUnique({ where: { certificateNo } });
  },

  /**
   * Create certificate (idempotent — unique on userId+courseId).
   * Returns existing if already issued.
   */
  async create(data: {
    userId: string;
    courseId: string;
    certificateNo: string;
    studentName: string;
    courseTitle: string;
    quizScore: number;
    verificationUrl: string;
  }) {
    // Idempotent check
    const existing = await db.certificate.findUnique({
      where: { userId_courseId: { userId: data.userId, courseId: data.courseId } },
    });
    if (existing) return { certificate: existing, alreadyIssued: true };

    const certificate = await db.certificate.create({ data });
    return { certificate, alreadyIssued: false };
  },

  async findByUser(userId: string) {
    return db.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });
  },
};