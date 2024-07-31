import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();

    // const cookies:any = parseCookies({ req: request });
    // let accessToken;
    // if(!cookies) {
    //      accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
    //     console.log(cookies, "accessToken");
    // }

    // const url = request.nextUrl.clone();

    // if (accessToken) {
    //     url.pathname = '/admin/dashboard';
    //     return NextResponse.redirect(url);
    // } else {
    //     url.pathname = '/auth/signin';
    //     return NextResponse.redirect(url);
    // }
    
    const accessToken = request.cookies.get('COOKIES_USER_ACCESS_TOKEN');
    console.log(accessToken,"accessToken");
    
    if (accessToken) {
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
    } else {
        url.pathname = '/auth/signin';
          return NextResponse.redirect(url);
    }

    // Continue to next middleware/route if no specific conditions are met
    // return NextResponse.next();
}

export const config = {
    matcher: ["/"],
    // matcher: ["/",'/admin/dashboard/:path*',  '/admin/member/:path*', '/admin/meeting/:path*','/admin/manage_questions/:path*','/admin/archive_meeting/:path*','/admin/questionnaire/:path*'],
};