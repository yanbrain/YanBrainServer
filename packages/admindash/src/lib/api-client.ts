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
    const token = await getToken()

    try {
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
            throw new Error(data.error || `API error: ${response.status}`)
        }

        return data
    } catch (error) {
        console.error('API call failed:', error)
        throw error
    }
}

// User Actions
export async function createUser(email: string, password: string) {
    return callApi('/users', 'POST', { email, password })
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
