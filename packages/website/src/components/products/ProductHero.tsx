'use client'

import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GlowingCard } from '@/components/ui/GlowingCard'
import { Product } from '@/types'
import Image from 'next/image'

interface ProductHeroProps {
  product: Product
  isPortrait?: boolean
  children?: React.ReactNode // For custom preview (comparison, etc.)
}

export function ProductHero({ product, isPortrait = false, children }: ProductHeroProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <div
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg p-3"
            style={{ backgroundColor: product.colors.primary }}
          >
            <Image
              src={`/images/products/${product.slug}/${product.slug}_logo.webp`}
              alt={`${product.name} logo`}
              width={64}
              height={64}
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight">{product.name}</h1>
          <p className="mb-3 text-xl font-semibold" style={{ color: product.colors.primary }}>
            {product.tagline}
          </p>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{product.heroDescription}</p>
          <Button size="lg" style={{ backgroundColor: product.colors.primary }} className="text-white hover:opacity-90">
            <Download className="mr-2 h-5 w-5" />
            Download Now
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <div className={`w-full ${isPortrait ? 'max-w-sm' : ''}`}>
            {children || (
              <GlowingCard 
                primaryColor={product.colors.primary}
                secondaryColor={product.colors.secondary || 'hsl(25, 95%, 53%)'}
                isPortrait={isPortrait}
              >
                <div className="flex h-full items-center justify-center bg-secondary text-sm text-muted-foreground">
                  Product Preview
                </div>
              </GlowingCard>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
