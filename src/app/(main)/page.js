'use client'
import { useRouter } from 'next/navigation'
import { TELEGRAM_URL } from '@/lib/telegram'

function RobotIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M9 11V7a3 3 0 0 1 6 0v4"/><circle cx="9" cy="16" r="1" fill="white"/><circle cx="15" cy="16" r="1" fill="white"/><path d="M12 2v3"/></svg> }
function ChartIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg> }
function EyeIcon()    { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> }
function GearIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function AssetsIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> }
function LockIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> }

const features = [
  { Icon: RobotIcon,    title: 'Automated trading strategies', desc: 'Execute pre-programmed trading strategies 24/7.' },
  { Icon: ChartIcon,   title: 'Backtested performance',        desc: 'View historical performance data and risk assessments.' },
  { Icon: EyeIcon,     title: 'Real-time monitoring',          desc: 'Track trades and portfolio performance in real-time.' },
  { Icon: GearIcon,    title: 'Customisable settings',         desc: 'Adjust parameters to suit your risk tolerance and goals.' },
  { Icon: AssetsIcon,  title: 'Multiple asset support',        desc: 'Trade assets including stocks, forex, and cryptocurrencies.' },
  { Icon: LockIcon,    title: 'Secure and reliable',           desc: 'Benefit from a secure and reliable platform designed for performance.' },
]

const stats = [
  { val: '$100', label: 'MINIMUM DEPOSIT' },
  { val: '98.8%', label: 'WIN RATE' },
  { val: '30', label: 'TRADES EXECUTED DAILY' },
]

const plans = [
  {
    tag: 'PROMO: 40% OFF', tagBg: '#ef4444', tagColor: '#fff',
    title: 'AUTO PILOT', price: '$180', period: '/oneoff',
    img: '/media/Auto%20Pilot.webp',
    cta: 'BUY NOW',
    features: ['AutoPilotPro system', 'Free membership channel', 'Access to 500+ close guides', "Access to Choppa's Telegram community", '24/7 customer support', 'Free currency and forex real-gold', 'Trade in NFTs'],
  },
  {
    tag: 'FEATURED', tagBg: '#22d3ee', tagColor: '#000',
    title: 'CHOPPA PRO', price: '$499', period: '/oneoff',
    img: '/media/CHOPPA%20PRO.jpg',
    cta: 'GET STARTED',
    features: ['A pre-set trades on your signal files', 'Free membership channel', 'Multi-info trader', "Access to Choppa's telegram community", '24/7 customer support', 'Free signal membership', "All access to Choppa's trading group", 'Supply currency & Billion real-gold', 'Trade in NFTs'],
  },
  {
    tag: 'LIMITED', tagBg: '#ef4444', tagColor: '#fff',
    title: 'CHOPPA S', price: '$300', period: '/oneoff',
    img: '/media/CHOPPA%20S.png',
    cta: 'GET STARTED',
    features: ['Monitored on sample file', 'Multi-S with channel', 'Access to 500+ close guides', "Access to Choppa's telegram community", '24/7 customer support', 'Free signal membership', 'Supply currency & Billion real-gold'],
  },
]

const ORBITRON = "'Poppins', sans-serif"
const SYNE = "'Poppins', sans-serif"
const CYAN = '#22d3ee'

