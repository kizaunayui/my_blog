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
  const railPosition = SONGS.length <= 1 ? 0 : (activeIndex / (SONGS.length - 1)) * 100

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
    <section className="relative w-full max-w-sm py-3 text-slate-900 dark:text-slate-100">
      <div className="absolute left-0 right-0 top-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
      <div className="absolute bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

      <div className="grid grid-cols-[1.7rem_1fr_1.7rem] items-center gap-2">
        <button
          type="button"
          onClick={() => switchSong(-1)}
          aria-label="Previous song"
          className="group/btn relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full text-slate-400 transition duration-300 hover:text-slate-950 dark:text-slate-500 dark:hover:text-white"
        >
          <span className="absolute inset-0 scale-0 rounded-full bg-slate-100 transition duration-300 group-hover/btn:scale-100 dark:bg-white/10" />
          <span className="relative -mt-px transition duration-300 group-hover/btn:-translate-x-0.5">‹</span>
        </button>

        <div className="relative min-w-0 px-1">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-heading text-[9px] font-bold uppercase tracking-[0.34em] text-slate-400 dark:text-slate-500">
              Listening
            </span>
            <span className="text-[9px] tabular-nums tracking-[0.22em] text-slate-400 dark:text-slate-500">
              {String(activeIndex + 1).padStart(2, '0')} / {String(SONGS.length).padStart(2, '0')}
            </span>
          </div>

          <div className="relative overflow-hidden py-1.5">
            <div className="scan-line pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-transparent via-slate-200/70 to-transparent dark:via-white/10" />

            <div key={activeIndex} className={`song-strip ${direction === 'next' ? 'from-next' : 'from-prev'}`}>
              <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-2">
                <span className="font-heading text-[10px] font-bold tabular-nums text-slate-400 dark:text-slate-500">
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>

                <p className="song-name min-w-0 truncate text-[15px] font-medium tracking-wide text-slate-950 dark:text-white" title={activeSong.title}>
                  {activeSong.title}
                </p>

                <time className="text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
                  {activeSong.duration}
                </time>
              </div>

              <div className="mt-1 flex items-center gap-2 pl-6">
                <span className="h-px w-5 bg-slate-300 dark:bg-slate-700" />
                <p className="truncate text-[11px] tracking-wide text-slate-400 dark:text-slate-500">
                  {activeSong.artist}
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-1 h-5">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[repeating-linear-gradient(90deg,rgba(148,163,184,0.75)_0_2px,transparent_2px_8px)] dark:bg-[repeating-linear-gradient(90deg,rgba(71,85,105,0.9)_0_2px,transparent_2px_8px)]" />

            <span
              className="rail-cursor absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-600 bg-white shadow-[0_0_0_4px_rgba(148,163,184,0.12)] transition-[left] duration-500 ease-out dark:border-slate-200 dark:bg-slate-950 dark:shadow-[0_0_0_4px_rgba(255,255,255,0.08)]"
              style={{ left: `${railPosition}%` }}
            />

            <div className="relative flex h-full items-center justify-between">
              {SONGS.map((song, index) => (
                <button
                  key={`${song.title}-${song.artist}-node`}
                  type="button"
                  onClick={() => selectSong(index)}
                  aria-label={`Show ${song.title}`}
                  className={`h-1.5 w-1.5 rounded-full transition duration-300 ${
                    index === activeIndex
                      ? 'scale-0 bg-slate-900 dark:bg-white'
                      : 'bg-slate-300 hover:scale-150 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => switchSong(1)}
          aria-label="Next song"
          className="group/btn relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full text-slate-400 transition duration-300 hover:text-slate-950 dark:text-slate-500 dark:hover:text-white"
        >
          <span className="absolute inset-0 scale-0 rounded-full bg-slate-100 transition duration-300 group-hover/btn:scale-100 dark:bg-white/10" />
          <span className="relative -mt-px transition duration-300 group-hover/btn:translate-x-0.5">›</span>
        </button>
      </div>

      <style jsx>{`
        .scan-line {
          animation: scan-line 4.8s ease-in-out infinite;
        }

        .song-strip {
          animation-duration: 430ms;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }

        .from-next {
          animation-name: from-next;
        }

        .from-prev {
          animation-name: from-prev;
        }

        .song-name {
          animation: text-breathe 3.8s ease-in-out infinite;
        }

        .rail-cursor::after {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 999px;
          border: 1px solid currentColor;
          opacity: 0.18;
          animation: cursor-pulse 1.8s ease-in-out infinite;
        }

        @keyframes scan-line {
          0%,
          58%,
          100% {
            transform: translateX(-120%);
            opacity: 0;
          }

          70% {
            opacity: 1;
          }

          88% {
            transform: translateX(720%);
            opacity: 0;
          }
        }

        @keyframes from-next {
          from {
            transform: translateY(10px) skewY(1.6deg);
            filter: blur(5px);
            opacity: 0;
          }

          to {
            transform: translateY(0) skewY(0);
            filter: blur(0);
            opacity: 1;
          }
        }

        @keyframes from-prev {
          from {
            transform: translateY(-10px) skewY(-1.6deg);
            filter: blur(5px);
            opacity: 0;
          }

          to {
            transform: translateY(0) skewY(0);
            filter: blur(0);
            opacity: 1;
          }
        }

        @keyframes text-breathe {
          0%,
          100% {
            letter-spacing: 0.025em;
          }

          50% {
            letter-spacing: 0.055em;
          }
        }

        @keyframes cursor-pulse {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.08;
          }

          50% {
            transform: scale(1.3);
            opacity: 0.22;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scan-line,
          .song-strip,
          .song-name,
          .rail-cursor::after {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
