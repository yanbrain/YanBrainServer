import * as admin from 'firebase-admin'

// Initialize Firebase Admin only if not already initialized and credentials are available
if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (projectId && clientEmail && privateKey) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            })
        } catch (error) {
            console.error('Firebase Admin initialization error:', error)
        }
    }
}

export const db = admin.apps.length > 0 ? admin.firestore() : null as any
export const auth = admin.apps.length > 0 ? admin.auth() : null as any

// Collections - will be null if Firebase isn't initialized
export const usersCollection = db ? db.collection('users') : null as any
export const licensesCollection = db ? db.collection('licenses') : null as any
export const transactionsCollection = db ? db.collection('transactions') : null as any