'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading, isAdmin } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const normalizedPath = pathname?.replace(/\/+$/, '') || '/'
    const isLoginRoute = normalizedPath === '/login'

    useEffect(() => {
        // Skip auth check for login page
        if (isLoginRoute) {
            if (process.env.NODE_ENV === 'development') {
                console.info('[ProtectedRoute] Allowing login route', { pathname })
            }
            return
        }

        // Redirect to login if not authenticated
        if (!loading && !user) {
            console.warn('[ProtectedRoute] Unauthenticated user, redirecting to /login', { pathname })
            router.push('/login')
        }

        // Redirect if not admin
        if (!loading && user && !isAdmin) {
            console.warn('[ProtectedRoute] User lacks admin claim, redirecting to /login', { pathname, uid: user.uid })
            router.push('/login')
        }
    }, [user, loading, isAdmin, router, pathname, isLoginRoute])

    // Always allow the login page to render, even while auth is loading.
    if (isLoginRoute) {
        return <>{children}</>
    }

    // Show loading state for protected routes.
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
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Redirecting to login…</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
