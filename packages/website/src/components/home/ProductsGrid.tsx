'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { PRODUCTS } from '@/config/products'

export function ProductsGrid() {
    return (
        <div className="grid gap-8 md:grid-cols-3">
            <svg className="absolute size-0" aria-hidden="true">
                <defs>
                    <filter
                        id="turbulent-displace"
                        colorInterpolationFilters="sRGB"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                    >
                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
                        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
                            <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
                        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
                            <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise3" seed="2" />
                        <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
                            <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise4" seed="2" />
                        <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
                            <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
                        <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
                        <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

                        <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
                    </filter>
                </defs>
            </svg>
            {PRODUCTS.map((product, i) => {
                // Use landing-hero for yan-avatar, regular hero for others
                const heroImage = product.slug === 'yan-avatar'
                    ? `/images/products/${product.slug}/hero/${product.slug}_landing-hero.webp`
                    : `/images/products/${product.slug}/hero/${product.slug}_hero.webp`

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
                            className="group flex flex-col flex-1"
                            style={{
                                ['--hover-color' as string]: product.colors.primary,
                                ['--electric-border-color' as string]: product.colors.primary
                            }}
                        >
                            <div className="electric-card relative aspect-video w-full">
                                <div className="electric-border-outer electric-layer pointer-events-none">
                                    <div className="electric-border-main" />
                                </div>
                                <div className="electric-glow electric-glow-1 electric-layer pointer-events-none" />
                                <div className="electric-glow electric-glow-2 electric-layer pointer-events-none" />
                                <div className="electric-overlay electric-overlay-1 electric-layer pointer-events-none" />
                                <div className="electric-overlay electric-overlay-2 electric-layer pointer-events-none" />
                                <div className="electric-bg-glow electric-layer pointer-events-none" />
                                <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-border shadow-2xl">
                                    <Image
                                        src={heroImage}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 px-2 flex-1 flex flex-col">
                                <h2
                                    className="mb-2 text-2xl font-bold transition-colors group-hover:text-[color:var(--hover-color)]"
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
