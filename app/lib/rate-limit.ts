
import { db } from './db';
import { RateLimitError } from './api-error';

interface RateLimitConfig {
  /** Unique key prefix, e.g. "login", "otp", "api" */
  prefix: string;
  /** Max hits allowed in the window */
  maxHits: number;
  /** Window size in minutes */
  windowMinutes: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Check rate limit for a given identifier (email, IP, etc).
 * Uses a DB-backed sliding window approach.
 *
 * How it works:
 * 1. Build a key from prefix + identifier (e.g. "login:user@email.com")
 * 2. Calculate the current window start (floored to window boundary)
 * 3. Upsert: increment hitCount if within window, create new entry if not
 * 4. If hitCount > maxHits, reject
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `${config.prefix}:${identifier}`;
  const windowMs = config.windowMinutes * 60 * 1000;
  const now = new Date();
  const windowStart = new Date(
    Math.floor(now.getTime() / windowMs) * windowMs
  );
  const expiresAt = new Date(windowStart.getTime() + windowMs);

  try {
    // Upsert: create or increment hit count
    const entry = await db.rateLimitEntry.upsert({
      where: {
        key_windowStart: { key, windowStart },
      },
      create: {
        key,
        hitCount: 1,
        windowStart,
        expiresAt,
      },
      update: {
        hitCount: { increment: 1 },
      },
    });

    const allowed = entry.hitCount <= config.maxHits;
    const remaining = Math.max(0, config.maxHits - entry.hitCount);

    return { allowed, remaining, resetAt: expiresAt };
  } catch {
    // If rate limit check fails (DB error), allow the request
    // rather than blocking users. Log and investigate.
    return { allowed: true, remaining: config.maxHits, resetAt: expiresAt };
  }
}

/**
 * Enforce rate limit — throws RateLimitError if exceeded.
 * Use in route handlers before processing.
 */
export async function enforceRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<void> {
  const result = await checkRateLimit(identifier, config);

  if (!result.allowed) {
    throw new RateLimitError(
      `Rate limit exceeded. Try again after ${result.resetAt.toISOString()}`
    );
  }
}

// ─── Pre-configured Limiters ────────────────────────────────────

export const LOGIN_LIMIT: RateLimitConfig = {
  prefix: 'login',
  maxHits: parseInt(process.env.RATE_LIMIT_LOGIN_MAX || '5', 10),
  windowMinutes: parseInt(
    process.env.RATE_LIMIT_LOGIN_WINDOW_MINUTES || '15',
    10
  ),
};

export const OTP_LIMIT: RateLimitConfig = {
  prefix: 'otp',
  maxHits: parseInt(process.env.RATE_LIMIT_OTP_MAX || '3', 10),
  windowMinutes: parseInt(
    process.env.RATE_LIMIT_OTP_WINDOW_MINUTES || '10',
    10
  ),
};

export const API_LIMIT: RateLimitConfig = {
  prefix: 'api',
  maxHits: parseInt(process.env.RATE_LIMIT_API_MAX || '100', 10),
  windowMinutes: parseInt(
    process.env.RATE_LIMIT_API_WINDOW_MINUTES || '1',
    10
  ),
};

// ─── Cleanup ────────────────────────────────────────────────────

/**
 * Delete expired rate limit entries.
 * Call periodically (e.g. in job worker or cron).
 */
export async function cleanExpiredRateLimits(): Promise<number> {
  const result = await db.rateLimitEntry.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}