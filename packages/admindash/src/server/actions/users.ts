'use server'

import { revalidatePath } from 'next/cache'
import { CLOUD_FUNCTIONS_URL } from '@yanbrain/shared'
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

export async function createUser(userId: string, email: string) {
    const result = await callApi('/users', 'POST', { userId, email })
    if (result.success) revalidatePath('/users')
    return result
}

export async function deleteUser(userId: string) {
    const result = await callApi(`/users/${userId}`, 'DELETE')
    if (result.success) revalidatePath('/users')
    return result
}

export async function suspendUser(userId: string) {
    const result = await callApi(`/users/${userId}/suspend`, 'PATCH')
    if (result.success) revalidatePath('/users')
    return result
}

export async function unsuspendUser(userId: string) {
    const result = await callApi(`/users/${userId}/unsuspend`, 'PATCH')
    if (result.success) revalidatePath('/users')
    return result
}