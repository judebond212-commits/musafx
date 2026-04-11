'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { HiInformationCircle, HiLockClosed } from 'react-icons/hi'

export default function WithdrawForm({ user, isMature, remainingDays, plan }) {
  const router = useRouter()
  const [form, setForm] = useState({ amount: '', walletAddress: '', paymentMethod: 'Bank Transfer' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isMature) {
      toast.error(`Withdrawal is locked. Available in ${remainingDays} days.`)
      return
    }
    if (!form.amount || Number(form.amount) < 10) { toast.error('Minimum withdrawal is $10.'); return }
    if (!form.walletAddress.trim()) { toast.error('Please enter your bank account details.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, paymentMethod: 'Bank Transfer' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Withdrawal request failed.')
      
      toast.success('We have received your withdrawal request.')
      setForm({ amount: '', walletAddress: '', paymentMethod: 'Bank Transfer' })
      router.push('/dashboard/transactions')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isMature) {
    return (
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <HiLockClosed size={30} color="#3b82f6" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Withdrawal Locked</h2>
        <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px', margin: '0 auto' }}>
          Your investment in the <strong style={{ color: '#aaa' }}>{plan?.name}</strong> is currently active. 
          Withdrawals will be available after the {plan?.duration}-day duration has elapsed.
        </p>
        <div style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: '#888' }}>
          <span>Available in:</span>
          <strong style={{ color: '#3b82f6' }}>{remainingDays} days</strong>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px', maxWidth: '800px' }}>
      {/* Form */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '28px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Amount (USD)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555', fontSize: '14px' }}>$</span>
              <input
                className="input-dark"
                type="number"
                placeholder="0.00"
                min="10"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                style={{ paddingLeft: '26px' }}
              />
            </div>
            <p style={{ color: '#444', fontSize: '11px', marginTop: '4px' }}>Minimum withdrawal: $10</p>
          </div>

          <div>
            <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Payment Method</label>
            <div className="input-dark" style={{ background: 'rgba(255,255,255,0.02)', cursor: 'not-allowed', color: '#666' }}>
              Bank Transfer
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Bank Account Details</label>
            <textarea
              className="input-dark"
              placeholder="Bank name, Account number, SWIFT/BIC, IBAN..."
              rows={4}
              value={form.walletAddress}
              onChange={e => setForm({ ...form, walletAddress: e.target.value })}
              style={{ resize: 'vertical' }}
            />
            <p style={{ color: '#444', fontSize: '11px', marginTop: '4px' }}>⚠ Ensure all bank details are accurate to avoid delays.</p>
          </div>

          <button type="submit" className="btn-accent" disabled={loading} style={{ padding: '13px', fontSize: '15px' }}>
            {loading ? 'Submitting...' : 'Request Withdrawal'}
          </button>
        </form>
      </div>

      {/* Info Panel */}
      <div>
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6' }}>
            <HiInformationCircle size={16} /> Withdrawal Guidelines
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '🏦', title: 'Bank Only', desc: 'Secure bank transfers are the exclusive withdrawal method' },
              { icon: '⏱', title: 'Processing Time', desc: '24–72 business hours after submission' },
              { icon: '✅', title: 'Maturity Required', desc: 'Withdrawal is only available after investment duration' },
              { icon: '🔒', title: 'Verification', desc: 'Identity verification may be required for security' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#ccc', marginBottom: '2px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.5' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
