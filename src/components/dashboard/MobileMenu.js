'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { HiHome, HiTrendingUp, HiArrowCircleDown, HiClipboardList, HiCog, HiLogout, HiMenu, HiX } from 'react-icons/hi'

const navItems = [
  { icon: HiHome, label: 'Home', href: '/dashboard' },
  { icon: HiTrendingUp, label: 'Invest', href: '/dashboard/invest' },
  { icon: HiArrowCircleDown, label: 'Withdraw', href: '/dashboard/withdraw' },
  { icon: HiClipboardList, label: 'Transactions', href: '/dashboard/transactions' },
  { icon: HiCog, label: 'Settings', href: '/dashboard/settings' },
]

export default function MobileMenu({ user }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    toast.success('Logged out successfully.')
    router.push('/auth/login')
  }

  return (
    <>
      <style>{`
        .dashboard-mobile-flex { display: flex !important; }
        .dashboard-mobile-only { display: block !important; }
        @media (min-width: 768px) { 
          .dashboard-mobile-flex, .dashboard-mobile-only { display: none !important; } 
        }
      `}</style>

      <header
        className="dashboard-mobile-flex"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background: '#0a0a0a',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          padding: '12px 14px',
          paddingRight: '66px',
          boxSizing: 'border-box',
          height: '56px',
          position: 'fixed',
          overflow: 'hidden',
          WebkitBackdropFilter: 'blur(8px)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            minWidth: 0,
            flex: 1,
          }}
        >
          <img src="/media/logo.PNG" alt="MusaFX" style={{ height: '32px', width: 'auto', display: 'block' }} />
        </Link>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          style={{
            width: '40px',
            height: '40px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#ddd',
            cursor: 'pointer',
            flexShrink: 0,
            position: 'absolute',
            right: '14px',
            top: '8px',
          }}
        >
          {open ? <HiX size={22} /> : <HiMenu size={22} />}
        </button>
      </header>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
            className="dashboard-mobile-only"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 180,
              background: 'rgba(0,0,0,0.55)',
              border: 'none',
              padding: 0,
              margin: 0,
            }}
          />

          <div
            className="dashboard-mobile-only"
            style={{
              position: 'fixed',
              top: 56,
              left: 12,
              right: 12,
              zIndex: 220,
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.55)',
            }}
          >
            <div style={{ padding: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px' }}>
                  {user?.FName?.[0]}{user?.LName?.[0]}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#ddd', lineHeight: 1.2 }}>{user?.FName} {user?.LName}</div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.Email}</div>
                </div>
              </div>
            </div>

            <nav style={{ padding: '10px' }}>
              {navItems.map(({ icon: Icon, label, href }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      marginBottom: '4px',
                      textDecoration: 'none',
                      color: active ? '#3b82f6' : '#aaa',
                      background: active ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255,255,255,0.02)',
                      border: '1px solid ' + (active ? 'rgba(59, 130, 246, 0.18)' : 'rgba(255,255,255,0.06)'),
                      fontSize: '14px',
                      fontWeight: active ? '600' : '500',
                    }}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                )
              })}

              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#ff8080',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontWeight: '600',
                }}
              >
                <HiLogout size={18} />
                Logout
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  )
}

