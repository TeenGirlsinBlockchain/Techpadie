import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiError } from './api-error';
import { logger } from './logger';

// ─── Success Responses ──────────────────────────────────────────

interface SuccessOptions {
  status?: number;
  headers?: Record<string, string>;
}

export function success<T>(data: T, options: SuccessOptions = {}) {
  const { status = 200, headers } = options;

  return NextResponse.json(
    { success: true, data },
    { status, headers }
  );
}

export function created<T>(data: T) {
  return success(data, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

// ─── Error Response ─────────────────────────────────────────────

export function errorResponse(error: unknown) {
  // Known API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.statusCode }
    );
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    const details = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return NextResponse.json(
      { success: false, error: 'Validation failed', details },
      { status: 400 }
    );
  }

  // Prisma unique constraint violation
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2002'
  ) {
    return NextResponse.json(
      { success: false, error: 'Resource already exists' },
      { status: 409 }
    );
  }

  // Unknown/unexpected errors — log but don't expose internals
  logger.error(
    'Unhandled error',
    error instanceof Error ? error : new Error(String(error))
  );

  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}