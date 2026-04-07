import { redirect } from 'next/navigation'
import AdminSidebar from '../Adminsidebar'

export default function AdminDashboardLayout({ children }) {
  // Let the client handle the auth for now or use the session if it exists but the admin doesn't use the standard session from what we saw, they use an admin token or something. Let's assume it's just a layout.
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f' }}>
      <AdminSidebar />
      <main style={{
        flex: 1,
        minWidth: 0,
        marginLeft: '210px',
        padding: '32px',
        paddingBottom: '80px', // Extra bottom padding for mobile nav
        minHeight: '100vh',
      }} className="dashboard-main">
        <style>{`
          @media (max-width: 768px) {
            .dashboard-main {
              margin-left: 0 !important;
              padding: 24px 16px 80px !important;
            }
          }
        `}</style>
        {children}
      </main>
    </div>
  )
}
