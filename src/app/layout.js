import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata = {
  title: 'MusaFX – Professional FX Investment Platform',
  description: 'Grow your wealth with MusaFX – automated FX trading, real-time signals, and expert investment management.',
  keywords: 'FX investment, forex trading, autopilot trading, MusaFX',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <head>
      </head>
      <body className={`noise ${poppins.className}`} style={{ fontFamily: 'var(--font-poppins), sans-serif' }}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(245,166,35,0.3)',
              borderRadius: '10px',
              fontFamily: 'var(--font-body)',
            },
            success: {
              iconTheme: { primary: '#00c896', secondary: '#0f0f0f' },
            },
            error: {
              iconTheme: { primary: '#ff4444', secondary: '#0f0f0f' },
            },
          }}
        />
      </body>
    </html>
  )
}