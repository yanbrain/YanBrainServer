'use client'

import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditsGrantDialog } from './grant-credits-dialog'
import { UserCredits, UsageSummary, PRODUCTS } from '@yanbrain/shared'

interface CreditsGridProps {
    userId: string
    credits: UserCredits
    usage: UsageSummary
    isSuspended: boolean
    onRefresh: () => void
}

export function CreditsGrid({ userId, credits, usage, isSuspended, onRefresh }: CreditsGridProps) {
    const [isGranting, setIsGranting] = useState(false)
    const usageTotals = usage?.totalsByProduct || {}

    return (
        <div className="space-y-4">
            <Button
                color="green"
                appearance="outline"
                onClick={() => setIsGranting(true)}
                disabled={isSuspended}
                className="w-full"
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Grant Credits
            </Button>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Credit Balance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-green-10">{credits.balance ?? 0}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Usage (last 6 months)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    {PRODUCTS.map((product) => (
                        <div key={product.id} className="flex items-center justify-between">
                            <span className="text-slate-10">{product.name}</span>
                            <span className="font-medium text-white">{usageTotals[product.id] || 0}</span>
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