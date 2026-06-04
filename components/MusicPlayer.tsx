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
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [error, setError] = useState('')

  const activeSong = SONGS[activeIndex]
  const fallbackDuration = parseDuration(activeSong.duration)
  const realDuration = audioDuration || fallbackDuration

  // Circle geometry for progress ring
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset =
    realDuration > 0 ? circumference - (currentTime / realDuration) * circumference : circumference

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

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation() // Prevent triggering progress circle click
    }
    const audio = audioRef.current
    if (!audio) return

    setError('')

    if (audio.paused) {
      try {
        audio
          .play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch(() => {
            setIsPlaying(false)
            setError('音频加载失败')
          })
      } catch {
        setIsPlaying(false)
        setError('音频暂不可用')
      }
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const audio = audioRef.current
    if (!audio || realDuration === 0) return

    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const clickX = e.clientX - centerX
    const clickY = e.clientY - centerY

    // Angle starting from 12 o'clock going clockwise
    let angle = Math.atan2(clickY, clickX) + Math.PI / 2
    if (angle < 0) {
      angle += 2 * Math.PI
    }

    const percentage = angle / (2 * Math.PI)
    const newTime = percentage * realDuration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  return (
    <section className="relative flex flex-col items-center justify-center bg-transparent p-6 select-none">
      {/* Soft ambient background aura */}
      <div
        className={`absolute h-40 w-40 rounded-full blur-3xl transition-all duration-1000 ${
          isPlaying ? 'scale-110 bg-cyan-500/15' : 'scale-95 bg-cyan-500/5'
        }`}
      />

      {/* Floating Holographic Meta Info */}
      <div className="pointer-events-none z-10 mb-4 min-h-[2.5rem] text-center select-none">
        <p
          key={activeIndex}
          className={`song-title text-sm font-semibold tracking-[0.2em] text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] ${direction === 'next' ? 'from-next' : 'from-prev'}`}
        >
          {activeSong.title}
        </p>
        <p
          key={`artist-${activeIndex}`}
          className={`song-artist mt-0.5 text-[10px] font-medium tracking-wider text-white/55 ${direction === 'next' ? 'from-next' : 'from-prev'}`}
        >
          {activeSong.artist}
        </p>
      </div>

      {/* Main Turntable System */}
      <div className="relative z-10 flex h-48 w-48 items-center justify-center">
        {/* Glowing Progress Orbit Circle */}
        {}
        <svg
          viewBox="0 0 160 160"
          className="absolute inset-0 h-full w-full cursor-pointer overflow-visible"
          onClick={handleProgressClick}
        >
          <defs>
            <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Progress Ring Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="3.5"
          />

          {/* Active Glowing Progress Ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="url(#orbit-grad)"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter={isPlaying ? 'url(#glow)' : ''}
            className="transition-all duration-150 ease-out"
          />

          {/* Active indicator dot on progress path */}
          {realDuration > 0 && (
            <circle
              cx={80 + radius * Math.sin((currentTime / realDuration) * 2 * Math.PI)}
              cy={80 - radius * Math.cos((currentTime / realDuration) * 2 * Math.PI)}
              r="3.5"
              fill="#ffffff"
              className="transition-all duration-150"
            />
          )}

          {/* Vinyl Record body */}
          <g
            className="vinyl-rotate cursor-pointer"
            onClick={togglePlay}
            style={{
              transformOrigin: '80px 80px',
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          >
            {/* Outer vinyl disc */}
            <circle
              cx="80"
              cy="80"
              r="56"
              fill="#121317"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
            />
            <circle
              cx="80"
              cy="80"
              r="52"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.5"
            />
            <circle
              cx="80"
              cy="80"
              r="46"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.5"
            />
            <circle
              cx="80"
              cy="80"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.5"
            />
            <circle
              cx="80"
              cy="80"
              r="34"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.5"
            />
            <circle
              cx="80"
              cy="80"
              r="28"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.5"
            />

            {/* Label disc */}
            <circle cx="80" cy="80" r="16" fill="#0891b2" opacity="0.88" />
            <circle cx="80" cy="80" r="14" fill="#0f172a" />

            {/* Central Spindle hole */}
            <circle cx="80" cy="80" r="3" fill="#334155" />

            {/* Play/Pause indicator symbol inside label */}
            {isPlaying ? (
              <path d="M78 77h1.5v6H78zM80.5 77h1.5v6h-1.5z" fill="white" opacity="0.85" />
            ) : (
              <path d="M78.5 76.5l4.5 3.5-4.5 3.5z" fill="white" opacity="0.85" />
            )}

            {/* Vinyl Sheen overlay */}
            <path d="M 80,80 L 115,55 A 40,40 0 0,1 115,105 Z" fill="rgba(255,255,255,0.02)" />
            <path d="M 80,80 L 45,55 A 40,40 0 0,0 45,105 Z" fill="rgba(255,255,255,0.02)" />
          </g>

          {/* Turntable Stylus / Tonearm arm base */}
          <g
            style={{
              transformOrigin: '136px 24px',
              transform: `rotate(${isPlaying ? 16 : 0}deg)`,
              transition: 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
            }}
          >
            {/* Tonearm base circle */}
            <circle
              cx="136"
              cy="24"
              r="8"
              fill="#1e293b"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            <circle cx="136" cy="24" r="3" fill="#94a3b8" />

            {/* The metal arm tube */}
            <path
              d="M 136,24 L 132,60 Q 130,86 112,86 L 102,86"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />

            {/* The cartridge / needle head shell */}
            <path d="M 102,84.5 L 94,86 L 102,87.5 Z" fill="#475569" />
          </g>
        </svg>

        {/* Orbital Prev Button */}
        <button
          type="button"
          onClick={() => switchSong(-1)}
          aria-label="Previous song"
          className="absolute top-1/2 left-[-26px] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/8 bg-slate-950/60 text-white/70 shadow-lg backdrop-blur-md transition duration-300 hover:bg-slate-900 hover:text-cyan-400 active:scale-90"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        {/* Orbital Next Button */}
        <button
          type="button"
          onClick={() => switchSong(1)}
          aria-label="Next song"
          className="absolute top-1/2 right-[-26px] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/8 bg-slate-950/60 text-white/70 shadow-lg backdrop-blur-md transition duration-300 hover:bg-slate-900 hover:text-cyan-400 active:scale-90"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z" />
          </svg>
        </button>

        {/* Orbital Playlist Button */}
        <button
          type="button"
          onClick={() => setShowPlaylist(true)}
          aria-label="View playlist"
          className="absolute bottom-[-22px] left-1/2 flex h-7.5 w-7.5 -translate-x-1/2 items-center justify-center rounded-full border border-white/8 bg-slate-950/60 text-white/70 shadow-lg backdrop-blur-md transition duration-300 hover:bg-slate-900 hover:text-cyan-400 active:scale-90"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="h-3.5 w-3.5"
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

      {/* Floating HUD Timer below */}
      <div className="mt-8 flex items-center justify-center gap-2.5 text-[10px] font-bold tracking-widest text-cyan-400/70 select-none">
        <span className="tabular-nums">{formatTime(currentTime)}</span>
        <span className="opacity-30">/</span>
        <span className="tabular-nums">{formatTime(realDuration)}</span>
      </div>

      {/* Futuristic Playlist drawer overlay (relative to parent container size) */}
      <div
        className={`absolute inset-2 z-20 flex flex-col rounded-2xl border border-cyan-500/20 bg-slate-950/94 p-4 shadow-[0_0_24px_rgba(6,182,212,0.15)] backdrop-blur-2xl transition-all duration-300 ${
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
                <p className="truncate text-xs tracking-wide">{song.title}</p>
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
        onEnded={() => switchSong(1)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setAudioDuration(event.currentTarget.duration)}
        onError={() => {
          setIsPlaying(false)
          setError('音频加载失败')
        }}
      />

      <style jsx>{`
        .vinyl-rotate {
          animation: spin 8s linear infinite;
        }

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

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
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

        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </section>
  )
}
