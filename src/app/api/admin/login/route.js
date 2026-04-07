import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 })
    }

    const res = NextResponse.json({ success: true })
    const session = await getAdminSession()
    session.isAdmin = true
    session.email = email
    await session.save()

    return res
  } catch (err) {
    console.error('Admin login error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}