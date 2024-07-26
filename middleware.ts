import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();

    const accessToken = request.cookies.get('COOKIES_USER_ACCESS_TOKEN');
    if (!accessToken) {
        url.pathname = '/auth/signin';
        return NextResponse.redirect(url);
    } else {
        const staticEmail = 'abhay@gmail.com';
        const staticPassword = 'Abhay@1';

        if (request.body &&String( request.body) === staticEmail && String(request.body) === staticPassword) {
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }
    }

    // Continue to next middleware/route if no specific conditions are met
    return NextResponse.next();
}

export const config = {
    matcher: ["/",'/admin/dashboard/:path*',  '/admin/member/:path*', '/admin/meeting/:path*','/admin/manage_questions/:path*','/admin/archive_meeting/:path*','/admin/questionnaire/:path*'],
};