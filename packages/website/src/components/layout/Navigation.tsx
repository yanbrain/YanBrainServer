'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/NavigationMenu'
import { SITE_CONFIG } from '@/config/site'
import { PRODUCTS } from '@/config/products'
import { cn } from '@/lib/utils'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="glass-panel glass-panel--edge glass-panel--header fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white transition-colors hover:text-white/90">
            {SITE_CONFIG.name}
          </Link>

          <div className="flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-auto bg-transparent p-0 text-sm font-normal text-white/70 hover:bg-transparent hover:text-white focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-white">
                    Software
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="neon-menu glass-panel">
                      <span className="neon-menu-shine neon-menu-shine-top" />
                      <span className="neon-menu-shine neon-menu-shine-bottom" />
                      <span className="neon-menu-glow neon-menu-glow-top" />
                      <span className="neon-menu-glow neon-menu-glow-bottom" />
                      <span className="neon-menu-glow neon-menu-glow-bright neon-menu-glow-top" />
                      <span className="neon-menu-glow neon-menu-glow-bright neon-menu-glow-bottom" />
                      <div className="neon-menu-inner">
                        <ul className="w-64 space-y-2">
                          {PRODUCTS.map((product) => (
                            <li key={product.slug}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={`/${product.slug}`}
                                  className={cn(
                                    "neon-menu-item group flex w-full flex-col gap-1 px-4 py-3",
                                    pathname === `/${product.slug}` && "neon-menu-item-active"
                                  )}
                                >
                                  <div className={cn(
                                    "text-sm font-medium transition-colors",
                                    pathname === `/${product.slug}` ? "text-white" : "text-foreground group-hover:text-white"
                                  )}>
                                    {product.name}
                                  </div>
                              <div className="text-xs leading-relaxed text-white/60">
                                {product.tagline}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              href="/contact"
              className={cn(
                "text-sm transition-colors hover:text-white",
                pathname === '/contact' ? 'text-white' : 'text-white/70'
              )}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
