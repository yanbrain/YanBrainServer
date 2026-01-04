'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PRODUCTS } from '@/config/products'
import { GlowingCard } from '@/components/ui/glowing-card'
import { BeforeAfterComparison } from '@/components/ui/before-after-comparison'

// Products that have before/after images
const PRODUCTS_WITH_BEFORE_AFTER = ['yan-draw', 'yan-photobooth']

export function ProductsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <Link
              href={`/${product.slug}`}
              className="group flex flex-1 flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 via-black/80 to-black px-5 pb-6 pt-5 transition hover:border-white/20 hover:bg-white/5"
            >
              <div className="relative">
                {hasBeforeAfter ? (
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60">
                    <BeforeAfterComparison
                      productSlug={product.slug}
                      aspectRatio="video"
                    />
                  </div>
                ) : (
                  <GlowingCard
                    primaryColor={product.colors.primary}
                    secondaryColor={product.colors.secondary || 'hsl(25, 95%, 53%)'}
                    className="rounded-2xl"
                  >
                    <div className="flex h-full items-center justify-center bg-secondary text-lg font-semibold text-muted-foreground">
                      {product.name}
                    </div>
                  </GlowingCard>
                )}
              </div>

              <div className="mt-5 flex flex-1 flex-col">
                <h2
                  className="text-xl font-semibold text-white transition-colors"
                  style={{
                    ['--hover-color' as string]: product.colors.primary
                  }}
                >
                  {product.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground flex-1">
                  {product.description}
                </p>
                <div
                  className="mt-4 inline-flex items-center text-sm font-medium transition-colors"
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
