'use client'

import Image from 'next/image'
import type { GalleryImage } from '@/lib/gallery'

interface ProductGalleryProps {
  images: GalleryImage[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  if (images.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        No gallery images yet. Add images to the product gallery folder to see them here.
      </p>
    )
  }

  return (
    <div className="relative mx-auto max-w-6xl">
      <div
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {images.map((image) => (
          <div
            key={image.src}
            className="relative h-72 w-80 shrink-0 overflow-hidden rounded-lg bg-secondary sm:h-80 sm:w-96"
            style={{ scrollSnapAlign: 'start' }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 85vw, 384px"
            />
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
