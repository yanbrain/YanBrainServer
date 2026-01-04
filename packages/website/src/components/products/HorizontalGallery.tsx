'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryImage } from '@/lib/gallery'
import { cn } from '@/lib/utils'

interface HorizontalGalleryProps {
  images: GalleryImage[]
}

export function HorizontalGallery({ images }: HorizontalGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollability = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    )
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })
  }

  if (images.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        No gallery images yet. Add images to the product gallery folder to see them here.
      </p>
    )
  }

  return (
    <div className="relative mx-auto max-w-7xl">
      {/* Left Fade + Navigation Button */}
      <div
        className={cn(
          'absolute left-0 top-0 z-10 flex h-full w-32 items-center transition-opacity duration-300',
          'bg-gradient-to-r from-background via-background/80 to-transparent',
          canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-sm transition-all hover:bg-black hover:scale-110 disabled:opacity-0"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Right Fade + Navigation Button */}
      <div
        className={cn(
          'absolute right-0 top-0 z-10 flex h-full w-32 items-center justify-end transition-opacity duration-300',
          'bg-gradient-to-l from-background via-background/80 to-transparent',
          canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-sm transition-all hover:bg-black hover:scale-110 disabled:opacity-0"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Scrollable Gallery */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollability}
        className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth px-8 py-4"
        role="region"
        aria-label="Gallery images"
      >
        {images.map((image, index) => (
          <div
            key={image.src}
            className="group relative shrink-0 overflow-hidden rounded-xl bg-secondary shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
          >
            <div className="relative aspect-video w-80">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 90vw, 320px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
