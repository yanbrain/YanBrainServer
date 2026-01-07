'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User
} from 'firebase/auth'
import { User as UserIcon, X } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/NavigationMenu'
import { Button } from '@/components/ui/Button'
import { SITE_CONFIG } from '@/config/site'
import { PRODUCTS } from '@/config/products'
import { cn } from '@/lib/utils'
import { auth } from '@/lib/firebase'
import { AccountMenu, AuthCard } from '@yanbrain/shared/ui'

export function Navigation() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authMessage, setAuthMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        setModalOpen(false)
        setPassword('')
      }
    })
    return () => unsubscribe()
  }, [])

  const accountItems = useMemo(() => {
    if (user) {
      return [
        { label: 'Account', href: '/dashboard' },
        { label: 'Logout', onSelect: () => auth && signOut(auth) }
      ]
    }
    return [{ label: 'Login', href: '/dashboard' }]
  }, [user])

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthLoading(true)
    setAuthError(null)
    setAuthMessage(null)

    try {
      if (!auth) {
        setAuthError('Firebase is not configured.')
        return
      }
      if (modalMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
        setAuthMessage('Signed in successfully.')
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
        setAuthMessage('Account created successfully.')
      }
      setPassword('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed'
      setAuthError(message)
    } finally {
      setAuthLoading(false)
    }
  }

  async function handlePasswordReset() {
    setAuthError(null)
    setAuthMessage(null)

    if (!auth) {
      setAuthError('Firebase is not configured.')
      return
    }

    if (!email) {
      setAuthError('Enter your email to reset your password.')
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      setAuthMessage('Password reset email sent.')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed'
      setAuthError(message)
    }
  }

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white transition-colors hover:text-white/90">
            {SITE_CONFIG.name}
          </Link>

          <div className="flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-auto bg-transparent p-0 text-sm font-normal text-white/70 hover:bg-transparent hover:text-white focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-white">
                    Software
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="rounded-2xl border border-white/10 bg-black p-2 shadow-xl outline outline-1 outline-white/10">
                      <div className="rounded-xl border border-white/5 bg-black/95">
                        <ul className="w-64 space-y-2 p-2">
                          {PRODUCTS.map((product) => (
                            <li key={product.slug}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={`/${product.slug}`}
                                  className={cn(
                                    "group flex flex-col gap-1 rounded-lg border border-white/10 px-4 py-3 transition-colors hover:border-white/30 hover:bg-white/5",
                                    pathname === `/${product.slug}` && "border-white/40 bg-white/10"
                                  )}
                                >
                                  <div className={cn(
                                    "text-sm font-medium transition-colors",
                                    pathname === `/${product.slug}` ? "text-white" : "text-foreground group-hover:text-white"
                                  )}>
                                    {product.name}
                                  </div>
                                  <div className="text-xs leading-relaxed text-muted-foreground">
                                    {product.tagline}
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              href="/contact"
              className={cn(
                "text-sm transition-colors hover:text-white",
                pathname === '/contact' ? 'text-white' : 'text-white/70'
              )}
            >
              Contact
            </Link>

            {user ? (
              <AccountMenu
                summary={user?.email ?? 'Guest'}
                trigger={<UserIcon className="h-4 w-4" />}
                items={accountItems}
              />
            ) : (
              <div className="flex items-center gap-3 text-sm text-white">
                <button
                  type="button"
                  className="text-white/70 transition hover:text-white"
                  onClick={() => {
                    setModalMode('login')
                    setModalOpen(true)
                  }}
                >
                  Sign in
                </button>
                <Button
                  variant="outline"
                  className="h-9 border-white/30 text-white"
                  onClick={() => {
                    setModalMode('register')
                    setModalOpen(true)
                  }}
                >
                  Join
                </Button>
              </div>
            )}
          </div>

          <AccountMenu
            summary={user?.email ?? 'Guest'}
            trigger={<UserIcon className="h-4 w-4" />}
            items={accountItems}
          />
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="relative w-full max-w-md">
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:text-white"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <AuthCard
              title={modalMode === 'login' ? 'Sign in to your account' : 'Create a new account'}
              description={
                modalMode === 'login'
                  ? 'Don’t have an account? Join here.'
                  : 'Already have an account? Sign in.'
              }
              variant="modal"
            >
              <form onSubmit={handleAuthSubmit} className="grid gap-4">
                <label className="grid gap-2 text-sm text-white/80">
                  Email address
                  <input
                    type="email"
                    className="rounded-md border border-white/10 bg-black px-3 py-2 text-white"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm text-white/80">
                  Password
                  <input
                    type="password"
                    className="rounded-md border border-white/10 bg-black px-3 py-2 text-white"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </label>

                {authError ? (
                  <p className="text-sm text-red-300">{authError}</p>
                ) : null}

                {authMessage ? (
                  <p className="text-sm text-emerald-300">{authMessage}</p>
                ) : null}

                <Button type="submit" disabled={authLoading}>
                  {authLoading
                    ? 'Processing...'
                    : modalMode === 'login'
                      ? 'Sign in'
                      : 'Create account'}
                </Button>
              </form>

              <div className="mt-4 flex items-center justify-between text-sm text-white/70">
                <button
                  type="button"
                  className="text-white hover:underline"
                  onClick={() => {
                    setModalMode(modalMode === 'login' ? 'register' : 'login')
                    setAuthError(null)
                    setAuthMessage(null)
                  }}
                >
                  {modalMode === 'login'
                    ? 'Don’t have an account? Join here.'
                    : 'Already have an account? Sign in.'}
                </button>
                {modalMode === 'login' ? (
                  <button
                    type="button"
                    className="text-white hover:underline"
                    onClick={handlePasswordReset}
                  >
                    Forgot password?
                  </button>
                ) : null}
              </div>
            </AuthCard>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
