export const dynamic = 'force-dynamic'

import { createHash } from 'crypto'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function hashToken(token) {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}

export async function POST(request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 })
    }

    const body = await request.json()
    const token = String(body?.token || '').trim()
    const password = String(body?.password || '')

    if (!token || token.length < 32) {
      return NextResponse.json({ error: 'Invalid or expired reset link.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const tokenHash = hashToken(token)
    const nowIso = new Date().toISOString()

    const { data: row, error: fetchErr } = await supabaseAdmin
      .from('password_reset_tokens')
      .select('id, userID, expiresAt, usedAt')
      .eq('tokenHash', tokenHash)
      .maybeSingle()

    if (fetchErr || !row) {
      return NextResponse.json({ error: 'Invalid or expired reset link.' }, { status: 400 })
    }
    if (row.usedAt) {
      return NextResponse.json({ error: 'This reset link was already used.' }, { status: 400 })
    }
    if (row.expiresAt < nowIso) {
      return NextResponse.json({ error: 'This reset link has expired. Request a new one.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { error: updateErr } = await supabaseAdmin
      .from('accounts')
      .update({ PWord: hashedPassword })
      .eq('"userID"', row.userID)

    if (updateErr) {
      console.error('reset-password update:', updateErr)
      return NextResponse.json({ error: 'Could not update password.' }, { status: 500 })
    }

    await supabaseAdmin
      .from('password_reset_tokens')
      .update({ usedAt: nowIso })
      .eq('id', row.id)

    return NextResponse.json({ success: true, message: 'Your password has been updated.' }, { status: 200 })
  } catch (err) {
    console.error('reset-password:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
