
import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'tp_session';

// Routes that require authentication (checked at edge level)
const PROTECTED_PREFIXES = [
  '/api/admin',
  '/api/creator',
  '/api/rewards',
  '/api/certificates',
];

// Routes that require auth but are mixed (some sub-routes are public)
const AUTH_REQUIRED_PATTERNS = [
  /^\/api\/courses\/[^/]+\/enroll$/,
  /^\/api\/courses\/[^/]+\/lessons\/[^/]+\/progress$/,
  /^\/api\/quiz\/.+/,
  /^\/api\/auth\/me$/,
  /^\/api\/auth\/logout$/,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip non-API routes and public endpoints
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Check if route requires auth
  const needsAuth =
    PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    AUTH_REQUIRED_PATTERNS.some((pattern) => pattern.test(pathname));

  if (!needsAuth) {
    return NextResponse.next();
  }

  // Quick session cookie check at edge (fast rejection)
  // Full session validation happens in route handler via requireAuth()
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};