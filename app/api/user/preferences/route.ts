import { NextRequest } from 'next/server';
import { requireAuth } from '@/app/lib/auth';
import { updateUserLanguage } from '@/app/server/services/user.service';
import { success, errorResponse } from '@/app/lib/api-response';
import { z } from 'zod';
import { Language } from '@prisma/client';

const preferencesSchema = z.object({
  preferredLanguage: z.nativeEnum(Language).or(
    z.enum(['en', 'fr', 'ar', 'sw', 'ha', 'pt']).transform((val) => val.toUpperCase() as Language)
  ),
});

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await requireAuth();
    const body = await request.json();
    const { preferredLanguage } = preferencesSchema.parse(body);

    const updated = await updateUserLanguage(sessionUser.id, preferredLanguage);

    return success({ user: updated });
  } catch (error) {
    return errorResponse(error);
  }
}
