import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/forgot-password', '/reset-password'];

const REDIRECT_MAP: Record<string, string> = {
  '/helmets': '/dashboard/helmets',
  '/gas-analytics': '/dashboard/gas-analytics',
  '/environment': '/dashboard/environment',
  '/impacts': '/dashboard/impacts',
  '/compliance': '/dashboard/compliance',
  '/network': '/dashboard/network',
  '/settings': '/dashboard/settings',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (REDIRECT_MAP[pathname]) {
    return NextResponse.redirect(new URL(REDIRECT_MAP[pathname], request.url));
  }

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith('/docs'),
  );
  const isProtected =
    pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  if (isProtected && !isPublic) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/helmets',
    '/gas-analytics',
    '/environment',
    '/impacts',
    '/compliance',
    '/network',
    '/settings',
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};
