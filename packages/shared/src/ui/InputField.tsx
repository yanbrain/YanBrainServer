import * as React from 'react'
import { cn } from '../utils'

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ className, type, style, ...props }, ref) => {
        return (
            <input
                type={type}
                id={props.id || props.name}
                name={props.name}
                className={cn(
                    'w-full rounded-lg border px-3 py-2 text-sm shadow-inner shadow-black/30 transition',
                    'bg-slate-950 border-slate-400/35 text-white/95 placeholder:text-slate-400/75',
                    'focus-visible:outline-none focus-visible:border-slate-400/45 focus-visible:ring-1 focus-visible:ring-slate-400/45',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)

InputField.displayName = 'InputField'

export { InputField }