'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button, InputField as Input } from '@yanbrain/shared/ui'
import { PRODUCTS } from '@yanbrain/shared'
import { grantLicense } from '@/lib/api-client'
import { toast } from 'sonner'

interface FormData {
    productId: string
    days: number
}

interface GrantLicenseDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userId: string
    onSuccess: () => void
}

export function GrantLicenseDialog({ open, onOpenChange, userId, onSuccess }: GrantLicenseDialogProps) {
    const [submitting, setSubmitting] = useState(false)
    const form = useForm<FormData>({ defaultValues: { productId: PRODUCTS[0].id, days: 30 } })

    const onSubmit = async (data: FormData) => {
        setSubmitting(true)
        const result = await grantLicense(userId, data.productId, data.days)
        setSubmitting(false)

        if (result.success) {
            toast.success(`License ${data.days > 0 ? 'granted' : 'reduced'}`)
            onSuccess()
            onOpenChange(false)
            form.reset()
        } else {
            toast.error(result.error || 'Failed to grant license')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Grant License</DialogTitle>
                    <DialogDescription>
                        Add or reduce days. Use positive to add, negative to reduce.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Product</label>
                        <select {...form.register('productId')} className="w-full rounded-md border border-input bg-background px-3 py-2">
                            {PRODUCTS.map((product) => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Days</label>
                        <Input type="number" placeholder="30" {...form.register('days', { valueAsNumber: true })} />
                        <p className="text-xs text-muted-foreground">Positive adds days, negative reduces</p>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Granting...' : 'Grant License'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
