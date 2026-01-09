'use client'

import { useState } from 'react'
import { RefreshCw, ShieldAlert, ShieldCheck, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { UserTable } from '@/features/users/user-table'
import { CreditsPanel } from '@/features/credits/credits-panel'
import { TransactionPanel } from '@/features/transactions/transaction-panel'
import { CreateUserDialog } from '@/features/users/create-user-dialog'
import { User } from '@yanbrain/shared'
import { GlassPanel } from '@yanbrain/shared/ui'
import { suspendUser, unsuspendUser } from '@/lib/api-client'
import { toast } from 'sonner'

interface DashboardProps {
    users: User[]
    token: string
    onRefresh: () => void
}

export function Dashboard({ users, token, onRefresh }: DashboardProps) {
    const router = useRouter()
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [showCreateUser, setShowCreateUser] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const selectedUser = users.find((u) => u.id === selectedUserId)

    const handleRefresh = () => {
        onRefresh()
        router.refresh()
        setRefreshKey(k => k + 1)
    }

    const handleSuspend = async () => {
        if (!selectedUserId) return
        setLoading(true)
        const result = await suspendUser(selectedUserId)
        setLoading(false)

        if (result.success) {
            toast.success('User suspended')
            handleRefresh()
        } else {
            toast.error(result.error || 'Failed to suspend')
        }
    }

    const handleUnsuspend = async () => {
        if (!selectedUserId) return
        setLoading(true)
        const result = await unsuspendUser(selectedUserId)
        setLoading(false)

        if (result.success) {
            toast.success('User unsuspended')
            handleRefresh()
        } else {
            toast.error(result.error || 'Failed to unsuspend')
        }
    }

    const handleUserCreated = () => {
        setShowCreateUser(false)
        handleRefresh()
    }

    return (
        <div className="space-y-6">
            <GlassPanel className="flex items-center justify-between px-6 py-5">
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowCreateUser(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create User
                    </Button>
                    {selectedUser && (
                        <Button
                            variant="outline"
                            onClick={selectedUser.isSuspended ? handleUnsuspend : handleSuspend}
                            disabled={loading}
                            className={selectedUser.isSuspended ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}
                        >
                            {selectedUser.isSuspended ? <ShieldCheck className="mr-2 h-4 w-4" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
                            {selectedUser.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </Button>
                    )}
                    <Button variant="outline" onClick={handleRefresh}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </GlassPanel>

            <div className="grid gap-6 lg:grid-cols-[1fr_350px_350px]">
                <Card className="p-6">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Users
                    </h2>
                    <UserTable
                        users={users}
                        selectedUserId={selectedUserId}
                        onSelectUser={(user) => setSelectedUserId(user.id)}
                    />
                </Card>

                <Card className="p-6">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {selectedUser ? `Credits: ${selectedUser.email}` : 'Credits'}
                    </h2>
                    {selectedUser ? (
                        <CreditsPanel
                            userId={selectedUser.id}
                            isSuspended={selectedUser.isSuspended}
                            token={token}
                            refreshKey={refreshKey}
                            onRefresh={handleRefresh}
                        />
                    ) : (
                        <div className="py-12 text-center text-sm text-muted-foreground">
                            Select a user to view credits
                        </div>
                    )}
                </Card>

                <Card className="p-6">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Transactions
                    </h2>
                    {selectedUser ? (
                        <TransactionPanel
                            userId={selectedUser.id}
                            token={token}
                            refreshKey={refreshKey}
                        />
                    ) : (
                        <div className="py-12 text-center text-sm text-muted-foreground">
                            Select a user to view transactions
                        </div>
                    )}
                </Card>
            </div>

            <CreateUserDialog
                open={showCreateUser}
                onOpenChange={setShowCreateUser}
                onSuccess={handleUserCreated}
            />
        </div>
    )
}
