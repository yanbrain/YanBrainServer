'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface BeforeAfterComparisonProps {
  productSlug: string
  aspectRatio?: 'video' | 'portrait'
}

export function BeforeAfterComparison({
  productSlug,
  aspectRatio = 'video',
}: BeforeAfterComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const beforeImage = `/images/products/${productSlug}/before-after/${productSlug}_before.webp`
  const afterImage = `/images/products/${productSlug}/before-after/${productSlug}_after.webp`

  useEffect(() => {
    // Trigger visibility animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    updateSliderPosition(e)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    updateSliderPosition(e)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    updateSliderPositionTouch(e)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    updateSliderPositionTouch(e)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const updateSliderPosition = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(percentage, 100)))
  }

  const updateSliderPositionTouch = (e: React.TouchEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width))
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(percentage, 100)))
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden rounded-xl select-none',
        aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-video'
      )}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Before Image (Background) */}
      <div className="relative h-full w-full">
        <Image
          src={beforeImage}
          alt="Before"
          fill
          className="object-cover"
          priority
        />

        {/* Before Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className={cn(
            'absolute right-4 top-4 px-4 py-2 text-sm font-medium tracking-wider text-white',
            sliderPosition < 95 ? 'opacity-100' : 'opacity-0'
          )}
        >
          BEFORE
        </motion.div>
      </div>

      {/* After Image (Overlay) */}
      <motion.div
        initial={{ width: '0%' }}
        animate={isVisible ? { width: `${sliderPosition}%` } : { width: '0%' }}
        transition={
          isVisible && !isDragging
            ? {
                duration: 0.7,
                ease: [0.42, 0, 0.58, 1.6], // Bounce easing
              }
            : { duration: 0 }
        }
        className="absolute left-0 top-0 h-full overflow-hidden"
        style={isDragging ? { width: `${sliderPosition}%` } : undefined}
      >
        <div className="relative h-full" style={{ width: containerRef.current?.offsetWidth || '100vw' }}>
          <Image
            src={afterImage}
            alt="After"
            fill
            className="object-cover"
            priority
          />

          {/* After Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className={cn(
              'absolute left-4 top-4 px-4 py-2 text-sm font-medium tracking-wider text-white',
              sliderPosition > 5 ? 'opacity-100' : 'opacity-0'
            )}
          >
            AFTER
          </motion.div>
        </div>
      </motion.div>

      {/* Draggable Handle */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="absolute top-1/2 -translate-y-1/2 cursor-move"
        style={{ left: `${sliderPosition}%`, marginLeft: '-22px' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className={cn(
            'h-11 w-11 rounded-full bg-black shadow-[0_0_0_6px_rgba(0,0,0,0.2),0_0_10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)] transition-colors',
            isDragging && 'bg-orange-600'
          )}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M15 18L9 12L15 6\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3Cpath d=\'M9 18L15 12L9 6\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      </motion.div>
    </div>
  )
}
