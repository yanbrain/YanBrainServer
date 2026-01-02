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
} from '@/components/ui/navigation-menu'
import { SITE_CONFIG } from '@/config/site'
import { PRODUCTS } from '@/config/products'
import { cn } from '@/lib/utils'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-black backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold transition-colors hover:text-accent">
            {SITE_CONFIG.name}
          </Link>

          <div className="flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-auto bg-transparent p-0 text-sm font-normal text-muted-foreground hover:bg-transparent hover:text-foreground focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-foreground">
                    Software
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-64 space-y-1 p-3">
                      {PRODUCTS.map((product) => (
                        <li key={product.slug}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/${product.slug}`}
                              className={cn(
                                "group block rounded-lg border border-transparent px-4 py-3 transition-all hover:border-border hover:bg-secondary/50",
                                pathname === `/${product.slug}` && "border-accent/50 bg-accent/5"
                              )}
                            >
                              <div className={cn(
                                "mb-1 font-medium transition-colors",
                                pathname === `/${product.slug}` ? "text-accent" : "text-foreground group-hover:text-accent"
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
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              href="/contact"
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                pathname === '/contact' ? 'text-accent' : 'text-muted-foreground'
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
