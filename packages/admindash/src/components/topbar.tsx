'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'

export function Topbar() {
    const { user, signOut } = useAuth()

    return (
        <header className="glass-panel glass-panel--edge sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-6">
                <h1 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
                    Admin Panel
                </h1>
                {user && (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-white/70">{user.email}</span>
                        <Button variant="ghost" size="sm" onClick={signOut}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                )}
            </div>
        </header>
    )
}
