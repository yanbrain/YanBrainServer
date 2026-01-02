'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const [resetLoading, setResetLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Please enter email and password')
            return
        }

        setLoading(true)

        try {
            console.log('Attempting login with:', email)

            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            console.log('Login result:', result)

            if (result?.error) {
                console.error('Login error:', result.error)

                if (result.error.includes('Invalid email or password')) {
                    toast.error('Invalid email or password')
                } else if (result.error.includes('Not authorized as admin')) {
                    toast.error('You do not have admin access')
                } else {
                    toast.error(result.error)
                }
            } else if (result?.ok) {
                toast.success('Logged in successfully')
                router.push('/users')
                router.refresh()
            } else {
                toast.error('An unexpected error occurred')
            }
        } catch (error: any) {
            console.error('Login exception:', error)
            toast.error(error.message || 'Failed to log in')
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
            // Dynamically import Firebase auth to avoid build-time errors
            const { sendPasswordResetEmail } = await import('firebase/auth')
            const { auth } = await import('@/lib/firebase-client') as { auth: any }

            if (!auth) {
                toast.error('Password reset is not available at this time')
                setResetLoading(false)
                return
            }

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

    // Show error from URL if redirected with error
    if (error && !loading) {
        toast.error('Authentication failed. Please log in again.')
    }

    if (showForgotPassword) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>Enter your email to receive a password reset link</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Admin Login</CardTitle>
                    <CardDescription>Sign in to access the admin panel</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}