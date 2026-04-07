export const dynamic = 'force-dynamic'

import { createHash, randomBytes } from 'crypto'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendPasswordResetEmail } from '@/lib/mailer'

const TOKEN_BYTES = 32
const EXPIRY_MS = 60 * 60 * 1000 // 1 hour

function hashToken(token) {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}

export async function POST(request) {
  const genericMessage = 'If an account exists for that email, we sent a password reset link.'

  try {
    if (!supabaseAdmin) {
      console.error('forgot-password: Supabase admin not configured.')
      return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 })
    }

    const body = await request.json()
    const email = String(body?.email || '').trim().toLowerCase()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }

    const { data: user, error: userErr } = await supabaseAdmin
      .from('accounts')
      .select('"userID", "Email", "FName"')
      .ilike('Email', email)
      .maybeSingle()

    if (userErr) {
      console.error('forgot-password lookup:', userErr)
    }

    if (!user) {
      return NextResponse.json({ message: genericMessage }, { status: 200 })
    }

    const rawToken = randomBytes(TOKEN_BYTES).toString('hex')
    const tokenHash = hashToken(rawToken)
    const expiresAt = new Date(Date.now() + EXPIRY_MS).toISOString()

    const uid = user.userID
    await supabaseAdmin.from('password_reset_tokens').delete().eq('userID', uid)

    const { error: insertErr } = await supabaseAdmin.from('password_reset_tokens').insert([
      {
        userID: uid,
        tokenHash,
        expiresAt,
        usedAt: null,
      },
    ])

    if (insertErr) {
      console.error('forgot-password insert:', insertErr)
      return NextResponse.json({ error: 'Could not start reset. Please try again.' }, { status: 500 })
    }

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '') || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/auth/reset-password?token=${encodeURIComponent(rawToken)}`

    try {
      await sendPasswordResetEmail(user.Email, user.FName, resetUrl)
    } catch (mailErr) {
      console.error('forgot-password email:', mailErr)
      await supabaseAdmin.from('password_reset_tokens').delete().eq('tokenHash', tokenHash)
      return NextResponse.json({ error: 'Could not send email. Please try again later.' }, { status: 500 })
    }

    return NextResponse.json({ message: genericMessage }, { status: 200 })
  } catch (err) {
    console.error('forgot-password:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
