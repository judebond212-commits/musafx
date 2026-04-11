import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'
import InvestForm from './InvestForm'

export default async function InvestPageServer() {
  const session = await getSession()
  if (!session?.userID) redirect('/auth/login')

  const { data: user } = await supabaseAdmin
    .from('accounts')
    .select('investmentPlan, investmentDate, investmentAmount, InvestMentEnabled')
    .eq('"userID"', session.userID)
    .single()

  const { data: history } = await supabaseAdmin
    .from('transactions')
    .select('id')
    .eq('email', session.Email)
    .eq('paymentfor', 'investment')
    .eq('confirmed', 'true')
    .limit(1)

  return (
    <InvestForm 
      userPlan={user?.investmentPlan}
      startDate={user?.investmentDate}
      initialAmount={Number(user?.investmentAmount) || 0}
      isEnabled={user?.InvestMentEnabled === 'true'}
      hasHistory={!!history?.length}
    />
  )
}
