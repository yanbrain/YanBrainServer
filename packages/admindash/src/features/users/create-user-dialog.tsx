'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createUser } from '@/lib/api-client'
import { toast } from 'sonner'

interface FormData {
    userId: string
    email: string
}

interface CreateUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function CreateUserDialog({ open, onOpenChange, onSuccess }: CreateUserDialogProps) {
    const [submitting, setSubmitting] = useState(false)
    const form = useForm<FormData>()

    const onSubmit = async (data: FormData) => {
        setSubmitting(true)
        const result = await createUser(data.userId, data.email)
        setSubmitting(false)

        if (result.success) {
            toast.success('User created successfully')
            onSuccess()
            form.reset()
        } else {
            toast.error(result.error || 'Failed to create user')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                        Add a new user to the system. They will start with zero credits.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">User ID</label>
                        <Input
                            placeholder="user_123"
                            {...form.register('userId', { required: true })}
                        />
                        <p className="text-xs text-muted-foreground">Unique identifier for the user</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            type="email"
                            placeholder="user@example.com"
                            {...form.register('email', { required: true })}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
