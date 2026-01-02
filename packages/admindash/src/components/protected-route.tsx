'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading, isAdmin } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === '/login') {
            return
        }

        // Redirect to login if not authenticated
        if (!loading && !user) {
            router.push('/login')
        }

        // Redirect if not admin
        if (!loading && user && !isAdmin) {
            router.push('/login')
        }
    }, [user, loading, isAdmin, router, pathname])

    // Show loading state
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    // Show login page if not authenticated
    if (!user || !isAdmin) {
        if (pathname === '/login') {
            return <>{children}</>
        }
        return null
    }

    return <>{children}</>
}
