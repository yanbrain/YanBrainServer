'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const CLIENTS = [
    { name: 'BMW', logo: '/images/clients/bmw.webp' },
    { name: 'ADNOC', logo: '/images/clients/adnoc.webp' },
    { name: 'ALI & SONS', logo: '/images/clients/ali-sons.webp' },
    { name: 'WTC Dubai', logo: '/images/clients/wtc.webp' },
    { name: 'Sofoil', logo: '/images/clients/sofoil.webp' }
]

export function OurClientsScroll() {
    // Calculate the width of one set: (width + gap) * number of items
    // 160px width + 80px gap (20 * 4) = 240px per item
    const scrollDistance = -(240 * CLIENTS.length)

    return (
        <section className="border-y border-border bg-secondary/30 py-12">
            <div className="mx-auto max-w-7xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="mb-8 text-center text-3xl font-bold">Trusted by Leading Brands</h2>

                    <div
                        className="relative flex overflow-hidden select-none"
                        style={{
                            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                        }}
                    >
                        {[1, 2, 3].map((groupIndex) => (
                            <motion.div
                                key={groupIndex}
                                className="flex shrink-0 gap-20 pr-20"
                                animate={{
                                    x: [0, scrollDistance],
                                }}
                                transition={{
                                    x: {
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        duration: 20,
                                        ease: "linear",
                                    },
                                }}
                                aria-hidden={groupIndex > 1}
                            >
                                {CLIENTS.map((client) => (
                                    <div
                                        key={`${client.name}-${groupIndex}`}
                                        className="flex h-20 w-40 shrink-0 items-center justify-center"
                                    >
                                        <div className="relative h-full w-full">
                                            <Image
                                                src={client.logo}
                                                alt={client.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}