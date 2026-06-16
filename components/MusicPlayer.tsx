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

interface MusicPlayerProps {
  onPlayStateChange?: (playing: boolean) => void
}

export default function MusicPlayer({ onPlayStateChange }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<SlideDirection>('next')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [error, setError] = useState('')

  const activeSong = SONGS[activeIndex]
  const fallbackDuration = parseDuration(activeSong.duration)
  const realDuration = audioDuration || fallbackDuration
  const playProgress = realDuration > 0 ? Math.min(100, (currentTime / realDuration) * 100) : 0

  useEffect(() => {
    onPlayStateChange?.(isPlaying)
  }, [isPlaying, onPlayStateChange])

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
        setError('音频暂不可用')
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  const switchSong = (step: 1 | -1) => {
    setDirection(step === 1 ? 'next' : 'prev')
    setActiveIndex((index) => (index + step + SONGS.length) % SONGS.length)
  }

  const handleEnded = () => {
    setIsPlaying(true)
    switchSong(1)
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
        setError('音频暂不可用')
      }
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || realDuration === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const newTime = (clickX / width) * realDuration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  return (
    <section className="relative flex w-56 flex-col items-center justify-center p-3 text-white select-none">
      {/* 100% Cardless Layout - Elements float directly over background */}

      {/* Top Metadata Area */}
      <div className="pointer-events-none z-10 mb-1.5 min-h-[2.4rem] w-full text-center">
        <p
          key={activeIndex}
          className={`song-title truncate text-[13px] font-semibold tracking-[0.18em] text-cyan-400 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${direction === 'next' ? 'from-next' : 'from-prev'}`}
        >
          {activeSong.title}
        </p>
        <p
          key={`artist-${activeIndex}`}
          className={`song-artist mt-0.5 truncate text-[10px] font-medium tracking-wider text-white/50 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] ${direction === 'next' ? 'from-next' : 'from-prev'}`}
        >
          {activeSong.artist}
        </p>
      </div>

      {/* Holographic Flowing Oscilloscope Waves */}
      <div className="relative z-10 mb-3.5 h-10 w-full overflow-hidden">
        <svg
          viewBox="0 0 400 40"
          className={`absolute inset-0 h-full w-[200%] transition-all duration-700 ${
            isPlaying ? 'opacity-90' : 'scale-y-[0.15] opacity-25'
          }`}
        >
          <defs>
            <linearGradient id="cyan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="pink-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Wave 1: Flowing Left */}
          <path
            className={`wave-left ${isPlaying ? 'animate-flow-left' : ''}`}
            d="M 0 20 Q 25 8, 50 20 T 100 20 T 150 20 T 200 20 Q 225 8, 250 20 T 300 20 T 350 20 T 400 20"
            fill="none"
            stroke="url(#cyan-grad)"
            strokeWidth="2.2"
          />

          {/* Wave 2: Flowing Right */}
          <path
            className={`wave-right ${isPlaying ? 'animate-flow-right' : ''}`}
            d="M 0 20 Q 20 12, 40 20 T 80 20 T 120 20 T 160 20 T 200 20 Q 220 12, 240 20 T 280 20 T 320 20 T 400 20"
            fill="none"
            stroke="url(#pink-grad)"
            strokeWidth="1.8"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Progress slider bar */}
      <div className="z-10 mb-3.5 flex w-full items-center gap-2">
        <span className="text-[9px] font-semibold text-white/40 tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {formatTime(currentTime)}
        </span>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          onClick={handleProgressBarClick}
          className="group relative h-1 flex-1 cursor-pointer rounded-full bg-white/10 transition-all hover:h-1.5"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 shadow-[0_0_8px_rgba(6,182,212,0.6)] transition-[width] duration-150"
            style={{ width: `${playProgress}%` }}
          />
          {/* Glowing Playhead dot */}
          <span
            className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-white bg-slate-900 opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100"
            style={{ left: `calc(${playProgress}% - 5px)` }}
          />
        </div>
        <span className="text-[9px] font-semibold text-white/40 tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {formatTime(realDuration)}
        </span>
      </div>

      {/* Sleek, Borderless Floating Controls */}
      <div className="z-10 flex w-full items-center justify-between px-2">
        <button
          type="button"
          onClick={() => switchSong(-1)}
          aria-label="Previous song"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition duration-300 hover:scale-105 hover:text-cyan-400 active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4.5 w-4.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
          >
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 shadow-lg transition duration-300 hover:scale-105 active:scale-95 ${
            isPlaying
              ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          {isPlaying ? (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4.5 w-4.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-0.5 h-4.5 w-4.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={() => switchSong(1)}
          aria-label="Next song"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition duration-300 hover:scale-105 hover:text-cyan-400 active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4.5 w-4.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
          >
            <path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => setShowPlaylist((prev) => !prev)}
          aria-label="Toggle playlist"
          className={`flex h-8 w-8 items-center justify-center rounded-full transition duration-300 ${
            showPlaylist ? 'text-cyan-400' : 'text-white/50 hover:text-white'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="h-4 w-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <circle cx="3" cy="6" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="3" cy="12" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="3" cy="18" r="1.2" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </div>

      {/* Floating Playlist Drawer (Appears right over the layout) */}
      <div
        className={`absolute inset-0 z-20 flex flex-col rounded-xl border border-cyan-500/25 bg-slate-950/94 p-3 shadow-[0_0_24px_rgba(6,182,212,0.18)] backdrop-blur-xl transition-all duration-300 ${
          showPlaylist
            ? 'pointer-events-auto visible translate-y-0 opacity-100'
            : 'pointer-events-none invisible translate-y-4 opacity-0'
        }`}
      >
        <div className="mb-2.5 flex items-center justify-between border-b border-white/10 pb-1.5">
          <h4 className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
            PLAYLIST
          </h4>
          <button
            type="button"
            onClick={() => setShowPlaylist(false)}
            className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-semibold text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            CLOSE
          </button>
        </div>
        <div className="no-scrollbar flex-1 space-y-1.5 overflow-y-auto pr-0.5">
          {SONGS.map((song, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx !== activeIndex) {
                  setDirection(idx > activeIndex ? 'next' : 'prev')
                  setActiveIndex(idx)
                }
                setShowPlaylist(false)
              }}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition ${
                idx === activeIndex
                  ? 'border border-cyan-500/20 bg-cyan-500/15 font-medium text-cyan-400'
                  : 'border border-transparent text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="truncate pr-4">
                <p className="truncate text-[11px] tracking-wide">{song.title}</p>
                <p className="mt-0.5 truncate text-[9px] tracking-wide text-white/35">
                  {song.artist}
                </p>
              </div>
              <span className="text-[9px] text-white/40 tabular-nums">{song.duration}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="absolute bottom-1 text-center text-[9px] font-bold tracking-wider text-rose-400/90">
          {error}
        </p>
      )}

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={activeSong.src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setAudioDuration(event.currentTarget.duration)}
        onError={() => {
          setIsPlaying(false)
          setError('音频加载失败')
        }}
      />

      <style jsx>{`
        .song-title,
        .song-artist {
          animation-duration: 480ms;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
        }

        .from-next {
          animation-name: from-next;
        }

        .from-prev {
          animation-name: from-prev;
        }

        /* Oscilloscope Looping Animations */
        .animate-flow-left {
          animation: flow-left 3.2s linear infinite;
        }

        .animate-flow-right {
          animation: flow-right 3.6s linear infinite;
        }

        @keyframes flow-left {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-200px, 0, 0);
          }
        }

        @keyframes flow-right {
          from {
            transform: translate3d(-200px, 0, 0);
          }
          to {
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes from-next {
          from {
            transform: translateY(8px);
            filter: blur(2px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            filter: blur(0);
            opacity: 1;
          }
        }

        @keyframes from-prev {
          from {
            transform: translateY(-8px);
            filter: blur(2px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            filter: blur(0);
            opacity: 1;
          }
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
