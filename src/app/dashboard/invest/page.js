import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'
import { getUserCurrency } from '@/lib/currency'
import InvestForm from './InvestForm'

export default async function InvestPageServer() {
  const session = await getSession()
  if (!session?.userID) redirect('/auth/login')

  const { data: user } = await supabaseAdmin
    .from('accounts')
    .select('Country')
    .eq('"userID"', session.userID)
    .single()

  const userRate = await getUserCurrency(1, user?.Country)

  return <InvestForm userRate={userRate} />
}
