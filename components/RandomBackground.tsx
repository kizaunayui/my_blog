'use client'

import { useEffect, useState } from 'react'

const backgroundPool = [
  '/static/images/taeyeon_background.png',
  '/static/images/taeyeon_gravity.png',
  '/static/images/若叶睦background.png',
  '/static/images/若叶睦background 2.png',
]

type RandomBackgroundProps = {
  basePath?: string
}

function toBackgroundImage(basePath: string, imagePath: string) {
  return `url("${basePath}${imagePath}")`
}

export default function RandomBackground({ basePath = '' }: RandomBackgroundProps) {
  const [imagePath, setImagePath] = useState(backgroundPool[0])

  useEffect(() => {
    const index = Math.floor(Math.random() * backgroundPool.length)
    setImagePath(backgroundPool[index] || backgroundPool[0])
  }, [])

  return (
    <div
      aria-hidden="true"
      className="site-fixed-bg hero-aurora-one pointer-events-none fixed inset-0"
      style={{ backgroundImage: toBackgroundImage(basePath, imagePath) }}
    />
  )
}
