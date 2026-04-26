import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths
  if (pathname === '/login' || pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/lamp.png') {
    // If user is trying to access login but already has a valid session, redirect to home
    if (pathname === '/login') {
      const sessionCookie = request.cookies.get('session')?.value;
      if (sessionCookie) {
        try {
          const payload = await decrypt(sessionCookie);
          if (payload) {
            return NextResponse.redirect(new URL('/', request.url));
          }
        } catch (e) {
          // invalid token, let them stay on login page
        }
      }
    }
    return NextResponse.next();
  }

  // Protected paths
  const sessionCookie = request.cookies.get('session')?.value;
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = await decrypt(sessionCookie);
    if (!payload) {
      throw new Error('Invalid token');
    }
    
    // Protect /admin routes
    if (pathname.startsWith('/admin') && !payload.isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (e) {
    // Session is invalid or expired
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
