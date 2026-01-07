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
      ? 'relative overflow-hidden border-white/10 bg-gradient-to-br from-black via-neutral-950 to-neutral-900 shadow-2xl ring-1 ring-white/10'
      : 'border-white/15 bg-black/70 shadow-2xl ring-1 ring-white/10'

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
        {variant === 'modal' ? (
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                'radial-gradient(600px 420px at 15% 10%, rgba(109, 40, 217, 0.4), transparent 60%), radial-gradient(520px 420px at 85% 20%, rgba(38, 120, 220, 0.35), transparent 55%), linear-gradient(180deg, rgba(4, 4, 12, 0.95), rgba(6, 6, 16, 0.9))',
            }}
          />
        ) : null}
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
