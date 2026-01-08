import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? ''
}

if (typeof window !== 'undefined' && !firebaseConfig.apiKey) {
  console.warn('Firebase config is missing. Set NEXT_PUBLIC_FIREBASE_* env vars.')
}

const canInitialize = typeof window !== 'undefined' && Boolean(firebaseConfig.apiKey)

const app = canInitialize
  ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig))
  : null

export const auth = app ? getAuth(app) : null
