'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  type User
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/Button'
import { AuthCard, FormField } from '@yanbrain/shared/ui'

const PRODUCTS = [
  { id: 'yanAvatar', name: 'Yan Avatar' },
  { id: 'yanDraw', name: 'Yan Draw' },
  { id: 'yanPhotobooth', name: 'Yan Photobooth' }
]

type LicenseRecord = {
  isActive?: boolean
  activatedAt?: string | null
  expiryDate?: string | null
  revokedAt?: string | null
}

type MeResponse = {
  user: {
    id: string
    email?: string | null
  }
  licenses: Record<string, LicenseRecord> | null
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString()
}

function formatTimeLeft(value?: string | null) {
  if (!value) return 'No expiry date'
  const expiry = new Date(value)
  if (Number.isNaN(expiry.getTime())) return 'No expiry date'
  const diffMs = expiry.getTime() - Date.now()
  if (diffMs <= 0) return 'Expired'
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return diffDays === 1 ? '1 day left' : `${diffDays} days left`
}

export default function DashboardPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const apiUrl = apiBase ? `${apiBase}/me` : '/me'

  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [data, setData] = useState<MeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  const licenseList = useMemo(() => {
    const licenses = data?.licenses || {}
    return PRODUCTS.map((product) => ({
      ...product,
      license: licenses[product.id]
    }))
  }, [data])

  const activeLicenses = useMemo(
    () => licenseList.filter(({ license }) => license?.isActive),
    [licenseList]
  )

  async function loadDashboard(currentUser: User) {
    setLoading(true)
    setError(null)

    try {
      if (!apiBase) {
        setError('Set NEXT_PUBLIC_API_BASE_URL to load dashboard data.')
        setData(null)
        return
      }
      const token = await currentUser.getIdToken()
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to load dashboard data')
      }

      const payload = await response.json()
      setData(payload)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error'
      setError(message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false)
      setError('Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_* variables.')
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
      setActionMessage(null)

      if (currentUser) {
        loadDashboard(currentUser)
      } else {
        setData(null)
      }
    })

    return () => unsubscribe()
  }, [])

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setActionMessage(null)

    try {
      if (!auth) return
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
        setActionMessage('Signed in successfully.')
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
        setActionMessage('Account created successfully.')
      }
      setPassword('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed'
      setError(message)
    }
  }

  async function handleSignOut() {
    if (!auth) return
    await signOut(auth)
  }

  async function handleEmailUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setActionMessage(null)

    if (!user || !newEmail) return

    try {
      await updateEmail(user, newEmail)
      setActionMessage('Email updated successfully.')
      setNewEmail('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Email update failed'
      setError(message)
    }
  }

  async function handlePasswordUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setActionMessage(null)

    if (!user || !newPassword) return

    try {
      await updatePassword(user, newPassword)
      setActionMessage('Password updated successfully.')
      setNewPassword('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password update failed'
      setError(message)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg">
        Loading dashboard...
      </div>
    )
  }

  if (!user) {
    return (
      <AuthCard
        title={authMode === 'login' ? 'Sign in' : 'Create your account'}
        description="Use your email and password to access your licenses and account settings."
      >
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {actionMessage && (
          <div className="mb-4 rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {actionMessage}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="grid gap-4">
          <FormField
            label="Email address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            wrapperClassName="grid gap-2 text-sm"
          />
          <FormField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            wrapperClassName="grid gap-2 text-sm"
          />
          <Button type="submit">
            {authMode === 'login' ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-white/70">
          <button
            type="button"
            className="text-white hover:underline"
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          >
            {authMode === 'login' ? 'Need an account?' : 'Have an account?'}
          </button>

          {apiBase === '' && (
            <span className="text-xs text-slate-400">
              Set NEXT_PUBLIC_API_BASE_URL to load licenses.
            </span>
          )}
        </div>
      </AuthCard>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="flex flex-col items-end gap-3 text-right">
          <h1 className="text-3xl font-semibold">User Dashboard</h1>
          <p className="text-sm text-slate-300">
            Manage your account, update your email or password, and review your current licenses.
          </p>
        </header>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {actionMessage && (
          <div className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {actionMessage}
          </div>
        )}

        <>
            <section className="rounded-2xl border border-white/15 bg-slate-900/80 p-8 shadow-xl ring-1 ring-white/10">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <h2 className="text-xl font-semibold">Account</h2>
                  <p className="text-sm text-slate-400">Signed in as {user.email}</p>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <form onSubmit={handleEmailUpdate} className="grid gap-3">
                  <h3 className="text-sm font-semibold">Change email</h3>
                  <FormField
                    label="New email"
                    type="email"
                    placeholder="new@email.com"
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    labelClassName="text-xs text-white/80"
                    wrapperClassName="grid gap-2"
                  />
                  <Button type="submit" variant="secondary">
                    Update email
                  </Button>
                </form>

                <form onSubmit={handlePasswordUpdate} className="grid gap-3">
                  <h3 className="text-sm font-semibold">Change password</h3>
                  <FormField
                    label="New password"
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    labelClassName="text-xs text-white/80"
                    wrapperClassName="grid gap-2"
                  />
                  <Button type="submit" variant="secondary">
                    Update password
                  </Button>
                </form>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Licenses</h2>
                <Button variant="outline" onClick={() => user && loadDashboard(user)} disabled={loading}>
                  {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {activeLicenses.length ? (
                  activeLicenses.map(({ id, name, license }) => (
                    <div key={id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <h3 className="text-base font-semibold">{name}</h3>
                      <p className="mt-2 text-sm text-emerald-300">Active</p>
                      <p className="text-sm text-slate-400">
                        Time left: {formatTimeLeft(license?.expiryDate)}
                      </p>
                      <p className="text-sm text-slate-500">Expiry: {formatDate(license?.expiryDate)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No active licenses.</p>
                )}
              </div>
            </section>
        </>
      </div>
    </div>
  )
}
