'use client'

import type { KeyboardEvent } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { GalleryImage } from '@/lib/gallery'
import { cn } from '@/lib/utils'

interface VerticalGalleryProps {
  images: GalleryImage[]
}

export function VerticalGallery({ images }: VerticalGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  const clampIndex = useCallback(
    (index: number) => Math.max(0, Math.min(images.length - 1, index)),
    [images.length]
  )

  useEffect(() => {
    const target = itemRefs.current[activeIndex]
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  }, [activeIndex])

  useEffect(() => {
    setActiveIndex((current) => clampIndex(current))
  }, [clampIndex])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((current) => clampIndex(current + 1))
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((current) => clampIndex(current - 1))
      }
    },
    [clampIndex]
  )

  const transforms = useMemo(
    () =>
      images.map((_, index) => {
        const offset = index - activeIndex
        const distance = Math.min(Math.abs(offset), 3)
        const scale = 1 - distance * 0.08
        const rotateX = offset * 4
        const translateY = offset * 16

        return {
          transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
          zIndex: images.length - Math.abs(offset)
        }
      }),
    [activeIndex, images]
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
      className="relative mx-auto flex max-w-3xl flex-col items-center"
      style={{ perspective: '1200px' }}
      tabIndex={0}
      role="region"
      aria-label="Gallery images"
      onKeyDown={handleKeyDown}
    >
      <div className="flex max-h-[70vh] w-full flex-col items-center gap-6 overflow-y-auto pb-6 scrollbar-hide scroll-smooth snap-y snap-mandatory">
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
                'relative w-64 shrink-0 overflow-hidden rounded-2xl bg-secondary transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                isActive ? 'aspect-[9/16] shadow-xl ring-1 ring-primary/40' : 'aspect-[9/16] opacity-80'
              )}
              style={{
                scrollSnapAlign: 'center',
                ...transforms[index]
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className={cn('object-cover transition duration-300', isActive && 'scale-[1.03]')}
                sizes="(max-width: 768px) 60vw, 256px"
              />
              <span className="sr-only">View gallery image {index + 1}</span>
            </button>
          )
        })}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Tap a card to bring it into focus.
      </p>
    </div>
  )
}
