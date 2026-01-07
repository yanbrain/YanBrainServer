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
import { AuthCard } from '@yanbrain/shared/ui'

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

type SubscriptionRecord = {
  id: string
  status?: string
  plan?: string
  provider?: string
  currentPeriodEnd?: string | null
  nextBillingDate?: string | null
  linkedProducts?: string[]
}

type TransactionRecord = {
  id: string
  type?: string
  productIds?: string[]
  timestamp?: string | null
}

type MeResponse = {
  user: {
    id: string
    email?: string | null
  }
  licenses: Record<string, LicenseRecord> | null
  subscriptions: SubscriptionRecord[]
  transactions: TransactionRecord[]
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString()
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

  async function loadDashboard(currentUser: User) {
    setLoading(true)
    setError(null)

    try {
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
          <label className="grid gap-2 text-sm">
            Email address
            <input
              type="email"
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="grid gap-2 text-sm">
            Password
            <input
              type="password"
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
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
            <span className="text-xs text-amber-300">
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
        <header className="flex flex-col gap-3">
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
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
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
                  <input
                    type="email"
                    className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    placeholder="new@email.com"
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                  />
                  <Button type="submit" variant="secondary">
                    Update email
                  </Button>
                </form>

                <form onSubmit={handlePasswordUpdate} className="grid gap-3">
                  <h3 className="text-sm font-semibold">Change password</h3>
                  <input
                    type="password"
                    className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
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
                {licenseList.map(({ id, name, license }) => (
                  <div key={id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <h3 className="text-base font-semibold">{name}</h3>
                    <p className="mt-2 text-sm text-slate-300">
                      Status:{' '}
                      <span className={license?.isActive ? 'text-emerald-300' : 'text-slate-400'}>
                        {license?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                    <p className="text-sm text-slate-400">Expiry: {formatDate(license?.expiryDate)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
              <h2 className="text-xl font-semibold">Subscriptions</h2>
              <div className="mt-4 grid gap-4">
                {data?.subscriptions?.length ? (
                  data.subscriptions.map((subscription) => (
                    <div key={subscription.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm text-slate-400">Subscription ID</p>
                          <p className="text-sm font-medium text-white">{subscription.id}</p>
                        </div>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">
                          {subscription.status || 'Unknown'}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-slate-400">
                        <p>Plan: {subscription.plan || 'Standard'}</p>
                        <p>Next billing: {formatDate(subscription.nextBillingDate)}</p>
                        <p>
                          Products: {subscription.linkedProducts?.length ? subscription.linkedProducts.join(', ') : '—'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No subscriptions found.</p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
              <h2 className="text-xl font-semibold">Recent activity</h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-slate-300">
                    <tr>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Products</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {data?.transactions?.length ? (
                      data.transactions.map((tx) => (
                        <tr key={tx.id} className="bg-slate-900/30">
                          <td className="px-4 py-3 text-slate-200">{tx.type || '—'}</td>
                          <td className="px-4 py-3 text-slate-400">
                            {tx.productIds?.length ? tx.productIds.join(', ') : '—'}
                          </td>
                          <td className="px-4 py-3 text-slate-400">{formatDate(tx.timestamp)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-4 py-6 text-center text-slate-400" colSpan={3}>
                          No recent activity yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
        </>
      </div>
    </div>
  )
}
