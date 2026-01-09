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
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/80 transition hover:text-white outline-none ring-0 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {trigger}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-black p-2 text-sm text-white shadow-xl outline outline-1 outline-white/10"
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
