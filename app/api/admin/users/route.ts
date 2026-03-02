
import { NextRequest } from 'next/server';
import { withRole } from '@/app/middleware/with-role';
import { db } from '@/app/lib/db';
import { paginationSchema, paginate, paginatedResult } from '@/app/server/validators/common.validators';
import { success, errorResponse } from '@/app/lib/api-response';
import type { UserRole } from '@prisma/client';

/**
 * GET /api/admin/users?page=1&limit=20&role=STUDENT&q=john
 */
export const GET = withRole('ADMIN')(async (request, { user: _admin }) => {
  try {
    const url = new URL(request.url);
    const input = paginationSchema.parse({
      page: url.searchParams.get('page'),
      limit: url.searchParams.get('limit'),
    });

    const role = url.searchParams.get('role') as UserRole | null;
    const search = url.searchParams.get('q') || undefined;

    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          displayName: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          creatorProfile: {
            select: { status: true },
          },
          _count: {
            select: {
              enrollments: true,
              certificates: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: paginate(input).skip,
        take: paginate(input).take,
      }),
      db.user.count({ where }),
    ]);

    return success(paginatedResult(items, total, input));
  } catch (error) {
    return errorResponse(error);
  }
});