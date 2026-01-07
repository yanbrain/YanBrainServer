import { type ReactNode } from 'react'
import { cn } from '../utils'

interface AuthCardProps {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
  variant?: 'page' | 'modal'
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
  variant = 'page'
}: AuthCardProps) {
  const variantStyles =
    variant === 'modal'
      ? 'border-white/20 bg-black/80 shadow-2xl ring-1 ring-white/10'
      : 'border-white/15 bg-black/70 shadow-2xl ring-1 ring-white/10'

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div
        className={cn(
          'glass-panel w-full max-w-md p-6 text-white',
          variantStyles,
          className
        )}
      >
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">{title}</h1>
          {description ? (
            <p className="text-sm text-white/70">{description}</p>
          ) : null}
        </div>
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>
  )
}
