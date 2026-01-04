import { auth } from './firebase-client'
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'

export async function signIn(email: string, password: string) {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized')
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  const idTokenResult = await userCredential.user.getIdTokenResult()

  // Check if user has admin claim
  if (!idTokenResult.claims.admin) {
    await firebaseSignOut(auth)
    throw new Error('User does not have admin privileges')
  }

  return userCredential.user
}

export async function signOut() {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized')
  }

  await firebaseSignOut(auth)
}

export function onAuthChange(callback: (user: User | null) => void) {
  if (!auth) {
    console.warn('Firebase Auth is not initialized')
    return () => {}
  }

  return onAuthStateChanged(auth, callback)
}

export async function getCurrentUser(): Promise<User | null> {
  if (!auth) {
    return null
  }

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export async function getIdToken(): Promise<string | null> {
  const user = await getCurrentUser()
  if (!user) return null

  return user.getIdToken()
}
