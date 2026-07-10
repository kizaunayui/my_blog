'use client'

import { useEffect } from 'react'

export default function MouseTracker() {
  useEffect(() => {
    // Disable tracking if user prefers reduced motion or on mobile/touch devices
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches

    if (prefersReducedMotion || isTouchDevice) {
      return
    }

    const doc = document.documentElement
    let pendingUpdate = false
    let mouseX = 0
    let mouseY = 0
    let pointerX = 0
    let pointerY = 0

    const updateMouseCoords = () => {
      doc.style.setProperty('--mouse-x', `${mouseX}px`)
      doc.style.setProperty('--mouse-y', `${mouseY}px`)
      doc.style.setProperty('--pointer-x', `${(pointerX * 6).toFixed(2)}px`)
      doc.style.setProperty('--pointer-y', `${(pointerY * 4).toFixed(2)}px`)
      pendingUpdate = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2

      if (!pendingUpdate) {
        requestAnimationFrame(updateMouseCoords)
        pendingUpdate = true
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Set initial values to prevent sudden jumps
    doc.style.setProperty('--mouse-x', '50%')
    doc.style.setProperty('--mouse-y', '30%')
    doc.style.setProperty('--pointer-x', '0px')
    doc.style.setProperty('--pointer-y', '0px')

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      doc.style.removeProperty('--pointer-x')
      doc.style.removeProperty('--pointer-y')
    }
  }, [])

  return null
}
