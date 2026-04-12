'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { FiArrowRight } from 'react-icons/fi'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const migrateEmail = searchParams.get('email') || ''
  const isMigrate = searchParams.get('migrate') === 'true'

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!token && !isMigrate) {
      toast.error('Invalid reset link. Request a new one from the forgot password page.')
      return
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const endpoint = isMigrate ? '/api/auth/migrate-password' : '/api/auth/reset-password'
      const body = isMigrate ? { email: migrateEmail, password } : { token, password }
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not reset password.')
      toast.success(data.message || 'Password updated.')
      router.push('/auth/login')
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
          <h1 style={{ fontSize: '22px', fontWeight: '700', marginTop: '24px', marginBottom: '6px' }}>Set new password</h1>
          <p style={{ color: '#555', fontSize: '14px' }}>Choose a strong password for your account.</p>
        </div>

        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '36px' }}>
          {(!token && !isMigrate) ? (
            <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', margin: 0 }}>
              Missing or invalid link.{' '}
              <Link href="/auth/forgot-password" style={{ color: '#3b82f6', fontWeight: '600' }}>Request a new reset</Link>
            </p>
          ) : isMigrate && !migrateEmail ? (
            <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', margin: 0 }}>
              Email information missing.{' '}
              <Link href="/auth/login" style={{ color: '#3b82f6', fontWeight: '600' }}>Try logging in again</Link>
            </p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {isMigrate && (
                <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
                   <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', fontWeight: '700', marginBottom: '2px' }}>Migrating Account</div>
                   <div style={{ fontSize: '13px', color: '#aaa' }}>{migrateEmail}</div>
                </div>
              )}
              <div>
                <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>New password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input-dark"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ paddingRight: '40px' }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
                    {showPw ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Confirm password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input-dark"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    style={{ paddingRight: '40px' }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
                    {showConfirm ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-accent" disabled={loading} style={{ marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px', padding: '13px' }}>
                {loading ? 'Saving...' : <><span>Update password</span><FiArrowRight /></>}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', color: '#555', fontSize: '13px', marginTop: '24px' }}>
            <Link href="/auth/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '14px' }}>
        Loading…
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
