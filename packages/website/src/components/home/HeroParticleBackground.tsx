'use client'

import { motion } from 'framer-motion'

// Configuration - easy to adjust
const CONFIG = {
  size: 2.5, // Size multiplier relative to container
  opacity: 0.25, // Overall opacity
  animationDuration: 2, // Animation duration in seconds
  colors: ['#359EEE', '#FFC43D', '#EF476F', '#03CEA4'], // Gradient colors
  ellipseCount: 30 // Number of ellipses
}

export function HeroParticleBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: CONFIG.opacity }}
        transition={{ duration: 1 }}
        style={{
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
          <motion.linearGradient
            id="aiGrad"
            x1="513.98"
            y1="290"
            x2="479.72"
            y2="320"
            gradientUnits="userSpaceOnUse"
            animate={{
              x1: [513.98, 213.98, 513.98],
              x2: [479.72, 179.72, 479.72]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset=".15" stopColor="#EF476F" />
            <stop offset=".4" stopColor="#359eee" />
            <stop offset=".6" stopColor="#03cea4" />
            <stop offset=".78" stopColor="#FFC43D" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </motion.linearGradient>
        </defs>

        {Array.from({ length: CONFIG.ellipseCount }).map((_, i) => {
          const delay = i / (CONFIG.ellipseCount - 1) * 0.5
          const opacity = 1 - i / CONFIG.ellipseCount
          const colorIndex = i / CONFIG.ellipseCount
          const color = CONFIG.colors[Math.floor(colorIndex * CONFIG.colors.length)]

          return (
            <motion.ellipse
              key={i}
              cx="400"
              cy="300"
              rx="80"
              ry="80"
              fill="none"
              stroke={color}
              strokeOpacity={opacity}
              initial={{
                rx: 80,
                ry: 80,
                rotate: 0
              }}
              animate={{
                rx: [80, 80 + i * 1.4, 80],
                ry: [80, 80 - i * 2.3, 80],
                rotate: [0, -180, 0]
              }}
              transition={{
                duration: CONFIG.animationDuration * 2,
                delay,
                repeat: Infinity,
                repeatDelay: 8,
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
            />
          )
        })}

        <motion.path
          id="ai"
          d="m417.17,323.85h-34.34c-3.69,0-6.67-2.99-6.67-6.67v-34.34c0-3.69,2.99-6.67,6.67-6.67h34.34c3.69,0,6.67,2.99,6.67,6.67v34.34c0,3.69-2.99,6.67-6.67,6.67Zm-5.25-12.92v-21.85c0-.55-.45-1-1-1h-21.85c-.55,0-1,.45-1,1v21.85c0,.55.45,1,1,1h21.85c.55,0,1-.45,1-1Zm23.08-16.29h-11.15m-47.69,0h-11.15m70,10.73h-11.15m-47.69,0h-11.15m40.37,29.63v-11.15m0-47.69v-11.15m-10.73,70v-11.15m0-47.69v-11.15"
          stroke="url(#aiGrad)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="2"
          fill="none"
          initial={{ scale: 1, opacity: 0 }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.svg>
    </div>
  )
}
