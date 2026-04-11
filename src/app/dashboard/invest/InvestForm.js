'use client'
import { useState } from 'react'
import { HiTrendingUp, HiCurrencyDollar, HiCalendar, HiClock, HiExclamation, HiCheckCircle, HiArrowRight, HiChat, HiX } from 'react-icons/hi'
import { basePlans, calculateCurrentBalance } from '@/lib/investment'
import { TELEGRAM_URL } from '@/lib/telegram'
import Link from 'next/link'

export default function InvestForm({ userPlan, startDate, initialAmount, isEnabled, hasHistory }) {
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const plan = basePlans.find(p => p.id.toLowerCase() === (userPlan || '').toLowerCase())
  const currentBalance = calculateCurrentBalance(initialAmount, userPlan, startDate)
  const earnings = currentBalance - initialAmount
  
  const isCompleted = startDate && plan && (Date.now() - new Date(startDate).getTime()) > (plan.duration * 24 * 60 * 60 * 1000)

  // Show empty state only if they have NO current plan AND no history of investments
  if (!userPlan && !hasHistory) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }} data-aos="fade-up">
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <HiTrendingUp size={32} color="#3b82f6" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>No Active Investments</h2>
        <p style={{ color: '#555', fontSize: '15px', maxWidth: '400px', margin: '0 auto 32px', lineHeight: '1.6' }}>
          You currently do not have any running investments. Start your journey with MusaFX today and watch your capital grow.
        </p>

        {!showForm ? (
          <button 
            onClick={() => setShowForm(true)}
            style={{ 
              display: 'inline-block', 
              padding: '14px 40px', 
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: '#fff',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)'
            }}
          >
            Start Investing
          </button>
        ) : (
          <div style={{ maxWidth: '320px', margin: '0 auto', textAlign: 'left', animation: 'fadeIn 0.3s ease-out' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#555', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.1em' }}>Desired Investment amount (USD)</label>
            <div style={{ position: 'relative', marginBottom: '18px' }}>
               <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#333', fontWeight: '800', fontSize: '14px' }}>$</span>
               <input 
                 type="number"
                 className="input-dark"
                 placeholder="Enter amount e.g. 1500"
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 style={{ 
                   paddingLeft: '32px',
                   height: '50px',
                   fontSize: '15px',
                   background: '#0a0a0a',
                   border: '1px solid rgba(255,255,255,0.08)'
                 }}
               />
            </div>
            <button 
              onClick={() => setShowPaymentModal(true)}
              style={{ 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '14px', 
                background: '#00c896',
                color: '#fff',
                borderRadius: '8px',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                boxShadow: '0 10px 20px rgba(0, 200, 150, 0.15)'
              }}
            >
              Proceed to Payment <HiArrowRight size={18} />
            </button>
            <button 
               onClick={() => setShowForm(false)}
               style={{ width: '100%', background: 'none', border: 'none', color: '#444', fontSize: '12px', marginTop: '16px', cursor: 'pointer', fontWeight: '600' }}
            >
               Go back
            </button>
          </div>
        )}

        {/* Payment Instructions Modal */}
        {showPaymentModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowPaymentModal(false)}>
            <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowPaymentModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}><HiX size={20} /></button>
              
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <HiChat size={32} color="#3b82f6" />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>Contact support</h3>
              <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
                Please contact customer support via <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '700', borderBottom: '1px solid rgba(59, 130, 246, 0.3)' }}>Telegram</a> or email to receive the official Musafx payment details.
              </p>
              
              <button 
                onClick={() => setShowPaymentModal(false)}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                  color: '#fff', 
                  borderRadius: '12px', 
                  border: 'none',
                  fontWeight: '700', 
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(59, 130, 246, 0.15)'
                }}
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  const details = [
    { label: 'Initial Investment', value: `$${initialAmount.toLocaleString()}`, icon: HiCurrencyDollar, color: '#aaa' },
    { label: 'Total Earnings', value: `+$${earnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, icon: HiTrendingUp, color: '#00c896' },
    { label: 'Start Date', value: startDate ? new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—', icon: HiCalendar, color: '#818cf8' },
    { label: 'Plan Duration', value: `${plan?.duration || '—'} Days`, icon: HiClock, color: '#f472b6' },
  ]

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '700', marginBottom: '6px' }}>
          Your <span style={{ color: plan?.color || '#3b82f6' }}>Investment</span>
        </h1>
        <p style={{ color: '#555', fontSize: '14px' }}>
          Overview of your automated trading account and performance.
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Main Single Card */}
      <div style={{ 
        background: '#111', 
        border: '1px solid rgba(255,255,255,0.06)', 
        borderRadius: '20px', 
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        marginBottom: '40px'
      }} data-aos="fade-up">
        {/* Card Header */}
        <div style={{ 
          padding: '32px', 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${plan?.color || '#3b82f6'}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HiTrendingUp size={24} color={plan?.color || '#3b82f6'} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#555', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Selected Plan</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{plan?.name || userPlan}</div>
            </div>
          </div>

          <div style={{
            padding: '6px 14px',
            borderRadius: '100px',
            fontSize: '11px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: isCompleted ? 'rgba(0,200,150,0.1)' : (isEnabled ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.05)'),
            color: isCompleted ? '#00c896' : (isEnabled ? '#3b82f6' : '#666'),
            border: `1px solid ${isCompleted ? 'rgba(0,200,150,0.2)' : (isEnabled ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.1)')}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {isCompleted ? <HiCheckCircle size={14} /> : <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isEnabled ? '#3b82f6' : '#666' }} />}
            {isCompleted ? 'Completed' : (isEnabled ? 'Active' : 'Inactive')}
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '40px 32px' }}>
          {/* Main Balance Row */}
          <div style={{ marginBottom: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#555', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>Current Investment Balance</div>
            <div style={{ fontSize: 'clamp(32px, 8vw, 48px)', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ color: '#00c896' }}>$</span>
              {currentBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {details.map((d, i) => (
              <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  <d.icon size={14} color={d.color} /> {d.label}
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>{d.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Footer Notice */}
        <div style={{ padding: '24px 32px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
           <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <HiExclamation size={18} color="#555" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ color: '#555', fontSize: '12px', lineHeight: '1.6', margin: 0 }}>
              {isCompleted 
                ? 'This investment cycle has successfully completed. You can re-invest or withdraw your earnings by contacting your account manager.'
                : 'Earnings are generated daily based on the algorithmic trading performance. The current balance is a real-time estimation.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}