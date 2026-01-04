'use client'

import type { KeyboardEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { GalleryImage } from '@/lib/gallery'
import { cn } from '@/lib/utils'

interface HorizontalGalleryProps {
  images: GalleryImage[]
}

export function HorizontalGallery({ images }: HorizontalGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  const clampIndex = useCallback(
    (index: number) => Math.max(0, Math.min(images.length - 1, index)),
    [images.length]
  )

  useEffect(() => {
    const target = itemRefs.current[activeIndex]
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeIndex])

  useEffect(() => {
    setActiveIndex((current) => clampIndex(current))
  }, [clampIndex])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setActiveIndex((current) => clampIndex(current + 1))
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setActiveIndex((current) => clampIndex(current - 1))
      }
    },
    [clampIndex]
  )

  if (images.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        No gallery images yet. Add images to the product gallery folder to see them here.
      </p>
    )
  }

  return (
    <div
      className="relative mx-auto max-w-6xl"
      tabIndex={0}
      role="region"
      aria-label="Gallery images"
      onKeyDown={handleKeyDown}
    >
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth snap-x snap-mandatory">
        {images.map((image, index) => {
          const isActive = index === activeIndex

          return (
            <button
              key={image.src}
              ref={(element) => {
                itemRefs.current[index] = element
              }}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative shrink-0 overflow-hidden rounded-2xl bg-secondary transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                isActive
                  ? 'aspect-video w-[28rem] ring-1 ring-primary/40 shadow-lg'
                  : 'aspect-video w-64 opacity-80 hover:opacity-100'
              )}
              style={{ scrollSnapAlign: 'center' }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className={cn('object-cover transition duration-300', isActive && 'scale-[1.03]')}
                sizes="(max-width: 768px) 70vw, 448px"
              />
              <span className="sr-only">View gallery image {index + 1}</span>
            </button>
          )
        })}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Click a neighboring image to move through the gallery.
      </p>
    </div>
  )
}
