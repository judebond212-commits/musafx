'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { HiInformationCircle, HiLockClosed } from 'react-icons/hi'

export default function WithdrawForm({ user, balance, isMature, remainingDays, plan }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [bankInfo, setBankInfo] = useState({ bankName: '', accountNumber: '' })

  const fullName = `${user?.FName || ''} ${user?.LName || ''}`.trim()
  const email = user?.Email || ''
  const phone = user?.ST || '' // Phone is mapped to 'ST' in this system

  const labelStyle = { 
    display: 'block', 
    color: '#888', 
    fontSize: '11px', 
    fontWeight: '700', 
    textTransform: 'uppercase', 
    letterSpacing: '0.08em', 
    marginBottom: '8px' 
  }

  const readOnlyStyle = {
    background: 'rgba(255,255,255,0.03)',
    color: '#888',
    cursor: 'not-allowed',
    padding: '12px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    border: '1px solid rgba(255,255,255,0.05)',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center'
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isMature) {
      toast.error(`Withdrawal is locked. Available in ${remainingDays} days.`)
      return
    }
    if (balance < 10) { 
      toast.error('Your current balance is below the minimum withdrawal amount ($10).')
      return 
    }
    if (!bankInfo.bankName.trim() || !bankInfo.accountNumber.trim()) { 
      toast.error('Please provide both Bank Name and Account Number.')
      return 
    }

    setLoading(true)
    try {
      // Format bank details for the walletAddress storage field
      const formattedDetails = `Bank: ${bankInfo.bankName.trim()} | Account: ${bankInfo.accountNumber.trim()}`
      
      const res = await fetch('/api/dashboard/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: balance, 
          walletAddress: formattedDetails, 
          paymentMethod: 'Bank Transfer' 
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Withdrawal request failed.')
      
      toast.success('Your withdrawal request has been submitted for review.')
      router.push('/dashboard/transactions')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isMature) {
    return (
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '60px 40px', textAlign: 'center', maxWidth: '800px' }} data-aos="fade-up">
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <HiLockClosed size={36} color="#3b82f6" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Withdrawal Locked</h2>
        <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto 32px' }}>
          Withdrawals are only available after your investment has reached its full duration. Your current cycle in the <strong style={{ color: '#ccc' }}>{plan?.name || 'investment'}</strong> is still active.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 24px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '100px', border: '1px solid rgba(59, 130, 246, 0.15)', fontSize: '14px', color: '#3b82f6', fontWeight: '600' }}>
          <span>Access available in:</span>
          <span>{remainingDays} days</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '32px', maxWidth: '900px' }}>
      {/* Form Section */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '32px' }} data-aos="fade-right">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ padding: '20px', background: 'rgba(0,200,150,0.05)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: '12px', marginBottom: '8px' }}>
            <label style={{ ...labelStyle, color: '#00c896' }}>Withdrawal Balance (Auto-Calculated)</label>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p style={{ color: '#00c89699', fontSize: '11px', marginTop: '4px', fontWeight: '600' }}>This is your total current investment value.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <div style={readOnlyStyle}>{fullName}</div>
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <div style={readOnlyStyle}>{phone}</div>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <div style={readOnlyStyle}>{email}</div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.04)', margin: '8px 0' }} />

          <div>
            <label style={labelStyle}>Destination Bank Name</label>
            <input 
              className="input-dark" 
              placeholder="e.g. Chase Bank, Barclays, etc."
              required
              value={bankInfo.bankName}
              onChange={e => setBankInfo(p => ({ ...p, bankName: e.target.value }))}
            />
          </div>

          <div>
            <label style={labelStyle}>Account Number</label>
            <input 
              className="input-dark" 
              placeholder="Enter your bank account number"
              required
              value={bankInfo.accountNumber}
              onChange={e => setBankInfo(p => ({ ...p, accountNumber: e.target.value }))}
            />
          </div>

          <button type="submit" className="btn-accent" disabled={loading || balance < 10} style={{ padding: '14px', fontSize: '15px', marginTop: '10px' }}>
            {loading ? 'Processing...' : 'Submit Withdrawal Request'}
          </button>
        </form>
      </div>

      {/* Info Section */}
      <div>
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }} data-aos="fade-left">
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#3b82f6' }}>
            <HiInformationCircle size={20} /> Withdrawal Policy
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '🏛️', title: 'Direct Bank Deposit', desc: 'Earnings are transferred directly to your verified bank account.' },
              { icon: '🔒', title: 'Fixed Balance', desc: 'You must withdraw your full matured balance at once.' },
              { icon: '📅', title: 'Schedule', desc: 'Processing takes 24–48 hours for external verification.' },
              { icon: '🛡️', title: 'Security', desc: 'Transfers are only made to bank accounts matching your registration name.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', paddingBottom: '16px', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }} data-aos="fade-left" data-aos-delay={i * 100}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#eee', marginBottom: '3px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
