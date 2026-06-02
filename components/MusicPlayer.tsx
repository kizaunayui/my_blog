'use client'

import { useEffect, useRef } from 'react'

const SONGS = [
  { name: 'wind,glass,girls', artist: '牛尾憲輔', id: '554245323' },
  { name: 'Gravity', artist: 'TAEYEON', id: '1399689812' },
  { name: 'Mice on Venus (金星鼠之梦)', artist: 'C418', id: '4010207' },
]

const PLAYER_STYLE_ID = 'reflexion-music-player-style'

const PLAYER_STYLES = `
  .reflexion-music-player .aplayer {
    margin: 0;
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.82);
    box-shadow: 0 18px 48px rgba(15, 23, 42, 0.12);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    overflow: hidden;
    font-family: inherit;
  }

  .dark .reflexion-music-player .aplayer {
    border-color: rgba(148, 163, 184, 0.16);
    background: rgba(15, 23, 42, 0.78);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
  }

  .reflexion-music-player .aplayer-body {
    min-height: 58px;
  }

  .reflexion-music-player .aplayer .aplayer-pic {
    width: 48px;
    height: 48px;
    margin: 8px;
    border-radius: 12px;
  }

  .reflexion-music-player .aplayer .aplayer-info {
    height: 64px;
    margin-left: 64px;
    padding: 8px 10px 6px 0;
    border-bottom: none;
  }

  .reflexion-music-player .aplayer .aplayer-title {
    max-width: 125px;
    color: rgb(30, 41, 59);
    font-size: 12px;
    font-weight: 500;
  }

  .dark .reflexion-music-player .aplayer .aplayer-title {
    color: rgb(226, 232, 240);
  }

  .reflexion-music-player .aplayer .aplayer-author {
    color: rgb(100, 116, 139);
    font-size: 11px;
  }

  .dark .reflexion-music-player .aplayer .aplayer-author {
    color: rgb(148, 163, 184);
  }

  .reflexion-music-player .aplayer .aplayer-controller {
    align-items: center;
  }

  .reflexion-music-player .aplayer .aplayer-bar-wrap {
    margin: 0 0 0 4px;
    padding: 4px 0;
  }

  .reflexion-music-player .aplayer .aplayer-bar {
    height: 2px;
    background: rgba(148, 163, 184, 0.32);
  }

  .reflexion-music-player .aplayer .aplayer-loaded,
  .reflexion-music-player .aplayer .aplayer-played {
    height: 2px;
  }

  .reflexion-music-player .aplayer .aplayer-thumb {
    width: 8px;
    height: 8px;
    margin-top: -3px;
  }

  .reflexion-music-player .aplayer .aplayer-time {
    bottom: 2px;
    color: rgb(100, 116, 139);
    font-size: 10px;
  }

  .dark .reflexion-music-player .aplayer .aplayer-time {
    color: rgb(148, 163, 184);
  }

  .reflexion-music-player .aplayer .aplayer-icon {
    opacity: 0.72;
  }

  .reflexion-music-player .aplayer .aplayer-icon:hover {
    opacity: 1;
  }

  .reflexion-music-player .aplayer .aplayer-list {
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .reflexion-music-player .aplayer .aplayer-list ol li {
    height: 28px;
    line-height: 28px;
    border-top: none;
    font-size: 11px;
  }

  .reflexion-music-player .aplayer .aplayer-list ol li.aplayer-list-light {
    background: rgba(148, 163, 184, 0.12);
  }

  @media (max-width: 768px) {
    .reflexion-music-player .aplayer .aplayer-title {
      max-width: 110px;
    }
  }
`

function buildMetingUrl(id: string) {
  return `https://api.injahow.cn/meting/?type=url&id=${id}&server=netease`
}

function ensurePlayerStyles() {
  if (document.getElementById(PLAYER_STYLE_ID)) return

  const style = document.createElement('style')
  style.id = PLAYER_STYLE_ID
  style.textContent = PLAYER_STYLES
  document.head.appendChild(style)
}

// Load APlayer from CDN — avoids bundling aplayer npm package entirely
function loadAPlayer(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).APlayer) {
      resolve((window as any).APlayer)
      return
    }

    // Load CSS
    if (!document.querySelector('link[href*="APlayer.min.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css'
      document.head.appendChild(link)
    }

    // Load JS
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js'
    script.onload = () => resolve((window as any).APlayer)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function MusicPlayer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let player: any
    let destroyed = false

    const init = async () => {
      ensurePlayerStyles()
      const APlayer = await loadAPlayer()

      if (destroyed || !containerRef.current) return

      player = new APlayer({
        container: containerRef.current,
        mini: false,
        fixed: false,
        autoplay: false,
        theme: '#64748b',
        loop: 'all',
        order: 'list',
        preload: 'none',
        volume: 0.55,
        mutex: true,
        listFolded: true,
        listMaxHeight: '96px',
        lrcType: 0,
        audio: SONGS.map((s) => ({
          name: s.name,
          artist: s.artist,
          url: buildMetingUrl(s.id),
          cover: 'https://picsum.photos/seed/reflexion-music/80/80',
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
    <aside
      aria-label="Music player"
      className="reflexion-music-player fixed right-3 top-1/2 z-50 w-[214px] -translate-y-1/2 sm:right-4 md:w-[230px]"
    >
      <div ref={containerRef} className="w-full" />
    </aside>
  )
}
