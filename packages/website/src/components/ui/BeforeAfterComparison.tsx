'use client'

import { useState, useRef, useEffect } from 'react'
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
  const [compareValue, setCompareValue] = useState(100) // Start at 100 to show full "before" image
  const sectionRef = useRef<HTMLElement>(null)

  const beforeImage = `/images/products/${productSlug}/before-after/${productSlug}_before.webp`
  const afterImage = `/images/products/${productSlug}/before-after/${productSlug}_after.webp`

  // Update CSS custom property when slider changes
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.style.setProperty('--compare', compareValue.toString())
    }
  }, [compareValue])

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative mx-auto overflow-hidden rounded-xl border-2 border-border shadow-2xl',
        aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-video',
        'w-full max-w-[min(80vmin,1080px)]'
      )}
      style={{
        containerType: 'inline-size',
        '--compare': compareValue,
      } as React.CSSProperties}
    >
      {/* After Image (Background - shows on right side) */}
      <Image
        src={afterImage}
        alt="After"
        fill
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        priority
      />

      {/* Before Image (Clipped - shows on left side) */}
      <Image
        src={beforeImage}
        alt="Before"
        fill
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{
          clipPath: 'inset(0 0 0 calc(var(--compare) * 1%))',
        }}
        priority
      />

      {/* BEFORE Label - Only visible when before image is showing (left side) */}
      <div
        className="pointer-events-none absolute left-4 top-4 z-30 rounded-md bg-black/70 px-3 py-1.5 text-xs font-bold tracking-wider text-white backdrop-blur-sm transition-opacity duration-200"
        style={{
          opacity: compareValue > 10 ? 1 : 0,
        }}
      >
        BEFORE
      </div>

      {/* AFTER Label - Only visible when after image is showing (right side) */}
      <div
        className="pointer-events-none absolute right-4 top-4 z-30 rounded-md bg-black/70 px-3 py-1.5 text-xs font-bold tracking-wider text-white backdrop-blur-sm transition-opacity duration-200"
        style={{
          opacity: compareValue < 90 ? 1 : 0,
        }}
      >
        AFTER
      </div>

      {/* Separator Line */}
      <div
        className="pointer-events-none absolute top-0 z-20 h-full w-0.5 bg-white shadow-lg"
        style={{
          left: `${compareValue}%`,
          transform: 'translateX(-50%)',
        }}
      />

      {/* Range Input Slider */}
      <input
        type="range"
        min="0"
        max="100"
        value={compareValue}
        onChange={(e) => setCompareValue(Number(e.target.value))}
        className="absolute inset-0 z-10 h-full w-full cursor-grab appearance-none bg-transparent opacity-0 active:cursor-grabbing"
        style={{
          overflow: 'hidden',
        }}
      />

      {/* Drag Handle */}
      <div
        className="pointer-events-none absolute top-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-white shadow-lg"
        style={{
          left: `${compareValue}%`,
          transform: 'translate(-50%, -50%) rotate(90deg)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
          />
        </svg>
      </div>
    </section>
  )
}
