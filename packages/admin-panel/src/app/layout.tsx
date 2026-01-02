import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { SessionProvider } from '@/components/session-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Admin Panel',
    description: 'YanPlay Admin Dashboard',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
        <body className={inter.className}>
        <SessionProvider>
            {children}
            <Toaster position="bottom-right" />
        </SessionProvider>
        </body>
        </html>
    )
}