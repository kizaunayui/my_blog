'use client'

import React, { useEffect, useRef } from 'react'

interface MagneticProps {
  children: React.ReactElement
  range?: number // Distance within which the magnetic effect triggers (in px)
  actionStrength?: number // Force of the pull (0 to 1)
}

export default function Magnetic({ children, range = 75, actionStrength = 0.35 }: MagneticProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const childRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const child = childRef.current
    if (!container || !child) return

    // Avoid running animations if users prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let isHovered = false

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY
      const distance = Math.hypot(distanceX, distanceY)

      if (distance < range) {
        isHovered = true
        // Apply magnetic translation relative to cursor distance
        const targetX = distanceX * actionStrength
        const targetY = distanceY * actionStrength

        child.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
        child.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      } else if (isHovered) {
        // Smoothly reset when mouse moves outside the active range
        handleMouseLeave()
      }
    }

    const handleMouseLeave = () => {
      isHovered = false
      child.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)'
      child.style.transform = 'translate3d(0px, 0px, 0px)'
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [range, actionStrength])

  // React.cloneElement is used to inject the ref to the child element
  return (
    <div ref={containerRef} className="inline-block">
      {React.cloneElement(children, {
        ref: childRef,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)}
    </div>
  )
}
