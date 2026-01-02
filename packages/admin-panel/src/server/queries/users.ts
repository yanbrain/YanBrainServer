import { User, UserDetails, UserLicenses, CLOUD_FUNCTIONS_URL } from '@yanplay/shared'

function convertTimestamp(timestamp: any): string | null {
    if (!timestamp) return null
    if (typeof timestamp === 'string') return timestamp
    if (timestamp._seconds) return new Date(timestamp._seconds * 1000).toISOString()
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toISOString()
    return null
}

function normalizeLicenses(licenses: any): UserLicenses {
    if (!licenses) return {}

    const normalized: UserLicenses = {}
    for (const [productId, license] of Object.entries(licenses)) {
        const l = license as any
        normalized[productId] = {
            isActive: l.isActive ?? false,
            activatedAt: convertTimestamp(l.activatedAt),
            expiryDate: convertTimestamp(l.expiryDate),
            revokedAt: l.revokedAt ? convertTimestamp(l.revokedAt) : undefined,
        }
    }
    return normalized
}

export async function getUsers(limit: number = 1000): Promise<User[]> {
    try {
        const response = await fetch(`${CLOUD_FUNCTIONS_URL}/users?limit=${limit}`, {
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
        })

        const data = await response.json()
        if (!data.success) throw new Error(data.error)

        return data.users || []
    } catch (error) {
        console.error('Error fetching users:', error)
        return []
    }
}

export async function getUserDetails(userId: string): Promise<UserDetails | null> {
    try {
        const response = await fetch(`${CLOUD_FUNCTIONS_URL}/users/${userId}`, {
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
        })

        const data = await response.json()
        if (!data.success) throw new Error(data.error)

        return {
            user: data.user,
            licenses: normalizeLicenses(data.licenses),
            transactions: data.transactions || [],
            subscriptions: data.subscriptions || [],
        }
    } catch (error) {
        console.error('Error fetching user details:', error)
        return null
    }
}