export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.userID) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: user, error } = await supabaseAdmin
      .from('accounts')
      .select('"userID", "Email", "FName", "LName", "Country", "ST", "AD"')
      .eq('"userID"', session.userID)
      .single()

    if (error || !user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    return NextResponse.json({ user })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession()
    if (!session?.userID) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()

    if (body.type === 'profile') {
      const { FName, LName, Country, ST, AD } = body
      if (!FName || !LName) return NextResponse.json({ error: 'First and last name are required.' }, { status: 400 })
      const { error } = await supabaseAdmin
        .from('accounts')
        .update({ FName, LName, Country: Country || '', ST: ST || '', AD: AD || '' })
        .eq('"userID"', session.userID)
      if (error) throw error
      return NextResponse.json({ success: true })
    }

    if (body.type === 'password') {
      const { current, newPw } = body
      if (!current || !newPw) return NextResponse.json({ error: 'All password fields are required.' }, { status: 400 })
      if (newPw.length < 8) return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 })

      const { data: user, error: fetchErr } = await supabaseAdmin
        .from('accounts')
        .select('"PWord"')
        .eq('"userID"', session.userID)
        .single()

      if (fetchErr || !user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

      const valid = await bcrypt.compare(current, user.PWord)
      if (!valid) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })

      const hashed = await bcrypt.hash(newPw, 10)
      const { error: updateErr } = await supabaseAdmin
        .from('accounts')
        .update({ PWord: hashed })
        .eq('"userID"', session.userID)

      if (updateErr) throw updateErr
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid request type.' }, { status: 400 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
