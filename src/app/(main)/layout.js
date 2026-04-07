import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

export default async function MainLayout({ children }) {
  const session = await getSession()
  
  if (session?.userID) {
    redirect('/dashboard')
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        {children}
      </main>
      <Footer />
    </>
  )
}