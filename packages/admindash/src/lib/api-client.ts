import { auth } from './firebase-client'
import { CLOUD_FUNCTIONS_URL } from '@yanbrain/shared'

async function getToken(): Promise<string> {
    const user = auth.currentUser
    if (!user) {
        throw new Error('Not authenticated')
    }
    return await user.getIdToken()
}

async function callApi(endpoint: string, method: string = 'POST', body?: any) {
    try {
        const token = await getToken()

        const response = await fetch(`${CLOUD_FUNCTIONS_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: body ? JSON.stringify(body) : undefined,
        })

        const data = await response.json()

        if (!response.ok) {
            return { success: false, error: data.error || `API error: ${response.status}` }
        }

        return { success: true, ...data }
    } catch (error) {
        console.error('API call failed:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

// User Actions
export async function createUser(userId: string, email: string) {
    return callApi('/users', 'POST', { userId, email })
}

export async function deleteUser(userId: string) {
    return callApi(`/users/${userId}`, 'DELETE')
}

export async function suspendUser(userId: string) {
    return callApi(`/users/${userId}/suspend`, 'PATCH')
}

export async function unsuspendUser(userId: string) {
    return callApi(`/users/${userId}/unsuspend`, 'PATCH')
}

// License Actions
export async function grantLicense(userId: string, productId: string, days: number) {
    return callApi('/licenses/grant', 'POST', { userId, productId, days })
}

export async function revokeLicense(userId: string, productId: string) {
    return callApi(`/licenses/${userId}/${productId}`, 'DELETE')
}
