'use client'

import { useEffect, useRef, useState } from 'react'

type Song = {
  title: string
  artist: string
  duration: string
  src: string
}

const SONGS: Song[] = [
  {
    title: 'wind,glass,girls',
    artist: '牛尾憲輔',
    duration: '4:37',
    src: '/music/wind-glass-girls.mp3',
  },
  {
    title: 'Gravity',
    artist: 'TAEYEON',
    duration: '4:02',
    src: '/music/gravity.mp3',
  },
  {
    title: 'Mice on Venus',
    artist: 'C418',
    duration: '4:41',
    src: '/music/mice-on-venus.mp3',
  },
]

type SlideDirection = 'next' | 'prev'

function parseDuration(duration: string) {
  const [minutes, seconds] = duration.split(':').map(Number)

  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    return 0
  }

  return minutes * 60 + seconds
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'

  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<SlideDirection>('next')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [error, setError] = useState('')

  const activeSong = SONGS[activeIndex]
  const fallbackDuration = parseDuration(activeSong.duration)
  const realDuration = audioDuration || fallbackDuration
  const playProgress = realDuration > 0 ? Math.min(100, (currentTime / realDuration) * 100) : 0
  const railPosition = SONGS.length <= 1 ? 0 : (activeIndex / (SONGS.length - 1)) * 100

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    setCurrentTime(0)
    setAudioDuration(0)
    setError('')
    audio.load()

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false)
        setError('audio file unavailable')
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  const switchSong = (step: 1 | -1) => {
    setDirection(step === 1 ? 'next' : 'prev')
    setActiveIndex((index) => (index + step + SONGS.length) % SONGS.length)
  }

  const selectSong = (index: number) => {
    if (index === activeIndex) return
    setDirection(index > activeIndex ? 'next' : 'prev')
    setActiveIndex(index)
  }

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    setError('')

    if (audio.paused) {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch {
        setIsPlaying(false)
        setError('audio file unavailable')
      }
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  return (
    <section className="relative w-full max-w-sm px-1 py-3 text-slate-900 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-1 h-px bg-gradient-to-r from-transparent via-slate-400/70 to-transparent dark:via-slate-500/80" />
      <div className="pointer-events-none absolute inset-x-0 bottom-1 h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-slate-700/80" />

      <div className="grid grid-cols-[1.8rem_1fr_1.8rem] items-center gap-2">
        <button
          type="button"
          onClick={() => switchSong(-1)}
          aria-label="Previous song"
          className="group/btn relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full text-slate-500 transition duration-300 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
        >
          <span className="absolute inset-1 scale-0 rounded-full bg-slate-200/60 transition duration-300 group-hover/btn:scale-100 dark:bg-white/10" />
          <span className="relative -mt-px transition duration-300 group-hover/btn:-translate-x-0.5">‹</span>
        </button>

        <div className="relative min-w-0 px-1.5 py-1">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-heading text-[9px] font-bold uppercase tracking-[0.34em] text-slate-500 dark:text-slate-400">
              Listening
            </span>
            <span className="text-[9px] font-medium tabular-nums tracking-[0.22em] text-slate-500 dark:text-slate-400">
              {String(activeIndex + 1).padStart(2, '0')} / {String(SONGS.length).padStart(2, '0')}
            </span>
          </div>

          <div className="relative overflow-hidden py-1.5">
            <div className="scan-line pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-transparent via-slate-300/70 to-transparent dark:via-white/20" />

            <div key={activeIndex} className={`song-strip ${direction === 'next' ? 'from-next' : 'from-prev'}`}>
              <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause music' : 'Play music'}
                  className={`relative flex h-5 w-5 items-center justify-center rounded-full text-[9px] transition duration-300 ${
                    isPlaying
                      ? 'bg-slate-900 text-white shadow-[0_0_18px_rgba(15,23,42,0.22)] dark:bg-white dark:text-slate-950 dark:shadow-[0_0_18px_rgba(255,255,255,0.18)]'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                  }`}
                >
                  <span className={`play-pulse absolute inset-0 rounded-full ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
                  <span className="relative leading-none">{isPlaying ? 'Ⅱ' : '▶'}</span>
                </button>

                <p className="song-name min-w-0 truncate text-[15px] font-semibold tracking-wide text-slate-950 drop-shadow-[0_1px_10px_rgba(255,255,255,0.58)] dark:text-white dark:drop-shadow-[0_1px_10px_rgba(0,0,0,0.55)]" title={activeSong.title}>
                  {activeSong.title}
                </p>

                <time className="text-[11px] font-medium tabular-nums text-slate-600 dark:text-slate-300">
                  {activeSong.duration}
                </time>
              </div>

              <div className="mt-1 flex items-center gap-2 pl-7">
                <span className="h-px w-5 bg-slate-400/80 dark:bg-slate-600" />
                <p className="truncate text-[11px] font-medium tracking-wide text-slate-600 dark:text-slate-400">
                  {activeSong.artist}
                </p>
                <span className="ml-auto text-[9px] font-medium tabular-nums text-slate-500 dark:text-slate-500">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>
          </div>

          <div className="relative mt-1 h-5">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[repeating-linear-gradient(90deg,rgba(100,116,139,0.8)_0_2px,transparent_2px_8px)] dark:bg-[repeating-linear-gradient(90deg,rgba(148,163,184,0.7)_0_2px,transparent_2px_8px)]" />
            <div
              className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-slate-900 transition-[width] duration-300 dark:bg-white"
              style={{ width: `${playProgress}%` }}
            />

            <span
              className="rail-cursor absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-950 shadow-[0_0_0_4px_rgba(15,23,42,0.10)] transition-[left] duration-500 ease-out dark:bg-white dark:shadow-[0_0_0_4px_rgba(255,255,255,0.10)]"
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
                      ? 'scale-0 bg-slate-950 dark:bg-white'
                      : 'bg-slate-500 hover:scale-150 hover:bg-slate-950 dark:bg-slate-500 dark:hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="mt-1 text-[10px] font-medium text-rose-600 dark:text-rose-400">
              {error}. check files in /public/music.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => switchSong(1)}
          aria-label="Next song"
          className="group/btn relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full text-slate-500 transition duration-300 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
        >
          <span className="absolute inset-1 scale-0 rounded-full bg-slate-200/60 transition duration-300 group-hover/btn:scale-100 dark:bg-white/10" />
          <span className="relative -mt-px transition duration-300 group-hover/btn:translate-x-0.5">›</span>
        </button>
      </div>

      <audio
        ref={audioRef}
        src={activeSong.src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => switchSong(1)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setAudioDuration(event.currentTarget.duration)}
        onError={() => {
          setIsPlaying(false)
          setError('audio file unavailable')
        }}
      />

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

        .play-pulse {
          box-shadow: 0 0 0 0 rgba(15, 23, 42, 0.28);
          animation: play-pulse 1.8s ease-in-out infinite;
        }

        .rail-cursor::after {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 999px;
          border: 1px solid currentColor;
          opacity: 0.22;
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

        @keyframes play-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(15, 23, 42, 0.18);
          }

          50% {
            box-shadow: 0 0 0 6px rgba(15, 23, 42, 0);
          }
        }

        @keyframes cursor-pulse {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.1;
          }

          50% {
            transform: scale(1.3);
            opacity: 0.24;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scan-line,
          .song-strip,
          .song-name,
          .play-pulse,
          .rail-cursor::after {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
