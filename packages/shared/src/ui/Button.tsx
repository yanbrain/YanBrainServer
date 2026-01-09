import * as React from 'react'
import { cn } from '../utils'

type ButtonColor = 'slate' | 'red' | 'orange' | 'green'
type ButtonAppearance = 'filled' | 'outline'
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon'

const baseClasses =
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-8 disabled:pointer-events-none disabled:opacity-50'

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-9 px-3 text-sm',
    default: 'h-10 px-4 text-sm',
    lg: 'h-11 px-8 text-base',
    icon: 'h-10 w-10',
}

// Color + Appearance combinations
const getVariantClasses = (color: ButtonColor, appearance: ButtonAppearance): string => {
    const variants = {
        slate: {
            filled: 'bg-slate-8 text-white hover:bg-slate-10',
            outline: 'border border-slate-8 bg-transparent text-slate-10 hover:border-slate-10 hover:text-white',
        },
        red: {
            filled: 'bg-red-8 text-white hover:bg-red-10',
            outline: 'border border-red-8 bg-transparent text-red-8 hover:border-red-10 hover:text-red-10',
        },
        orange: {
            filled: 'bg-orange-8 text-white hover:bg-orange-10',
            outline: 'border border-orange-8 bg-transparent text-orange-8 hover:border-orange-10 hover:text-orange-10',
        },
        green: {
            filled: 'bg-green-8 text-white hover:bg-green-10',
            outline: 'border border-green-8 bg-transparent text-green-8 hover:border-green-10 hover:text-green-10',
        },
    }

    return variants[color][appearance]
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: ButtonColor
    appearance?: ButtonAppearance
    size?: ButtonSize
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, color = 'slate', appearance = 'filled', size = 'default', ...props }, ref) => (
        <button
            className={cn(
                baseClasses,
                sizeClasses[size],
                getVariantClasses(color, appearance),
                className
            )}
            ref={ref}
            {...props}
        />
    )
)

Button.displayName = 'Button'

export { Button }