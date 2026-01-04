'use client'

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
            className="flex shrink-0 items-center justify-center rounded-lg bg-secondary p-4"
            style={{ scrollSnapAlign: 'start' }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="max-h-96 w-auto max-w-[85vw] object-contain"
              loading="lazy"
              decoding="async"
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
