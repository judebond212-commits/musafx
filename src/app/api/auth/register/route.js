export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { sendWelcomeEmail } from '@/lib/mailer'

export async function POST(request) {
  try {
    if (!supabaseAdmin) {
      console.error(
        'Register error: Supabase admin client not configured. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
      )
      return NextResponse.json(
        { error: 'Server misconfiguration. Please try again later.' },
        { status: 500 }
      )
    }

    const { FName, LName, Email, PWord } = await request.json()

    // Validate
    if (!FName || !LName || !Email || !PWord) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (PWord.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }
    if (!/\S+@\S+\.\S+/.test(Email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from('accounts')
      .select('"userID"')
      .eq('"Email"', Email)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(PWord, 10)

    // Insert new user
    const { data, error } = await supabaseAdmin
      .from('accounts')
      .insert([{
        Email,
        FName,
        LName,
        PWord: hashedPassword,
        investmentAmount: 0,
        investmentPlan: '',
        InvestMentEnabled: 'false',
        firstBillingEnabled: 'false',
        Country: '',
        ST: '',
        AD: '',
        AccountEnabled: 'true',
      }])
      .select()
      .single()

    if (error) {
      console.error('DB insert error:', error)
      return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 })
    }

    // Send welcome email (non-blocking)
    sendWelcomeEmail(Email, FName).catch(err => console.error('Welcome email failed:', err))

    return NextResponse.json({ success: true, message: 'Account created successfully.' }, { status: 201 })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
