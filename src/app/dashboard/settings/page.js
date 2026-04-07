
'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { HiUser, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'

export default function SettingsPage() {
  const [profile, setProfile] = useState({ FName: '', LName: '', Country: '', ST: '', AD: '' })
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' })
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPw, setLoadingPw] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    fetch('/api/dashboard/settings')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setProfile({
            FName: data.user.FName || '',
            LName: data.user.LName || '',
            Country: data.user.Country || '',
            ST: data.user.ST || '',
            AD: data.user.AD || '',
          })
        }
      })
      .catch(() => toast.error('Failed to load profile.'))
      .finally(() => setFetching(false))
  }, [])

  async function handleProfileSave(e) {
    e.preventDefault()
    if (!profile.FName || !profile.LName) { toast.error('First and last name are required.'); return }
    setLoadingProfile(true)
    try {
      const res = await fetch('/api/dashboard/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'profile', ...profile }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save.')
      toast.success('Profile updated successfully.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoadingProfile(false)
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    if (!passwords.current) { toast.error('Enter your current password.'); return }
    if (!passwords.newPw || passwords.newPw.length < 8) { toast.error('New password must be at least 8 characters.'); return }
    if (passwords.newPw !== passwords.confirm) { toast.error('Passwords do not match.'); return }
    setLoadingPw(true)
    try {
      const res = await fetch('/api/dashboard/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'password', current: passwords.current, newPw: passwords.newPw }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update password.')
      toast.success('Password updated successfully.')
      setPasswords({ current: '', newPw: '', confirm: '' })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoadingPw(false)
    }
  }

  const inputStyle = {
    background: '#0f0f0f',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    borderRadius: '8px',
    padding: '10px 14px',
    width: '100%',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  }
  const labelStyle = {
    display: 'block',
    color: '#888',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '6px',
  }

  if (fetching) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
        <div style={{ color: '#444', fontSize: '14px' }}>Loading settings...</div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '700', marginBottom: '6px' }}>
          Account Settings
        </h1>
        <p style={{ color: '#555', fontSize: '14px' }}>Manage your profile and security settings.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '680px' }}>

        {/* Profile Section */}
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HiUser size={18} color="#3b82f6" />
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: '600' }}>Profile Information</h2>
              <p style={{ color: '#555', fontSize: '12px', marginTop: '1px' }}>Update your personal details</p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input style={inputStyle} type="text" value={profile.FName}
                  onChange={e => setProfile({ ...profile, FName: e.target.value })}
                  placeholder="First name"
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input style={inputStyle} type="text" value={profile.LName}
                  onChange={e => setProfile({ ...profile, LName: e.target.value })}
                  placeholder="Last name"
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Country</label>
                <input style={inputStyle} type="text" value={profile.Country}
                  onChange={e => setProfile({ ...profile, Country: e.target.value })}
                  placeholder="e.g. Nigeria"
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              <div>
                <label style={labelStyle}>State / Region</label>
                <input style={inputStyle} type="text" value={profile.ST}
                  onChange={e => setProfile({ ...profile, ST: e.target.value })}
                  placeholder="e.g. Lagos"
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} rows={3}
                value={profile.AD}
                onChange={e => setProfile({ ...profile, AD: e.target.value })}
                placeholder="Street address..."
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-accent" disabled={loadingProfile} style={{ padding: '10px 24px' }}>
                {loadingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Password Section */}
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HiLockClosed size={18} color="#3b82f6" />
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: '600' }}>Change Password</h2>
              <p style={{ color: '#555', fontSize: '12px', marginTop: '1px' }}>Ensure your account stays secure</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'current', label: 'Current Password', show: showCurrent, toggle: () => setShowCurrent(v => !v), placeholder: 'Your current password' },
              { key: 'newPw', label: 'New Password', show: showNew, toggle: () => setShowNew(v => !v), placeholder: 'Min. 8 characters' },
              { key: 'confirm', label: 'Confirm New Password', show: showConfirm, toggle: () => setShowConfirm(v => !v), placeholder: 'Repeat new password' },
            ].map(({ key, label, show, toggle, placeholder }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    style={{ ...inputStyle, paddingRight: '42px' }}
                    type={show ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={passwords[key]}
                    onChange={e => setPasswords({ ...passwords, [key]: e.target.value })}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <button type="button" onClick={toggle}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
                    {show ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                  </button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={loadingPw}
                style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3b82f6', fontWeight: '700', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                {loadingPw ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
