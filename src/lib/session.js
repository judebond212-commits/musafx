import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'userSession',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
}

const adminSessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'adminSession',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession(cookieStore, sessionOptions)
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  return getIronSession(cookieStore, adminSessionOptions)
}

// For use in API route handlers (req/res not available in App Router)
export { sessionOptions, adminSessionOptions }