import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }
  }

  // Check auth for protected routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/projects') ||
    request.nextUrl.pathname.startsWith('/settings') ||
    request.nextUrl.pathname.startsWith('/billing') ||
    request.nextUrl.pathname.startsWith('/planner') ||
    request.nextUrl.pathname.startsWith('/dashboard');

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup');

  // Get session from Better Auth via internal API call
  let session = null;
  if (isProtectedRoute || isAuthRoute) {
    try {
      // Call the session API internally
      const sessionUrl = new URL('/api/auth/get-session', request.url);
      const sessionResponse = await fetch(sessionUrl, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });
      if (sessionResponse.ok) {
        session = await sessionResponse.json();
      }
    } catch (error) {
      // Session check failed, treat as unauthenticated
      console.error('Session check failed:', error);
    }
  }

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/projects', request.url));
  }

  // Check email verification for protected routes
  if (isProtectedRoute && session && !session.user?.emailVerified) {
    // Allow access to verify-email page
    if (!request.nextUrl.pathname.startsWith('/verify-email')) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
