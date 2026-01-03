'use client'

import { useAuth } from './session-provider'
import { signOut } from '@/lib/auth-utils'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Topbar() {
    const { user } = useAuth()
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.push('/login')
    }

    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
                <h1 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    Admin Panel
                </h1>
                {user && (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                        <Button variant="ghost" size="sm" onClick={handleSignOut}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                )}
            </div>
        </header>
    )
}