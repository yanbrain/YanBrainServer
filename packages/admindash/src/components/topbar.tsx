'use client'

import { useAuth } from '@/lib/auth-context'
import { User } from 'lucide-react'
import { AccountMenu, GlassPanel } from '@yanbrain/shared/ui'

export function Topbar() {
    const { user, signOut } = useAuth()

    return (
        <GlassPanel
            as="header"
            edge
            className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur"
        >
            <div className="flex h-16 items-center justify-between px-6">
                <h1 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
                    Admin Panel
                </h1>
                {user && (
                    <AccountMenu
                        summary={user.email || 'Admin'}
                        trigger={<User className="h-4 w-4" />}
                        items={[
                            { label: 'Users', href: '/users' },
                            { label: 'Logout', onSelect: signOut }
                        ]}
                    />
                )}
            </div>
        </GlassPanel>
    )
}
