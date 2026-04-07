import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { supabaseAdmin } from '@/lib/supabase'

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

    // Only allow updating certain fields for security
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
