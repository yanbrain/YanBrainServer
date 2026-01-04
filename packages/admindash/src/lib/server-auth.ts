'use server'

import { cookies } from 'next/headers'

/**
 * Get Firebase ID token from cookies
 * The token is set by the client after successful authentication
 */
export async function getFirebaseToken(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get('firebase-token')?.value

  if (!token) {
    throw new Error('Not authenticated - no token found')
  }

  return token
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.has('firebase-auth') && cookieStore.has('firebase-token')
}
