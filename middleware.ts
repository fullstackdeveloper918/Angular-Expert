import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token =" request.cookies.get('COOKIES_USER_ACCESS_TOKEN');"

  if (!token) {
      // If not authenticated, redirect to login
      return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // If authenticated, allow the request to proceed
  return NextResponse.next();
}

export const config = {
    // matcher:["/"]
    matcher: ["/",'/admin/dashboard/:path*',  '/admin/member/:path*', '/admin/meeting/:path*','/admin/manage_questions/:path*','/admin/archive_meeting/:path*','/admin/questionnaire/:path*'],
    // matcher: ["/",'/admin/dashboard/:path*',  '/admin/member/:path*', '/admin/meeting/:path*','/admin/manage_questions/:path*','/admin/archive_meeting/:path*','/admin/questionnaire/:path*'],
};