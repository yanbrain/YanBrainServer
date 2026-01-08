import * as React from 'react'
import { cn } from '../utils'

type GlassPanelProps = {
  as?: React.ElementType
  edge?: boolean
  className?: string
} & Omit<React.HTMLAttributes<HTMLElement>, 'className'>

const GlassPanel = React.forwardRef<HTMLElement, GlassPanelProps>(
  ({ as: Component = 'div', edge = false, className, ...props }, ref) => (
    <Component
      ref={ref}
      className={cn('glass-panel', edge && 'glass-panel--edge', className)}
      {...props}
    />
  )
)

GlassPanel.displayName = 'GlassPanel'

export { GlassPanel }
