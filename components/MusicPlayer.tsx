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

type SlideDirection = 'next' | 'prev'

export default function MusicPlayer() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<SlideDirection>('next')

  const activeSong = SONGS[activeIndex]
  const progress = ((activeIndex + 1) / SONGS.length) * 100

  const switchSong = (step: 1 | -1) => {
    setDirection(step === 1 ? 'next' : 'prev')
    setActiveIndex((index) => (index + step + SONGS.length) % SONGS.length)
  }

  const selectSong = (index: number) => {
    if (index === activeIndex) return
    setDirection(index > activeIndex ? 'next' : 'prev')
    setActiveIndex(index)
  }

  return (
    <section className="group relative w-full max-w-sm overflow-hidden rounded-[1.4rem] border border-slate-200/70 bg-white/70 p-3 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-950/40 dark:hover:shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(14,165,233,0.12),transparent_34%),radial-gradient(circle_at_85%_78%,rgba(168,85,247,0.09),transparent_35%)]" />
      <div className="light-sweep pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="font-heading text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Listening
          </p>
          <p className="text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
            {String(activeIndex + 1).padStart(2, '0')} / {String(SONGS.length).padStart(2, '0')}
          </p>
        </div>

        <div className="grid grid-cols-[3.25rem_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/55 px-3 py-3 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="relative flex h-11 w-11 items-center justify-center" aria-hidden="true">
            <span className="pulse-ring absolute h-9 w-9 rounded-full border border-slate-300/80 dark:border-slate-600/80" />
            <span className="orbit absolute h-11 w-11 rounded-full">
              <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-slate-700 shadow-[0_0_14px_rgba(51,65,85,0.35)] dark:bg-slate-100 dark:shadow-[0_0_14px_rgba(255,255,255,0.28)]" />
            </span>
            <span className="orbit orbit-delay absolute h-8 w-8 rounded-full">
              <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-slate-400 dark:bg-slate-500" />
            </span>
            <div className="relative z-10 flex h-5 items-end gap-[3px] rounded-full bg-white/70 px-2 py-1.5 shadow-sm dark:bg-slate-950/70">
              <span className="signal-bar h-2 w-[2px] rounded-full bg-slate-700 dark:bg-slate-200" />
              <span className="signal-bar h-3.5 w-[2px] rounded-full bg-slate-700 dark:bg-slate-200" />
              <span className="signal-bar h-2.5 w-[2px] rounded-full bg-slate-700 dark:bg-slate-200" />
            </div>
          </div>

          <div className="min-w-0 overflow-hidden">
            <div key={activeIndex} className={`song-copy ${direction === 'next' ? 'slide-from-right' : 'slide-from-left'}`}>
              <p className="song-title truncate text-[15px] font-medium leading-5 tracking-wide text-slate-950 dark:text-white" title={activeSong.title}>
                {activeSong.title}
              </p>
              <p className="mt-1 truncate text-[11px] leading-3 text-slate-400 dark:text-slate-500">
                {activeSong.artist}
              </p>
            </div>
          </div>

          <time className="self-end pb-0.5 text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
            {activeSong.duration}
          </time>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => switchSong(-1)}
            aria-label="Previous song"
            className="h-7 w-7 rounded-full border border-slate-200/80 bg-white/70 text-sm leading-none text-slate-500 transition-all duration-300 hover:-translate-x-0.5 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:text-white"
          >
            ‹
          </button>

          <div className="relative h-7 flex-1 overflow-hidden rounded-full border border-slate-200/70 bg-white/50 px-2 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 bg-slate-200 dark:bg-slate-800" />
            <div
              className="absolute left-2 top-1/2 h-px -translate-y-1/2 bg-slate-700 transition-[width] duration-500 ease-out dark:bg-slate-200"
              style={{ width: `calc((100% - 1rem) * ${progress / 100})` }}
            />
            <div className="relative flex h-full items-center justify-between">
              {SONGS.map((song, index) => (
                <button
                  key={`${song.title}-dot`}
                  type="button"
                  onClick={() => selectSong(index)}
                  aria-label={`Show ${song.title}`}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'scale-125 bg-slate-900 shadow-[0_0_12px_rgba(15,23,42,0.3)] dark:bg-white dark:shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                      : 'bg-slate-300 hover:scale-110 hover:bg-slate-500 dark:bg-slate-700 dark:hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => switchSong(1)}
            aria-label="Next song"
            className="h-7 w-7 rounded-full border border-slate-200/80 bg-white/70 text-sm leading-none text-slate-500 transition-all duration-300 hover:translate-x-0.5 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:text-white"
          >
            ›
          </button>
        </div>
      </div>

      <style jsx>{`
        .light-sweep {
          animation: light-sweep 5.2s ease-in-out infinite;
        }

        .pulse-ring {
          animation: pulse-ring 2.4s ease-in-out infinite;
        }

        .orbit {
          animation: orbit 5.6s linear infinite;
        }

        .orbit-delay {
          animation-duration: 7.2s;
          animation-direction: reverse;
        }

        .signal-bar {
          animation: signal-breathe 980ms ease-in-out infinite;
          transform-origin: bottom;
        }

        .signal-bar:nth-child(1) {
          animation-delay: 0ms;
        }

        .signal-bar:nth-child(2) {
          animation-delay: 140ms;
        }

        .signal-bar:nth-child(3) {
          animation-delay: 280ms;
        }

        .song-copy {
          animation-duration: 380ms;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }

        .slide-from-right {
          animation-name: slide-from-right;
        }

        .slide-from-left {
          animation-name: slide-from-left;
        }

        .song-title {
          background: linear-gradient(90deg, currentColor, currentColor, rgba(100, 116, 139, 0.72));
          background-size: 210% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: title-flow 4s ease-in-out infinite;
        }

        @keyframes light-sweep {
          0%,
          62%,
          100% {
            transform: translateX(0) skewX(-18deg);
            opacity: 0;
          }

          76% {
            opacity: 1;
          }

          92% {
            transform: translateX(310%) skewX(-18deg);
            opacity: 0;
          }
        }

        @keyframes pulse-ring {
          0%,
          100% {
            transform: scale(0.88);
            opacity: 0.55;
          }

          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes orbit {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes signal-breathe {
          0%,
          100% {
            transform: scaleY(0.48);
            opacity: 0.55;
          }

          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes slide-from-right {
          from {
            transform: translateX(16px) scale(0.98);
            filter: blur(4px);
            opacity: 0;
          }

          to {
            transform: translateX(0) scale(1);
            filter: blur(0);
            opacity: 1;
          }
        }

        @keyframes slide-from-left {
          from {
            transform: translateX(-16px) scale(0.98);
            filter: blur(4px);
            opacity: 0;
          }

          to {
            transform: translateX(0) scale(1);
            filter: blur(0);
            opacity: 1;
          }
        }

        @keyframes title-flow {
          0%,
          100% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .light-sweep,
          .pulse-ring,
          .orbit,
          .signal-bar,
          .song-copy,
          .song-title {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
