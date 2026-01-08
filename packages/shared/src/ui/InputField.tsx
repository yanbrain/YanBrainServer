import * as React from 'react'
import { cn } from '../utils'

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'w-full rounded-lg border px-3 py-2 text-sm text-[color:var(--input-text)] placeholder:text-[color:var(--input-placeholder)] shadow-inner shadow-black/30 transition focus-visible:outline-none focus-visible:border-[color:var(--input-ring)] focus-visible:ring-1 focus-visible:ring-[color:var(--input-ring)] disabled:cursor-not-allowed disabled:opacity-50',
          'bg-[color:var(--input-bg)] border-[color:var(--input-border)]',
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
