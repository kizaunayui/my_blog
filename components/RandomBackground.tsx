'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type BackgroundOption = {
  src: string
  position?: string
  mobilePosition?: string
  size?: string
  tone: 'dark' | 'balanced' | 'bright'
}

const backgroundPool: BackgroundOption[] = [
  {
    src: '/static/images/taeyeon_background.webp',
    position: 'center center',
    mobilePosition: 'center center',
    size: 'cover',
    tone: 'dark',
  },
  {
    src: '/static/images/taeyeon_gravity.webp',
    position: '72% center',
    mobilePosition: '66% center',
    size: 'cover',
    tone: 'dark',
  },
  {
    src: '/static/images/若叶睦background.webp',
    position: '72% center',
    mobilePosition: '66% center',
    size: 'cover',
    tone: 'balanced',
  },
  {
    src: '/static/images/若叶睦background 2.webp',
    position: '72% center',
    mobilePosition: '66% center',
    size: 'cover',
    tone: 'bright',
  },
  {
    src: '/static/images/anmi_ukai.webp',
    position: 'center center',
    mobilePosition: 'center center',
    size: 'cover',
    tone: 'balanced',
  },

  {
    src: '/static/images/ask_shaohua.webp',
    position: 'center center',
    mobilePosition: 'center center',
    size: 'cover',
    tone: 'bright',
  },
  {
    src: '/static/images/mint_hair_beach.webp',
    position: 'center center',
    mobilePosition: 'center center',
    size: 'cover',
    tone: 'bright',
  },
  {
    src: '/static/images/niko_m0nesy_yacht.webp',
    position: 'center center',
    mobilePosition: 'center center',
    size: 'cover',
    tone: 'dark',
  },
  {
    src: '/static/images/taeyeon_concert_purple.webp',
    position: 'center center',
    mobilePosition: 'center center',
    size: 'cover',
    tone: 'dark',
  },
]

const fixedBackgrounds: Record<string, BackgroundOption> = {
  '/blog/niko-2016-2026': {
    src: '/static/images/niko-cologne-major-2026.jpg',
    position: 'center center',
    mobilePosition: '62% center',
    size: 'cover',
    tone: 'dark',
  },
  '/articles/niko-2016-2026': {
    src: '/static/images/niko-cologne-major-2026.jpg',
    position: 'center center',
    mobilePosition: '62% center',
    size: 'cover',
    tone: 'dark',
  },
}

type RandomBackgroundProps = {
  basePath?: string
}

function toBackgroundImage(basePath: string, imagePath: string) {
  return `url("${basePath}${imagePath}")`
}

export default function RandomBackground({ basePath = '' }: RandomBackgroundProps) {
  const pathname = usePathname()
  const [background, setBackground] = useState(backgroundPool[0])

  useEffect(() => {
    const index = Math.floor(Math.random() * backgroundPool.length)
    setBackground(backgroundPool[index] || backgroundPool[0])
  }, [])

  const normalizedPathname = pathname.replace(/\/+$/, '') || '/'
  const activeBackground = fixedBackgrounds[normalizedPathname] || background

  return (
    <>
      <div
        aria-hidden="true"
        className="site-fixed-bg hero-aurora-one pointer-events-none fixed inset-0"
        data-background-tone={activeBackground.tone}
        style={
          {
            backgroundImage: toBackgroundImage(basePath, activeBackground.src),
            '--site-bg-position': activeBackground.position || '72% center',
            '--site-bg-mobile-position':
              activeBackground.mobilePosition || activeBackground.position || '66% center',
            '--site-bg-size': activeBackground.size || 'cover',
          } as React.CSSProperties
        }
      />
    </>
  )
}
