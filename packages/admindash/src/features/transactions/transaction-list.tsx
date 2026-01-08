'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Transaction, TRANSACTION_TYPES } from '@yanbrain/shared'
import { GlassPanel } from '@yanbrain/shared/yglassui'
import { formatDate } from '@/lib/utils'

interface TransactionListProps {
    transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
    if (transactions.length === 0) {
        return <div className="py-12 text-center text-sm text-muted-foreground">No transactions</div>
    }

    const getIcon = (type: string) => {
        const positiveTypes = ['CREDITS_GRANTED', 'MANUAL_GRANT', 'USER_CREATED', 'ACCOUNT_UNSUSPENDED']
        return positiveTypes.includes(type) ? (
            <CheckCircle className="h-4 w-4 text-success" />
        ) : (
            <XCircle className="h-4 w-4 text-destructive" />
        )
    }

    const getDescription = (tx: Transaction) => {
        switch (tx.type) {
            case 'CREDITS_GRANTED':
                return `Granted ${tx.creditsGranted ?? 0} credits`
            case 'CREDITS_DEDUCTED':
                return `Deducted ${Math.abs(tx.creditsGranted || 0)} credits`
            case 'CREDITS_SPENT':
                return `Spent ${tx.creditsSpent ?? 0} credits`
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
                <GlassPanel key={tx.id} className="border-white/10 p-4">
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
                </GlassPanel>
            ))}
        </div>
    )
}
