
import { z } from 'zod';

// ─── Signup ─────────────────────────────────────────────────────

export const signupSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(255)
    .transform((e) => e.toLowerCase().trim()),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase, one uppercase, and one digit'
    ),
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(100)
    .trim(),
});

export type SignupInput = z.infer<typeof signupSchema>;

// ─── Login Step 1 (Email + Password) ────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(255)
    .transform((e) => e.toLowerCase().trim()),
  password: z.string().min(1, 'Password is required').max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Login Step 2 (OTP Verification) ────────────────────────────

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(255)
    .transform((e) => e.toLowerCase().trim()),
  code: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must be numeric'),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

// ─── Password Reset Request ─────────────────────────────────────

export const resetPasswordRequestSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(255)
    .transform((e) => e.toLowerCase().trim()),
});

export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;

// ─── Password Reset Confirm ─────────────────────────────────────

export const resetPasswordConfirmSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(255)
    .transform((e) => e.toLowerCase().trim()),
  code: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must be numeric'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase, one uppercase, and one digit'
    ),
});

export type ResetPasswordConfirmInput = z.infer<typeof resetPasswordConfirmSchema>;