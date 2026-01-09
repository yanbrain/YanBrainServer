'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { User } from '@yanbrain/shared'
import { cn } from '@/lib/utils'

interface UserTableProps {
    users: User[]
    selectedUserId?: string | null
    onSelectUser?: (user: User) => void
}

export function UserTable({ users, selectedUserId, onSelectUser }: UserTableProps) {
    const [search, setSearch] = useState('')

    const filtered = users.filter((user) =>
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.id.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-10" />
                <Input
                    id="user-search"
                    name="user-search"
                    placeholder="Search by email or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            <ScrollArea className="h-[440px]">
                {filtered.length === 0 ? (
                    <div className="py-12 text-center text-sm text-slate-10">No users found</div>
                ) : (
                    <div className="space-y-px pr-4">
                        {filtered.map((user) => (
                            <div
                                key={user.id}
                                className={cn(
                                    'flex items-center justify-between px-4 py-3 cursor-pointer transition-colors border-b border-slate-5',
                                    selectedUserId === user.id && 'bg-[rgba(255,255,255,0.05)]',
                                    'hover:bg-[rgba(255,255,255,0.03)]'
                                )}
                                onClick={() => onSelectUser?.(user)}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-8 text-sm font-bold text-white shrink-0">
                                        {user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="font-medium text-slate-11 truncate">{user.email}</div>
                                        <code className="text-xs text-slate-10 truncate block">{user.id}</code>
                                    </div>
                                </div>
                                <span className={cn(
                                    'text-sm font-medium shrink-0 ml-4',
                                    user.isSuspended ? 'text-red-10' : 'text-green-10'
                                )}>
                                    {user.isSuspended ? 'Suspended' : 'Active'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}