'use client'

import { motion } from 'framer-motion'
import { SITE_CONFIG } from '@/config/site'
import { HeroParticleBackground } from './HeroParticleBackground'

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      {/* Particle Background Animation */}
      <HeroParticleBackground />

      {/* Hero Content */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 py-20 text-center"
      >
        <h1 className="mb-4 text-6xl font-bold">{SITE_CONFIG.name}</h1>
        <p className="font-medium text-accent" style={{ fontSize: '1.5rem' }}>Intelligent Software Solutions</p>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground" style={{ fontSize: '1.8rem' }}>
          Say Hi to AI !
        </p>
      </motion.section>
    </div>
  )
}
