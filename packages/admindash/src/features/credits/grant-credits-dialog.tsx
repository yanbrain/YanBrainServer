'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PRODUCTS } from '@yanbrain/shared'
import { grantCredits } from '@/lib/api-client'
import { toast } from 'sonner'

interface FormData {
    productId?: string
    credits: number
    reason?: string
}

interface CreditsGrantDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userId: string
    onSuccess: () => void
}

export function CreditsGrantDialog({ open, onOpenChange, userId, onSuccess }: CreditsGrantDialogProps) {
    const [submitting, setSubmitting] = useState(false)
    const form = useForm<FormData>({ defaultValues: { productId: '', credits: 100, reason: 'ADMIN_GRANT' } })

    const onSubmit = async (data: FormData) => {
        setSubmitting(true)
        const productId = data.productId || null
        const result = await grantCredits(userId, data.credits, data.reason, productId)
        setSubmitting(false)

        if (result.success) {
            toast.success(`Credits ${data.credits > 0 ? 'granted' : 'deducted'}`)
            onSuccess()
            onOpenChange(false)
            form.reset()
        } else {
            toast.error(result.error || 'Failed to update credits')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Grant Credits</DialogTitle>
                    <DialogDescription>
                        Add credits for a user. Use a negative value to deduct.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Product (optional)</label>
                        <select
                            {...form.register('productId')}
                            className="w-full rounded-lg border bg-[color:var(--input-bg)] px-3 py-2 text-sm text-[color:var(--input-text)] shadow-inner shadow-black/30 transition focus-visible:outline-none focus-visible:border-[color:var(--input-ring)] focus-visible:ring-1 focus-visible:ring-[color:var(--input-ring)] border-[color:var(--input-border)]"
                        >
                            <option value="">All products</option>
                            {PRODUCTS.map((product) => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Credits</label>
                        <Input type="number" placeholder="100" {...form.register('credits', { valueAsNumber: true })} />
                        <p className="text-xs text-muted-foreground">Positive adds credits, negative deducts</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Reason</label>
                        <Input placeholder="ADMIN_GRANT" {...form.register('reason')} />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Update Credits'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
