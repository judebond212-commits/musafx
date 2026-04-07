'use client'
import { HiExternalLink, HiShieldCheck, HiStar } from 'react-icons/hi'
import { FiArrowRight } from 'react-icons/fi'

const brokers = [
  {
    name: 'IC Markets',
    type: 'ECN Broker',
    description: 'One of the world\'s largest True ECN brokers with ultra-low spreads, fast execution, and deep liquidity pools ideal for algorithmic trading.',
    features: ['Spreads from 0.0 pips', 'Up to 1:500 leverage', 'MT4, MT5, cTrader', 'Regulated ASIC & CySEC'],
    rating: 4.9,
    badge: 'Top Rated',
    url: 'https://icmarkets.com',
  },
  {
    name: 'Pepperstone',
    type: 'ECN Broker',
    description: 'Award-winning broker known for exceptional execution speeds and a wide range of tradeable instruments across Forex, CFDs, and crypto.',
    features: ['Raw spreads from 0.0', 'No dealing desk', 'MT4, MT5, cTrader', 'Regulated FCA, ASIC'],
    rating: 4.8,
    badge: 'Recommended',
    url: 'https://pepperstone.com',
  },
  {
    name: 'XM Group',
    type: 'Market Maker',
    description: 'A globally recognised broker with over 5 million clients. Offers excellent educational resources and competitive trading conditions.',
    features: ['Micro accounts available', 'No requotes', 'MT4 & MT5', 'Regulated CySEC, ASIC'],
    rating: 4.6,
    url: 'https://xm.com',
  },
  {
    name: 'FXCM',
    type: 'NDD Broker',
    description: 'Pioneer in online forex trading with advanced trading technology, real-time news, and extensive analytical tools.',
    features: ['No dealing desk', 'API trading support', 'Advanced charting', 'Regulated FCA'],
    rating: 4.5,
    url: 'https://fxcm.com',
  },
  {
    name: 'Exness',
    type: 'ECN Broker',
    description: 'Known for instant withdrawals and high leverage options. Popular with traders across Africa and Asia for its accessible minimum deposits.',
    features: ['Instant withdrawals', 'High leverage options', 'MT4, MT5', 'Regulated FCA, CySEC'],
    rating: 4.7,
    badge: 'Popular in Africa',
    url: 'https://exness.com',
  },
  {
    name: 'HotForex (HFM)',
    type: 'Market Maker',
    description: 'Multi-award-winning broker with a strong presence in emerging markets, offering multiple account types and comprehensive trading tools.',
    features: ['Multiple account types', 'Copy trading', 'MT4 & MT5', 'Regulated CySEC, DFSA'],
    rating: 4.4,
    url: 'https://hfm.com',
  },
]


export default function BrokersPage() {
  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(59, 130, 246, 0.07), transparent)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Vetted Partners</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Recommended{' '}
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Brokers</span>
          </h1>
          <p style={{ color: '#777', fontSize: '16px', lineHeight: '1.7' }}>
            We've partnered with the world's most trusted and regulated brokers to ensure you get the best trading conditions possible.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 0', padding: '0 24px 40px' }}>
        <div style={{ background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', padding: '14px 20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <HiShieldCheck color="#3b82f6" size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <p style={{ color: '#888', fontSize: '13px', lineHeight: '1.6' }}>
            <strong style={{ color: '#3b82f6' }}>Disclaimer:</strong> All brokers listed are independently regulated. MusaFX may receive a referral commission when you open an account through our links. Always trade with money you can afford to lose.
          </p>
        </div>
      </div>

      {/* Brokers Grid */}
      <section style={{ padding: '0 24px 100px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {brokers.map((broker, i) => (
            <div key={i} style={{
              background: '#111', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px', padding: '28px',
              transition: 'all 0.3s', position: 'relative',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'; e.currentTarget.style.background = '#141414' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = '#111' }}
            >
              {broker.badge && (
                <div style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: '#fff', fontSize: '10px', fontWeight: '700',
                  padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.06em',
                }}>
                  {broker.badge}
                </div>
              )}

              {/* Logo placeholder */}
              <div style={{
                width: '52px', height: '52px', borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.08))',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
                fontFamily: 'var(--font-display)', fontWeight: '700',
                color: '#3b82f6', fontSize: '18px',
              }}>
                {broker.name.charAt(0)}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{broker.name}</h3>
                <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{broker.type}</span>
              </div>

              <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.7', marginBottom: '20px' }}>{broker.description}</p>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
                {broker.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#888' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>

              {/* Rating + CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HiStar color="#3b82f6" size={16} />
                  <span style={{ color: '#3b82f6', fontWeight: '700', fontSize: '14px' }}>{broker.rating}</span>
                  <span style={{ color: '#444', fontSize: '12px' }}>/5.0</span>
                </div>
                <a
                  href={broker.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: '#fff', textDecoration: 'none',
                    fontWeight: '700', fontSize: '13px',
                    padding: '8px 16px', borderRadius: '6px',
                  }}
                >
                  Visit Broker <HiExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}