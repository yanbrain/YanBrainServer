'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
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

  return (
    <div ref={menuRef} className={cn('relative', className)}>
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:text-white"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {trigger}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-48 rounded-2xl border border-white/10 bg-black/90 p-2 text-sm text-white shadow-lg"
        >
          {summary ? (
            <div className="px-3 py-2 text-xs text-white/60">
              {summary}
            </div>
          ) : null}
          {items.map((item) => {
            const content = (
              <span className="block w-full rounded-lg px-3 py-2 text-left transition hover:bg-white/10">
                {item.label}
              </span>
            )

            if (item.href) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="block"
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
                className="block w-full text-left"
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
