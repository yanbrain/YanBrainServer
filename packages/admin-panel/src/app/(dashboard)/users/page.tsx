import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminPanel } from '@/features/admin/admin-panel'
import { User, CLOUD_FUNCTIONS_URL } from '@yanplay/shared'

export const revalidate = 0

async function getUsers(token: string): Promise<User[]> {
    try {
        const response = await fetch(`${CLOUD_FUNCTIONS_URL}/users?limit=1000`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        const data = await response.json()
        if (!data.success) throw new Error(data.error)

        return data.users || []
    } catch (error) {
        console.error('Error fetching users:', error)
        return []
    }
}

export default async function UsersPage() {
    const session = await getServerSession(authOptions)

    if (!session?.firebaseToken) {
        redirect('/login')
    }

    const users = await getUsers(session.firebaseToken)

    return <AdminPanel users={users} token={session.firebaseToken} />
}