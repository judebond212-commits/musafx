'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { HiHome, HiTrendingUp, HiArrowCircleDown, HiClipboardList, HiCog, HiLogout } from 'react-icons/hi'

const navItems = [
  { icon: HiHome, label: 'Home', href: '/dashboard' },
  { icon: HiTrendingUp, label: 'Invest', href: '/dashboard/invest' },
  { icon: HiArrowCircleDown, label: 'Withdraw', href: '/dashboard/withdraw' },
  { icon: HiClipboardList, label: 'Transactions', href: '/dashboard/transactions' },
  { icon: HiCog, label: 'Settings', href: '/dashboard/settings' },
]

export default function Sidebar({ user }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    toast.success('Logged out successfully.')
    router.push('/auth/login')
  }

  return (
    <>
      <style>{`
        /* Don't rely on Tailwind existing for responsive behavior */
        .dashboard-desktop-sidebar { display: none !important; }
        @media (min-width: 768px) {
          .dashboard-desktop-sidebar { display: flex !important; }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside style={{
        width: '220px',
        minHeight: '100vh',
        background: '#0a0a0a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
      }} className="dashboard-desktop-sidebar">
        {/* Logo */}
        <div style={{ padding: '0 20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <img src="/media/logo.PNG" alt="MusaFX" style={{ height: '32px', width: 'auto', display: 'block' }} />
          </Link>
        </div>

        {/* User */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '8px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px', marginBottom: '10px' }}>
            {user?.FName?.[0]}{user?.LName?.[0]}
          </div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#ddd' }}>{user?.FName} {user?.LName}</div>
          <div style={{ fontSize: '11px', color: '#555', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.Email}</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 10px' }}>
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px', marginBottom: '2px',
                textDecoration: 'none',
                color: active ? '#3b82f6' : '#777',
                background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                fontSize: '14px', fontWeight: active ? '600' : '400',
                transition: 'all 0.15s',
              }}>
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0 10px 10px' }}>
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '8px',
            background: 'none', border: 'none', color: '#555',
            fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s',
            fontFamily: 'var(--font-body)',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ff5555'; e.currentTarget.style.background = 'rgba(255,85,85,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'none' }}>
            <HiLogout size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}