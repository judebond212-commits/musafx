import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'
import Sidebar from '@/components/dashboard/Sidebar'
import MobileMenu from '@/components/dashboard/MobileMenu'

export default async function DashboardLayout({ children }) {
  const session = await getSession()
  if (!session?.userID) redirect('/auth/login')

  if (!supabaseAdmin) {
    // If Supabase client is null (missing env vars during build), redirect or throw as appropriate.
    // In build context, this usually means static generation is failing.
    // Forcing dynamic on this layout can also help.
    redirect('/auth/login')
  }

  const { data: user } = await supabaseAdmin
    .from('accounts')
    .select('*')
    .eq('"userID"', session.userID)
    .single()

  if (!user || user.AccountEnabled !== 'true') redirect('/auth/login')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f' }}>
      <MobileMenu user={user} />
      <Sidebar user={user} />
      <main style={{
        flex: 1,
        minWidth: 0,
        marginLeft: '220px',
        padding: '32px',
        paddingBottom: '32px',
        minHeight: '100vh',
      }} className="dashboard-main">
        <style>{`
          @media (max-width: 768px) {
            .dashboard-main {
              margin-left: 0 !important;
              padding: 76px 16px 24px !important;
            }
          }
        `}</style>
        {children}
      </main>
    </div>
  )
}