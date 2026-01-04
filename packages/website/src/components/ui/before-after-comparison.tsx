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
  const [compareValue, setCompareValue] = useState(50)
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
      {/* Before Image (Background) */}
      <Image
        src={beforeImage}
        alt="Before"
        fill
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        priority
      />

      {/* After Image (Clipped) */}
      <Image
        src={afterImage}
        alt="After"
        fill
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{
          clipPath: 'inset(0 0 0 calc(var(--compare) * 1%))',
        }}
        priority
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
        className="pointer-events-none absolute top-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-600 bg-black text-white shadow-lg transition-opacity active:opacity-0"
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
