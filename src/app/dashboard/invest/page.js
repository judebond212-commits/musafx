import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'
import InvestForm from './InvestForm'

export default async function InvestPageServer() {
  const session = await getSession()
  if (!session?.userID) redirect('/auth/login')

  return <InvestForm />
}
