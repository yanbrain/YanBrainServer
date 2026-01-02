'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GrantLicenseDialog } from './grant-license-dialog'
import { revokeLicense } from '@/server/actions/licenses'
import { UserLicenses, PRODUCTS } from '@yanbrain/shared'
import { getDaysUntil, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface LicenseGridProps {
    userId: string
    licenses: UserLicenses
    isSuspended: boolean
    onRefresh: () => void
}

export function LicenseGrid({ userId, licenses, isSuspended, onRefresh }: LicenseGridProps) {
    const [isGranting, setIsGranting] = useState(false)
    const [revoking, setRevoking] = useState<string | null>(null)

    const handleRevoke = async (productId: string) => {
        setRevoking(productId)
        const result = await revokeLicense(userId, productId)
        setRevoking(null)

        if (result.success) {
            toast.success('License revoked')
            onRefresh()
        } else {
            toast.error(result.error || 'Failed to revoke')
        }
    }

    const handleLicenseGranted = () => {
        setIsGranting(false)
        onRefresh()
    }

    return (
        <div className="space-y-4">
            <Button size="sm" onClick={() => setIsGranting(true)} disabled={isSuspended} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Grant License
            </Button>

            <div className="space-y-3">
                {PRODUCTS.map((product) => {
                    const license = licenses[product.id]
                    const isActive = license?.isActive ?? false
                    const daysRemaining = license?.expiryDate ? getDaysUntil(license.expiryDate) : null

                    return (
                        <Card key={product.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-base">{product.name}</CardTitle>
                                    <Badge
                                        variant={isActive ? 'default' : 'secondary'}
                                        className={isActive ? 'bg-green-600 hover:bg-green-700' : ''}
                                    >
                                        {isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {license && isActive ? (
                                    <>
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Expires: </span>
                                            <span className="font-medium">{formatDate(license.expiryDate)}</span>
                                        </div>
                                        {daysRemaining !== null && (
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">Days remaining: </span>
                                                <span className={`font-medium ${daysRemaining < 7 ? 'text-destructive' : daysRemaining < 30 ? 'text-warning' : 'text-success'}`}>
                          {daysRemaining}
                        </span>
                                            </div>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="w-full mt-2"
                                            onClick={() => handleRevoke(product.id)}
                                            disabled={revoking === product.id || isSuspended}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Revoke
                                        </Button>
                                    </>
                                ) : (
                                    <div className="text-sm text-muted-foreground">No active license</div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <GrantLicenseDialog
                open={isGranting}
                onOpenChange={setIsGranting}
                userId={userId}
                onSuccess={handleLicenseGranted}
            />
        </div>
    )
}