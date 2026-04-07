import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const isValidUrl = (url) => {
  try {
    return url && url.startsWith('http')
  } catch {
    return false
  }
}

// Public client (for client-side use only — no sensitive operations)
export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null

// Service-role client — ONLY use in API routes (server-side)
export const supabaseAdmin = isValidUrl(supabaseUrl) && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null