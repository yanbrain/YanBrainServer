import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-slate-8 bg-transparent text-slate-10',
                secondary:
                    'border-slate-8 bg-slate-8/30 text-slate-10',
                destructive:
                    'border-red-8 bg-transparent text-red-10',
                success:
                    'border-green-8 bg-transparent text-green-10',
                warning:
                    'border-orange-8 bg-transparent text-orange-10',
                outline: 'border-slate-8 text-slate-10',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }