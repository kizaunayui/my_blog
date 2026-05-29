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
      className={`group relative rounded-3xl p-[1.5px] transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.01] ${
        isHovered
          ? 'bg-gradient-to-br from-cyan-500 via-sky-500 to-pink-500 shadow-[0_20px_50px_rgba(6,182,212,0.2)] dark:shadow-[0_20px_50px_rgba(6,182,212,0.15)]'
          : 'bg-white/15 dark:bg-white/5 border border-white/10 dark:border-white/5 shadow-md'
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div className={`relative overflow-hidden rounded-[22px] bg-white/95 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-500 h-full w-full ${className}`}>
        {/* Spotlight cursor glow */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 z-0"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(${glowSize}px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
          }}
        />
        {/* Shimmer sweep effect */}
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"
        />
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </div>
  )
}
