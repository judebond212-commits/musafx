export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'

export async function POST(request) {
  try {
    if (!supabaseAdmin) {
      console.error(
        'Invest error: Supabase admin client not configured. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
      )
      return NextResponse.json(
        { error: 'Server misconfiguration. Please try again later.' },
        { status: 500 }
      )
    }

    const session = await getSession()
    if (!session?.userID) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const plan = String(body?.plan || '')
    const amount = Number(body?.amount)
    const paymentMethod = String(body?.paymentMethod || '')
    const screenshot = String(body?.screenshot || '')

    if (!plan) return NextResponse.json({ error: 'Missing plan.' }, { status: 400 })
    if (!Number.isFinite(amount) || amount < 100) {
      return NextResponse.json({ error: 'Invalid amount (min. $100).' }, { status: 400 })
    }
    if (!paymentMethod) return NextResponse.json({ error: 'Missing payment method.' }, { status: 400 })
    if (!screenshot) return NextResponse.json({ error: 'Missing screenshot URL.' }, { status: 400 })

    const { data: user, error: userErr } = await supabaseAdmin
      .from('accounts')
      .select('"userID", "Email", "AccountEnabled"')
      .eq('"userID"', session.userID)
      .single()

    if (userErr || !user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    if (user.AccountEnabled !== 'true') return NextResponse.json({ error: 'Account disabled.' }, { status: 403 })

    const { data: tx, error: insertErr } = await supabaseAdmin
      .from('transactions')
      .insert([{
        userID: user.userID,
        email: user.Email,
        paymentfor: 'investment',
        amount,
        paymentMethod,
        plan,
        screenshot,
        confirmed: 'false',
      }])
      .select()
      .single()

    if (insertErr) {
      console.error('Invest insert error:', insertErr)
      return NextResponse.json({ error: 'Failed to submit investment.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, transaction: tx }, { status: 201 })
  } catch (err) {
    console.error('Invest error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

