import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function authMiddleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('better-auth.session_token')
    const { pathname } = request.nextUrl

    // If no session, redirect to sign-in
    if (!sessionCookie && pathname !== '/sign-in') {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // If session exists and user is trying to access sign-in, redirect to dashboard
    if (sessionCookie && pathname === '/sign-in') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }



    // Otherwise, let the request pass
    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/sign-in'], // apply to dashboard routes and sign-in
}
