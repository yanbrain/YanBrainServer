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
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/15 bg-black/50 backdrop-blur-xl">
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
                    <div className="rounded-2xl border border-white/15 bg-black/60 p-2 shadow-2xl backdrop-blur-xl outline outline-1 outline-white/10">
                      <div className="rounded-xl border border-white/10 bg-black/50">
                        <ul className="w-64 space-y-2 p-2">
                          {PRODUCTS.map((product) => (
                            <li key={product.slug}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={`/${product.slug}`}
                                  className={cn(
                                    "group flex flex-col gap-1 rounded-lg border border-white/10 px-4 py-3 transition-colors hover:border-white/30 hover:bg-white/5",
                                    pathname === `/${product.slug}` && "border-white/40 bg-white/10"
                                  )}
                                >
                                  <div className={cn(
                                    "text-sm font-medium transition-colors",
                                    pathname === `/${product.slug}` ? "text-white" : "text-foreground group-hover:text-white"
                                  )}>
                                    {product.name}
                                  </div>
                                  <div className="text-xs leading-relaxed text-muted-foreground">
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
