import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect old routes to new dashboard routes
  const redirectMap: { [key: string]: string } = {
    '/helmets': '/dashboard/helmets',
    '/gas-analytics': '/dashboard/gas-analytics',
    '/environment': '/dashboard/environment',
    '/impacts': '/dashboard/impacts',
    '/compliance': '/dashboard/compliance',
    '/network': '/dashboard/network',
    '/settings': '/dashboard/settings',
  };

  if (redirectMap[pathname]) {
    return NextResponse.redirect(new URL(redirectMap[pathname], request.url));
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
  ],
};
