import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'
import { basePlans, calculateCurrentBalance } from '@/lib/investment'
import WithdrawForm from './WithdrawForm'

export default async function WithdrawPage() {
  const session = await getSession()
  if (!session?.userID) redirect('/auth/login')

  const { data: user } = await supabaseAdmin
    .from('accounts')
    .select('*')
    .eq('"userID"', session.userID)
    .single()

  if (!user || user.AccountEnabled !== 'true') redirect('/auth/login')

  const plan = basePlans.find(p => p.id.toLowerCase() === (user.investmentPlan || '').toLowerCase())
  
  // Calculate current balance (Amount to withdraw)
  const balance = calculateCurrentBalance(Number(user.investmentAmount) || 0, user.investmentPlan, user.investmentDate)

  let isMature = false
  let remainingDays = 0

  if (user.investmentDate && plan) {
    const start = new Date(user.investmentDate).getTime()
    const now = Date.now()
    const elapsedMs = now - start
    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24))
    
    isMature = elapsedDays >= plan.duration
    remainingDays = Math.max(0, plan.duration - elapsedDays)
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '700', marginBottom: '6px' }}>Withdraw Funds</h1>
        <p style={{ color: '#555', fontSize: '14px' }}>Securely withdraw your earnings to your bank account.</p>
      </div>

      <WithdrawForm 
        user={user} 
        balance={balance}
        isMature={isMature} 
        remainingDays={remainingDays} 
        plan={plan} 
      />
    </div>
  )
}