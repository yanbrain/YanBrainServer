'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { PRODUCTS } from '@/config/products'

export function ProductsGrid() {
    return (
        <div className="grid gap-8 md:grid-cols-3">
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
                                ['--hover-color' as string]: product.colors.primary
                            }}
                        >
                            <div className="relative aspect-video w-full overflow-hidden rounded-[22px]">
                                <Image
                                    src={heroImage}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
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
