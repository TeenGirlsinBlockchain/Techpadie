
import { NextRequest } from 'next/server';
import { withAuth } from '@/app/middleware/with-auth';
import { getUserCertificates } from '@/app/server/services/certificate.service';
import { success, errorResponse } from '@/app/lib/api-response';

/**
 * GET /api/certificates
 * Returns all certificates for the current user.
 */
export const GET = withAuth(async (_request, { user }) => {
  try {
    const certificates = await getUserCertificates(user.id);
    return success({ certificates });
  } catch (error) {
    return errorResponse(error);
  }
});