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
import { Container } from '@/components/ui/Container'
import { AuthCard, FormField, GlassPanel } from '@yanbrain/shared/ui'
import { PRODUCTS } from '@yanbrain/shared'

type MeResponse = {
  user: {
    id: string
    email?: string | null
  }
  credits?: {
    balance: number
    lifetime: number
    updatedAt?: string | null
  }
  usage?: {
    totalsByProduct?: Record<string, number>
    usagePeriods?: Array<{
      id: string
      period: string
      totals: Record<string, number>
      totalCredits: number
    }>
  }
}

const INPUT_CLASS_NAME =
  'border-white/15 bg-white/5 text-white outline outline-1 outline-white/10 placeholder:text-white/50 focus-visible:border-white/30 focus-visible:ring-white/10'
const OUTLINE_BUTTON_CLASS_NAME =
  'border-white/20 bg-white/5 text-white outline outline-1 outline-white/15 hover:border-white/40 hover:bg-white/10'

function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString()
}

function formatPeriod(value?: string | null) {
  if (!value) return '—'
  const date = new Date(`${value}-01T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
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
  const [currentPassword, setCurrentPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const usageSummary = useMemo(() => {
    const totals = data?.usage?.totalsByProduct || {}
    return PRODUCTS.map((product) => ({
      ...product,
      total: totals[product.id] || 0
    }))
  }, [data])

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
      setShowEmailModal(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Email update failed'
      setError(message)
    }
  }

  async function handlePasswordUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setActionMessage(null)

    if (!user || !newPassword || !currentPassword || !confirmPassword) return
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }

    try {
      await signInWithEmailAndPassword(auth, user.email ?? '', currentPassword)
      await updatePassword(user, newPassword)
      setActionMessage('Password updated successfully.')
      setNewPassword('')
      setCurrentPassword('')
      setConfirmPassword('')
      setShowPasswordModal(false)
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
        description="Use your email and password to access your credits and account settings."
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
            inputClassName={INPUT_CLASS_NAME}
          />
          <FormField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            wrapperClassName="grid gap-2 text-sm"
            inputClassName={INPUT_CLASS_NAME}
          />
          <Button type="submit" variant="outline" className={OUTLINE_BUTTON_CLASS_NAME}>
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
              Set NEXT_PUBLIC_API_BASE_URL to load credits.
            </span>
          )}
        </div>
      </AuthCard>
    )
  }

  return (
    <Container className="py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">User Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage your account, update your email or password, and review your current credits.
          </p>
        </header>

        {error && (
          <GlassPanel className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </GlassPanel>
        )}

        {actionMessage && (
          <GlassPanel className="border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {actionMessage}
          </GlassPanel>
        )}

        <GlassPanel className="p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold">Account</h2>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className={OUTLINE_BUTTON_CLASS_NAME}
            >
              Sign out
            </Button>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className={OUTLINE_BUTTON_CLASS_NAME}
                onClick={() => setShowEmailModal(true)}
              >
                Edit
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Password</p>
                <p className="text-sm text-muted-foreground">******</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className={OUTLINE_BUTTON_CLASS_NAME}
                onClick={() => setShowPasswordModal(true)}
              >
                Edit
              </Button>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Credits</h2>
            <Button
              variant="outline"
              onClick={() => user && loadDashboard(user)}
              disabled={loading}
              className={OUTLINE_BUTTON_CLASS_NAME}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <GlassPanel className="p-4">
              <h3 className="text-base font-semibold">Current balance</h3>
              <p className="mt-2 text-2xl font-semibold text-emerald-200">
                {data?.credits?.balance ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">
                Lifetime: {data?.credits?.lifetime ?? 0}
              </p>
            </GlassPanel>
            <GlassPanel className="p-4">
              <h3 className="text-base font-semibold">Usage overview</h3>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                {usageSummary.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <span>{product.name}</span>
                    <span className="font-medium text-white">{product.total}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
            <GlassPanel className="p-4">
              <h3 className="text-base font-semibold">Last updated</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatDate(data?.credits?.updatedAt || null)}
              </p>
            </GlassPanel>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Usage by month
            </h3>
            <div className="mt-3 space-y-3 text-sm text-muted-foreground">
              {data?.usage?.usagePeriods?.length ? (
                data.usage.usagePeriods.map((entry) => (
                  <GlassPanel key={entry.id} className="flex items-center justify-between px-4 py-2">
                    <span>{formatPeriod(entry.period)}</span>
                    <span className="font-medium text-white">{entry.totalCredits} credits</span>
                  </GlassPanel>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No usage yet.</p>
              )}
            </div>
          </div>
        </GlassPanel>
      </div>
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-6">
          <GlassPanel className="w-full max-w-md p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Update email</h3>
                <p className="text-sm text-muted-foreground">Enter your new email address.</p>
              </div>
              <button
                type="button"
                className="text-sm text-white/70 hover:text-white"
                onClick={() => setShowEmailModal(false)}
              >
                Close
              </button>
            </div>
            <form onSubmit={handleEmailUpdate} className="mt-6 grid gap-4">
              <FormField
                label="New email"
                type="email"
                placeholder="new@email.com"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                labelClassName="text-xs text-white/80"
                wrapperClassName="grid gap-2"
                inputClassName={INPUT_CLASS_NAME}
              />
              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className={OUTLINE_BUTTON_CLASS_NAME}
                  onClick={() => setShowEmailModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="outline" className={OUTLINE_BUTTON_CLASS_NAME}>
                  Update email
                </Button>
              </div>
            </form>
          </GlassPanel>
        </div>
      )}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-6">
          <GlassPanel className="w-full max-w-md p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Update password</h3>
                <p className="text-sm text-muted-foreground">Confirm your current password first.</p>
              </div>
              <button
                type="button"
                className="text-sm text-white/70 hover:text-white"
                onClick={() => setShowPasswordModal(false)}
              >
                Close
              </button>
            </div>
            <form onSubmit={handlePasswordUpdate} className="mt-6 grid gap-4">
              <FormField
                label="Current password"
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                labelClassName="text-xs text-white/80"
                wrapperClassName="grid gap-2"
                inputClassName={INPUT_CLASS_NAME}
              />
              <FormField
                label="New password"
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                labelClassName="text-xs text-white/80"
                wrapperClassName="grid gap-2"
                inputClassName={INPUT_CLASS_NAME}
              />
              <FormField
                label="Confirm new password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                labelClassName="text-xs text-white/80"
                wrapperClassName="grid gap-2"
                inputClassName={INPUT_CLASS_NAME}
              />
              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className={OUTLINE_BUTTON_CLASS_NAME}
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="outline" className={OUTLINE_BUTTON_CLASS_NAME}>
                  Update password
                </Button>
              </div>
            </form>
          </GlassPanel>
        </div>
      )}
    </Container>
  )
}
