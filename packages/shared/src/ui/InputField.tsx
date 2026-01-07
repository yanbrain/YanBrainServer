import * as React from 'react'
import { cn } from '../utils'

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'w-full rounded-md border px-3 py-2 text-sm text-[color:var(--input-text)] placeholder:text-[color:var(--input-placeholder)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--input-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--input-bg)] disabled:cursor-not-allowed disabled:opacity-50',
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
