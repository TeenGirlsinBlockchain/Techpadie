
import { cookies } from 'next/headers';
import { db } from './db';
import { generateSessionToken } from './crypto';
import { UnauthorizedError } from './api-error';
import { logger } from './logger';
import type { UserRole } from '@prisma/client';

const SESSION_COOKIE = 'tp_session';
const SESSION_MAX_AGE_HOURS = parseInt(
  process.env.SESSION_MAX_AGE_HOURS || '168',
  10
);

// ─── Types ──────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

// ─── Create Session ─────────────────────────────────────────────

/**
 * Create a new session in DB and set HttpOnly cookie.
 * Called after OTP verification succeeds.
 */
export async function createSession(
  userId: string,
  meta: { ipAddress?: string; userAgent?: string }
): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date(
    Date.now() + SESSION_MAX_AGE_HOURS * 60 * 60 * 1000
  );

  await db.session.create({
    data: {
      userId,
      token,
      ipAddress: meta.ipAddress || null,
      userAgent: meta.userAgent || null,
      expiresAt,
    },
  });

  // Set HttpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_HOURS * 60 * 60,
  });

  return token;
}

// ─── Get Current User ───────────────────────────────────────────

/**
 * Read session cookie → look up session → return user.
 * Returns null if no valid session (does NOT throw).
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) return null;

    const session = await db.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) {
      // Session expired — clean it up
      await db.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }
    if (!session.user.isActive) return null;

    return {
      id: session.user.id,
      email: session.user.email,
      displayName: session.user.displayName,
      role: session.user.role,
    };
  } catch (err) {
    logger.error(
      'Session lookup failed',
      err instanceof Error ? err : new Error(String(err))
    );
    return null;
  }
}

// ─── Require Auth ───────────────────────────────────────────────

/**
 * Like getCurrentUser but throws UnauthorizedError if not authenticated.
 * Use in route handlers that require login.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }
  return user;
}

/**
 * Require auth AND a specific role.
 */
export async function requireRole(
  ...roles: UserRole[]
): Promise<SessionUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new UnauthorizedError('Insufficient permissions');
  }
  return user;
}

// ─── Destroy Session ────────────────────────────────────────────

/**
 * Delete session from DB and clear cookie.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await db.session.deleteMany({ where: { token } }).catch(() => {});
  }

  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

// ─── Cleanup ────────────────────────────────────────────────────

/**
 * Delete all expired sessions. Call periodically from job worker.
 */
export async function cleanExpiredSessions(): Promise<number> {
  const result = await db.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}

// ─── Request Helpers ────────────────────────────────────────────

/**
 * Extract IP and User-Agent from a request for audit logging.
 */
export function getRequestMeta(request: Request) {
  return {
    ipAddress:
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
  };
}