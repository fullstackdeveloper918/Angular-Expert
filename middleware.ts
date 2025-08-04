// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = " request.cookies.get('COOKIES_USER_ACCESS_TOKEN');";

//   if (!token) {
//     // If not authenticated, redirect to login
//     return NextResponse.redirect(new URL("/auth/signin", request.url));
//   }

//   // If authenticated, allow the request to proceed
//   return NextResponse.next();
// }

// export const config = {
//   // matcher:["/"]
//   matcher: [
//     "/",
//     "/admin/dashboard/:path*",
//     "/admin/member/:path*",
//     "/admin/meeting/:path*",
//     "/admin/manage_questions/:path*",
//     "/admin/archive_meeting/:path*",
//     "/admin/questionnaire/:path*",
//   ],
//   // matcher: ["/",'/admin/dashboard/:path*',  '/admin/member/:path*', '/admin/meeting/:path*','/admin/manage_questions/:path*','/admin/archive_meeting/:path*','/admin/questionnaire/:path*'],
// };
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userToken = request.cookies.get('COOKIES_USER_ACCESS_TOKEN')?.value;
  // const username:any = request.cookies.get('Username') || ''; // Default to empty string if undefined
  // const password:any = request.cookies.get('Password') || '';

  // const correctUsername = 'abhay@gmail.com';
  // const correctPassword = 'Abhay@123';

  // console.log('userToken', userToken);
  // console.log('Retrieved Username:', username);
  // console.log('Retrieved Password:', password);

  // if (username === correctUsername && password === correctPassword) {
  //   return NextResponse.redirect(new URL("/multistep_form", request.url));
  // } 
  // return NextResponse.next();

  if(!userToken){
    return NextResponse.redirect(new URL('/auth/signin',request.url))
  }
    else{
      return NextResponse.next();
    }
}



// Update matcher configuration to ensure middleware is applied correctly
export const config = {
  matcher: [
    // // Apply middleware to specific paths
    // // "/multistep_form/:path*",
    // // "/dashboard/:path*",
    // "/user_list/:path*",
    // // "/board/",
    // "/share/:path*",
    // "/card/boardpay/:path*",
    // "/account/:path*",
    "/",
        "/admin/dashboard/:path*",
        "/admin/member/:path*",
        "/admin/meeting/:path*",
        "/admin/manage_questions/:path*",
      "/admin/archive_meeting/:path*",
        "/admin/questionnaire/:path*",
        "/admin/manage_questions/:path*",
    // Optionally, apply to other paths if needed
  ],
}
