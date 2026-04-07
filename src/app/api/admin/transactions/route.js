import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const { data: transactions, error } = await supabaseAdmin
      .from('transactions')
      .select('*')
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

    const { error } = await supabaseAdmin
      .from('transactions')
      .update({ confirmed })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin transactions PATCH error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
