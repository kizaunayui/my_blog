'use client'

import { useEffect, useRef } from 'react'

// ═══════════════════════════════════════════════
// 音乐播放器 — 侧边浮卡 (方案 C)
// 网易云歌曲 ID 获取：打开歌曲页面，URL 中 ?id= 后面的数字
// 示例：https://music.163.com/#/song?id=1863312152 → id = 1863312152
// ═══════════════════════════════════════════════

const SONGS: { name: string; artist: string; id: string }[] = [
  { name: 'wind,glass,girls', artist: '牛尾憲輔', id: '554245323' },
  { name: 'Gravity', artist: 'TAEYEON', id: '1399689812' },
  { name: 'Mice on Venus (金星鼠之梦)', artist: 'C418', id: '4010207' },
]

// 用 Meting API 把网易云 ID 转成外链
function buildMetingUrl(id: string) {
  return `https://api.injahow.cn/meting/?type=url&id=${id}&server=netease`
}

export default function MusicPlayer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let player: any
    let destroyed = false

    const init = async () => {
      const [{ default: APlayer }] = await Promise.all([
        import('aplayer'),
        // 在不支持 CSS module 的环境手动注入样式
        import('aplayer/dist/APlayer.min.css'),
      ])

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
          cover:
            'https://picsum.photos/seed/music/80/80', // 占位封面，Meting 会自动替换
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
      {/* 渐变发光边框：粉 → 青 → 粉 */}
      <div className="rounded-xl bg-gradient-to-br from-pink-500/40 via-cyan-400/25 to-pink-500/40 p-[1px] shadow-[0_0_32px_rgba(229,97,142,0.12)]">
        <div
          ref={containerRef}
          className="w-72 rounded-xl bg-gray-950/95 backdrop-blur-sm"
        />
      </div>

      {/* APlayer CSS 暗色覆盖（注入到全局） */}
      <style jsx global>{`
        /* 暗色卡片内部样式 */
        .aplayer {
          background: transparent !important;
          border-radius: 0.75rem;
          font-family: 'Inter', sans-serif;
        }
        .aplayer .aplayer-info .aplayer-music {
          color: #e2e8f0;
        }
        .aplayer .aplayer-info .aplayer-music .aplayer-author {
          color: #94a3b8;
        }
        .aplayer .aplayer-list ol li {
          border-top-color: rgba(255, 255, 255, 0.04);
        }
        .aplayer .aplayer-list ol li:hover {
          background: rgba(229, 97, 142, 0.08);
        }
        .aplayer .aplayer-list ol li.aplayer-list-light {
          background: rgba(229, 97, 142, 0.12);
        }
        .aplayer .aplayer-list ol li .aplayer-list-author {
          color: #94a3b8;
        }
        .aplayer .aplayer-list ol li .aplayer-list-index {
          color: #64748b;
        }
        .aplayer .aplayer-pic {
          border-radius: 0.5rem;
        }
        .aplayer .aplayer-icon {
          color: #e2e8f0;
        }
        .aplayer .aplayer-icon:hover {
          color: #e5618e;
        }
        .aplayer .aplayer-lrc {
          color: #e2e8f0;
        }
        .aplayer .aplayer-lrc p {
          color: #94a3b8;
        }
        .aplayer .aplayer-lrc p.aplayer-lrc-current {
          color: #e5618e;
        }
        .aplayer .aplayer-volume-wrap .aplayer-volume-bar {
          background: rgba(229, 97, 142, 0.3);
        }
        .aplayer .aplayer-volume-wrap .aplayer-volume-bar .aplayer-volume {
          background: #e5618e;
        }
        .aplayer .aplayer-time .aplayer-icon-back,
        .aplayer .aplayer-time .aplayer-icon-forward,
        .aplayer .aplayer-time .aplayer-icon-play,
        .aplayer .aplayer-time .aplayer-icon-pause {
          color: #e2e8f0;
        }
        .aplayer .aplayer-time .aplayer-icon:hover {
          color: #e5618e;
        }
        .aplayer .aplayer-time .aplayer-icon-mode {
          color: #64748b;
        }
        .aplayer .aplayer-time .aplayer-icon-menu {
          color: #64748b;
        }
        .aplayer .aplayer-time .aplayer-icon-menu:hover {
          color: #e5618e;
        }
        .aplayer .aplayer-time .played,
        .aplayer .aplayer-time .duration {
          color: #64748b;
        }
        /* 进度条 */
        .aplayer .aplayer-bar-wrap .aplayer-bar .aplayer-loaded {
          background: rgba(255, 255, 255, 0.1);
        }
        .aplayer .aplayer-bar-wrap .aplayer-bar .aplayer-played {
          background: #e5618e;
        }
        .aplayer .aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb {
          background: #f0a0c0;
          box-shadow: 0 0 6px rgba(229, 97, 142, 0.5);
        }
      `}</style>
    </div>
  )
}
