'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { HiMail, HiPhone, HiLocationMarker, HiChevronDown, HiChevronUp } from 'react-icons/hi'
import { FiSend } from 'react-icons/fi'

const faqs = [
  { q: 'How do I make a deposit?', a: 'Go to Dashboard → Invest, select your plan, enter the amount, choose your payment method (Bitcoin, USDT, or Bank Transfer), upload your payment screenshot, and submit. Our team confirms within 24 hours.' },
  { q: 'How long do withdrawals take?', a: 'Withdrawal requests are processed within 24–48 business hours. Crypto withdrawals are usually faster than bank transfers.' },
  { q: 'What is the minimum investment?', a: 'The minimum investment amount is $100, which qualifies you for our Starter plan.' },
  { q: 'Can I have multiple investment plans active?', a: 'Currently each account supports one active investment plan at a time. You can upgrade your plan at any time by contacting support.' },
  { q: 'How do I change my password?', a: 'Log in to your dashboard, go to Settings, and use the "Change Password" section at the bottom of the page.' },
  { q: 'What payment methods are accepted?', a: 'We accept Bitcoin (BTC), USDT (TRC20 and ERC20), and bank transfers. Specific wallet addresses and bank details are provided during the investment process.' },
  { q: 'Is my personal information safe?', a: 'Yes. We use industry-standard encryption for all data. We never sell or share your personal information with third parties.' },
  { q: 'How do I contact support urgently?', a: 'For urgent matters, use the contact form below and mark your message as urgent, or reach us directly via our Telegram support channel.' },
]

export default function SupportPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      toast.success('Message sent! We\'ll get back to you shortly.')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(59, 130, 246, 0.07), transparent)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>We're Here to Help</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Contact{' '}
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Support</span>
          </h1>
          <p style={{ color: '#777', fontSize: '16px', lineHeight: '1.7' }}>
            Have a question or need assistance? Our support team typically responds within a few hours.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {/* Info */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>Get in Touch</h2>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.8', marginBottom: '36px' }}>
              Whether you have a question about your account, a transaction, or just want to learn more about our platform — we're ready to help.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: HiMail, label: 'Email', val: 'support@musafx.com' },
                { icon: HiPhone, label: 'Telegram', val: '@musafx_support' },
                { icon: HiLocationMarker, label: 'Response Time', val: '< 4 hours (business days)' },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '2px' }}>{label}</div>
                    <div style={{ fontSize: '14px', color: '#ccc' }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Send a Message</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Full Name</label>
                <input
                  className="input-dark"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Email Address</label>
                <input
                  className="input-dark"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Message</label>
                <textarea
                  className="input-dark"
                  placeholder="Describe your issue or question..."
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <button type="submit" className="btn-accent" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? 'Sending...' : <><FiSend size={14} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '40px 24px 100px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '700', textAlign: 'center', marginBottom: '48px' }}>
            Frequently Asked <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Questions</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: '#111', border: `1px solid ${openFaq === i ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', textAlign: 'left', padding: '18px 22px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: '500', fontFamily: 'var(--font-body)', gap: '16px' }}
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? <HiChevronUp color="#3b82f6" style={{ flexShrink: 0 }} /> : <HiChevronDown color="#555" style={{ flexShrink: 0 }} />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 22px 18px', color: '#777', fontSize: '13px', lineHeight: '1.8' }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}