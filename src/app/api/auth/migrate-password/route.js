export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin not configured.' }, { status: 500 })
    }

    const { email, password } = await request.json()

    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: 'Invalid data provided.' }, { status: 400 })
    }

    // 1. Find user
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('Email', email)
      .single()

    if (fetchError || !user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    // 2. Verify migration status
    if (!user.AD?.includes('[MIGRATED]')) {
      return NextResponse.json({ error: 'This account does not require a migration reset.' }, { status: 400 })
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Update user - clear the [MIGRATED] tag and set the new hashed password
    const newAddress = user.AD.replace('[MIGRATED]', '').trim()

    const { error: updateError } = await supabaseAdmin
      .from('accounts')
      .update({
        PWord: hashedPassword,
        AD: newAddress
      })
      .eq('userID', user.userID)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully. You can now log in.' })

  } catch (err) {
    console.error('Migrate password error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
