import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_PASSWORD || 'default_secret_fallback');

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // We only care about /admin and /api/admin routes
  // Bypass middleware for public catalog endpoints
  const publicApiPaths = ['/api/admin/login', '/api/admin/models', '/api/admin/presets', '/api/admin/components', '/api/admin/seed-now'];
  if (publicApiPaths.some(p => pathname.startsWith(p)) && request.method === 'GET') {
    return NextResponse.next();
  }
  
  if (pathname.startsWith('/api/admin/login')) {
    return NextResponse.next();
  }

  // We only care about /admin and /api/admin routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  // Allow unrestricted access to the login pages/APIs
  if (pathname === '/admin/login' || pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
    return NextResponse.next();
  }

  // Extract the token from cookies
  const token = request.cookies.get('admin_session')?.value;

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  try {
    // Verify the JWT token
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    // Invalid or expired token
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
