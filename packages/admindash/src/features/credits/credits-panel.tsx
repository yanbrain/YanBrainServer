'use client'

import { useState, useEffect } from 'react'
import { CreditsGrid } from './credits-grid'
import { CLOUD_FUNCTIONS_URL, UsageDailyEntry, UserCredits } from '@yanbrain/shared'

interface CreditsPanelProps {
    userId: string
    isSuspended: boolean
    token: string
    refreshKey: number
    onRefresh: () => void
}

type CreditsResponse = {
    credits: UserCredits
    usage?: UsageDailyEntry[]
}

export function CreditsPanel({ userId, isSuspended, token, refreshKey, onRefresh }: CreditsPanelProps) {
    const [credits, setCredits] = useState<UserCredits>({ balance: 0, lifetime: 0, updatedAt: null })
    const [usage, setUsage] = useState<UsageDailyEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCredits() {
            setLoading(true)
            try {
                const res = await fetch(`${CLOUD_FUNCTIONS_URL}/users/${userId}`, {
                    cache: 'no-store',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                const data = await res.json()

                if (data.success) {
                    setCredits(data.credits || { balance: 0, lifetime: 0, updatedAt: null })
                    setUsage(data.usage || [])
                }
            } catch (error) {
                console.error('Failed to fetch credits:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCredits()
    }, [userId, token, refreshKey])

    if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>

    return (
        <CreditsGrid
            userId={userId}
            credits={credits}
            usage={usage}
            isSuspended={isSuspended}
            onRefresh={onRefresh}
        />
    )
}
