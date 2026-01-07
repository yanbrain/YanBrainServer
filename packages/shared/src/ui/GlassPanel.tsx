import * as React from 'react'
import { cn } from '../utils'

type GlassPanelProps<T extends React.ElementType = 'div'> = {
  as?: T
  edge?: boolean
  className?: string
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className'>

const GlassPanel = React.forwardRef(
  <T extends React.ElementType = 'div'>(
    { as, edge = false, className, ...props }: GlassPanelProps<T>,
    ref: React.ComponentPropsWithRef<T>['ref']
  ) => {
    const Component = as ?? 'div'
    return (
      <Component
        ref={ref}
        className={cn('glass-panel', edge && 'glass-panel--edge', className)}
        {...props}
      />
    )
  }
)

GlassPanel.displayName = 'GlassPanel'

export { GlassPanel }
