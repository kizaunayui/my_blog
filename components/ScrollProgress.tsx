'use client'

import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false

    const update = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`
      }
      ticking = false
    }

    const handleScroll = () => {
      if (ticking) {
        return
      }
      ticking = true
      window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-500 via-sky-500 to-pink-500"
    />
  )
}
