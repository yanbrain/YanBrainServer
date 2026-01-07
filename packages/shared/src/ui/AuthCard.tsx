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
      ? 'relative overflow-hidden glass-panel border-white/10 bg-white/5 shadow-2xl'
      : 'glass-panel border-white/10 bg-white/5 shadow-2xl'

  const wrapperStyles =
    variant === 'modal'
      ? 'flex w-full items-center justify-center'
      : 'flex min-h-screen items-center justify-center p-6'

  return (
    <div className={wrapperStyles}>
      <div
        className={cn(
          variant === 'modal' ? 'w-full max-w-md p-6 text-white' : 'glass-panel w-full max-w-md p-6 text-white',
          variantStyles,
          className
        )}
      >
        <div className="relative z-10 space-y-2">
          <h1 className="text-xl font-semibold">{title}</h1>
          {description ? (
            <p className="text-sm text-white/70">{description}</p>
          ) : null}
        </div>
        <div className="relative z-10 mt-6">{children}</div>
        {footer ? <div className="relative z-10 mt-6">{footer}</div> : null}
      </div>
    </div>
  )
}
