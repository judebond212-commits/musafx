export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'

export async function POST(request) {
  try {
    if (!supabaseAdmin) {
      console.error(
        'Login error: Supabase admin client not configured. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
      )
      return NextResponse.json(
        { error: 'Server misconfiguration. Please try again later.' },
        { status: 500 }
      )
    }

    const { Email, PWord } = await request.json()

    if (!Email || !PWord) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    // Look up user
    const { data: user, error } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('"Email"', Email)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    // Check account enabled
    if (user.AccountEnabled !== 'true') {
      return NextResponse.json({ error: 'Your account has been disabled. Please contact support.' }, { status: 403 })
    }

    // Compare password
    const valid = await bcrypt.compare(PWord, user.PWord)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    // Create session
    const res = NextResponse.json({ success: true })
    const session = await getSession()
    session.userID = user.userID
    session.Email = user.Email
    session.FName = user.FName
    await session.save()

    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
