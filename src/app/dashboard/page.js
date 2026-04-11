import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'
import { HiTrendingUp, HiCurrencyDollar, HiCalendar, HiShieldCheck, HiClock } from 'react-icons/hi'
import Link from 'next/link'
import { calculateCurrentBalance } from '@/lib/investment'

function StatusBadge({ status }) {
  const isActive = status === 'true'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600',
      background: isActive ? 'rgba(0,200,150,0.12)' : 'rgba(255,85,85,0.1)',
      color: isActive ? '#00c896' : '#ff5555',
      border: `1px solid ${isActive ? 'rgba(0,200,150,0.25)' : 'rgba(255,85,85,0.2)'}`,
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

export default async function DashboardHome() {
  const session = await getSession()
  if (!session?.userID) redirect('/auth/login')

  const { data: user } = await supabaseAdmin
    .from('accounts')
    .select('*')
    .eq('"userID"', session.userID)
    .single()

  const { data: transactions } = await supabaseAdmin
    .from('transactions')
    .select('*')
    .eq('email', user.Email)
    .order('"createdAt"', { ascending: false })
    .limit(5)

  // Calculate the current "live" balance based on elapsed time and plan
  const initialUSD = Number(user.investmentAmount) || 0
  const dynamicUSD = calculateCurrentBalance(initialUSD, user.investmentPlan, user.investmentDate)

  // Display values in USD
  const localBalanceValue = dynamicUSD

  const stats = [
    {
      icon: HiCurrencyDollar,
      label: 'Investment Balance',
      value: `$${localBalanceValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      sub: user.investmentPlan || 'No active plan',
      accent: '#3b82f6',
    },
    {
      icon: HiTrendingUp,
      label: 'Investment Plan',
      value: user.investmentPlan || '—',
      sub: <StatusBadge status={user.InvestMentEnabled} />,
      accent: '#00c896',
    },
    {
      icon: HiCalendar,
      label: 'Investment Date',
      value: user.investmentDate ? new Date(user.investmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
      sub: 'Start date',
      accent: '#818cf8',
    },
    {
      icon: HiShieldCheck,
      label: 'Account Status',
      value: <StatusBadge status={user.AccountEnabled} />,
      sub: `Member since ${new Date(user.created_at || Date.now()).getFullYear()}`,
      accent: '#f472b6',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '700', marginBottom: '6px' }}>
          Welcome back, <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user.FName}</span> 👋
        </h1>
        <p style={{ color: '#555', fontSize: '14px' }}>Here's an overview of your investment account.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            padding: '22px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: `radial-gradient(circle, ${s.accent}20, transparent 70%)`, borderRadius: '0 12px 0 0' }} />
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: `${s.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <s.icon size={20} color={s.accent} />
            </div>
            <div style={{ fontSize: '12px', color: '#555', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#444' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600' }}>Recent Transactions</h2>
          <Link href="/dashboard/transactions" style={{ color: '#3b82f6', fontSize: '12px', textDecoration: 'none', fontWeight: '600' }}>
            View all →
          </Link>
        </div>

        {!transactions?.length ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#444', fontSize: '14px' }}>
            <HiClock size={32} style={{ margin: '0 auto 10px', display: 'block', opacity: 0.3 }} />
            No transactions yet. <Link href="/dashboard/invest" style={{ color: '#3b82f6', textDecoration: 'none' }}>Make your first investment</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Date', 'Type', 'Amount', 'Method', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#555', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px', color: '#888', whiteSpace: 'nowrap' }}>
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-GB') : '—'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ textTransform: 'capitalize', color: tx.paymentfor === 'investment' ? '#00c896' : '#3b82f6' }}>{tx.paymentfor}</span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: '600' }}>
                      ${tx.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '12px', color: '#777', textTransform: 'capitalize' }}>{tx.paymentMethod}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 9px', borderRadius: '100px', fontSize: '11px', fontWeight: '600',
                        background: tx.confirmed === 'true' ? 'rgba(0,200,150,0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: tx.confirmed === 'true' ? '#00c896' : '#3b82f6',
                        border: `1px solid ${tx.confirmed === 'true' ? 'rgba(0,200,150,0.25)' : 'rgba(59, 130, 246, 0.25)'}`,
                      }}>
                        {tx.confirmed === 'true' ? 'Confirmed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px', marginTop: '20px' }}>
        <Link href="/dashboard/invest" style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(59, 130, 246, 0.04))',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: '10px', padding: '18px 20px',
          textDecoration: 'none', color: '#3b82f6',
          display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', fontSize: '14px',
        }}>
          <HiTrendingUp size={18} /> New Investment
        </Link>
        <Link href="/dashboard/withdraw" style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px', padding: '18px 20px',
          textDecoration: 'none', color: '#aaa',
          display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500', fontSize: '14px',
        }}>
          <HiCurrencyDollar size={18} /> Request Withdrawal
        </Link>
      </div>
    </div>
  )
}