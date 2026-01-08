import { Card } from '@/components/ui/card'

export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                <div className="h-10 w-32 animate-pulse rounded bg-muted" />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_350px_350px]">
                <Card className="p-6">
                    <div className="h-6 w-24 mb-4 animate-pulse rounded bg-muted" />
                    <div className="h-[600px] animate-pulse rounded bg-muted" />
                </Card>

                <Card className="p-6">
                    <div className="h-6 w-32 mb-4 animate-pulse rounded bg-muted" />
                    <div className="h-[400px] animate-pulse rounded bg-muted" />
                </Card>

                <Card className="p-6">
                    <div className="h-6 w-32 mb-4 animate-pulse rounded bg-muted" />
                    <div className="h-[400px] animate-pulse rounded bg-muted" />
                </Card>
            </div>
        </div>
    )
}