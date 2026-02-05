import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protected routes yang memerlukan authentication
  const protectedRoutes = ['/admin'];
  
  // Check if route is protected (but allow /admin/login)
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) && pathname !== '/admin/login'
  );

  if (isProtectedRoute) {
    // Baca cookie untuk session
    const session = request.cookies.get('admin_session')?.value;

    if (!session) {
      // Redirect ke login jika tidak ada session
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
