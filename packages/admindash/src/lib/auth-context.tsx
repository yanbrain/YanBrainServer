'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from './firebase-client'
import { useRouter } from 'next/navigation'

interface AuthContextType {
    user: User | null
    loading: boolean
    isAdmin: boolean
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
    signIn: async () => {},
    signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user)

            if (user) {
                // Check if user has admin custom claim
                const idTokenResult = await user.getIdTokenResult()
                const hasAdminClaim = !!idTokenResult.claims.admin
                setIsAdmin(hasAdminClaim)

                if (hasAdminClaim) {
                    // Get fresh ID token and store in cookies for server actions
                    const idToken = await user.getIdToken()
                    document.cookie = `firebase-auth=true; path=/; max-age=3600; SameSite=Strict`
                    document.cookie = `firebase-token=${idToken}; path=/; max-age=3600; SameSite=Strict`
                } else {
                    // Clear cookies if not admin
                    document.cookie = 'firebase-auth=; path=/; max-age=0'
                    document.cookie = 'firebase-token=; path=/; max-age=0'
                }
            } else {
                setIsAdmin(false)
                // Clear cookies on sign out
                document.cookie = 'firebase-auth=; path=/; max-age=0'
                document.cookie = 'firebase-token=; path=/; max-age=0'
            }

            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const signIn = async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)

        // Check if user is admin
        const idTokenResult = await userCredential.user.getIdTokenResult()
        if (!idTokenResult.claims.admin) {
            await firebaseSignOut(auth)
            throw new Error('You do not have admin access')
        }
    }

    const signOut = async () => {
        await firebaseSignOut(auth)
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
