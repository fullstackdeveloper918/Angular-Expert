import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    console.log('middleware called');

    const accessToken = request.cookies.get('COOKIES_USER_ACCESS_TOKEN');
    console.log(accessToken, "accessToken")
    // debugger
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
    matcher: [  '/dashboard/:path*', '/artists/:path*', '/content/:path*', '/faq/:path*', '/badge-info/:path*', '/rewards/:path*', '/orders/:path*', '/transaction/user/:path*', '/transaction/artist/:path*', '/commission', '/commission/edit', '/contact-us/:path*', '/cloud-messaging', '/database', '/staff/:path*', '/points/:path*', '/genre/:path*'],
};