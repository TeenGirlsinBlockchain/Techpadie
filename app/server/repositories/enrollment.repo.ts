// FILE: src/server/repositories/enrollment.repo.ts — Enrollment Data Access

import { db } from '@/lib/db';
import type { Language } from '@prisma/client';

export const enrollmentRepo = {
  async findByUserAndCourse(userId: string, courseId: string) {
    return db.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
  },

  async create(userId: string, courseId: string, language: Language) {
    return db.enrollment.create({
      data: { userId, courseId, language },
    });
  },

  async markCompleted(userId: string, courseId: string) {
    return db.enrollment.update({
      where: { userId_courseId: { userId, courseId } },
      data: { completedAt: new Date() },
    });
  },

  async findByUser(
    userId: string,
    pagination: { skip: number; take: number }
  ) {
    const [items, total] = await Promise.all([
      db.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              translations: true,
              _count: { select: { modules: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        ...pagination,
      }),
      db.enrollment.count({ where: { userId } }),
    ]);
    return { items, total };
  },

  async countByCourse(courseId: string) {
    return db.enrollment.count({ where: { courseId } });
  },
};