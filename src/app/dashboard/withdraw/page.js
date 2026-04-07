'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { HiCurrencyDollar, HiInformationCircle } from 'react-icons/hi'

const paymentMethods = ['Bitcoin (BTC)', 'USDT (TRC20)', 'USDT (ERC20)', 'Bank Transfer']

export default function WithdrawPage() {
  const router = useRouter()
  const [form, setForm] = useState({ amount: '', walletAddress: '', paymentMethod: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.amount || Number(form.amount) < 10) { toast.error('Minimum withdrawal is $10.'); return }
    if (!form.walletAddress.trim()) { toast.error('Please enter your wallet address or bank details.'); return }
    if (!form.paymentMethod) { toast.error('Please select a payment method.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Withdrawal request failed.')
      toast.success('Withdrawal request submitted! Processing within 24–48 hours.')
      setForm({ amount: '', walletAddress: '', paymentMethod: '' })
      router.push('/dashboard/transactions')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '700', marginBottom: '6px' }}>Withdraw Funds</h1>
        <p style={{ color: '#555', fontSize: '14px' }}>Request a withdrawal — processed within 24–48 business hours.</p>
      </div>

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
              <select
                className="input-dark"
                value={form.paymentMethod}
                onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                style={{ cursor: 'pointer' }}
              >
                <option value="">Select method</option>
                {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                {form.paymentMethod === 'Bank Transfer' ? 'Bank Account Details' : 'Wallet Address'}
              </label>
              <textarea
                className="input-dark"
                placeholder={
                  form.paymentMethod === 'Bank Transfer'
                    ? 'Bank name, account number, sort code / IBAN...'
                    : 'Enter your crypto wallet address'
                }
                rows={3}
                value={form.walletAddress}
                onChange={e => setForm({ ...form, walletAddress: e.target.value })}
                style={{ resize: 'vertical' }}
              />
              <p style={{ color: '#444', fontSize: '11px', marginTop: '4px' }}>⚠ Double-check your address. Incorrect addresses result in permanent loss.</p>
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
                { icon: '⏱', title: 'Processing Time', desc: '24–48 business hours after submission' },
                { icon: '✅', title: 'Account Must Be Active', desc: 'Withdrawals are only processed for accounts in good standing' },
                { icon: '🔒', title: 'Verification', desc: 'Large withdrawals may require additional identity verification' },
                { icon: '💸', title: 'Network Fees', desc: 'Crypto withdrawals are subject to blockchain network fees' },
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

          <div style={{ marginTop: '12px', background: 'rgba(255,85,85,0.06)', border: '1px solid rgba(255,85,85,0.15)', borderRadius: '10px', padding: '16px' }}>
            <p style={{ color: '#ff8888', fontSize: '12px', lineHeight: '1.6' }}>
              ⚠ <strong>Important:</strong> Always verify your wallet address before submitting. MusaFX is not responsible for funds sent to incorrect addresses.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}