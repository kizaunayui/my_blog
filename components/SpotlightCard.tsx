'use client'

import React, { useState } from 'react'

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  glowColor?: string // e.g. rgba(6, 182, 212, 0.15) for cyan
  glowSize?: number // in px
}

export default function SpotlightCard({
  children,
  className = '',
  glowColor = 'rgba(6, 182, 212, 0.15)',
  glowSize = 350,
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

  return (
    <div
      className="group relative border-t border-[color:var(--hairline)] bg-transparent transition-all duration-500 ease-out hover:-translate-y-1 hover:border-cyan-200/30"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div
        className={`relative h-full w-full overflow-hidden bg-transparent transition-colors duration-500 ${className}`}
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
        <div className="group-hover:animate-shimmer pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </div>
  )
}
