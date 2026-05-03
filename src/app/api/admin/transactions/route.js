import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { supabaseAdmin } from '@/lib/supabase'
import { sendFundedEmail, sendWithdrawalStatusEmail } from '@/lib/mailer'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const { data: transactions, error } = await supabaseAdmin
      .from('transactions')
      .select('*, accounts("FName", "LName", "Country")')
      .order('"createdAt"', { ascending: false })

    if (error) throw error

    return NextResponse.json({ transactions: transactions || [] })
  } catch (err) {
    console.error('Admin transactions GET error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getAdminSession()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const { id, confirmed } = await request.json()
    
    if (!id || !confirmed) {
      return NextResponse.json({ error: 'Missing parameters.' }, { status: 400 })
    }

    const { data: tx, error: fetchError } = await supabaseAdmin
      .from('transactions')
      .select('*, accounts("FName")')
      .eq('id', id)
      .single()

    if (fetchError || !tx) {
      return NextResponse.json({ error: 'Transaction not found.' }, { status: 404 })
    }

    const { error } = await supabaseAdmin
      .from('transactions')
      .update({ confirmed })
      .eq('id', id)

    if (error) throw error

    const firstName = tx.accounts?.FName || 'User'
    const amount = parseFloat(tx.amount) || 0

    if (tx.paymentfor === 'investment' && confirmed === 'approved') {
      try {
        await sendFundedEmail(tx.email, firstName, amount, '$', tx.plan?.toUpperCase() || 'INVESTMENT')
      } catch (err) { console.error('Failed to send investment approval email:', err) }
    } else if (tx.paymentfor === 'withdrawal') {
      if (confirmed === 'approved') {
        try {
          await supabaseAdmin
            .from('accounts')
            .update({ investmentAmount: 0 })
            .eq('"userID"', tx.userID)
        } catch (err) { console.error('Failed to reset balance:', err) }
      }
      
      if (confirmed === 'approved' || confirmed === 'declined') {
        try {
          await sendWithdrawalStatusEmail(tx.email, firstName, confirmed, amount, '$', tx.walletAddress)
        } catch (err) { console.error('Failed to send withdrawal email:', err) }
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin transactions PATCH error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
