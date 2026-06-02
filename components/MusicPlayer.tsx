'use client'

import { useState } from 'react'

type Song = {
  title: string
  artist: string
  duration: string
}

const SONGS: Song[] = [
  {
    title: 'wind,glass,girls',
    artist: '牛尾憲輔',
    duration: '04:21',
  },
  {
    title: 'Gravity',
    artist: 'TAEYEON',
    duration: '03:59',
  },
  {
    title: 'Mice on Venus',
    artist: 'C418',
    duration: '04:41',
  },
  {
    title: 'Fine',
    artist: 'TAEYEON',
    duration: '03:29',
  },
  {
    title: 'Reflexion, allegretto, you',
    artist: '牛尾憲輔',
    duration: '02:36',
  },
]

export default function MusicPlayer() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 p-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.06),transparent_32%)]" />

      <div className="relative">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="font-heading text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Listening
          </h2>
          <span className="text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
            {SONGS.length} tracks
          </span>
        </div>

        <ul className="space-y-1">
          {SONGS.map((song, index) => {
            const isActive = index === activeIndex

            return (
              <li
                key={`${song.title}-${song.artist}`}
                onMouseEnter={() => setActiveIndex(index)}
                style={{ animationDelay: `${index * 70}ms` }}
                className={`music-row group flex items-center gap-2 rounded-xl px-2 py-2 opacity-0 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-100/80 hover:shadow-sm dark:hover:bg-white/10 ${
                  isActive ? 'bg-slate-100/70 dark:bg-white/10' : 'bg-transparent'
                }`}
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {isActive ? (
                    <div className="flex h-4 items-end gap-[2px]" aria-hidden="true">
                      <span className="wave-bar h-2 w-[2px] rounded-full bg-slate-700 dark:bg-slate-200" />
                      <span className="wave-bar h-3 w-[2px] rounded-full bg-slate-700 dark:bg-slate-200" />
                      <span className="wave-bar h-1.5 w-[2px] rounded-full bg-slate-700 dark:bg-slate-200" />
                      <span className="wave-bar h-3.5 w-[2px] rounded-full bg-slate-700 dark:bg-slate-200" />
                    </div>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 transition-colors duration-300 group-hover:bg-slate-500 dark:bg-slate-700 dark:group-hover:bg-slate-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-[13px] leading-4 transition-colors duration-300 ${
                      isActive
                        ? 'font-medium text-slate-950 dark:text-white'
                        : 'font-normal text-slate-700 group-hover:text-slate-950 dark:text-slate-300 dark:group-hover:text-white'
                    }`}
                    title={song.title}
                  >
                    {song.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] leading-3 text-slate-400 transition-colors duration-300 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400">
                    {song.artist}
                  </p>
                </div>

                <time className="shrink-0 text-[11px] tabular-nums text-slate-400 transition-colors duration-300 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300">
                  {song.duration}
                </time>
              </li>
            )
          })}
        </ul>
      </div>

      <style jsx>{`
        .music-row {
          animation: music-row-in 420ms ease-out forwards;
        }

        .wave-bar {
          animation: wave-breathe 900ms ease-in-out infinite;
          transform-origin: bottom;
        }

        .wave-bar:nth-child(1) {
          animation-delay: 0ms;
        }

        .wave-bar:nth-child(2) {
          animation-delay: 120ms;
        }

        .wave-bar:nth-child(3) {
          animation-delay: 240ms;
        }

        .wave-bar:nth-child(4) {
          animation-delay: 360ms;
        }

        @keyframes music-row-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wave-breathe {
          0%,
          100% {
            transform: scaleY(0.45);
            opacity: 0.55;
          }

          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  )
}
