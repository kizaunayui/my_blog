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

    // Avoid pointer-driven motion for reduced-motion and touch users.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (prefersReducedMotion || isTouchDevice) return

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY
      const distance = Math.hypot(distanceX, distanceY)

      if (distance < range) {
        const targetX = distanceX * actionStrength
        const targetY = distanceY * actionStrength

        child.style.transition = 'transform 0.15s cubic-bezier(0.19, 1, 0.22, 1)'
        child.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      }
    }

    const handlePointerLeave = () => {
      child.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)'
      child.style.transform = 'translate3d(0px, 0px, 0px)'
    }

    container.addEventListener('pointermove', handlePointerMove, { passive: true })
    container.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerleave', handlePointerLeave)
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
