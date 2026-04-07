import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const res = NextResponse.next()
    const session = await getIronSession(request.cookies, {
      password: process.env.SESSION_SECRET,
      cookieName: 'userSession',
    })
    if (!session?.userID) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return res
  }

  // Protect /admin/dashboard routes
  if (pathname.startsWith('/admin/dashboard')) {
    const res = NextResponse.next()
    const session = await getIronSession(request.cookies, {
      password: process.env.SESSION_SECRET,
      cookieName: 'adminSession',
    })
    if (!session?.isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/dashboard/:path*'],
}