'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { onAuthChange } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Verify user has admin claim
        const idTokenResult = await firebaseUser.getIdTokenResult()
        if (idTokenResult.claims.admin) {
          setUser(firebaseUser)

          // Get fresh ID token and store in cookies
          const idToken = await firebaseUser.getIdToken()

          // Set auth cookies for middleware and server actions
          document.cookie = `firebase-auth=true; path=/; max-age=3600; SameSite=Strict`
          document.cookie = `firebase-token=${idToken}; path=/; max-age=3600; SameSite=Strict`
        } else {
          setUser(null)
          document.cookie = 'firebase-auth=; path=/; max-age=0'
          document.cookie = 'firebase-token=; path=/; max-age=0'
          router.push('/login?error=not-admin')
        }
      } else {
        setUser(null)
        document.cookie = 'firebase-auth=; path=/; max-age=0'
        document.cookie = 'firebase-token=; path=/; max-age=0'
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}