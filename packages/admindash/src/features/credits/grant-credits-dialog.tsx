'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { grantCredits } from '@/lib/api-client'
import { toast } from 'sonner'

interface FormData {
    credits: number
}

interface CreditsGrantDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userId: string
    onSuccess: () => void
}

export function CreditsGrantDialog({ open, onOpenChange, userId, onSuccess }: CreditsGrantDialogProps) {
    const [submitting, setSubmitting] = useState(false)
    const form = useForm<FormData>({ defaultValues: { credits: 100 } })

    const onSubmit = async (data: FormData) => {
        setSubmitting(true)
        const result = await grantCredits(userId, data.credits)
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
                        <label className="text-sm font-medium">Credits</label>
                        <Input
                            id="credits"
                            type="number"
                            placeholder="100"
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            {...form.register('credits', { valueAsNumber: true })}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            color="red"
                            appearance="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="green"
                            appearance="filled"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : 'Update Credits'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}