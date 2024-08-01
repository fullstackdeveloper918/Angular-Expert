import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseCookies } from 'nookies';

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
    
    // const cookies = parseCookies();
    // const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
    
    // if (accessToken) {
    //     url.pathname = '/admin/dashboard';
    //     return NextResponse.redirect(url);
    // } else {
    //     url.pathname = '/auth/signin';
    //       return NextResponse.redirect(url);
    // }

    // // Continue to next middleware/route if no specific conditions are met
    // return NextResponse.next();
    let cookie = request.cookies.get('COOKIES_USER_ACCESS_TOKEN')
    console.log(cookie,"cookie") // => { name: 'nextjs', value: 'fast', Path: '/' }
    const allCookies = request.cookies.getAll()
    // console.log(allCookies,"allCookies") // => [{ name: 'nextjs', value: 'fast' }]
   
    request.cookies.has('COOKIES_USER_ACCESS_TOKEN') // => true
    request.cookies.delete('nextjs')
    request.cookies.has('nextjs') // => false
   
    // Setting cookies on the response using the `ResponseCookies` API
    const response = NextResponse.next()
    response.cookies.set('vercel', 'fast')
    response.cookies.set({
      name: 'vercel',
      value: 'fast',
      path: '/',
    })
    cookie = response.cookies.get('vercel')
    console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
    // The outgoing response will have a `Set-Cookie:vercel=fast;path=/` header.
   
    
    return response
    
}

export const config = {
    // matcher:["/"]
    matcher: ["/",'/admin/dashboard/:path*',  '/admin/member/:path*', '/admin/meeting/:path*','/admin/manage_questions/:path*','/admin/archive_meeting/:path*','/admin/questionnaire/:path*'],
    // matcher: ["/",'/admin/dashboard/:path*',  '/admin/member/:path*', '/admin/meeting/:path*','/admin/manage_questions/:path*','/admin/archive_meeting/:path*','/admin/questionnaire/:path*'],
};