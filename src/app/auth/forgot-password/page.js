'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { FiArrowRight } from 'react-icons/fi'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      toast.error('Enter your email address.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      toast.error('Enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setSent(true)
      toast.success(data.message || 'Check your email.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59, 130, 246, 0.06), transparent)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/media/logo.PNG" alt="MusaFX" style={{ height: '40px', width: 'auto', display: 'block' }} />
          </Link>
          <h1 style={{ fontSize: '22px', fontWeight: '700', marginTop: '24px', marginBottom: '6px' }}>Forgot password</h1>
          <p style={{ color: '#555', fontSize: '14px' }}>
            {sent ? 'Check your inbox for a reset link.' : 'Enter your email and we’ll send you a link to reset your password.'}
          </p>
        </div>

        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '36px' }}>
          {!sent ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Email Address</label>
                <input
                  className="input-dark"
                  type="email"
                  autoComplete="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-accent" disabled={loading} style={{ marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px', padding: '13px' }}>
                {loading ? 'Sending...' : <><span>Send reset link</span><FiArrowRight /></>}
              </button>
            </form>
          ) : (
            <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
              If an account exists for that email, you’ll receive a message with instructions. The link expires in 1 hour.
            </p>
          )}

          <p style={{ textAlign: 'center', color: '#555', fontSize: '13px', marginTop: '24px' }}>
            <Link href="/auth/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
