'use client'

import { useEffect, useState } from 'react'
import { AdminPanel } from '@/features/admin/admin-panel'
import { User, CLOUD_FUNCTIONS_URL } from '@yanbrain/shared'
import { auth } from '@/lib/firebase-client'

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUsers() {
            try {
                const user = auth.currentUser
                if (!user) {
                    setUsers([])
                    setLoading(false)
                    return
                }

                const token = await user.getIdToken()
                const response = await fetch(`${CLOUD_FUNCTIONS_URL}/users?limit=1000`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
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
        }

        fetchUsers()
    }, [])

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

    return <AdminPanel initialUsers={users} />
}
