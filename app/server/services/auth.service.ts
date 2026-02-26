import { userRepo } from '@/app/server/repositories/user.repo';
import { otpRepo } from '@/app/server/repositories/session.repo';
import { auditRepo } from '@/app/server/repositories/audit.repo';
import {
  hashPassword,
  verifyPassword,
  generateOTP,
  verifyOTP,
} from '@/app/lib/crypto';
import { createSession, destroySession } from '@/app/lib/auth';
import { sendOTPEmail, sendWelcomeEmail, sendPasswordResetEmail } from '@/app/lib/email';
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
  // Check if email already exists
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

  // Audit
  await auditRepo.log({
    userId: user.id,
    action: 'USER_SIGNUP',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    metadata: { email: input.email },
  });

  // Send welcome email (fire-and-forget, don't block signup)
  sendWelcomeEmail(input.email, input.displayName).catch((err) => {
    logger.error('Welcome email failed', err instanceof Error ? err : new Error(String(err)));
  });

  return user;
}

// ─── Login Step 1 (Email + Password → Send OTP) ────────────────

/**
 * Validates credentials. If valid, generates and sends OTP.
 * Returns a generic response to prevent user enumeration.
 *
 * ANTI-ENUMERATION: Whether the email exists or not, the response
 * is the same: "If the account exists, an OTP has been sent."
 */
export async function loginStep1(
  input: LoginInput,
  meta: { ipAddress: string; userAgent: string }
): Promise<{ otpRequired: true }> {
  const user = await userRepo.findByEmail(input.email);

  if (!user || !user.isActive) {
    // Anti-enumeration: don't reveal that user doesn't exist
    // Add a small delay to match the timing of a real password check
    await hashPassword('dummy-to-match-timing');

    await auditRepo.log({
      action: 'USER_LOGIN_FAILED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      metadata: { email: input.email, reason: 'user_not_found' },
    });

    // Return same shape as success — caller can't tell the difference
    return { otpRequired: true };
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

    // Same anti-enumeration response
    return { otpRequired: true };
  }

  // Password correct → Generate and send OTP
  const { code, hash } = await generateOTP();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await otpRepo.create({
    userId: user.id,
    codeHash: hash,
    purpose: 'login',
    expiresAt,
  });

  await auditRepo.log({
    userId: user.id,
    action: 'OTP_SENT',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    metadata: { purpose: 'login' },
  });

  // Send OTP email
  const emailResult = await sendOTPEmail(input.email, code, user.displayName);
  if (!emailResult.success) {
    logger.error(
      'OTP email delivery failed',
      new Error(emailResult.error || 'unknown'),
      { userId: user.id }
    );
    // Still return otpRequired — user can retry
  }

  return { otpRequired: true };
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

  // Find latest valid OTP
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

  // Check attempt limit
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

  // Increment attempts BEFORE verifying (prevents race conditions)
  await otpRepo.incrementAttempts(otp.id);

  // Verify code
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

  // OTP valid → mark used + create session
  await otpRepo.markUsed(otp.id);

  // Mark email as verified (first successful OTP = email confirmed)
  if (!user.emailVerified) {
    await userRepo.setEmailVerified(user.id);
  }

  // Create session (sets HttpOnly cookie)
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

  // Return safe user data
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

/**
 * Anti-enumeration: always returns the same response.
 */
export async function requestPasswordReset(
  email: string,
  meta: { ipAddress: string; userAgent: string }
) {
  const user = await userRepo.findByEmail(email);

  if (!user || !user.isActive) {
    // Anti-enumeration: don't reveal user existence
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

  // Update password
  const newHash = await hashPassword(input.newPassword);
  await userRepo.updatePassword(user.id, newHash);
  await otpRepo.markUsed(otp.id);

  // Destroy all existing sessions (force re-login)
  const { sessionRepo } = await import('@/server/repositories/session.repo');
  await sessionRepo.deleteAllForUser(user.id);

  await auditRepo.log({
    userId: user.id,
    action: 'PASSWORD_RESET_COMPLETED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });
}