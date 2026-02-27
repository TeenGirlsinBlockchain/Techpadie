import { certificateRepo } from '@/app/server/repositories/certificate.repo';
import { courseRepo } from '@/app/server/repositories/course.repo';
import { userRepo } from '@/app/server/repositories/user.repo';
import { auditRepo } from '@/app/server/repositories/audit.repo';
import { generateCertificateNo } from '@/app/lib/crypto';
import { NotFoundError } from '@/app/lib/api-error';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

/**
 * Generate a certificate for a user who completed a course.
 * IDEMPOTENT: Returns existing certificate if already issued.
 */
export async function generateCertificate(
  userId: string,
  courseId: string,
  quizScore: number
) {
  // Check if already issued
  const existing = await certificateRepo.findByUserAndCourse(userId, courseId);
  if (existing) return { certificate: existing, alreadyIssued: true };

  // Get user and course details for the certificate
  const [user, course] = await Promise.all([
    userRepo.findByIdSafe(userId),
    courseRepo.findById(courseId),
  ]);

  if (!user) throw new NotFoundError('User not found');
  if (!course) throw new NotFoundError('Course not found');

  // Get course title from default language translation
  const defaultTranslation = course.translations.find(
    (t: { language: any; }) => t.language === course.defaultLanguage
  );
  const courseTitle = defaultTranslation?.title || 'Untitled Course';

  const certificateNo = generateCertificateNo();
  const verificationUrl = `${APP_URL}/api/certificates/verify?id=${certificateNo}`;

  const { certificate, alreadyIssued } = await certificateRepo.create({
    userId,
    courseId,
    certificateNo,
    studentName: user.displayName,
    courseTitle,
    quizScore,
    verificationUrl,
  });

  if (!alreadyIssued) {
    await auditRepo.log({
      userId,
      action: 'CERTIFICATE_ISSUED',
      metadata: { courseId, certificateNo },
    });
  }

  return { certificate, alreadyIssued };
}

/**
 * Public verification — look up certificate by certificate number.
 */
export async function verifyCertificate(certificateNo: string) {
  const cert = await certificateRepo.findByCertificateNo(certificateNo);
  if (!cert) throw new NotFoundError('Certificate not found');

  return {
    valid: true,
    certificateNo: cert.certificateNo,
    studentName: cert.studentName,
    courseTitle: cert.courseTitle,
    quizScore: cert.quizScore,
    issuedAt: cert.issuedAt,
  };
}

/**
 * Get a specific certificate by ID (for authenticated user).
 */
export async function getCertificate(certificateId: string) {
  const cert = await certificateRepo.findById(certificateId);
  if (!cert) throw new NotFoundError('Certificate not found');
  return cert;
}

/**
 * Get all certificates for a user.
 */
export async function getUserCertificates(userId: string) {
  return certificateRepo.findByUser(userId);
}