'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'
import { HeroParticleBackground } from './HeroParticleBackground'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-black to-black">
      <HeroParticleBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,107,0,0.18),_transparent_55%)]" />
      <motion.section 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 grid gap-12 px-6 py-16 text-left sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-16 lg:py-24"
      >
        <div>
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            AI Creative Studio
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            {SITE_CONFIG.name}
            <span className="block text-accent">Designs that feel effortless.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Deliver photobooths, avatars, and brand experiences with an AI-first platform that stays sleek,
            fast, and reliable across every screen size.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/contact">Book a demo</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:border-white/40 hover:bg-white/10">
              <Link href="#products">Explore products</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { label: 'Launch-ready', value: '2 weeks' },
              { label: 'Global uptime', value: '99.9%' },
              { label: 'Events powered', value: '350+' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -bottom-8 right-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-black/80 to-black p-8 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Live preview</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Immersive brand moments</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Every module is responsive, touch-ready, and tuned for dark environments to keep attention
              on your content.
            </p>
            <div className="mt-8 grid gap-4">
              {['Instant AI rendering', 'On-brand customization', 'Real-time analytics'].map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-sm text-white">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
