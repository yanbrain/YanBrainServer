'use server'

import { revalidatePath } from 'next/cache'
import { CLOUD_FUNCTIONS_URL } from '@yanplay/shared'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function getToken(): Promise<string> {
    const session = await getServerSession(authOptions)
    if (!session?.firebaseToken) {
        throw new Error('Not authenticated')
    }
    return session.firebaseToken
}

async function callApi(endpoint: string, method: string = 'POST', body?: any) {
    const token = await getToken()

    try {
        const response = await fetch(`${CLOUD_FUNCTIONS_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: body ? JSON.stringify(body) : undefined,
            cache: 'no-store',
        })

        const data = await response.json()
        if (!response.ok || !data.success) {
            return { success: false, error: data.error || `HTTP ${response.status}` }
        }

        return { success: true, data }
    } catch (error) {
        console.error(`API error (${endpoint}):`, error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function grantLicense(userId: string, productId: string, days: number) {
    const result = await callApi('/licenses/grant', 'POST', { userId, productId, days })
    if (result.success) revalidatePath('/users')
    return result
}

export async function revokeLicense(userId: string, productId: string) {
    const result = await callApi(`/licenses/${userId}/${productId}`, 'DELETE')
    if (result.success) revalidatePath('/users')
    return result
}