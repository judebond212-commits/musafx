export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { sendSupportEmail } from '@/lib/mailer'

export async function POST(request) {
  try {
    const { name, email, message } = await request.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    await sendSupportEmail({ name, email, message })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
