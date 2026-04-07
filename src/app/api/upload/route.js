import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const MAX_BYTES = 5 * 1024 * 1024
const DEFAULT_BUCKET = process.env.SUPABASE_UPLOAD_BUCKET || 'uploads'

function safeExtFromMime(mime) {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/webp') return 'webp'
  return null
}

export async function POST(request) {
  try {
    if (!supabaseAdmin) {
      console.error(
        'Upload error: Supabase admin client not configured. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
      )
      return NextResponse.json(
        { error: 'Server misconfiguration. Please try again later.' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'Missing file.' }, { status: 400 })
    }
    if (typeof file === 'string') {
      return NextResponse.json({ error: 'Invalid file.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File must be under 5MB.' }, { status: 400 })
    }

    const ext = safeExtFromMime(file.type)
    if (!ext) {
      return NextResponse.json({ error: 'Only PNG, JPG, or WEBP images are allowed.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const path = `payments/${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from(DEFAULT_BUCKET)
      .upload(path, bytes, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: uploadError.message || 'Upload failed.' },
        { status: 500 }
      )
    }

    const { data } = supabaseAdmin.storage.from(DEFAULT_BUCKET).getPublicUrl(path)
    if (!data?.publicUrl) {
      return NextResponse.json({ error: 'Failed to generate file URL.' }, { status: 500 })
    }

    return NextResponse.json({ url: data.publicUrl }, { status: 200 })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

