'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX } from 'react-icons/fi'
import { HiTrendingUp } from 'react-icons/hi'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'AutoPilotPro', href: '/autopilotpro' },
  { label: 'Telegram', href: '/telegram' },
  { label: 'Support', href: '/support' },
  { label: 'Brokers', href: '/brokers' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile) setMobileOpen(false)
  }, [isMobile])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s',
        background: scrolled || mobileOpen
          ? 'rgba(15,15,15,0.97)'
          : 'transparent',
        backdropFilter: scrolled || mobileOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(59, 130, 246, 0.15)' : 'none',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Top Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/media/logo.PNG" alt="MusaFX" style={{ height: '40px', width: 'auto', display: 'block' }} />
          </Link>

          {/* Desktop Nav */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: pathname === link.href ? '#3b82f6' : '#aaa',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = pathname === link.href ? '#3b82f6' : '#aaa'}
                >
                  {link.label}
                </Link>
              ))}
              <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
              <Link
                href="/auth/login"
                style={{
                  color: '#aaa',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                transition: 'background 0.2s',
              }}
            >
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobile && (
          <div
            style={{
              maxHeight: mobileOpen ? '500px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.35s ease',
            }}
          >
            <div style={{
              padding: '8px 0 24px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: pathname === link.href ? '#3b82f6' : '#ccc',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: pathname === link.href ? '600' : '400',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    background: pathname === link.href ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                    transition: 'background 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '12px 0' }} />
              <div style={{ display: 'flex', gap: '10px', padding: '0 4px' }}>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '11px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    color: '#ccc',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '11px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    borderRadius: '6px',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '700',
                  }}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}