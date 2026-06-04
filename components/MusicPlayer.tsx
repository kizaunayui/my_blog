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

const VinylRecord = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/5 bg-slate-950/80 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
      {/* Vinyl Grooves SVG */}
      <svg
        className="vinyl-rotate h-full w-full"
        viewBox="0 0 100 100"
        style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
      >
        <circle cx="50" cy="50" r="48" fill="#111216" opacity="0.9" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />
        <circle
          cx="50"
          cy="50"
          r="22"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />

        {/* Center Label */}
        <circle cx="50" cy="50" r="14" fill="#0891b2" />
        <circle cx="50" cy="50" r="12" fill="#0f172a" />
        <circle cx="50" cy="50" r="4" fill="#334155" />

        {/* Vinyl sheen */}
        <path d="M 50,50 L 85,25 A 40,40 0 0,1 85,75 Z" fill="rgba(255,255,255,0.04)" />
        <path d="M 50,50 L 15,25 A 40,40 0 0,0 15,75 Z" fill="rgba(255,255,255,0.04)" />
      </svg>
      <div className="absolute h-1.5 w-1.5 rounded-full bg-slate-400/80 shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
    </div>
  )
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
        setError('音频文件暂不可用')
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  const switchSong = (step: 1 | -1) => {
    setDirection(step === 1 ? 'next' : 'prev')
    setActiveIndex((index) => (index + step + SONGS.length) % SONGS.length)
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
        setError('音频文件暂不可用')
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
    <section className="music-card relative w-full overflow-hidden rounded-2xl border border-cyan-500/25 bg-slate-950/20 p-4 text-white shadow-[0_0_30px_rgba(6,182,212,0.18),inset_0_0_16px_rgba(255,255,255,0.06)] backdrop-blur-md">
      {/* Background soft color glow */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan-500/8 blur-2xl transition-all duration-1000" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-pink-500/8 blur-2xl transition-all duration-1000" />

      {/* Main UI Layout */}
      <div className="relative z-10 flex flex-col gap-3.5">
        {/* Top Info Area */}
        <div className="flex items-center gap-3">
          {/* Vinyl Art */}
          <VinylRecord isPlaying={isPlaying} />

          {/* Song metadata */}
          <div className="min-w-0 flex-1">
            <p
              key={activeIndex}
              className={`song-name-container text-shadow-glow truncate text-[14px] font-semibold tracking-wide text-white ${direction === 'next' ? 'from-next' : 'from-prev'}`}
              title={activeSong.title}
            >
              {activeSong.title}
            </p>
            <p
              key={`artist-${activeIndex}`}
              className={`song-artist-container text-shadow-glow truncate text-[11px] font-medium text-white/50 ${direction === 'next' ? 'from-next' : 'from-prev'}`}
            >
              {activeSong.artist}
            </p>
          </div>

          {/* Playlist toggle button */}
          <button
            type="button"
            onClick={() => setShowPlaylist((prev) => !prev)}
            aria-label="Toggle playlist"
            className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition duration-300 ${
              showPlaylist
                ? 'bg-white/15 text-cyan-400'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="h-4 w-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
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

        {/* Progress seek bar */}
        <div className="flex items-center gap-2">
          <span className="text-shadow-glow min-w-[2.2rem] text-right text-[10px] font-medium text-white/40 tabular-nums">
            {formatTime(currentTime)}
          </span>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            onClick={handleProgressBarClick}
            className="group relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/10 transition hover:h-2"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-[width] duration-150"
              style={{ width: `${playProgress}%` }}
            />
            {/* Playhead thumb node */}
            <span
              className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border border-white bg-slate-900 opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100"
              style={{ left: `calc(${playProgress}% - 7px)` }}
            />
          </div>
          <span className="text-shadow-glow min-w-[2.2rem] text-left text-[10px] font-medium text-white/40 tabular-nums">
            {formatTime(realDuration)}
          </span>
        </div>

        {/* Playback control buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => switchSong(-1)}
            aria-label="Previous song"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-white/5 text-white/70 shadow-sm transition duration-300 hover:bg-white/10 hover:text-white active:scale-95"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
            >
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-950 shadow-[0_4px_12px_rgba(255,255,255,0.25)] transition duration-300 hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-5 w-5">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={() => switchSong(1)}
            aria-label="Next song"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-white/5 text-white/70 shadow-sm transition duration-300 hover:bg-white/10 hover:text-white active:scale-95"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
            >
              <path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Playlist Drawer Overlay */}
      <div
        className={`absolute inset-0 z-20 flex flex-col rounded-2xl bg-slate-950/92 p-4 backdrop-blur-xl transition-all duration-300 ${
          showPlaylist
            ? 'pointer-events-auto visible translate-y-0 opacity-100'
            : 'pointer-events-none invisible translate-y-4 opacity-0'
        }`}
      >
        <div className="mb-2.5 flex items-center justify-between border-b border-white/10 pb-2">
          <h4 className="text-shadow-glow text-xs font-semibold tracking-wider text-cyan-400 uppercase">
            播放列表
          </h4>
          <button
            type="button"
            onClick={() => setShowPlaylist(false)}
            className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            关闭
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
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition ${
                idx === activeIndex
                  ? 'border border-cyan-500/20 bg-cyan-500/15 font-medium text-cyan-400 shadow-sm'
                  : 'border border-transparent text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="truncate pr-4">
                <p className="text-shadow-glow truncate text-xs tracking-wide">{song.title}</p>
                <p className="text-shadow-glow mt-0.5 truncate text-[10px] text-white/35">
                  {song.artist}
                </p>
              </div>
              <span className="text-shadow-glow text-[10px] text-white/40 tabular-nums">
                {song.duration}
              </span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="absolute right-4 bottom-1 left-4 text-center text-[9px] font-medium text-rose-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
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

        .song-name-container,
        .song-artist-container {
          animation-duration: 450ms;
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
            transform: translateY(6px);
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
            transform: translateY(-6px);
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

        .text-shadow-glow {
          text-shadow:
            0 1px 4px rgba(0, 0, 0, 0.95),
            0 1px 2px rgba(0, 0, 0, 0.9);
        }
      `}</style>
    </section>
  )
}
