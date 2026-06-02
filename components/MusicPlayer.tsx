'use client'

import { useEffect, useRef } from 'react'

const SONGS = [
  { name: 'wind,glass,girls', artist: '牛尾憲輔', id: '554245323' },
  { name: 'Gravity', artist: 'TAEYEON', id: '1399689812' },
  { name: 'Mice on Venus (金星鼠之梦)', artist: 'C418', id: '4010207' },
]

function buildMetingUrl(id: string) {
  return `https://api.injahow.cn/meting/?type=url&id=${id}&server=netease`
}

export default function MusicPlayer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let player: any
    let destroyed = false

    const init = async () => {
      // Dynamic import to avoid SSR issues
      const { default: APlayer } = await import('aplayer')
      
      // Load APlayer CSS from CDN
      if (!document.querySelector('link[href*="APlayer"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css'
        document.head.appendChild(link)
      }

      if (destroyed || !containerRef.current) return

      player = new APlayer({
        container: containerRef.current,
        mini: false,
        fixed: false,
        autoplay: false,
        theme: '#e5618e',
        loop: 'all',
        order: 'list',
        preload: 'none',
        volume: 0.7,
        mutex: true,
        listFolded: false,
        listMaxHeight: '160px',
        lrcType: 0,
        audio: SONGS.map((s) => ({
          name: s.name,
          artist: s.artist,
          url: buildMetingUrl(s.id),
          cover: 'https://picsum.photos/seed/music/80/80',
        })),
      })
    }

    init()

    return () => {
      destroyed = true
      if (player) player.destroy()
    }
  }, [])

  return (
    <div className="fixed bottom-20 right-3 z-50 block w-72 max-w-[calc(100vw-24px)] lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2">
      <div className="rounded-xl bg-gradient-to-br from-pink-500/40 via-cyan-400/25 to-pink-500/40 p-[1px] shadow-[0_0_32px_rgba(229,97,142,0.12)]">
        <div
          ref={containerRef}
          className="w-72 rounded-xl bg-gray-950/95 backdrop-blur-sm"
        />
      </div>
    </div>
  )
}
