'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { HiUsers, HiClipboardList, HiLogout, HiShieldCheck, HiTrendingUp } from 'react-icons/hi'

const navItems = [
  { icon: HiUsers, label: 'Users', href: '/admin/dashboard' },
  { icon: HiClipboardList, label: 'Transactions', href: '/admin/dashboard/transactions' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    toast.success('Logged out.')
    router.push('/admin')
  }

  return (
    <>
      <aside style={{ width: '210px', minHeight: '100vh', background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }} className="hidden md:flex">
        <div style={{ padding: '0 18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <img src="/media/logo.PNG" alt="MusaFX" style={{ height: '28px', width: 'auto', display: 'block' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px' }}>
            <HiShieldCheck size={12} color="#3b82f6" />
            <span style={{ color: '#3b82f6', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</span>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', marginBottom: '2px', textDecoration: 'none', color: active ? '#3b82f6' : '#666', background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent', fontSize: '14px', fontWeight: active ? '600' : '400', transition: 'all 0.15s' }}>
                <Icon size={17} />{label}
              </Link>
            )
          })}
        </nav>
        <div style={{ padding: '0 8px 8px' }}>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: 'none', border: 'none', color: '#555', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ff5555'; e.currentTarget.style.background = 'rgba(255,85,85,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'none' }}>
            <HiLogout size={17} />Logout
          </button>
        </div>
      </aside>
      <nav style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.08)', zIndex: 100, padding: '8px 0' }} className="flex md:hidden">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', textDecoration: 'none', padding: '6px', color: active ? '#3b82f6' : '#555' }}>
              <Icon size={20} />
              <span style={{ fontSize: '10px', fontWeight: active ? '600' : '400' }}>{label}</span>
            </Link>
          )
        })}
        <button onClick={handleLogout} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', background: 'none', border: 'none', color: '#555', padding: '6px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          <HiLogout size={20} /><span style={{ fontSize: '10px' }}>Logout</span>
        </button>
      </nav>
    </>
  )
}