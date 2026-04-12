'use client'
import { useState } from 'react'
import {
  HiTrendingUp, HiCurrencyDollar, HiCalendar, HiClock,
  HiExclamation, HiCheckCircle, HiArrowRight, HiChat, HiX,
  HiStar, HiLightningBolt, HiShieldCheck,
} from 'react-icons/hi'
import { basePlans, calculateCurrentBalance } from '@/lib/investment'
import { TELEGRAM_URL } from '@/lib/telegram'

// ─── Step constants ────────────────────────────────────────────
const STEP_IDLE      = 'idle'
const STEP_PLANS     = 'plans'
const STEP_AMOUNT    = 'amount'
const STEP_PAYMENT   = 'payment'

// ─── Plan icon map ─────────────────────────────────────────────
const PLAN_ICONS = {
  basic:   HiStar,
  gold:    HiLightningBolt,
  diamond: HiShieldCheck,
}

// ─── Plan card ─────────────────────────────────────────────────
function PlanCard({ plan, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const Icon = PLAN_ICONS[plan.id] || HiTrendingUp

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(plan)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
        width: '100%',
        padding: '28px 24px',
        background: hovered
          ? `linear-gradient(135deg, ${plan.color}15, ${plan.color}08)`
          : '#111',
        border: `1px solid ${hovered ? plan.color + '55' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? `0 0 28px ${plan.color}20` : 'none',
        outline: 'none',
      }}
    >
      {/* Icon + Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px', alignItems: 'flex-start' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: `${plan.color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s'
        }}>
          <Icon size={22} color={plan.color} />
        </div>
        <span style={{
          fontSize: '10px', fontWeight: '800', textTransform: 'uppercase',
          letterSpacing: '0.08em', color: plan.color,
          background: `${plan.color}15`, padding: '4px 10px', borderRadius: '100px',
          border: `1px solid ${plan.color}30`
        }}>{plan.name}</span>
      </div>

      {/* Range */}
      <div style={{ marginBottom: '6px' }}>
        <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' }}>
          ${plan.min.toLocaleString()}
        </span>
        <span style={{ color: '#555', fontSize: '14px', fontWeight: '600', marginLeft: '4px' }}>
          — ${plan.max.toLocaleString()}
        </span>
      </div>

      {/* Returns */}
      <p style={{ color: '#777', fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>
        {plan.returns}
      </p>

      {/* CTA row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        color: plan.color, fontSize: '13px', fontWeight: '700'
      }}>
        Select this plan <HiArrowRight size={14} />
      </div>
    </button>
  )
}

// ─── Main component ────────────────────────────────────────────
export default function InvestForm({ userPlan, startDate, initialAmount, isEnabled, hasHistory }) {
  const [step, setStep]               = useState(STEP_IDLE)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [amount, setAmount]           = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const plan = basePlans.find(p => p.id.toLowerCase() === (userPlan || '').toLowerCase())
  const currentBalance = calculateCurrentBalance(initialAmount, userPlan, startDate)
  const earnings = currentBalance - initialAmount
  const isCompleted = startDate && plan &&
    (Date.now() - new Date(startDate).getTime()) > (plan.duration * 24 * 60 * 60 * 1000)

  // ── Amount validation ──────────────────────────────────────
  const numAmount = Number(amount)
  const amountTooLow  = amount !== '' && selectedPlan && numAmount < selectedPlan.min
  const amountTooHigh = amount !== '' && selectedPlan && numAmount > selectedPlan.max
  const amountValid   = amount !== '' && selectedPlan &&
    numAmount >= selectedPlan.min && numAmount <= selectedPlan.max

  // ── Handlers ───────────────────────────────────────────────
  function handleSelectPlan(p) {
    setSelectedPlan(p)
    setAmount('')
    setStep(STEP_AMOUNT)
  }

  function handleBack() {
    if (step === STEP_AMOUNT) { setStep(STEP_PLANS); setSelectedPlan(null) }
    else if (step === STEP_PLANS) setStep(STEP_IDLE)
  }

  // ── EMPTY STATE ────────────────────────────────────────────
  if (!userPlan && !hasHistory) {
    return (
      <div style={{ maxWidth: '860px' }}>
        <style>{`
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .plan-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 18px;
            animation: fadeSlide 0.35s ease-out;
          }
          .amount-form {
            max-width: 380px;
            margin: 0 auto;
            animation: fadeSlide 0.35s ease-out;
          }
        `}</style>

        {/* ── IDLE: Hero CTA ── */}
        {step === STEP_IDLE && (
          <div
            style={{
              textAlign: 'center', padding: '80px 20px',
              background: '#111', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px', animation: 'fadeSlide 0.3s ease-out'
            }}
          >
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'rgba(59,130,246,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <HiTrendingUp size={36} color="#3b82f6" />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '12px' }}>
              No Active Investments
            </h2>
            <p style={{
              color: '#555', fontSize: '15px', maxWidth: '420px',
              margin: '0 auto 36px', lineHeight: '1.7'
            }}>
              You currently have no running investments. Start your journey with MusaFX
              and watch your capital grow with our proven plans.
            </p>
            <button
              onClick={() => setStep(STEP_PLANS)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '15px 44px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#fff', borderRadius: '10px', fontWeight: '800',
                fontSize: '15px', border: 'none', cursor: 'pointer',
                boxShadow: '0 12px 28px rgba(59,130,246,0.25)',
                transition: 'transform 0.15s, box-shadow 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 18px 36px rgba(59,130,246,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(59,130,246,0.25)' }}
            >
              Start Investing <HiArrowRight size={18} />
            </button>
          </div>
        )}

        {/* ── PLANS: Select a plan ── */}
        {step === STEP_PLANS && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <button
                  onClick={handleBack}
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#aaa', borderRadius: '8px', padding: '6px 14px',
                    fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                  }}
                >← Back</button>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Step 1 of 2
                </div>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }}>
                Choose Your Investment Plan
              </h2>
              <p style={{ color: '#555', fontSize: '14px', marginTop: '6px' }}>
                Select the plan that best matches your investment goals and budget.
              </p>
            </div>

            {/* Plan cards */}
            <div className="plan-grid">
              {basePlans.map(p => (
                <PlanCard key={p.id} plan={p} onSelect={handleSelectPlan} />
              ))}
            </div>
          </div>
        )}

        {/* ── AMOUNT: Enter investment amount ── */}
        {step === STEP_AMOUNT && selectedPlan && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <button
                  onClick={handleBack}
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#aaa', borderRadius: '8px', padding: '6px 14px',
                    fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                  }}
                >← Back</button>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Step 2 of 2
                </div>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }}>
                Enter Investment Amount
              </h2>
              <p style={{ color: '#555', fontSize: '14px', marginTop: '6px' }}>
                Enter an amount within the <span style={{ color: selectedPlan.color, fontWeight: '700' }}>{selectedPlan.name}</span> limits.
              </p>
            </div>

            {/* Selected plan badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px 20px', marginBottom: '24px',
              background: `${selectedPlan.color}0d`,
              border: `1px solid ${selectedPlan.color}30`,
              borderRadius: '12px'
            }}>
              {(() => { const Icon = PLAN_ICONS[selectedPlan.id] || HiTrendingUp; return <Icon size={20} color={selectedPlan.color} /> })()}
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>{selectedPlan.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {selectedPlan.returns} · {selectedPlan.duration} day{selectedPlan.duration > 1 ? 's' : ''}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#555', fontWeight: '600', marginBottom: '2px' }}>Range</div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: selectedPlan.color }}>
                  ${selectedPlan.min.toLocaleString()} – ${selectedPlan.max.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Amount form */}
            <div className="amount-form">
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: '800',
                color: '#555', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.1em'
              }}>
                Investment Amount (USD)
              </label>

              {/* Input */}
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <span style={{
                  position: 'absolute', left: '16px', top: '50%',
                  transform: 'translateY(-50%)', color: '#555', fontWeight: '800', fontSize: '16px'
                }}>$</span>
                <input
                  type="number"
                  className="input-dark"
                  placeholder={`${selectedPlan.min} – ${selectedPlan.max}`}
                  value={amount}
                  min={selectedPlan.min}
                  max={selectedPlan.max}
                  onChange={e => setAmount(e.target.value)}
                  style={{
                    paddingLeft: '36px', height: '54px', fontSize: '16px',
                    background: '#0a0a0a',
                    border: `1px solid ${
                      amountTooLow || amountTooHigh ? '#ef4444'
                      : amountValid ? '#00c896'
                      : 'rgba(255,255,255,0.08)'
                    }`,
                    width: '100%', boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              {/* Validation message */}
              <div style={{ minHeight: '24px', marginBottom: '18px' }}>
                {amountTooLow && (
                  <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', margin: 0 }}>
                    Minimum amount for {selectedPlan.name} is ${selectedPlan.min.toLocaleString()}
                  </p>
                )}
                {amountTooHigh && (
                  <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', margin: 0 }}>
                    Maximum amount for {selectedPlan.name} is ${selectedPlan.max.toLocaleString()}
                  </p>
                )}
                {amountValid && (
                  <p style={{ color: '#00c896', fontSize: '12px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <HiCheckCircle size={14} /> Amount is valid
                  </p>
                )}
              </div>

              {/* Quick fill buttons */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap' }}>
                {[selectedPlan.min, Math.round((selectedPlan.min + selectedPlan.max) / 2), selectedPlan.max].map(v => (
                  <button
                    key={v}
                    onClick={() => setAmount(String(v))}
                    style={{
                      padding: '6px 14px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#aaa', fontSize: '12px', fontWeight: '700',
                      cursor: 'pointer', transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = selectedPlan.color + '55'; e.currentTarget.style.color = selectedPlan.color }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#aaa' }}
                  >
                    ${v.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Proceed button */}
              <button
                disabled={!amountValid}
                onClick={() => setShowPaymentModal(true)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '10px', padding: '15px',
                  background: amountValid
                    ? 'linear-gradient(135deg, #00c896, #00a87d)'
                    : 'rgba(255,255,255,0.04)',
                  color: amountValid ? '#fff' : '#444',
                  borderRadius: '10px', fontWeight: '800', border: 'none',
                  cursor: amountValid ? 'pointer' : 'not-allowed',
                  fontSize: '15px',
                  boxShadow: amountValid ? '0 10px 24px rgba(0,200,150,0.2)' : 'none',
                  transition: 'all 0.25s'
                }}
              >
                Proceed to Payment <HiArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── PAYMENT MODAL ── */}
        {showPaymentModal && (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
              backdropFilter: 'blur(10px)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }}
            onClick={() => setShowPaymentModal(false)}
          >
            <div
              style={{
                background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px', padding: '44px 40px', maxWidth: '460px', width: '100%',
                textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                position: 'relative', animation: 'fadeSlide 0.25s ease-out'
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}
              >
                <HiX size={20} />
              </button>

              {/* Plan + amount summary */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 18px', borderRadius: '100px', marginBottom: '28px',
                background: `${selectedPlan?.color}15`,
                border: `1px solid ${selectedPlan?.color}30`
              }}>
                {(() => { const Icon = PLAN_ICONS[selectedPlan?.id] || HiTrendingUp; return <Icon size={14} color={selectedPlan?.color} /> })()}
                <span style={{ fontSize: '13px', fontWeight: '700', color: selectedPlan?.color }}>
                  {selectedPlan?.name} · ${Number(amount).toLocaleString()}
                </span>
              </div>

              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(59,130,246,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
              }}>
                <HiChat size={32} color="#3b82f6" />
              </div>

              <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>
                Contact Support
              </h3>
              <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' }}>
                Please contact our customer support via{' '}
                <a
                  href={TELEGRAM_URL} target="_blank" rel="noreferrer"
                  style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '700', borderBottom: '1px solid rgba(59,130,246,0.35)' }}
                >
                  Telegram
                </a>{' '}
                or email to receive the official MusaFX payment details and activate your{' '}
                <strong style={{ color: '#fff' }}>{selectedPlan?.name}</strong> investment.
              </p>

              <a
                href={TELEGRAM_URL} target="_blank" rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  width: '100%', padding: '15px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: '#fff', borderRadius: '12px', fontWeight: '700',
                  fontSize: '15px', textDecoration: 'none',
                  boxShadow: '0 10px 24px rgba(59,130,246,0.18)',
                  marginBottom: '12px'
                }}
              >
                Open Telegram <HiArrowRight size={16} />
              </a>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  width: '100%', padding: '12px', background: 'none',
                  border: 'none', color: '#555', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── ACTIVE / COMPLETED INVESTMENT VIEW ─────────────────────
  const details = [
    { label: 'Initial Investment', value: `$${initialAmount.toLocaleString()}`, icon: HiCurrencyDollar, color: '#aaa' },
    { label: 'Total Earnings', value: `+$${earnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, icon: HiTrendingUp, color: '#00c896' },
    { label: 'Start Date', value: startDate ? new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—', icon: HiCalendar, color: '#818cf8' },
    { label: 'Plan Duration', value: `${plan?.duration || '—'} Days`, icon: HiClock, color: '#f472b6' },
  ]

  return (
    <div style={{ maxWidth: '900px' }}>
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '700', marginBottom: '6px' }}>
          Your <span style={{ color: plan?.color || '#3b82f6' }}>Investment</span>
        </h1>
        <p style={{ color: '#555', fontSize: '14px' }}>
          Overview of your automated trading account and performance.
        </p>
      </div>

      <div style={{
        background: '#111', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px', overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)', marginBottom: '40px'
      }} data-aos="fade-up">
        {/* Card Header */}
        <div style={{
          padding: '32px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: `${plan?.color || '#3b82f6'}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <HiTrendingUp size={24} color={plan?.color || '#3b82f6'} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#555', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Selected Plan</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{plan?.name || userPlan}</div>
            </div>
          </div>
          <div style={{
            padding: '6px 14px', borderRadius: '100px', fontSize: '11px', fontWeight: '800',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            background: isCompleted ? 'rgba(0,200,150,0.1)' : (isEnabled ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.05)'),
            color: isCompleted ? '#00c896' : (isEnabled ? '#3b82f6' : '#666'),
            border: `1px solid ${isCompleted ? 'rgba(0,200,150,0.2)' : (isEnabled ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.1)')}`,
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            {isCompleted ? <HiCheckCircle size={14} /> : <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isEnabled ? '#3b82f6' : '#666' }} />}
            {isCompleted ? 'Completed' : (isEnabled ? 'Active' : 'Inactive')}
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '40px 32px' }}>
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

        {/* Card Footer */}
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