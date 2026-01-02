import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { SessionProvider } from '@/components/session-provider'
import { ProtectedRoute } from '@/components/protected-route'
import '@yanbrain/shared/src/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Admin Panel',
    description: 'YanBrain Admin Dashboard',
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
            <ProtectedRoute>
                {children}
            </ProtectedRoute>
            <Toaster position="bottom-right" />
        </SessionProvider>
        </body>
        </html>
    )
}
