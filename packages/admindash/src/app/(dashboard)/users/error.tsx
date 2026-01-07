'use client'

import { useEffect } from 'react'
import { Button } from '@yanbrain/shared/ui'
import { Card } from '@/components/ui/card'

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-8 max-w-md">
                <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
                <p className="text-muted-foreground mb-6">
                    Failed to load users. Please try again.
                </p>
                <Button onClick={reset}>Try again</Button>
            </Card>
        </div>
    )
}
