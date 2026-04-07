
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'
import { HiExternalLink, HiClipboardList } from 'react-icons/hi'
import Link from 'next/link'

export default async function TransactionsPage() {
  const session = await getSession()
  if (!session?.userID) redirect('/auth/login')

  const { data: transactions } = await supabaseAdmin
    .from('transactions')
    .select('*')
    .eq('email', session.Email)
    .order('"createdAt"', { ascending: false })

  const confirmed = transactions?.filter(t => t.confirmed === 'true').length || 0
  const pending = transactions?.filter(t => t.confirmed !== 'true').length || 0
  const totalInvested = transactions?.filter(t => t.paymentfor === 'investment').reduce((s, t) => s + t.amount, 0) || 0
  const totalWithdrawn = transactions?.filter(t => t.paymentfor === 'withdrawal').reduce((s, t) => s + t.amount, 0) || 0

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '700', marginBottom: '6px' }}>Transaction History</h1>
        <p style={{ color: '#555', fontSize: '14px' }}>All deposits, investments and withdrawal requests.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Total Invested', value: `$${totalInvested.toLocaleString()}`, color: '#00c896' },
          { label: 'Total Withdrawn', value: `$${totalWithdrawn.toLocaleString()}`, color: '#3b82f6' },
          { label: 'Confirmed', value: confirmed, color: '#00c896' },
          { label: 'Pending', value: pending, color: '#3b82f6' },
        ].map(card => (
          <div key={card.label} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '18px' }}>
            <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600', marginBottom: '6px' }}>{card.label}</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
        {!transactions?.length ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#444' }}>
            <HiClipboardList size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
            <p style={{ fontSize: '15px', marginBottom: '8px' }}>No transactions yet</p>
            <p style={{ fontSize: '13px', color: '#333' }}>
              <Link href="/dashboard/invest" style={{ color: '#3b82f6', textDecoration: 'none' }}>Make your first investment</Link>
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Date', 'Type', 'Amount', 'Method', 'Screenshot', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#555', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={tx.id}
                    style={{ borderBottom: i < transactions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td style={{ padding: '14px 16px', color: '#888', whiteSpace: 'nowrap' }}>
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-GB') : '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize',
                        background: tx.paymentfor === 'investment' ? 'rgba(0,200,150,0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: tx.paymentfor === 'investment' ? '#00c896' : '#3b82f6',
                        border: `1px solid ${tx.paymentfor === 'investment' ? 'rgba(0,200,150,0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
                      }}>
                        {tx.paymentfor}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: '#fff' }}>${tx.amount.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', color: '#777', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{tx.paymentMethod}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {tx.paymentfor === 'investment' && tx.screenshot ? (
                        <a href={tx.screenshot} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#3b82f6', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>
                          View <HiExternalLink size={12} />
                        </a>
                      ) : (
                        <span style={{ color: '#333', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600',
                        background: tx.confirmed === 'true' ? 'rgba(0,200,150,0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: tx.confirmed === 'true' ? '#00c896' : '#3b82f6',
                        border: `1px solid ${tx.confirmed === 'true' ? 'rgba(0,200,150,0.25)' : 'rgba(59, 130, 246, 0.25)'}`,
                      }}>
                        {tx.confirmed === 'true' ? '✓ Confirmed' : '⏳ Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
