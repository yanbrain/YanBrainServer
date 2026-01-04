'use client'

import { useState } from 'react'
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

  const beforeImage = `/images/products/${productSlug}/before-after/${productSlug}_before.webp`
  const afterImage = `/images/products/${productSlug}/before-after/${productSlug}_after.webp`

  return (
    <section
      className={cn(
        'relative mx-auto overflow-hidden rounded-xl border-2 border-border shadow-2xl',
        aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-video',
        'w-full max-w-[min(80vmin,1080px)]'
      )}
    >
      {/* After Image - Base Layer (always visible) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${afterImage})`,
        }}
      >
        {/* AFTER Label */}
        <div className="absolute right-4 top-4 rounded-md bg-black/70 px-3 py-1.5 text-xs font-bold tracking-wider text-white backdrop-blur-sm">
          AFTER
        </div>
      </div>

      {/* Before Image - Overlay with dynamic width */}
      <div
        className="absolute inset-0 border-r-2 border-white bg-cover bg-center shadow-lg"
        style={{
          backgroundImage: `url(${beforeImage})`,
          width: `${compareValue}%`,
        }}
      >
        {/* BEFORE Label */}
        <div className="absolute left-4 top-4 rounded-md bg-black/70 px-3 py-1.5 text-xs font-bold tracking-wider text-white backdrop-blur-sm">
          BEFORE
        </div>
      </div>

      {/* Range Input Slider */}
      <input
        type="range"
        min="0"
        max="100"
        value={compareValue}
        onChange={(e) => setCompareValue(Number(e.target.value))}
        aria-label="Image comparison slider"
        className="absolute inset-0 z-30 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 active:cursor-grabbing"
        style={{
          WebkitAppearance: 'none',
        }}
      />

      {/* Drag Handle */}
      <div
        className="pointer-events-none absolute top-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-white shadow-lg transition-none"
        style={{
          left: `${compareValue}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="h-5 w-5"
          style={{ transform: 'rotate(90deg)' }}
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
