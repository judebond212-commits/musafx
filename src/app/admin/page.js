'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { HiShieldCheck, HiEye, HiEyeOff } from 'react-icons/hi'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('All fields required.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed.')
      toast.success('Access granted.')
      router.push('/admin/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.02) 1px, transparent 1px)`,
      backgroundSize: '60px 60px',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 30px rgba(59, 130, 246, 0.25)' }}>
            <HiShieldCheck size={28} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>Admin Access</h1>
          <p style={{ color: '#555', fontSize: '13px' }}>MusaFX Control Panel — Authorised Personnel Only</p>
        </div>

        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: '#888', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Admin Email</label>
              <input className="input-dark" type="email" placeholder="admin@musafx.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#888', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input-dark" type={showPw ? 'text' : 'password'} placeholder="Admin password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: '42px' }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
                  {showPw ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-accent" disabled={loading} style={{ marginTop: '6px', padding: '13px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? 'Authenticating...' : <><HiShieldCheck size={16} /><span>Enter Admin Panel</span></>}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', color: '#2a2a2a', fontSize: '11px', marginTop: '20px' }}>
          Unauthorised access attempts are logged and reported.
        </p>
      </div>
    </div>
  )
}