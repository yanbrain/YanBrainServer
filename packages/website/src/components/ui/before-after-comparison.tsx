'use client'

import { GripVertical } from 'lucide-react'
import { type MotionValue, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { type ComponentProps, createContext, type HTMLAttributes, useContext, useState } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { GlowingCard } from '@/components/ui/glowing-card'

type ComparisonContextType = {
  sliderPosition: number
  setSliderPosition: (pos: number) => void
  motionSliderPosition: MotionValue<number>
  mode: 'hover' | 'drag'
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

const useComparisonContext = () => {
  const context = useContext(ComparisonContext)
  if (!context) {
    throw new Error('useComparisonContext must be used within a Comparison')
  }
  return context
}

export type ComparisonProps = HTMLAttributes<HTMLDivElement> & {
  mode?: 'hover' | 'drag'
  onDragStart?: () => void
  onDragEnd?: () => void
}

export const Comparison = ({
  className,
  mode = 'drag',
  onDragStart,
  onDragEnd,
  children,
  ...props
}: ComparisonProps) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const motionSliderPosition = useMotionValue(50)
  const springConfig = { damping: 30, stiffness: 300 }
  const sliderPositionSpring = useSpring(motionSliderPosition, springConfig)

  const handleMouseDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode === 'drag' && !isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const percentage = (x / rect.width) * 100
    setSliderPosition(percentage)
    motionSliderPosition.set(percentage)
  }

  const handleTouchDrag = (e: React.TouchEvent<HTMLDivElement>) => {
    if (mode === 'drag' && !isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width))
    const percentage = (x / rect.width) * 100
    setSliderPosition(percentage)
    motionSliderPosition.set(percentage)
  }

  const handleDragStart = () => {
    if (mode === 'drag') {
      setIsDragging(true)
      onDragStart?.()
    }
  }

  const handleDragEnd = () => {
    if (mode === 'drag') {
      setIsDragging(false)
      onDragEnd?.()
    }
  }

  return (
    <ComparisonContext.Provider value={{ sliderPosition, setSliderPosition, motionSliderPosition, mode }}>
      <div
        aria-label="Comparison slider"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={sliderPosition}
        className={cn('relative isolate w-full select-none overflow-hidden', className)}
        onMouseDown={handleDragStart}
        onMouseLeave={handleDragEnd}
        onMouseMove={handleMouseDrag}
        onMouseUp={handleDragEnd}
        onTouchEnd={handleDragEnd}
        onTouchMove={handleTouchDrag}
        onTouchStart={handleDragStart}
        role="slider"
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    </ComparisonContext.Provider>
  )
}

export type ComparisonItemProps = ComponentProps<typeof motion.div> & {
  position: 'left' | 'right'
}

export const ComparisonItem = ({ className, position, children, ...props }: ComparisonItemProps) => {
  const { motionSliderPosition } = useComparisonContext()
  const clipPath = useTransform(
    motionSliderPosition,
    [0, 100],
    position === 'left'
      ? ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']
      : ['inset(0 0% 0 100%)', 'inset(0 0% 0 0%)']
  )

  return (
    <motion.div
      className={cn('absolute inset-0', className)}
      style={{ clipPath }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const ComparisonHandle = () => {
  const { motionSliderPosition } = useComparisonContext()
  const left = useTransform(motionSliderPosition, (value) => `${value}%`)

  return (
    <motion.div
      className="absolute inset-y-0 z-10 flex items-center justify-center"
      style={{ left }}
    >
      <div className="flex h-full items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl shadow-orange-500/50 backdrop-blur-sm transition-transform hover:scale-110">
          <GripVertical className="h-8 w-8 text-white drop-shadow-lg" strokeWidth={2.5} />
        </div>
      </div>
      <div className="absolute inset-y-0 w-1 bg-gradient-to-b from-white/0 via-white to-white/0 shadow-lg shadow-white/50" />
    </motion.div>
  )
}

// Main component for before/after images
interface BeforeAfterComparisonProps {
  productSlug: string
  aspectRatio?: 'video' | 'portrait'
  primaryColor?: string
  secondaryColor?: string
}

export function BeforeAfterComparison({
  productSlug,
  aspectRatio = 'video',
  primaryColor,
  secondaryColor
}: BeforeAfterComparisonProps) {
  const beforeImage = `/images/products/${productSlug}/before-after/${productSlug}-before.png`
  const afterImage = `/images/products/${productSlug}/before-after/${productSlug}-after.png`

  const comparisonContent = (
    <Comparison className="h-full w-full rounded-xl overflow-hidden">
      <ComparisonItem position="left">
        <div className="relative h-full w-full">
          <Image
            src={beforeImage}
            alt="Before"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute left-6 top-6 rounded-full bg-gradient-to-br from-gray-900/90 to-black/90 px-5 py-2.5 text-sm font-bold text-white shadow-2xl backdrop-blur-md border border-white/20">
            BEFORE
          </div>
        </div>
      </ComparisonItem>
      <ComparisonItem position="right">
        <div className="relative h-full w-full">
          <Image
            src={afterImage}
            alt="After"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute right-6 top-6 rounded-full bg-gradient-to-br from-orange-600/90 to-orange-700/90 px-5 py-2.5 text-sm font-bold text-white shadow-2xl backdrop-blur-md border border-white/30">
            AFTER
          </div>
        </div>
      </ComparisonItem>
      <ComparisonHandle />
    </Comparison>
  )

  // If colors provided, wrap in GlowingCard for consistent styling
  if (primaryColor) {
    return (
      <GlowingCard
        primaryColor={primaryColor}
        secondaryColor={secondaryColor || 'hsl(25, 95%, 53%)'}
        isPortrait={aspectRatio === 'portrait'}
      >
        {comparisonContent}
      </GlowingCard>
    )
  }

  return comparisonContent
}