export default function HomePage() {
  const router = useRouter()

  const handleAddToCart = (plan) => {
    localStorage.setItem('selectedPlan', JSON.stringify(plan))
    router.push('/cart')
  }

  return (
    <>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .phone-float { animation: float 4s ease-in-out infinite; }
        .feat-outer { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; }
        .feat-phone { display:flex; align-items:center; justify-content:center; }
        .plan-grid { display:grid; grid-template-columns:1fr 1fr; }
        @media(max-width:768px){
          .feat-outer { grid-template-columns:1fr; }
          .feat-phone { display:none; }
          .plan-grid { grid-template-columns:1fr; }
          .plan-img { min-height:220px !important; }
          .p-rev { order:unset !important; }
        }
        .cta-primary:hover { opacity:0.85; }
        .cta-outline:hover { border-color:rgba(34,211,238,0.4); }
        .plan-btn:hover { opacity:0.85; }
        .broker-btn:hover { opacity:0.8; }
        /* AI strip (below hero) — mobile */
        .ai-strip { padding: 70px 24px 60px; }
        .ai-strip-inner { max-width: 720px; margin-left: auto; margin-right: auto; }
        .ai-strip-quote { max-width: 34em; margin-left: auto; margin-right: auto; padding: 0 4px; }
        @media (max-width: 768px) {
          .ai-strip { padding: 44px 16px 40px; padding-left: max(16px, env(safe-area-inset-left)); padding-right: max(16px, env(safe-area-inset-right)); }
          .ai-strip-inner { max-width: 100%; }
          .ai-strip-quote { font-size: 12px !important; line-height: 1.65 !important; margin-bottom: 24px !important; }
          .ai-strip-h2 { letter-spacing: 0.02em !important; line-height: 1.05 !important; }
          .ai-strip-tag { font-size: 11px !important; letter-spacing: 0.08em !important; }
          .ai-strip-sub { font-size: 12px !important; letter-spacing: 0.06em !important; }
        }
        @media (max-width: 380px) {
          .ai-strip { padding-top: 36px; padding-bottom: 32px; }
          .ai-strip-h2 { font-size: clamp(22px, 9vw, 40px) !important; }
        }
        /* Features (follows AI strip) — tighten on mobile */
        @media (max-width: 768px) {
          .feat-section { padding: 40px 16px 56px !important; padding-left: max(16px, env(safe-area-inset-left)); padding-right: max(16px, env(safe-area-inset-right)); }
          .feat-col-left, .feat-col-right { padding-right: 0 !important; padding-left: 0 !important; gap: 26px !important; }
        }
      `}</style>

      <div style={{ background: '#0a0a0a', color: '#fff', fontFamily: "'Poppins', sans-serif", overflowX: 'hidden' }}>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src="/media/hero.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.52) 60%, #0a0a0a 100%)' }} />
          </div>


          {/* Text overlay */}
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '640px', padding: '100px 24px 60px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.28em', color: CYAN, textTransform: 'uppercase', marginBottom: '22px' }}>ALL NEW</p>
            <h1 style={{ fontFamily: ORBITRON, fontWeight: '900', fontSize: 'clamp(52px,13vw,108px)', lineHeight: '0.9', letterSpacing: '-0.01em', marginBottom: '18px', background: 'linear-gradient(135deg,#fff 20%,#00e5ff 60%,#0097a7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              CHOPPA<br />PRO
            </h1>
            <p style={{ fontFamily: ORBITRON, color: CYAN, letterSpacing: '0.28em', textTransform: 'uppercase', fontSize: '10px', marginBottom: '36px' }}>MOBILE VERSION</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#plans" className="cta-primary" style={{ background: CYAN, color: '#000', fontWeight: '700', fontSize: '13px', padding: '13px 32px', borderRadius: '3px', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'opacity 0.2s' }}>ACTIVATE</a>
              <a href="#plans" className="cta-outline" style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#ddd', fontWeight: '500', fontSize: '13px', padding: '13px 28px', borderRadius: '3px', textDecoration: 'none', transition: 'border-color 0.2s' }}>get started</a>
            </div>
          </div>
        </section>

        {/* ── AI STRIP ── */}
        <div className="ai-strip" style={{ background: '#000', textAlign: 'center' }}>
          <div className="ai-strip-inner">
            <p className="ai-strip-tag" style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', color: '#fff', marginBottom: '10px' }}>POWERED by AI.</p>
            <p className="ai-strip-quote" style={{ color: '#aaa', fontSize: '13px', fontStyle: 'italic', marginBottom: '32px', lineHeight: 1.6 }}>&ldquo;This isn't just a product, it's a platform for the future.&rdquo;</p>
            <h2 className="ai-strip-h2" style={{ fontFamily: ORBITRON, fontSize: 'clamp(28px,6vw,54px)', fontWeight: '900', letterSpacing: '0.04em', marginBottom: '12px', lineHeight: 1.05, wordBreak: 'break-word' }}>
              <span style={{ color: '#fff' }}>CHOPPA </span>
              <span style={{ color: '#ef4444' }}>PRO</span>
            </h2>
            <p className="ai-strip-sub" style={{ color: '#aaa', letterSpacing: '0.1em', fontSize: '13px', marginTop: '0', marginBottom: 0 }}>trading solution<span style={{ color: CYAN }}>|</span></p>
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section className="feat-section" style={{ background: '#000', padding: '60px 20px 80px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0', alignItems: 'center' }} className="feat-outer">
            {/* Left col */}
            <div className="feat-col-left" style={{ display: 'flex', flexDirection: 'column', gap: '36px', paddingRight: '32px' }}>
              {[0, 1, 2].map(i => {
                const Icon = features[i].Icon
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flexShrink: 0, width: '44px', height: '44px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '6px', lineHeight: 1.3 }}>{features[i].title}</h3>
                      <p style={{ color: CYAN, fontSize: '12px', lineHeight: '1.6', margin: 0 }}>{features[i].desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Center angled phone */}
            <div className="feat-phone" style={{ padding: '0 40px' }}>
              <div style={{ filter: 'drop-shadow(0 0 40px rgba(0,229,255,0.35))' }}>
                <img src="/media/choppapro.webp" alt="App"
                  style={{ width: '100%', maxWidth: '260px', height: 'auto', display: 'block', margin: '0 auto' }} />
              </div>
            </div>
            {/* Right col */}
            <div className="feat-col-right" style={{ display: 'flex', flexDirection: 'column', gap: '36px', paddingLeft: '32px' }}>
              {[3, 4, 5].map(i => {
                const Icon = features[i].Icon
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flexShrink: 0, width: '44px', height: '44px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '6px', lineHeight: 1.3 }}>{features[i].title}</h3>
                      <p style={{ color: CYAN, fontSize: '12px', lineHeight: '1.6', margin: 0 }}>{features[i].desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{ flex: '1', minWidth: '160px', textAlign: 'center', padding: '44px 24px', borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ fontFamily: ORBITRON, fontSize: 'clamp(32px,6vw,54px)', fontWeight: '900', color: CYAN, lineHeight: 1, marginBottom: '10px' }}>{s.val}</div>
              <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: '#555', textTransform: 'uppercase', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── PLANS ── */}
        <section id="plans" style={{ padding: '80px 20px' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <h2 style={{ fontFamily: SYNE, fontSize: 'clamp(24px,5vw,44px)', fontWeight: '800', marginBottom: '12px' }}>choose what works for you</h2>
              <p style={{ color: '#666', fontSize: '13px', maxWidth: '360px', margin: '0 auto', lineHeight: '1.7' }}>Our products are made to be simple and easy to use while being consistent and effective.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {plans.map((plan, idx) => (
                <div key={idx} className="plan-grid" style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div className={`plan-img p-rev`} style={{ order: idx % 2 === 1 ? 2 : 1, minHeight: '340px' }}>
                    <img src={plan.img} alt={plan.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)', display: 'block' }} />
                  </div>
                  <div className="p-rev" style={{ order: idx % 2 === 1 ? 1 : 2, background: '#111', padding: '32px', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ display: 'inline-block', background: plan.tagBg, color: plan.tagColor, fontSize: '10px', fontWeight: '900', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '2px', marginBottom: '12px', alignSelf: 'flex-start' }}>{plan.tag}</span>
                    <h3 style={{ fontFamily: ORBITRON, fontSize: '17px', fontWeight: '900', letterSpacing: '0.05em', marginBottom: '6px' }}>{plan.title}</h3>
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontFamily: SYNE, fontSize: '26px', fontWeight: '800', color: CYAN }}>{plan.price}</span>
                      <span style={{ color: '#555', fontSize: '13px' }}>{plan.period}</span>
                    </div>
                    <p style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', fontWeight: '600', marginBottom: '10px' }}>Items:</p>
                    <ul style={{ flex: 1, marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, listStyle: 'none' }}>
                      {plan.features.map((f, fi) => (
                        <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#aaa' }}>
                          <span style={{ color: CYAN, fontWeight: '700', flexShrink: 0, marginTop: '2px' }}>✓</span>{f}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => handleAddToCart(plan)}
                      className="plan-btn" 
                      style={{ 
                        display: 'block', 
                        width: '100%',
                        textAlign: 'center', 
                        background: CYAN, 
                        color: '#000', 
                        fontWeight: '700', 
                        fontSize: '12px', 
                        padding: '14px', 
                        borderRadius: '2px', 
                        border: 'none',
                        cursor: 'pointer',
                        textTransform: 'uppercase', 
                        letterSpacing: '0.15em', 
                        transition: 'opacity 0.2s',
                        fontFamily: 'inherit'
                      }}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STAY INFORMED ── */}
        <section style={{ position: 'relative', padding: '120px 20px', textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src="/media/stayinformed%20section%20background%20image.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.12) grayscale(0.4)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,#0a0a0a 0%,transparent 20%,transparent 80%,#0a0a0a 100%)' }} />
          </div>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontFamily: ORBITRON, fontSize: 'clamp(34px,9vw,80px)', fontWeight: '900', color: '#fff', marginBottom: '14px', lineHeight: 1 }}>Watch Results</h2>
            <p style={{ color: '#777', fontSize: '13px', marginBottom: '36px' }}>Don't miss out on the action!!</p>
            <a href={"https://t.me/+voei-i3K66owODk0"} className="broker-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: CYAN, color: '#000', fontWeight: '700', fontSize: '13px', padding: '14px 32px', borderRadius: '4px', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.12em', transition: 'opacity 0.2s' }}>
              <TelegramIcon /> FREE CHANNEL
            </a>
          </div>
        </section>

      </div>
    </>
  )
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}