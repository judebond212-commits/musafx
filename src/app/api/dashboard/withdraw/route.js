export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'
import { basePlans } from '@/lib/investment'

export async function POST(request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 })
    }

    const session = await getSession()
    if (!session?.userID) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { amount, walletAddress, paymentMethod } = await request.json()

    if (!amount || Number(amount) < 10) return NextResponse.json({ error: 'Min. withdrawal is $10.' }, { status: 400 })
    if (!walletAddress) return NextResponse.json({ error: 'Bank details required.' }, { status: 400 })

    // 1. Fetch user to check maturity
    const { data: user, error: userErr } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('"userID"', session.userID)
      .single()

    if (userErr || !user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    if (user.AccountEnabled !== 'true') return NextResponse.json({ error: 'Account disabled.' }, { status: 403 })

    const plan = basePlans.find(p => p.id.toLowerCase() === (user.investmentPlan || '').toLowerCase())
    
    // Maturity check
    if (user.investmentDate && plan) {
      const start = new Date(user.investmentDate).getTime()
      const now = Date.now()
      const elapsedMs = now - start
      const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24))
      
      if (elapsedDays < plan.duration) {
        return NextResponse.json({ error: `Withdrawal unavailable. Your plan requires ${plan.duration} days of maturity.` }, { status: 403 })
      }
    } else {
      return NextResponse.json({ error: 'No active investment plan found for withdrawal.' }, { status: 403 })
    }

    // 2. Insert withdrawal transaction
    const { data: tx, error: insertErr } = await supabaseAdmin
      .from('transactions')
      .insert([{
        userID: user.userID,
        email: user.Email,
        paymentfor: 'withdrawal',
        amount: Number(amount),
        paymentMethod: 'Bank Transfer',
        walletAddress, // Store bank details here
        confirmed: 'false',
      }])
      .select()
      .single()

    if (insertErr) {
      console.error('Withdraw insert error:', insertErr)
      return NextResponse.json({ error: 'Failed to submit withdrawal request.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, transaction: tx }, { status: 201 })
  } catch (err) {
    console.error('Withdraw API error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
