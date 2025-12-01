import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const protectedRoutes = ['/dashboard'];

    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        const sessionCookie = request.cookies.get('better-auth.session_token');

        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/', request.url));
        }


    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*',]
};