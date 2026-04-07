'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { HiTrendingUp, HiEye, HiEyeOff } from 'react-icons/hi'
import { FiArrowRight } from 'react-icons/fi'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ Email: '', PWord: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  function validate() {
    const e = {}
    if (!form.Email.trim()) e.Email = 'Email is required.'
    if (!form.PWord) e.PWord = 'Password is required.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: form.Email, PWord: form.PWord }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed.')
      toast.success('Successfully logged in!')
      router.push('/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59, 130, 246, 0.06), transparent)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/media/logo.PNG" alt="MusaFX" style={{ height: '40px', width: 'auto', display: 'block' }} />
          </Link>
          <h1 style={{ fontSize: '22px', fontWeight: '700', marginTop: '24px', marginBottom: '6px' }}>Welcome Back</h1>
          <p style={{ color: '#555', fontSize: '14px' }}>Log in to access your investment dashboard</p>
        </div>

        {/* Form Card */}
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '36px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Email Address</label>
              <input
                className="input-dark"
                type="email"
                placeholder="john@example.com"
                value={form.Email}
                onChange={e => setForm({ ...form, Email: e.target.value })}
              />
              {errors.Email && <p style={{ color: '#ff5555', fontSize: '12px', marginTop: '4px' }}>{errors.Email}</p>}
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
                <Link href="/auth/forgot-password" style={{ color: '#3b82f6', fontSize: '12px', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-dark"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.PWord}
                  onChange={e => setForm({ ...form, PWord: e.target.value })}
                  style={{ paddingRight: '40px' }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
                  {showPw ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                </button>
              </div>
              {errors.PWord && <p style={{ color: '#ff5555', fontSize: '12px', marginTop: '4px' }}>{errors.PWord}</p>}
            </div>

            <button type="submit" className="btn-accent" disabled={loading} style={{ marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px', padding: '13px' }}>
              {loading ? 'Logging in...' : <><span>Sign In</span><FiArrowRight /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#555', fontSize: '13px', marginTop: '24px' }}>
            Don't have an account?{' '}
            <Link href="/auth/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Register</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', color: '#333', fontSize: '12px', marginTop: '20px' }}>
          Secure login powered by MusaFX SSL
        </p>
      </div>
    </div>
  )
}