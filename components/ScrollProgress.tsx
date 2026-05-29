'use client'

import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setProgress((window.scrollY / totalHeight) * 100)
      }
    }

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-cyan-500 via-sky-500 to-pink-500 z-[100] transition-all duration-75 ease-out pointer-events-none"
      style={{ width: `${progress}%` }}
    />
  )
}
