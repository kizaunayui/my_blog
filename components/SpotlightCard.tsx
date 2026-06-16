'use client'

import React, { useState } from 'react'

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  glowColor?: string // e.g. rgba(6, 182, 212, 0.15) for cyan
  glowSize?: number // in px
  variant?: 'glass' | 'transparent'
}

export default function SpotlightCard({
  children,
  className = '',
  glowColor = 'rgba(6, 182, 212, 0.15)',
  glowSize = 350,
  variant = 'glass',
  ...props
}: SpotlightCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Style class matching based on variant
  const isGlass = variant === 'glass'

  const outerBgClass = isGlass
    ? isHovered
      ? 'bg-gradient-to-br from-cyan-500 via-sky-500 to-pink-500 shadow-[0_20px_50px_rgba(6,182,212,0.2)] dark:shadow-[0_20px_50px_rgba(6,182,212,0.15)]'
      : 'bg-white/15 dark:bg-white/5 border border-white/10 dark:border-white/5 shadow-md'
    : isHovered
      ? 'bg-gradient-to-br from-cyan-500/50 via-sky-500/50 to-pink-500/50 shadow-[0_20px_50px_rgba(6,182,212,0.12)]'
      : 'bg-transparent border border-white/5 dark:border-white/5 shadow-none'

  const innerBgClass = isGlass
    ? 'bg-white/95 dark:bg-slate-950/90 backdrop-blur-md'
    : 'bg-transparent'

  const paddingClass = isHovered ? 'p-[1.5px]' : 'p-[1.5px]'

  return (
    <div
      className={`group relative rounded-3xl transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.01] ${outerBgClass} ${paddingClass}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div
        className={`relative h-full w-full overflow-hidden rounded-[22px] transition-colors duration-500 ${innerBgClass} ${className}`}
      >
        {/* Spotlight cursor glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(${glowSize}px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
          }}
        />
        {/* Shimmer sweep effect */}
        <div className="group-hover:animate-shimmer pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </div>
  )
}
