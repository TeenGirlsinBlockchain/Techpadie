
import { randomBytes, createHash } from 'crypto';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

// ─── Password Hashing ──────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── OTP ────────────────────────────────────────────────────────

/**
 * Generate a 6-digit numeric OTP.
 * Returns both the plain code (for emailing) and the hash (for DB storage).
 */
export async function generateOTP(): Promise<{
  code: string;
  hash: string;
}> {
  // Crypto-secure random 6-digit code
  const buffer = randomBytes(4);
  const num = buffer.readUInt32BE(0);
  const code = String(num % 1000000).padStart(6, '0');

  const hash = await bcrypt.hash(code, SALT_ROUNDS);

  return { code, hash };
}

export async function verifyOTP(
  code: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

// ─── Session Tokens ─────────────────────────────────────────────

/**
 * Generate a cryptographically secure session token.
 * 48 bytes = 64 chars base64url, plenty of entropy.
 */
export function generateSessionToken(): string {
  return randomBytes(48).toString('base64url');
}

// ─── Content Hashing ────────────────────────────────────────────

/**
 * SHA-256 hash of content string.
 * Used to detect lesson text changes for AI/audio regeneration.
 */
export function hashContent(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

// ─── Certificate Number ─────────────────────────────────────────

/**
 * Generate a human-readable certificate number.
 * Format: TP-{YEAR}-{6 random hex chars uppercase}
 * Example: TP-2025-A3F9B2
 */
export function generateCertificateNo(): string {
  const year = new Date().getFullYear();
  const hex = randomBytes(3).toString('hex').toUpperCase();
  return `TP-${year}-${hex}`;
}