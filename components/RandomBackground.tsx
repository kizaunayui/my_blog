'use client'

import { useEffect, useState } from 'react'

const backgroundPool = ['/static/images/ocean.jpeg', '/static/images/time-machine.jpg']

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
