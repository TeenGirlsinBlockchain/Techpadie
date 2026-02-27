
import { NextRequest } from 'next/server';
import { withAuth } from '@/app/middleware/with-auth';
import { getCertificate } from '@/app/server/services/certificate.service';
import { success, errorResponse } from '@/app/lib/api-response';

/**
 * GET /api/certificates/[certificateId]
 */
export const GET = withAuth(async (_request, { user, params }) => {
  try {
    const certificate = await getCertificate(params!.certificateId);
    return success({ certificate });
  } catch (error) {
    return errorResponse(error);
  }
});