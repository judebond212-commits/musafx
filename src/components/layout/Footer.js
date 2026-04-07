'use client'
import Link from 'next/link'
import { HiTrendingUp } from 'react-icons/hi'
import { FiTwitter, FiInstagram, FiSend } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 24px 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <img src="/media/logo.PNG" alt="MusaFX" style={{ height: '32px', width: 'auto', display: 'block' }} />
            </div>
            <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.7', maxWidth: '220px' }}>
              Professional FX investment management. Grow your wealth with automated precision.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {[FiTwitter, FiInstagram, FiSend].map((Icon, i) => (
                <a key={i} href="#" style={{ width: '34px', height: '34px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'; e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>Platform</h4>
            {[{ label: 'AutoPilotPro', href: '/autopilotpro' }, { label: 'Telegram Signals', href: '/telegram' }, { label: 'Partner Brokers', href: '/brokers' }, { label: 'Support', href: '/support' }].map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'block', color: '#666', fontSize: '13px', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#3b82f6'}
                onMouseLeave={e => e.target.style.color = '#666'}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Account */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>Account</h4>
            {[{ label: 'Register', href: '/auth/register' }, { label: 'Login', href: '/auth/login' }, { label: 'Dashboard', href: '/dashboard' }].map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'block', color: '#666', fontSize: '13px', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#3b82f6'}
                onMouseLeave={e => e.target.style.color = '#666'}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>Legal</h4>
            {[{ label: 'Privacy Policy', href: '/privacy-policy' }, { label: 'Refund Policy', href: '/refund-policy' }, { label: 'Terms & Conditions', href: '/terms' }].map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'block', color: '#666', fontSize: '13px', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#3b82f6'}
                onMouseLeave={e => e.target.style.color = '#666'}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-[#060606] border-t border-white/5 px-6 py-5">
          <p className="text-[#333] text-[11px] leading-relaxed text-center max-w-3xl mx-auto">
            Risk Warning: Trading foreign exchange on margin carries a high level of risk, and may not be suitable for all investors.
            The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully consider
            your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of
            some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. You should be
            aware of all the risks associated with foreign exchange trading, and seek advice from an independent financial advisor if you
            have any doubts.
          </p>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: '#444', fontSize: '12px' }}>
            © {new Date().getFullYear()} MusaFX. All rights reserved.
          </p>
          <p style={{ color: '#444', fontSize: '12px' }}>
            Trading involves risk. Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    </footer>
  )
}