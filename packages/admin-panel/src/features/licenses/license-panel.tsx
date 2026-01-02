'use client'

import { useState, useEffect } from 'react'
import { LicenseGrid } from './license-grid'
import { UserLicenses, CLOUD_FUNCTIONS_URL } from '@yanbrain/shared'

interface LicensePanelProps {
    userId: string
    isSuspended: boolean
    token: string
    refreshKey: number
    onRefresh: () => void
}

export function LicensePanel({ userId, isSuspended, token, refreshKey, onRefresh }: LicensePanelProps) {
    const [licenses, setLicenses] = useState<UserLicenses>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchLicenses() {
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

                if (data.success && data.licenses) {
                    const normalized: UserLicenses = {}
                    for (const [productId, license] of Object.entries(data.licenses)) {
                        const l = license as any
                        normalized[productId] = {
                            isActive: l.isActive ?? false,
                            activatedAt: l.activatedAt?._seconds ? new Date(l.activatedAt._seconds * 1000).toISOString() : null,
                            expiryDate: l.expiryDate?._seconds ? new Date(l.expiryDate._seconds * 1000).toISOString() : null,
                            revokedAt: l.revokedAt?._seconds ? new Date(l.revokedAt._seconds * 1000).toISOString() : undefined,
                        }
                    }
                    setLicenses(normalized)
                }
            } catch (error) {
                console.error('Failed to fetch licenses:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchLicenses()
    }, [userId, token, refreshKey])

    if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>

    return <LicenseGrid userId={userId} licenses={licenses} isSuspended={isSuspended} onRefresh={onRefresh} />
}