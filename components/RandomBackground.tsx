'use client'

import { useMemo } from 'react'

const backgroundPool = ['/static/images/ocean.jpeg', '/static/images/time-machine.jpg']

type RandomBackgroundProps = {
  basePath?: string
}

export default function RandomBackground({ basePath = '' }: RandomBackgroundProps) {
  const backgroundImage = useMemo(() => {
    const index = Math.floor(Math.random() * backgroundPool.length)
    const imagePath = backgroundPool[index] || backgroundPool[0]

    return `url("${basePath}${imagePath}")`
  }, [basePath])

  return (
    <div
      aria-hidden="true"
      className="site-fixed-bg hero-aurora-one pointer-events-none fixed inset-0"
      style={{ backgroundImage }}
    />
  )
}
