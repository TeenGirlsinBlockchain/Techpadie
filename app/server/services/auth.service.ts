
import { userRepo } from '@/app/server/repositories/user.repo';
import { otpRepo } from '@/app/server/repositories/session.repo';
import { auditRepo } from '@/app/server/repositories/audit.repo';
import {
  hashPassword,
  verifyPassword,
  generateOTP,
  verifyOTP,
} from '@/app/lib/crypto';
// generateOTP + verifyOTP kept — still used by password reset flow
import { createSession, destroySession } from '@/app/lib/auth';
import { sendWelcomeEmail, sendPasswordResetEmail } from '@/app/lib/email';
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} from '@/app/lib/api-error';
import { logger } from '@/app/lib/logger';
import type { SignupInput, LoginInput, VerifyOtpInput } from '@/app/server/validators/auth.validator';

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10);

// ─── Signup ─────────────────────────────────────────────────────

export async function signup(
  input: SignupInput,
  meta: { ipAddress: string; userAgent: string }
) {
  const existing = await userRepo.findByEmail(input.email);
  if (existing) {
    throw new ConflictError('An account with this email already exists');
  }

  const passwordHash = await hashPassword(input.password);

  const user = await userRepo.create({
    email: input.email,
    passwordHash,
    displayName: input.displayName,
  });

  await auditRepo.log({
    userId: user.id,
    action: 'USER_SIGNUP',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    metadata: { email: input.email },
  });

  sendWelcomeEmail(input.email, input.displayName).catch((err: any) => {
    logger.error('Welcome email failed', err instanceof Error ? err : new Error(String(err)));
  });

  return user;
}

// ─── Login (Email + Password → Direct Session) ──────────────────

/**
 * Validates credentials and creates a session immediately for all roles.
 * OTP is only used for password reset, not login.
 *
 * ANTI-ENUMERATION: On failure, always return the same error regardless
 * of whether the email exists.
 */
export async function loginStep1(
  input: LoginInput,
  meta: { ipAddress: string; userAgent: string }
): Promise<{ otpRequired: boolean; user?: unknown }> {
  const user = await userRepo.findByEmail(input.email);

  if (!user || !user.isActive) {
    await hashPassword('dummy-to-match-timing');

    await auditRepo.log({
      action: 'USER_LOGIN_FAILED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      metadata: { email: input.email, reason: 'user_not_found' },
    });

    throw new UnauthorizedError('Invalid email or password');
  }

  const passwordValid = await verifyPassword(input.password, user.passwordHash);

  if (!passwordValid) {
    await auditRepo.log({
      userId: user.id,
      action: 'USER_LOGIN_FAILED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      metadata: { reason: 'invalid_password' },
    });

    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.emailVerified) {
    await userRepo.setEmailVerified(user.id);
  }

  await createSession(user.id, meta);

  await auditRepo.log({
    userId: user.id,
    action: 'SESSION_CREATED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    metadata: { method: 'password_only' },
  });

  const safeUser = await userRepo.findByIdSafe(user.id);
  return { otpRequired: false, user: safeUser };
}

// ─── Login Step 2 (Verify OTP → Create Session) ────────────────

export async function loginStep2(
  input: VerifyOtpInput,
  meta: { ipAddress: string; userAgent: string }
): Promise<{ user: ReturnType<typeof userRepo.findByIdSafe> extends Promise<infer T> ? T : never }> {
  const user = await userRepo.findByEmail(input.email);

  if (!user || !user.isActive) {
    throw new UnauthorizedError('Invalid email or verification code');
  }

  const otp = await otpRepo.findLatestValid(user.id, 'login');

  if (!otp) {
    await auditRepo.log({
      userId: user.id,
      action: 'OTP_FAILED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      metadata: { reason: 'no_valid_otp' },
    });
    throw new UnauthorizedError('Invalid email or verification code');
  }

  if (otp.attempts >= OTP_MAX_ATTEMPTS) {
    await auditRepo.log({
      userId: user.id,
      action: 'OTP_FAILED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      metadata: { reason: 'max_attempts_exceeded' },
    });
    throw new BadRequestError(
      'Too many verification attempts. Please request a new code.'
    );
  }

  await otpRepo.incrementAttempts(otp.id);

  const isValid = await verifyOTP(input.code, otp.codeHash);

  if (!isValid) {
    await auditRepo.log({
      userId: user.id,
      action: 'OTP_FAILED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      metadata: { reason: 'invalid_code', attempts: otp.attempts + 1 },
    });
    throw new UnauthorizedError('Invalid email or verification code');
  }

  await otpRepo.markUsed(otp.id);

  if (!user.emailVerified) {
    await userRepo.setEmailVerified(user.id);
  }

  await createSession(user.id, meta);

  await auditRepo.log({
    userId: user.id,
    action: 'OTP_VERIFIED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  await auditRepo.log({
    userId: user.id,
    action: 'SESSION_CREATED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  const safeUser = await userRepo.findByIdSafe(user.id);
  return { user: safeUser };
}

// ─── Logout ─────────────────────────────────────────────────────

export async function logout(
  userId: string,
  meta: { ipAddress: string; userAgent: string }
) {
  await destroySession();

  await auditRepo.log({
    userId,
    action: 'SESSION_DESTROYED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });
}

// ─── Password Reset Request ─────────────────────────────────────

export async function requestPasswordReset(
  email: string,
  meta: { ipAddress: string; userAgent: string }
) {
  const user = await userRepo.findByEmail(email);

  if (!user || !user.isActive) {
    return;
  }

  const { code, hash } = await generateOTP();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await otpRepo.create({
    userId: user.id,
    codeHash: hash,
    purpose: 'reset_password',
    expiresAt,
  });

  await auditRepo.log({
    userId: user.id,
    action: 'PASSWORD_RESET_REQUESTED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  await sendPasswordResetEmail(email, code, user.displayName);
}

// ─── Password Reset Confirm ─────────────────────────────────────

export async function confirmPasswordReset(
  input: { email: string; code: string; newPassword: string },
  meta: { ipAddress: string; userAgent: string }
) {
  const user = await userRepo.findByEmail(input.email);

  if (!user || !user.isActive) {
    throw new UnauthorizedError('Invalid email or verification code');
  }

  const otp = await otpRepo.findLatestValid(user.id, 'reset_password');

  if (!otp) {
    throw new UnauthorizedError('Invalid email or verification code');
  }

  if (otp.attempts >= OTP_MAX_ATTEMPTS) {
    throw new BadRequestError('Too many attempts. Please request a new code.');
  }

  await otpRepo.incrementAttempts(otp.id);

  const isValid = await verifyOTP(input.code, otp.codeHash);

  if (!isValid) {
    throw new UnauthorizedError('Invalid email or verification code');
  }

  const newHash = await hashPassword(input.newPassword);
  await userRepo.updatePassword(user.id, newHash);
  await otpRepo.markUsed(otp.id);

  const { sessionRepo } = await import('@/app/server/repositories/session.repo');
  await sessionRepo.deleteAllForUser(user.id);

  await auditRepo.log({
    userId: user.id,
    action: 'PASSWORD_RESET_COMPLETED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });
}