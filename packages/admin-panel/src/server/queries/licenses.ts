const CLOUD_FUNCTIONS_BASE_URL = process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL ||
    'https://us-central1-yan-play.cloudfunctions.net/api'

export interface License {
    isActive: boolean
    activatedAt: string | null
    expiryDate: string | null
    revokedAt?: string | null
}

export interface UserLicenses {
    [productId: string]: License
}

function convertFirestoreTimestamp(timestamp: any): string | null {
    if (!timestamp) return null

    // If it's already a string (ISO format), return it
    if (typeof timestamp === 'string') return timestamp

    // If it's a Firestore Timestamp with _seconds
    if (timestamp._seconds !== undefined) {
        return new Date(timestamp._seconds * 1000).toISOString()
    }

    // If it's a regular object with seconds
    if (timestamp.seconds !== undefined) {
        return new Date(timestamp.seconds * 1000).toISOString()
    }

    return null
}

function normalizeLicenses(licenses: any): UserLicenses {
    if (!licenses) return {}

    const normalized: UserLicenses = {}

    for (const [productId, license] of Object.entries(licenses)) {
        const l = license as any
        normalized[productId] = {
            isActive: l.isActive ?? false,
            activatedAt: convertFirestoreTimestamp(l.activatedAt),
            expiryDate: convertFirestoreTimestamp(l.expiryDate),
            revokedAt: l.revokedAt ? convertFirestoreTimestamp(l.revokedAt) : undefined,
        }
    }

    return normalized
}

export async function getUserLicenses(userId: string): Promise<UserLicenses> {
    try {
        const response = await fetch(
            `${CLOUD_FUNCTIONS_BASE_URL}/users/${userId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
                next: { revalidate: 0 }
            }
        )

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.licenses) {
            return normalizeLicenses(data.licenses)
        }

        return {}
    } catch (error) {
        console.error('Error fetching licenses:', error)
        return {}
    }
}