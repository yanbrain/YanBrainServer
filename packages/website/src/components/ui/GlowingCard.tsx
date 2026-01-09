'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface GlowingCardProps {
    children: React.ReactNode
    primaryColor: string  // Main product color for outline
    secondaryColor?: string // Secondary color for glow (defaults to purple)
    className?: string
    isPortrait?: boolean
    disableGlow?: boolean
}

export function GlowingCard({
                                children,
                                primaryColor,
                                secondaryColor = '#6d28d9', // Default purple
                                className,
                                isPortrait = false,
                                disableGlow = false
                            }: GlowingCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const card = cardRef.current
        if (!card) return

        const handlePointerMove = (e: PointerEvent) => {
            const rect = card.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            // Calculate percentage position
            const perX = ((100 / rect.width) * x)
            const perY = ((100 / rect.height) * y)

            // Calculate distance from center
            const cx = rect.width / 2
            const cy = rect.height / 2
            const dx = x - cx
            const dy = y - cy

            // Calculate angle
            let angle = 0
            if (dx !== 0 || dy !== 0) {
                const angleRad = Math.atan2(dy, dx)
                angle = angleRad * (180 / Math.PI) + 90
                if (angle < 0) angle += 360
            }

            // Calculate closeness to edge (0-100)
            let k_x = Infinity
            let k_y = Infinity
            if (dx !== 0) k_x = cx / Math.abs(dx)
            if (dy !== 0) k_y = cy / Math.abs(dy)
            const edge = Math.min(Math.max((1 / Math.min(k_x, k_y)), 0, 1), 1) * 100

            card.style.setProperty('--pointer-x', `${perX}%`)
            card.style.setProperty('--pointer-y', `${perY}%`)
            card.style.setProperty('--pointer-angle', `${angle}deg`)
            card.style.setProperty('--pointer-distance', `${edge}`)
        }

        card.addEventListener('pointermove', handlePointerMove)
        return () => card.removeEventListener('pointermove', handlePointerMove)
    }, [])

    return (
        <div className="glowing-card-wrapper" style={{ padding: '16px' }}>
            <div
                ref={cardRef}
                className={cn(
                    "glowing-card group relative overflow-hidden",
                    isPortrait ? "aspect-[9/16]" : "aspect-video",
                    className
                )}
                style={{
                    ['--primary-color' as string]: primaryColor,
                    ['--glow-color' as string]: secondaryColor,
                    ['--pointer-angle' as string]: '45deg',
                    ['--pointer-distance' as string]: '0',
                }}
            >
                {/* Glow effect - positioned outside to prevent clipping */}
                {!disableGlow && <span className="glow-effect" />}

                {/* Colored outline */}
                <span className="colored-outline" />

                {/* Static pale outline */}
                <span className="static-outline" />

                {/* Content */}
                <div className="relative z-10 h-full w-full overflow-hidden rounded-lg bg-secondary">
                    {children}
                </div>

                <style jsx global>{`
                    .glowing-card-wrapper {
                        position: relative;
                    }

                    .glowing-card {
                        --glow-sens: 30;
                        --color-sens: 50;

                        position: relative;
                        border-radius: 0.75rem;
                        isolation: isolate;
                    }

                    .glowing-card .colored-outline,
                    .glowing-card .glow-effect,
                    .glowing-card .static-outline {
                        content: "";
                        position: absolute;
                        inset: 0;
                        border-radius: inherit;
                        transition: opacity 0.3s ease-out;
                        pointer-events: none;
                    }

                    .glowing-card:not(:hover) .glow-effect,
                    .glowing-card:not(:hover) .colored-outline {
                        opacity: 0;
                        transition: opacity 0.6s ease-in-out;
                    }

                    /* Colored border outline (main product color) */
                    .glowing-card .colored-outline {
                        z-index: 20;
                        border: 2px solid var(--primary-color);
                        opacity: calc((var(--pointer-distance) - var(--color-sens)) / (100 - var(--color-sens)));
                        mask-image: conic-gradient(
                                from var(--pointer-angle) at center,
                                black 20%,
                                transparent 35%,
                                transparent 65%,
                                black 80%
                        );
                        -webkit-mask-image: conic-gradient(
                                from var(--pointer-angle) at center,
                                black 20%,
                                transparent 35%,
                                transparent 65%,
                                black 80%
                        );
                    }

                    .glowing-card .static-outline {
                        z-index: 15;
                        border: 1px solid rgba(255, 255, 255, 0.25);
                        opacity: 1;
                    }

                    /* Outer glow (secondary color) - OUTSIDE card to prevent clipping */
                    .glowing-card .glow-effect {
                        inset: -16px;
                        z-index: 0;
                        mask-image: conic-gradient(
                                from var(--pointer-angle) at center,
                                black 5%,
                                transparent 15%,
                                transparent 85%,
                                black 95%
                        );
                        -webkit-mask-image: conic-gradient(
                                from var(--pointer-angle) at center,
                                black 5%,
                                transparent 15%,
                                transparent 85%,
                                black 95%
                        );
                        opacity: calc((var(--pointer-distance) - var(--glow-sens)) / (100 - var(--glow-sens)));
                    }

                    .glowing-card .glow-effect::before {
                        content: "";
                        position: absolute;
                        inset: 16px;
                        border-radius: inherit;
                        box-shadow:
                            /* Inner glows */
                                inset 0 0 0 1px var(--glow-color),
                                inset 0 0 4px 0 var(--glow-color),
                                inset 0 0 8px 0 var(--glow-color),
                                inset 0 0 16px 2px var(--glow-color),

                                    /* Outer glows - brighter and more visible */
                                0 0 4px 1px var(--glow-color),
                                0 0 8px 2px var(--glow-color),
                                0 0 16px 3px var(--glow-color),
                                0 0 24px 4px var(--glow-color),
                                0 0 40px 6px var(--glow-color);
                    }
                `}</style>
            </div>
        </div>
    )
}
