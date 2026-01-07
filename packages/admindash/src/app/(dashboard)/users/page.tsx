'use client'

import { useCallback, useEffect, useState } from 'react'
import { Dashboard } from '@/features/admin/dashboard'
import { User, CLOUD_FUNCTIONS_URL } from '@yanbrain/shared'
import { auth } from '@/lib/firebase-client'

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [token, setToken] = useState<string>('')
    const [loading, setLoading] = useState(true)

    const fetchUsers = useCallback(async () => {
        try {
            const user = auth.currentUser
            if (!user) {
                setUsers([])
                setLoading(false)
                return
            }

            const idToken = await user.getIdToken(true)
            setToken(idToken)

            const response = await fetch(`${CLOUD_FUNCTIONS_URL}/users?limit=1000`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
            })

            const data = await response.json()
            if (data.success) {
                setUsers(data.users || [])
            }
        } catch (error) {
            console.error('Error fetching users:', error)
            setUsers([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading users...</p>
                </div>
            </div>
        )
    }

    return <Dashboard users={users} token={token} onRefresh={fetchUsers} />
}
