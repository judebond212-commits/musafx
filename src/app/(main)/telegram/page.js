import Link from 'next/link'
import { FaTelegram } from 'react-icons/fa'
import { TELEGRAM_URL } from '@/lib/telegram'
import { HiBell, HiLightningBolt, HiUsers, HiChartBar, HiChat, HiClock } from 'react-icons/hi'
import { FiArrowRight } from 'react-icons/fi'

const benefits = [
  { icon: HiLightningBolt, title: 'Live Trade Signals', desc: 'Get real-time entry, stop-loss, and take-profit signals as our analysts spot opportunities.' },
  { icon: HiBell, title: 'Market Alerts', desc: 'Instant notifications for major market events, economic releases, and volatility spikes.' },
  { icon: HiChartBar, title: 'Daily Analysis', desc: 'Morning briefings and evening wrap-ups covering all major currency pairs and market sentiment.' },
  { icon: HiUsers, title: 'Expert Community', desc: 'Connect with thousands of like-minded investors and experienced traders.' },
  { icon: HiChat, title: 'Q&A Sessions', desc: 'Weekly live sessions where our analysts answer your questions directly.' },
  { icon: HiClock, title: '24/7 Activity', desc: 'The community never sleeps — always someone to discuss a trade idea or market condition.' },
]

export const metadata = {
  title: 'Telegram Community – MusaFX',
}

export default function TelegramPage() {
  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero */}
      <section style={{
        padding: '100px 24px',
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,136,204,0.08), transparent)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #0088cc, #006699)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: '0 0 40px rgba(0,136,204,0.3)',
          }}>
            <FaTelegram size={40} color="#fff" />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: '700', lineHeight: '1.1',
            letterSpacing: '-0.02em', marginBottom: '20px',
          }}>
            Join the MusaFX{' '}
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Telegram Community
            </span>
          </h1>
          <p style={{ color: '#888', fontSize: '17px', lineHeight: '1.7', marginBottom: '40px' }}>
            Thousands of investors share signals, strategies, and market insights in our exclusive Telegram channel. Don't trade alone.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'linear-gradient(135deg, #0088cc, #006699)',
                color: '#fff', textDecoration: 'none',
                fontWeight: '700', fontSize: '15px',
                padding: '14px 32px', borderRadius: '8px',
              }}
            >
              <FaTelegram size={18} />
              Join Telegram Now
            </a>
            <Link href="/auth/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#ccc', textDecoration: 'none',
              fontWeight: '500', fontSize: '15px',
              padding: '14px 28px', borderRadius: '8px',
            }}>
              Create Account <FiArrowRight />
            </Link>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginTop: '56px', flexWrap: 'wrap' }}>
            {[{ val: '12,000+', label: 'Members' }, { val: '50+', label: 'Daily Signals' }, { val: '4.9/5', label: 'Rating' }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '700', color: '#3b82f6' }}>{s.val}</div>
                <div style={{ color: '#555', fontSize: '13px', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '80px 24px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '700', textAlign: 'center', marginBottom: '56px' }}>
            What You <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get Access To</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '28px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(0,136,204,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <b.icon size={20} color="#0088cc" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{b.title}</h3>
                <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.7' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,136,204,0.1), rgba(0,136,204,0.04))',
            border: '1px solid rgba(0,136,204,0.25)',
            borderRadius: '20px', padding: '56px 40px',
          }}>
            <FaTelegram size={48} color="#0088cc" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '700', marginBottom: '14px' }}>
              Ready to Join?
            </h2>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.7', marginBottom: '32px' }}>
              Click below to instantly join our Telegram community and start receiving live FX signals today.
            </p>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'linear-gradient(135deg, #0088cc, #006699)',
                color: '#fff', textDecoration: 'none',
                fontWeight: '700', fontSize: '15px',
                padding: '14px 32px', borderRadius: '8px',
              }}
            >
              <FaTelegram size={18} />
              Join Free on Telegram
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}