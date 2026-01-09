'use client'

import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '../utils'

export interface AccountMenuItem {
    label: string
    href?: string
    onSelect?: () => void
}

interface AccountMenuProps {
    trigger: ReactNode
    items: AccountMenuItem[]
    summary?: string | null
    className?: string
}

export function AccountMenu({ trigger, items, summary, className }: AccountMenuProps) {
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const dropdownRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (!menuRef.current) return
            if (!menuRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setOpen(false)
            }
        }

        if (open) {
            window.addEventListener('click', handleClick)
            window.addEventListener('keydown', handleEscape)
        }

        return () => {
            window.removeEventListener('click', handleClick)
            window.removeEventListener('keydown', handleEscape)
        }
    }, [open])

    // Position dropdown relative to trigger button
    useLayoutEffect(() => {
        if (open && dropdownRef.current && menuRef.current) {
            const dropdown = dropdownRef.current
            const triggerRect = menuRef.current.getBoundingClientRect()

            // Position dropdown below the trigger with a small gap (12px)
            dropdown.style.top = `${triggerRect.bottom + 12}px`

            // Wait for next frame to get accurate dropdown measurements
            requestAnimationFrame(() => {
                const dropdownRect = dropdown.getBoundingClientRect()
                const margin = 16

                // Check if dropdown would overflow on the right
                const wouldOverflowRight = dropdownRect.right + margin > window.innerWidth

                if (wouldOverflowRight) {
                    // Align dropdown's right edge with trigger's right edge
                    dropdown.style.left = 'auto'
                    dropdown.style.right = `${window.innerWidth - triggerRect.right}px`
                } else {
                    // Align dropdown's right edge with trigger's right edge (default)
                    dropdown.style.left = 'auto'
                    dropdown.style.right = `${window.innerWidth - triggerRect.right}px`
                }
            })
        }
    }, [open])

    return (
        <div ref={menuRef} className={cn('relative', className)}>
            <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/80 transition hover:text-white outline-none ring-0 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
            >
                {trigger}
            </button>

            {open ? (
                <div
                    ref={dropdownRef}
                    role="menu"
                    className="glass-panel fixed w-[min(14rem,calc(100vw-2rem))] max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl p-2 text-sm text-white shadow-xl outline outline-1 outline-white/10 z-50"
                >
                    {summary ? (
                        <div className="px-3 py-2 text-center text-xs text-white/60">
                            {summary}
                        </div>
                    ) : null}
                    {items.map((item) => {
                        const content = (
                            <span className="inline-flex rounded-lg px-3 py-2 text-right text-white/80 transition hover:bg-white/5 hover:text-white">
                {item.label}
              </span>
                        )

                        if (item.href) {
                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="flex justify-end"
                                    onClick={() => setOpen(false)}
                                >
                                    {content}
                                </a>
                            )
                        }

                        return (
                            <button
                                key={item.label}
                                type="button"
                                className="flex w-full justify-end text-left"
                                onClick={() => {
                                    setOpen(false)
                                    item.onSelect?.()
                                }}
                            >
                                {content}
                            </button>
                        )
                    })}
                </div>
            ) : null}
        </div>
    )
}