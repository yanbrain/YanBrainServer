'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { PRODUCTS } from '@/config/products'
import { GlowingCard } from '@/components/ui/glowing-card'
import { BeforeAfterComparison } from '@/components/ui/before-after-comparison'

// Products that have before/after images
const PRODUCTS_WITH_BEFORE_AFTER = ['yan-draw', 'yan-photobooth']

export function ProductsGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {PRODUCTS.map((product, i) => {
        const hasBeforeAfter = PRODUCTS_WITH_BEFORE_AFTER.includes(product.slug)

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex"
          >
            <Link href={`/${product.slug}`} className="group flex flex-col flex-1">
              {hasBeforeAfter ? (
                <BeforeAfterComparison
                  productSlug={product.slug}
                  aspectRatio="video"
                />
              ) : (
                <GlowingCard
                  primaryColor={product.colors.primary}
                  secondaryColor={product.colors.secondary || 'hsl(25, 95%, 53%)'}
                >
                  <div className="flex h-full items-center justify-center bg-secondary text-lg font-semibold text-muted-foreground">
                    {product.name}
                  </div>
                </GlowingCard>
              )}

              <div className="mt-4 px-2 flex-1 flex flex-col">
                <h2
                  className="mb-2 text-2xl font-bold transition-colors"
                  style={{
                    ['--hover-color' as string]: product.colors.primary
                  }}
                >
                  {product.name}
                </h2>
                <p className="mb-4 text-muted-foreground flex-1">{product.description}</p>
                <div
                  className="flex items-center text-sm font-medium transition-colors"
                  style={{ color: product.colors.primary }}
                >
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
