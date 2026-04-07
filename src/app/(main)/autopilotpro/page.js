import Link from 'next/link'
import { HiLightningBolt, HiChartBar, HiShieldCheck, HiClock, HiCurrencyDollar, HiTrendingUp } from 'react-icons/hi'
import { FiArrowRight, FiCheck } from 'react-icons/fi'

const benefits = [
  { icon: HiLightningBolt, title: 'Instant Execution', desc: 'Trades execute in milliseconds — no slippage, no emotional hesitation.' },
  { icon: HiChartBar, title: 'Multi-Pair Analysis', desc: 'Simultaneously monitors 20+ currency pairs to find the best opportunities.' },
  { icon: HiShieldCheck, title: 'Built-in Risk Management', desc: 'Automatic stop-loss and take-profit levels protect your capital on every trade.' },
  { icon: HiClock, title: 'Always-On Operation', desc: 'Runs 24/5 across all global FX sessions without interruption.' },
  { icon: HiCurrencyDollar, title: 'Compounding Returns', desc: 'Profits are automatically reinvested to accelerate portfolio growth.' },
  { icon: HiTrendingUp, title: 'Adaptive Strategy', desc: 'Machine-learning algorithms continuously refine strategy based on market conditions.' },
]

const plans = [
  {
    name: 'Starter',
    min: '$100',
    max: '$999',
    returns: '5–8%',
    period: 'monthly',
    features: ['AutoPilotPro access', 'Email reporting', 'Basic support', 'Weekly signals'],
  },
  {
    name: 'Growth',
    min: '$1,000',
    max: '$9,999',
    returns: '10–15%',
    period: 'monthly',
    features: ['Everything in Starter', 'Priority withdrawals', 'Dedicated account manager', 'Daily signals', 'Telegram VIP access'],
    highlight: true,
  },
  {
    name: 'Elite',
    min: '$10,000',
    max: 'Unlimited',
    returns: '18–25%',
    period: 'monthly',
    features: ['Everything in Growth', 'Custom strategy config', 'Direct analyst line', 'Exclusive market insights', 'Monthly 1-on-1 review'],
  },
]

export const metadata = {
  title: 'AutoPilotPro – MusaFX Automated Trading',
}

export default function AutoPilotProPage() {
  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero */}
      <section style={{
        padding: '100px 24px',
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.08), transparent)',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '28px',
          }}>
            <HiLightningBolt color="#3b82f6" size={14} />
            <span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI-Powered Trading
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 7vw, 72px)',
            fontWeight: '700', lineHeight: '1.1',
            letterSpacing: '-0.02em', marginBottom: '24px',
          }}>
            Meet{' '}
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa, #1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AutoPilotPro
            </span>
          </h1>
          <p style={{ color: '#888', fontSize: '18px', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 40px' }}>
            The most advanced algorithmic FX trading engine available to retail investors. Set it up once — let it work for you forever.
          </p>
          <Link href="/auth/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: '#fff', textDecoration: 'none',
            fontWeight: '700', fontSize: '15px',
            padding: '14px 32px', borderRadius: '8px',
          }}>
            Activate AutoPilotPro <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '80px 24px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '700', textAlign: 'center', marginBottom: '56px' }}>
            Why Traders <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Choose AutoPilotPro</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '28px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <b.icon size={20} color="#3b82f6" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{b.title}</h3>
                <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.7' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '700', textAlign: 'center', marginBottom: '56px' }}>
            How <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AutoPilotPro</span> Works
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { step: '1', title: 'Market Scanning', desc: 'The system continuously scans 20+ currency pairs across multiple timeframes, identifying high-probability setups using proprietary indicators.' },
              { step: '2', title: 'Signal Generation', desc: 'When conditions align, AutoPilotPro generates a trade signal with entry price, stop-loss, and take-profit levels calculated automatically.' },
              { step: '3', title: 'Trade Execution', desc: 'Trades are placed instantly through our connected broker network, ensuring the best available pricing with minimal slippage.' },
              { step: '4', title: 'Position Management', desc: 'Active positions are monitored in real-time. Trailing stops and dynamic risk adjustments protect profits as trades move in your favour.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{
                  flexShrink: 0, width: '48px', height: '48px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: '700', fontSize: '16px',
                }}>
                  {item.step}
                </div>
                <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '20px 24px', flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.7' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section style={{ padding: '80px 24px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '700', textAlign: 'center', marginBottom: '56px' }}>
            Investment <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Plans</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {plans.map((plan, i) => (
              <div key={i} style={{
                background: plan.highlight ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(59, 130, 246, 0.04))' : '#111',
                border: `1px solid ${plan.highlight ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '14px', padding: '32px',
                position: 'relative',
              }}>
                {plan.highlight && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: '#fff', fontSize: '11px', fontWeight: '700',
                    padding: '4px 14px', borderRadius: '100px', whiteSpace: 'nowrap',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>{plan.name}</h3>
                <p style={{ color: '#555', fontSize: '13px', marginBottom: '20px' }}>{plan.min} – {plan.max}</p>
                <div style={{ marginBottom: '24px' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '40px', fontWeight: '700',
                    background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    {plan.returns}
                  </span>
                  <span style={{ color: '#555', fontSize: '14px' }}> / {plan.period}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', fontSize: '13px' }}>
                      <FiCheck color="#00c896" size={14} />
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/auth/register" style={{
                  display: 'block', textAlign: 'center',
                  background: plan.highlight ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(255,255,255,0.06)',
                  color: plan.highlight ? '#fff' : '#ccc',
                  textDecoration: 'none', fontWeight: '700', fontSize: '14px',
                  padding: '12px', borderRadius: '8px',
                  border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}