'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import * as LucideIcons from 'lucide-react'
import { Product } from '@/types'
import { GlowingCard } from '@/components/ui/GlowingCard'

export function ProductFeatures({ product }: { product: Product }) {
  return (
    <>
      {product.features.map((feature, i) => {
        const Icon = (LucideIcons as any)[feature.icon] || LucideIcons.Sparkles
        const isPortrait = product.id === 'yan-avatar'
        const shouldFlipFirst = isPortrait && i === 0
        const featureImageSrc = `/images/products/${product.slug}/features/${product.slug}_feature_${String(i + 1).padStart(2, '0')}.webp`
        const textOrder = i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
        const imageOrder = i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
        let resolvedTextOrder = shouldFlipFirst ? imageOrder : textOrder
        let resolvedImageOrder = shouldFlipFirst ? textOrder : imageOrder

        if (isPortrait && i === 1) {
          resolvedTextOrder = 'lg:order-1'
          resolvedImageOrder = 'lg:order-2'
        }

        if (isPortrait && i === 2) {
          resolvedTextOrder = 'lg:order-2'
          resolvedImageOrder = 'lg:order-1'
        }
        
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="grid gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className={resolvedTextOrder}>
              <Icon className="mb-6 h-12 w-12" style={{ color: product.colors.primary }} />
              <h2 className="mb-4 text-3xl font-bold">{feature.title}</h2>
              <p className="text-lg text-muted-foreground">{feature.description}</p>
            </div>
            <div className={`flex items-center justify-center ${resolvedImageOrder}`}>
              <div className={`w-full ${isPortrait ? 'max-w-sm' : ''}`}>
                <GlowingCard
                  primaryColor={product.colors.primary}
                  secondaryColor={product.colors.secondary}
                  isPortrait={isPortrait}
                  disableGlow
                >
                  <Image
                    src={featureImageSrc}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                </GlowingCard>
              </div>
            </div>
          </motion.div>
        )
      })}
    </>
  )
}
