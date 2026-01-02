'use client'

import { useState, useEffect } from 'react'
import { TransactionList } from './transaction-list'
import { Transaction, CLOUD_FUNCTIONS_URL } from '@yanplay/shared'

interface TransactionPanelProps {
    userId: string
    token: string
    refreshKey: number
}

export function TransactionPanel({ userId, token, refreshKey }: TransactionPanelProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchTransactions() {
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
                setTransactions(data.transactions || [])
            } catch (error) {
                console.error('Failed to fetch transactions:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchTransactions()
    }, [userId, token, refreshKey])

    if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>

    return <TransactionList transactions={transactions} />
}