'use client'

import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (ticking) {
        return
      }

      ticking = true
      window.requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight
        setProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0)
        ticking = false
      })
    }

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[100] h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-500 via-sky-500 to-pink-500 shadow-[0_0_18px_rgba(34,211,238,0.45)] transition-transform duration-150 ease-out"
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  )
}
