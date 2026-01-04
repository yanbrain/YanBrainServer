import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { SITE_CONFIG } from '@/config/site'
import './globals.css'

// const inter = Inter({
//   subsets: ['latin'],
//   fallback: ['system-ui', 'arial', 'sans-serif'],
//   display: 'swap',
// })

export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <Navigation />
        <main className="mt-16">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
