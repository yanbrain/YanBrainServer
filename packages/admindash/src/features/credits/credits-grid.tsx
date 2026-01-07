'use client'

import { useMemo, useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditsGrantDialog } from './grant-credits-dialog'
import { UserCredits, UsageDailyEntry, PRODUCTS } from '@yanbrain/shared'

interface CreditsGridProps {
    userId: string
    credits: UserCredits
    usage: UsageDailyEntry[]
    isSuspended: boolean
    onRefresh: () => void
}

export function CreditsGrid({ userId, credits, usage, isSuspended, onRefresh }: CreditsGridProps) {
    const [isGranting, setIsGranting] = useState(false)

    const usageSummary = useMemo(() => {
        const totals: Record<string, number> = {}
        usage.forEach((entry) => {
            Object.entries(entry.totals || {}).forEach(([productId, amount]) => {
                totals[productId] = (totals[productId] || 0) + Number(amount || 0)
            })
        })
        return totals
    }, [usage])

    return (
        <div className="space-y-4">
            <Button size="sm" onClick={() => setIsGranting(true)} disabled={isSuspended} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Grant Credits
            </Button>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Credit Balance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Current balance</span>
                        <span className="font-semibold">{credits.balance ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Lifetime credits</span>
                        <span className="font-semibold">{credits.lifetime ?? 0}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Usage (last 30 days)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    {PRODUCTS.map((product) => (
                        <div key={product.id} className="flex items-center justify-between">
                            <span className="text-muted-foreground">{product.name}</span>
                            <span className="font-medium">{usageSummary[product.id] || 0}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <CreditsGrantDialog
                open={isGranting}
                onOpenChange={setIsGranting}
                userId={userId}
                onSuccess={onRefresh}
            />
        </div>
    )
}
