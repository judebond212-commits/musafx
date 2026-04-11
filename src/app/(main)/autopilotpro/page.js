'use client'
import { useRouter } from 'next/navigation'
import { FiCheck } from 'react-icons/fi'

const plans = [
  {
    tag: 'PROMO: 40% OFF', tagBg: '#ef4444', tagColor: '#fff',
    title: 'AUTO PILOT', price: '$180', period: '/oneoff',
    img: '/media/Auto%20Pilot.webp',
    features: ['AutoPilotPro system', 'Free membership channel', 'Access to 500+ close guides', "Access to Choppa's Telegram community", '24/7 customer support', 'Free currency and forex real-gold', 'Trade in NFTs'],
  },
  {
    tag: 'FEATURED', tagBg: '#22d3ee', tagColor: '#000',
    title: 'CHOPPA PRO', price: '$499', period: '/oneoff',
    img: '/media/CHOPPA%20PRO.jpg',
    features: ['A pre-set trades on your signal files', 'Free membership channel', 'Multi-info trader', "Access to Choppa's telegram community", '24/7 customer support', 'Free signal membership', "All access to Choppa's trading group", 'Supply currency & Billion real-gold', 'Trade in NFTs'],
  },
  {
    tag: 'LIMITED', tagBg: '#ef4444', tagColor: '#fff',
    title: 'CHOPPA S', price: '$300', period: '/oneoff',
    img: '/media/CHOPPA%20S.png',
    features: ['Monitored on sample file', 'Multi-S with channel', 'Access to 500+ close guides', "Access to Choppa's telegram community", '24/7 customer support', 'Free signal membership', 'Supply currency & Billion real-gold'],
  },
]

const CYAN = '#22d3ee'
const ORBITRON = "'Poppins', sans-serif"
const SYNE = "'Poppins', sans-serif"

export default function AutoPilotProPage() {
  const router = useRouter()

  const handleAddToCart = (plan) => {
    localStorage.setItem('selectedPlan', JSON.stringify(plan))
    router.push('/cart')
  }

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', fontFamily: "'Poppins', sans-serif", minHeight: '100vh', padding: '100px 20px 80px' }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .plan-card:hover { transform: translateY(-10px); border-color: ${CYAN}44 !important; }
        .plan-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px; max-width: 1200px; margin: 0 auto; }
        @media(max-width: 768px) {
          .plan-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header Area */}
      <div className="fade-in" style={{ textAlign: 'center', marginBottom: '80px' }}>
        <p style={{ color: CYAN, fontWeight: '700', letterSpacing: '0.28em', fontSize: '12px', textTransform: 'uppercase', marginBottom: '16px' }}>CHOPPA SOLUTIONS</p>
        <h1 style={{ fontFamily: ORBITRON, fontSize: 'clamp(32px, 8vw, 64px)', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '20px' }}>
          AUTOPILOT <span style={{ color: CYAN }}>PRO</span> SYSTEMS
        </h1>
        <p style={{ color: '#888', fontSize: '16px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
          Select your preferred automated trading system. All plans are one-off payments and includes lifetime access to our elite trading communities.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="plan-grid">
        {plans.map((p, i) => (
          <div key={i} className="fade-in plan-card" style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            animationDelay: `${i * 0.1}s`
          }}>
            {/* Top Image Section */}
            <div style={{ height: '200px', position: 'relative' }}>
              <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #111)' }} />
              <span style={{
                position: 'absolute', top: '20px', left: '20px',
                background: p.tagBg, color: p.tagColor,
                fontSize: '10px', fontWeight: '900', letterSpacing: '0.14em',
                textTransform: 'uppercase', padding: '6px 12px', borderRadius: '4px'
              }}>
                {p.tag}
              </span>
            </div>

            {/* Content Section */}
            <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontFamily: ORBITRON, fontSize: '22px', fontWeight: '900', letterSpacing: '0.05em', marginBottom: '12px' }}>{p.title}</h2>
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontFamily: SYNE, fontSize: '42px', fontWeight: '800', color: CYAN, lineHeight: 1 }}>{p.price}</span>
                <span style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>{p.period}</span>
              </div>

              <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', fontWeight: '700', marginBottom: '16px' }}>Features Included:</div>
              <ul style={{ flex: 1, marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, listStyle: 'none' }}>
                {p.features.map((f, fi) => (
                  <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#aaa', lineHeight: '1.4' }}>
                    <FiCheck color={CYAN} size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleAddToCart(p)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  background: CYAN,
                  color: '#000',
                  fontWeight: '800',
                  fontSize: '14px',
                  padding: '16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  boxShadow: `0 4px 20px ${CYAN}33`,
                  transition: 'transform 0.2s',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="fade-in" style={{ textAlign: 'center', marginTop: '64px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
        <p style={{ color: '#555', fontSize: '13px' }}>
          *Payments are processed securely via our official Telegram support. One-off payment for lifetime access.
        </p>
      </div>
    </div>
  )
}