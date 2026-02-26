
import { db } from '@/app/lib/db';
import type { User, UserRole } from '@prisma/client';

// ─── Types ──────────────────────────────────────────────────────

export interface CreateUserData {
  email: string;
  passwordHash: string;
  displayName: string;
  role?: UserRole;
}

/** Safe user projection — never expose passwordHash to API */
export const USER_SAFE_SELECT = {
  id: true,
  email: true,
  displayName: true,
  role: true,
  isActive: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type SafeUser = Pick<
  User,
  'id' | 'email' | 'displayName' | 'role' | 'isActive' | 'emailVerified' | 'createdAt' | 'updatedAt'
>;

// ─── Repository ─────────────────────────────────────────────────

export const userRepo = {
  async findByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return db.user.findUnique({ where: { id } });
  },

  async findByIdSafe(id: string): Promise<SafeUser | null> {
    return db.user.findUnique({
      where: { id },
      select: USER_SAFE_SELECT,
    });
  },

  async create(data: CreateUserData): Promise<SafeUser> {
    return db.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        displayName: data.displayName,
        role: data.role || 'STUDENT',
      },
      select: USER_SAFE_SELECT,
    });
  },

  async updatePassword(userId: string, passwordHash: string) {
    return db.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  },

  async setEmailVerified(userId: string) {
    return db.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
  },

  async updateRole(userId: string, role: UserRole) {
    return db.user.update({
      where: { id: userId },
      data: { role },
    });
  },

  async deactivate(userId: string) {
    return db.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  },
};