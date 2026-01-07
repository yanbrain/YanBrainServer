'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { InputField as Input } from '@yanbrain/shared/ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by email or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="max-h-[600px] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center">No users found</TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className={cn('cursor-pointer', selectedUserId === user.id && 'bg-primary/10')}
                                    onClick={() => onSelectUser?.(user)}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                                {user.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium">{user.email}</div>
                                                <code className="text-xs text-muted-foreground">{user.id}</code>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                    <span className={user.isSuspended ? 'text-destructive' : 'text-success'}>
                      {user.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
