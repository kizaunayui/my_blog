'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface TextScrambleProps {
  text: string
  className?: string
  duration?: number // duration of scramble in ms
  characterSet?: string // characters to use for scrambling
  triggerOn?: 'hover' | 'mount' | 'both'
}

const DEFAULT_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>'

export default function TextScramble({
  text,
  className = '',
  duration = 600,
  characterSet = DEFAULT_CHARS,
  triggerOn = 'hover',
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text)
  const isAnimating = useRef(false)
  const timerRef = useRef<number | null>(null)

  // Keep track of the latest text prop
  useEffect(() => {
    setDisplayText(text)
  }, [text])

  const scramble = useCallback(() => {
    if (isAnimating.current) {
      if (timerRef.current) cancelAnimationFrame(timerRef.current)
    }

    isAnimating.current = true
    const startTime = performance.now()
    const textLength = text.length

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      // Calculate how many characters are resolved
      const resolvedCount = Math.floor(progress * textLength)

      let result = ''
      for (let i = 0; i < textLength; i++) {
        if (i < resolvedCount) {
          result += text[i]
        } else if (text[i] === ' ') {
          result += ' '
        } else {
          // Scramble characters with random selections
          const randIndex = Math.floor(Math.random() * characterSet.length)
          result += characterSet[randIndex]
        }
      }

      setDisplayText(result)

      if (progress < 1) {
        timerRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayText(text)
        isAnimating.current = false
      }
    }

    timerRef.current = requestAnimationFrame(animate)
  }, [text, duration, characterSet])

  useEffect(() => {
    if (triggerOn === 'mount' || triggerOn === 'both') {
      scramble()
    }
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current)
    }
  }, [scramble, triggerOn])

  const handleMouseEnter = () => {
    if (triggerOn === 'hover' || triggerOn === 'both') {
      scramble()
    }
  }

  return (
    <span onMouseEnter={handleMouseEnter} className={className}>
      {displayText}
    </span>
  )
}
