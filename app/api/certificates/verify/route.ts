
import { NextRequest } from 'next/server';
import { verifyCertificate } from '@/app/server/services/certificate.service';
import { success, errorResponse } from '@/app/lib/api-response';
import { BadRequestError } from '@/app/lib/api-error';

/**
 * GET /api/certificates/verify?id=TP-2025-A3F9B2
 * PUBLIC — no auth required. Used by employers/institutions to verify.
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const certificateNo = url.searchParams.get('id');

    if (!certificateNo) {
      throw new BadRequestError('Certificate ID is required (?id=TP-XXXX-XXXXXX)');
    }

    const result = await verifyCertificate(certificateNo);

    return success(result);
  } catch (error) {
    return errorResponse(error);
  }
}