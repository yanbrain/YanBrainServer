'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  productSlug: string
  imageCount?: number
  isPortrait?: boolean
}

export function ProductGallery({ 
  productSlug, 
  imageCount = 5,
  isPortrait = false
}: ProductGalleryProps) {
  const images = Array.from({ length: imageCount }, (_, i) => ({
    src: `/images/products/${productSlug}/gallery/${productSlug}_gallery_${String(i + 1).padStart(2, '0')}.webp`,
    alt: `${productSlug} example ${i + 1}`
  }))

  return (
    <div className="relative mx-auto max-w-6xl">
      <div 
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {images.map((image, index) => (
          <div
            key={image.src}
            className={cn(
              "relative shrink-0 overflow-hidden rounded-lg bg-secondary",
              isPortrait ? "aspect-[9/16] w-48" : "aspect-video w-96"
            )}
            style={{ scrollSnapAlign: 'start' }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
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
