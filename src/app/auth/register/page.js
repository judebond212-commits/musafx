'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { FiArrowRight } from 'react-icons/fi'
import { countryData } from '@/lib/countrydata'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ 
    FName: '', 
    LName: '', 
    Email: '', 
    PWord: '', 
    confirm: '',
    Country: '',
    Phone: '',
    AD: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  function validate() {
    const e = {}
    if (!form.FName.trim()) e.FName = 'First name is required.'
    if (!form.LName.trim()) e.LName = 'Last name is required.'
    if (!form.Email.trim()) e.Email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.Email)) e.Email = 'Enter a valid email.'
    
    if (!form.Country) e.Country = 'Please select your country.'
    if (!form.Phone.trim()) e.Phone = 'Phone number is required.'
    if (!form.AD.trim()) e.AD = 'Residential address is required.'

    if (!form.PWord) e.PWord = 'Password is required.'
    else if (form.PWord.length < 8) e.PWord = 'Password must be at least 8 characters.'
    
    if (!form.confirm) e.confirm = 'Please confirm your password.'
    else if (form.PWord !== form.confirm) e.confirm = 'Passwords do not match.'
    
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          FName: form.FName, 
          LName: form.LName, 
          Email: form.Email, 
          PWord: form.PWord,
          Country: form.Country,
          Phone: form.Phone,
          AD: form.AD
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed.')
      toast.success('Account created! Please log in.')
      router.push('/auth/login')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const field = (key, label, type = 'text', placeholder = '', extra = {}) => (
    <div style={extra.full ? { gridColumn: 'span 2' } : {}}>
      <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {type === 'select' ? (
          <select
            className="input-dark"
            value={form[key]}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            style={{ cursor: 'pointer' }}
          >
            <option value="">Select {label}</option>
            {extra.options.map(opt => (
              <option key={opt.name} value={opt.name}>{opt.name}</option>
            ))}
          </select>
        ) : (
          <input
            className="input-dark"
            type={type}
            placeholder={placeholder}
            value={form[key]}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            style={extra.pr ? { paddingRight: '40px' } : {}}
          />
        )}
        {extra.toggle && (
          <button type="button" onClick={extra.toggle} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
            {extra.show ? <HiEyeOff size={16} /> : <HiEye size={16} />}
          </button>
        )}
      </div>
      {errors[key] && <p style={{ color: '#ff5555', fontSize: '12px', marginTop: '4px' }}>{errors[key]}</p>}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59, 130, 246, 0.06), transparent)' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/media/logo.PNG" alt="MusaFX" style={{ height: '40px', width: 'auto', display: 'block' }} />
          </Link>
          <h1 style={{ fontSize: '22px', fontWeight: '700', marginTop: '24px', marginBottom: '6px' }}>Create an Account</h1>
          <p style={{ color: '#555', fontSize: '14px' }}>Complete the form below to start your journey</p>
        </div>

        {/* Form Card */}
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              {field('FName', 'First Name', 'text', 'John')}
              {field('LName', 'Last Name', 'text', 'Doe')}
              
              {field('Email', 'Email Address', 'email', 'john@example.com', { full: true })}
              
              {field('Country', 'Country', 'select', '', { options: countryData })}
              {field('Phone', 'Phone Number', 'tel', '+1 (555) 000-0000')}
              
              {field('AD', 'Residential Address', 'text', '123 Main St, New York', { full: true })}

              <div>
                <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="input-dark" type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.PWord} onChange={e => setForm({ ...form, PWord: e.target.value })} style={{ paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
                    {showPw ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                  </button>
                </div>
                {errors.PWord && <p style={{ color: '#ff5555', fontSize: '12px', marginTop: '4px' }}>{errors.PWord}</p>}
              </div>

              <div>
                <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="input-dark" type={showConfirm ? 'text' : 'password'} placeholder="Repeat password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} style={{ paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
                    {showConfirm ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                  </button>
                </div>
                {errors.confirm && <p style={{ color: '#ff5555', fontSize: '12px', marginTop: '4px' }}>{errors.confirm}</p>}
              </div>
            </div>

            <button type="submit" className="btn-accent" disabled={loading} style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px', padding: '14px' }}>
              {loading ? 'Creating account...' : <><span>Register Account</span><FiArrowRight /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#555', fontSize: '13px', marginTop: '24px' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Log in</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', color: '#333', fontSize: '12px', marginTop: '20px' }}>
          By registering you agree to our{' '}
          <Link href="/terms" style={{ color: '#555', textDecoration: 'underline' }}>Terms</Link> and{' '}
          <Link href="/privacy-policy" style={{ color: '#555', textDecoration: 'underline' }}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}