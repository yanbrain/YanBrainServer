'use client'

import { useEffect, useRef } from 'react'

// Configuration - easy to adjust
const CONFIG = {
  size: 2.5, // Size multiplier relative to container
  opacity: 0.25, // Overall opacity
  animationDuration: 2, // Animation duration in seconds
  animationInterval: 10, // Total cycle time in seconds (animation + pause)
  colors: ['#359EEE', '#FFC43D', '#EF476F', '#03CEA4'], // Gradient colors
  ellipseCount: 30 // Number of ellipses
}

const GSAP_LIBS = [
  'https://unpkg.co/gsap@3/dist/gsap.min.js',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/CustomEase3.min.js',
  'https://unpkg.com/gsap@3/dist/MotionPathPlugin.min.js'
]

export function HeroParticleBackground() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg || typeof window === 'undefined') return

    const loadScript = (src: string) => 
      new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })

    const initAnimation = async () => {
      try {
        await Promise.all(GSAP_LIBS.map(loadScript))
        await new Promise(resolve => setTimeout(resolve, 100))

        const { gsap, CustomEase } = window as any
        if (!gsap || !CustomEase) return

        gsap.config({ trialWarn: false })

        const ellipses = gsap.utils.toArray('.ell')
        const ease1 = CustomEase.create('custom', 'M0,0 C0.2,0 0.432,0.147 0.507,0.374 0.59,0.629 0.822,1 1,1')
        const ease2 = CustomEase.create('custom', 'M0,0 C0.266,0.412 0.297,0.582 0.453,0.775 0.53,0.87 0.78,1 1,1')
        const ease3 = CustomEase.create('custom', 'M0,0 C0.594,0.062 0.79,0.698 1,1')
        const colorInterpolate = gsap.utils.interpolate(CONFIG.colors)

        gsap.set(svg, { visibility: 'visible' })

        const animateEllipse = (ellipse: any, index: number) => {
          const tl = gsap.timeline({ defaults: { ease: ease1 } })
          
          gsap.set(ellipse, {
            opacity: 1 - index / ellipses.length,
            stroke: colorInterpolate(index / ellipses.length)
          })

          tl.to(ellipse, { attr: { ry: `-=${index * 2.3}`, rx: `+=${index * 1.4}` }, ease: ease3, duration: 1 })
            .to(ellipse, { attr: { ry: `+=${index * 2.3}`, rx: `-=${index * 1.4}` }, ease: ease2, duration: 1 })
            .to(ellipse, { duration: CONFIG.animationDuration, rotation: -180, transformOrigin: '50% 50%' }, 0)
            .timeScale(0.5)

          return tl
        }

        // Gradient animation
        gsap.to('#aiGrad', {
          duration: 4,
          attr: { x1: '-=300', x2: '-=300' },
          scale: 1.2,
          transformOrigin: '50% 50%',
          repeat: -1,
          ease: 'none'
        })

        // AI icon pulse
        gsap.to('#ai', {
          duration: 1,
          scale: 1.1,
          transformOrigin: '50% 50%',
          repeat: -1,
          yoyo: true,
          ease: ease1
        })

        // Main timeline: animate for CONFIG.animationDuration seconds, then pause
        const masterTimeline = gsap.timeline({
          repeat: -1,
          repeatDelay: CONFIG.animationInterval - CONFIG.animationDuration
        })

        ellipses.forEach((ellipse: any, index: number) => {
          const delay = index / (ellipses.length - 1) * 0.5
          masterTimeline.add(animateEllipse(ellipse, index + 1), delay)
        })

      } catch (error) {
        console.error('Error loading GSAP:', error)
      }
    }

    initAnimation()

    return () => {
      document.querySelectorAll('script[src*="gsap"]').forEach(script => script.remove())
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <svg
        ref={svgRef}
        style={{ 
          visibility: 'hidden', 
          opacity: CONFIG.opacity,
          width: `max(${CONFIG.size * 100}%, ${CONFIG.size * 50}vw)`,
          height: `max(${CONFIG.size * 100}%, ${CONFIG.size * 50}vh)`,
          maxWidth: 'none',
          maxHeight: 'none'
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="aiGrad" x1="513.98" y1="290" x2="479.72" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset=".15" stopColor="#EF476F" />
            <stop offset=".4" stopColor="#359eee" />
            <stop offset=".6" stopColor="#03cea4" />
            <stop offset=".78" stopColor="#FFC43D" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: CONFIG.ellipseCount }).map((_, i) => (
          <ellipse key={i} className="ell" cx="400" cy="300" rx="80" ry="80" />
        ))}
        
        <path
          id="ai"
          opacity="0"
          d="m417.17,323.85h-34.34c-3.69,0-6.67-2.99-6.67-6.67v-34.34c0-3.69,2.99-6.67,6.67-6.67h34.34c3.69,0,6.67,2.99,6.67,6.67v34.34c0,3.69-2.99,6.67-6.67,6.67Zm-5.25-12.92v-21.85c0-.55-.45-1-1-1h-21.85c-.55,0-1,.45-1,1v21.85c0,.55.45,1,1,1h21.85c.55,0,1-.45,1-1Zm23.08-16.29h-11.15m-47.69,0h-11.15m70,10.73h-11.15m-47.69,0h-11.15m40.37,29.63v-11.15m0-47.69v-11.15m-10.73,70v-11.15m0-47.69v-11.15"
          stroke="url(#aiGrad)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="2"
        />

        <style>{`.ell, #ai { fill: none; }`}</style>
      </svg>
    </div>
  )
}
