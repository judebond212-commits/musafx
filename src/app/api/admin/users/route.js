import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { supabaseAdmin } from '@/lib/supabase'
import { sendFundedEmail } from '@/lib/mailer'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const { data: users, error } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .order('"createdAt"', { ascending: false })

    if (error) throw error

    return NextResponse.json({ users: users || [] })
  } catch (err) {
    console.error('Admin users GET error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getAdminSession()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const { userID, field, value } = await request.json()
    
    if (!userID || !field || value === undefined) {
      return NextResponse.json({ error: 'Missing parameters.' }, { status: 400 })
    }

    // Special handling for the fundUser composite action
    if (field === 'fundUser') {
      const { plan, amount } = value
      if (!plan || !amount || isNaN(amount)) {
        return NextResponse.json({ error: 'Invalid funding parameters.' }, { status: 400 })
      }

      // 1. Get the current user profile (for email, country, and current balance)
      const { data: user, error: userError } = await supabaseAdmin
        .from('accounts')
        .select('*')
        .eq('"userID"', userID)
        .single()
      
      if (userError || !user) throw new Error('User not found')

      const newBalance = (parseFloat(user.investmentAmount) || 0) + amount

      // 2. Perform DB update
      const { error: updateError } = await supabaseAdmin
        .from('accounts')
        .update({
          investmentAmount: newBalance,
          investmentPlan: plan,
          investmentDate: new Date().toISOString()
        })
        .eq('"userID"', userID)

      if (updateError) throw updateError

      // 3. Create a transaction record
      try {
        await supabaseAdmin
          .from('transactions')
          .insert([{
            userID: userID,
            email: user.Email,
            paymentfor: 'investment',
            amount: amount,
            paymentMethod: 'Admin Funding',
            plan: plan,
            confirmed: 'approved'
          }])
      } catch (txError) {
        console.error('Failed to create transaction record:', txError)
      }

      // 4. Process email notification
      try {
        await sendFundedEmail(user.Email, user.FName || 'User', amount, '$', plan.toUpperCase())
      } catch (mailError) {
        console.error('Failed to send funding email:', mailError)
        // Proceed with success anyway since DB is updated
      }

      return NextResponse.json({ success: true })
    }

    // Only allow updating certain individual fields for security
    const allowedFields = ['AccountEnabled', 'InvestMentEnabled', 'investmentAmount']
    if (!allowedFields.includes(field)) {
      return NextResponse.json({ error: 'Invalid field.' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('accounts')
      .update({ [field]: value })
      .eq('"userID"', userID)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin users PATCH error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
