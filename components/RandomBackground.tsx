'use client'

import { useEffect, useState } from 'react'

type BackgroundOption = {
  src: string
  position?: string
  mobilePosition?: string
  size?: string
}

const backgroundPool: BackgroundOption[] = [
  {
    src: '/static/images/taeyeon_background.webp',
    position: 'center center',
    mobilePosition: 'center center',
    size: 'cover',
  },
  {
    src: '/static/images/taeyeon_gravity.webp',
    position: '72% center',
    mobilePosition: '66% center',
    size: 'cover',
  },
  {
    src: '/static/images/若叶睦background.webp',
    position: '72% center',
    mobilePosition: '66% center',
    size: 'cover',
  },
  {
    src: '/static/images/若叶睦background 2.webp',
    position: '72% center',
    mobilePosition: '66% center',
    size: 'cover',
  },
  {
    src: '/static/images/anmi_ukai.webp',
    position: 'center center',
    mobilePosition: 'center center',
    size: 'cover',
  },

  {
    src: '/static/images/ask_shaohua.webp',
    position: 'center center',
    mobilePosition: 'center center',
    size: 'cover',
  },
  {
    src: '/static/images/mint_hair_beach.webp',
    position: 'center center',
    mobilePosition: 'center center',
    size: 'cover',
  },
  {
    src: '/static/images/niko_m0nesy_yacht.webp',
    position: 'center center',
    mobilePosition: 'center center',
    size: 'cover',
  },
  {
    src: '/static/images/taeyeon_concert_purple.webp',
    position: 'center center',
    mobilePosition: 'center center',
    size: 'cover',
  },
]

type RandomBackgroundProps = {
  basePath?: string
}

function toBackgroundImage(basePath: string, imagePath: string) {
  return `url("${basePath}${imagePath}")`
}

export default function RandomBackground({ basePath = '' }: RandomBackgroundProps) {
  const [background, setBackground] = useState(backgroundPool[0])

  useEffect(() => {
    const index = Math.floor(Math.random() * backgroundPool.length)
    setBackground(backgroundPool[index] || backgroundPool[0])
  }, [])

  return (
    <>
      <div
        aria-hidden="true"
        className="site-fixed-bg hero-aurora-one pointer-events-none fixed inset-0"
        style={
          {
            backgroundImage: toBackgroundImage(basePath, background.src),
            '--site-bg-position': background.position || '72% center',
            '--site-bg-mobile-position':
              background.mobilePosition || background.position || '66% center',
            '--site-bg-size': background.size || 'cover',
          } as React.CSSProperties
        }
      />

    </>
  )
}
