'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Transaction, TRANSACTION_TYPES } from '@yanbrain/shared'
import { formatDate } from '@/lib/utils'

interface TransactionListProps {
    transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
    if (transactions.length === 0) {
        return <div className="py-12 text-center text-sm text-muted-foreground">No transactions</div>
    }

    const getIcon = (type: string) => {
        const positiveTypes = ['SUBSCRIPTION_CREATED', 'SUBSCRIPTION_RENEWED', 'MANUAL_GRANT', 'USER_CREATED', 'ACCOUNT_UNSUSPENDED']
        return positiveTypes.includes(type) ? (
            <CheckCircle className="h-4 w-4 text-success" />
        ) : (
            <XCircle className="h-4 w-4 text-destructive" />
        )
    }

    const getDescription = (tx: Transaction) => {
        switch (tx.type) {
            case 'MANUAL_GRANT':
                return `Added ${tx.daysGranted} days to ${tx.productIds?.join(', ')}`
            case 'MANUAL_REDUCTION':
                return `Removed ${Math.abs(tx.daysGranted || 0)} days from ${tx.productIds?.join(', ')}`
            case 'MANUAL_REVOKE':
                return `Revoked ${tx.productIds?.join(', ')}`
            case 'ACCOUNT_SUSPENDED':
                return 'Account suspended'
            case 'ACCOUNT_UNSUSPENDED':
                return 'Account unsuspended'
            default:
                return TRANSACTION_TYPES[tx.type] || tx.type
        }
    }

    return (
        <div className="space-y-3">
            {transactions.map((tx) => (
                <div key={tx.id} className="rounded-lg border bg-card p-4">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getIcon(tx.type)}</div>
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{TRANSACTION_TYPES[tx.type]}</span>
                                <Badge variant={tx.performedBy === 'admin' ? 'default' : 'secondary'} className="text-xs">
                                    {tx.performedBy === 'admin' ? 'Admin' : 'System'}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{getDescription(tx)}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(tx.timestamp)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}