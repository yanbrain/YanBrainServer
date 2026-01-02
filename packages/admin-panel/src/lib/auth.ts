import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import * as admin from "firebase-admin"

// Initialize Firebase Admin only if credentials are available
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
    } else {
        console.warn('Firebase Admin credentials not found - some features will be disabled')
    }
}

// Helper function to verify password and get ID token
async function verifyPasswordAndGetToken(email: string, password: string): Promise<{ uid: string; idToken: string } | null> {
    try {
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
        if (!apiKey) {
            throw new Error('Firebase API key not configured')
        }

        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true,
                }),
            }
        )

        const data = await response.json()

        if (!response.ok) {
            console.error('Firebase Auth error:', data)
            return null
        }

        return {
            uid: data.localId,
            idToken: data.idToken,
        }
    } catch (error) {
        console.error('Password verification error:', error)
        return null
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials")
                }

                try {
                    const result = await verifyPasswordAndGetToken(credentials.email, credentials.password)

                    if (!result) {
                        throw new Error("Invalid email or password")
                    }

                    // Only check admin claims if Firebase Admin is initialized
                    if (admin.apps.length > 0) {
                        const { getAuth } = await import("firebase-admin/auth")
                        const userRecord = await getAuth().getUser(result.uid)
                        if (!userRecord.customClaims?.admin) {
                            throw new Error("Not authorized as admin")
                        }
                    }

                    return {
                        id: result.uid,
                        email: credentials.email,
                        idToken: result.idToken,
                    }
                } catch (error: any) {
                    console.error("Auth error:", error)
                    throw new Error(error.message || "Authentication failed")
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.firebaseToken = (user as any).idToken
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.firebaseToken = token.firebaseToken as string
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60, // 1 hour
    },
    secret: process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production',
}