'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase-client'
import { useAuth } from '@/lib/auth-context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { AuthCard } from '@yanbrain/shared/ui'

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const [resetLoading, setResetLoading] = useState(false)
    const router = useRouter()
    const { signIn } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Please enter email and password')
            return
        }

        setLoading(true)

        try {
            await signIn(email, password)
            toast.success('Logged in successfully')
            router.push('/users')
        } catch (error: any) {
            console.error('Login error:', error)

            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                toast.error('Invalid email or password')
            } else if (error.message?.includes('admin access')) {
                toast.error('You do not have admin access')
            } else if (error.code === 'auth/too-many-requests') {
                toast.error('Too many failed login attempts. Please try again later.')
            } else {
                toast.error(error.message || 'Failed to log in')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!resetEmail) {
            toast.error('Please enter your email address')
            return
        }

        setResetLoading(true)

        try {
            await sendPasswordResetEmail(auth, resetEmail)
            toast.success('Password reset email sent! Check your inbox.')
            setShowForgotPassword(false)
            setResetEmail('')
        } catch (error: any) {
            console.error('Password reset error:', error)

            if (error.code === 'auth/user-not-found') {
                toast.error('No account found with this email')
            } else if (error.code === 'auth/invalid-email') {
                toast.error('Invalid email address')
            } else if (error.code === 'auth/too-many-requests') {
                toast.error('Too many requests. Please try again later.')
            } else {
                toast.error('Failed to send reset email')
            }
        } finally {
            setResetLoading(false)
        }
    }

    if (showForgotPassword) {
        return (
            <AuthCard
                title="Reset Password"
                description="Enter your email to receive a password reset link"
            >
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            type="email"
                            placeholder="admin@example.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowForgotPassword(false)}
                            disabled={resetLoading}
                        >
                            Back to Login
                        </Button>
                        <Button type="submit" className="flex-1" disabled={resetLoading}>
                            {resetLoading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </div>
                </form>
            </AuthCard>
        )
    }

    return (
        <AuthCard title="Admin Login" description="Sign in to access the admin panel">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>

                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-primary hover:underline"
                    >
                        Forgot password?
                    </button>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 rounded border border-muted p-2 text-xs text-muted-foreground">
                    <p className="font-semibold">Debug Info:</p>
                    <p>Check browser console for detailed error logs</p>
                </div>
            )}
        </AuthCard>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
