'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface BeforeAfterComparisonProps {
    productSlug: string
    aspectRatio?: 'video' | 'portrait'
    initial?: number
    beforeLabel?: string
    afterLabel?: string
}

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n))
}

export function BeforeAfterComparison({
                                          productSlug,
                                          aspectRatio = 'video',
                                          initial = 50,
                                          beforeLabel = 'Before',
                                          afterLabel = 'After',
                                      }: BeforeAfterComparisonProps) {
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const rangeRef = React.useRef<HTMLInputElement | null>(null)
    const dragging = React.useRef(false)

    const beforeImage = `/images/products/${productSlug}/before-after/${productSlug}_before.webp`
    const afterImage = `/images/products/${productSlug}/before-after/${productSlug}_after.webp`

    React.useEffect(() => {
        rootRef.current?.style.setProperty('--pos', `${clamp(initial, 0, 100)}%`)
    }, [initial])

    const setFromX = (clientX: number) => {
        const el = rootRef.current
        if (!el) return

        const rect = el.getBoundingClientRect()
        const value = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100)

        el.style.setProperty('--pos', `${value}%`)
        if (rangeRef.current) rangeRef.current.value = String(Math.round(value))
    }

    return (
        <section
            ref={rootRef}
            className={cn(
                'relative mx-auto w-full overflow-hidden rounded-xl border-2 border-border shadow-2xl',
                aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-video',
                'max-w-[min(80vmin,1080px)]'
            )}
            style={{ ['--pos' as any]: '50%' }}
        >
            {/* AFTER - with clipping for right side */}
            <div
                className="absolute inset-0 z-10"
                style={{ clipPath: 'inset(0 0 0 var(--pos))' }}
            >
                <Image
                    src={afterImage}
                    alt="After"
                    fill
                    priority
                    className="pointer-events-none object-cover"
                />

                {/* AFTER LABEL - inside clipped area */}
                <div className="absolute right-3 top-3 pointer-events-none">
                    <span className="inline-block rounded bg-black/55 px-3 py-1.5 text-sm font-bold uppercase text-white backdrop-blur-sm">
                        {afterLabel}
                    </span>
                </div>
            </div>

            {/* BEFORE - with clipping for left side */}
            <div
                className="absolute inset-0 z-10"
                style={{ clipPath: 'inset(0 calc(100% - var(--pos)) 0 0)' }}
            >
                <Image
                    src={beforeImage}
                    alt="Before"
                    fill
                    className="pointer-events-none object-cover"
                />

                {/* BEFORE LABEL - inside clipped area */}
                <div className="absolute left-3 top-3 pointer-events-none">
                    <span className="inline-block rounded bg-black/55 px-3 py-1.5 text-sm font-bold uppercase text-white backdrop-blur-sm">
                        {beforeLabel}
                    </span>
                </div>
            </div>

            {/* Drag surface */}
            <div
                className="absolute inset-0 z-20 cursor-ew-resize"
                onPointerDown={(e) => {
                    dragging.current = true
                    e.currentTarget.setPointerCapture(e.pointerId)
                    setFromX(e.clientX)
                }}
                onPointerMove={(e) => dragging.current && setFromX(e.clientX)}
                onPointerUp={() => (dragging.current = false)}
                onPointerCancel={() => (dragging.current = false)}
            />

            {/* Divider */}
            <div
                className="pointer-events-none absolute top-0 z-30 h-full w-0.5 bg-white"
                style={{ left: 'var(--pos)', transform: 'translateX(-50%)' }}
            />

            {/* Handle */}
            <div
                className="pointer-events-none absolute top-1/2 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl ring-2 ring-gray-900"
                style={{ left: 'var(--pos)', transform: 'translate(-50%, -50%)' }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                >
                    {/* Left arrow */}
                    <path d="M9 7 L5 12 L9 17" />
                    {/* Right arrow */}
                    <path d="M15 7 L19 12 L15 17" />
                </svg>
            </div>

            {/* Accessible range */}
            <input
                ref={rangeRef}
                type="range"
                min={0}
                max={100}
                defaultValue={initial}
                aria-label="Image comparison slider"
                onChange={(e) =>
                    rootRef.current?.style.setProperty('--pos', `${e.target.value}%`)
                }
                className="absolute inset-0 z-50 h-full w-full cursor-ew-resize opacity-0"
            />
        </section>
    )
}