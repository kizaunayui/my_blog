'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'

const SONGS = [
  { name: 'wind,glass,girls', artist: '牛尾憲輔', id: '554245323', mood: 'ambient' },
  { name: 'Gravity', artist: 'TAEYEON', id: '1399689812', mood: 'vocal' },
  { name: 'Mice on Venus', artist: 'C418', id: '4010207', mood: 'memory' },
]

function buildMetingUrl(id: string) {
  return `https://api.injahow.cn/meting/?type=url&id=${id}&server=netease`
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
  const [audioUrl, setAudioUrl] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const activeSong = SONGS[activeIndex]
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0

  useEffect(() => {
    let cancelled = false

    const resolveAudio = async () => {
      setIsLoading(true)
      setError('')
      setAudioUrl('')
      setCurrentTime(0)
      setDuration(0)

      try {
        const response = await fetch(buildMetingUrl(activeSong.id), { cache: 'no-store' })
        const text = (await response.text()).trim()

        if (!response.ok || !text || text.toLowerCase() === 'null') {
          throw new Error('audio url unavailable')
        }

        if (!cancelled) {
          setAudioUrl(text)
        }
      } catch (err) {
        if (!cancelled) {
          setError('source locked')
          setIsPlaying(false)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    resolveAudio()

    return () => {
      cancelled = true
    }
  }, [activeSong.id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return

    audio.load()

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false)
        setError('tap to play')
      })
    }
  }, [audioUrl, isPlaying])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio || !audioUrl || isLoading) return

    setError('')

    if (audio.paused) {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (err) {
        setIsPlaying(false)
        setError('source locked')
      }
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const switchSong = (direction: 1 | -1) => {
    setActiveIndex((index) => (index + direction + SONGS.length) % SONGS.length)
    setIsPlaying(true)
  }

  const seek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return

    const nextTime = (Number(event.target.value) / 100) * duration
    audio.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  return (
    <section className="group relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/[0.46] p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/30">
      <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-cyan-400/15 blur-2xl transition duration-500 group-hover:bg-cyan-400/25" />
      <div className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-fuchsia-400/10 blur-2xl transition duration-500 group-hover:bg-fuchsia-400/20" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.28)_0%,transparent_38%,rgba(6,182,212,0.08)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_42%,rgba(6,182,212,0.08)_100%)]" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-heading text-[9px] font-bold uppercase tracking-[0.32em] text-cyan-600 dark:text-cyan-300">
              Now Playing
            </p>
            <p className="mt-1 font-heading text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              {activeSong.mood} · {activeIndex + 1}/{SONGS.length}
            </p>
          </div>

          <div className="flex h-7 items-end gap-1 rounded-full border border-slate-200/70 bg-white/50 px-2.5 py-1.5 dark:border-white/10 dark:bg-white/5">
            {[10, 16, 9, 20, 13].map((height, index) => (
              <span
                key={index}
                className={`w-0.5 rounded-full bg-cyan-500/70 dark:bg-cyan-300/80 ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}
                style={{ height, animationDelay: `${index * 120}ms` }}
              />
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-[4.25rem_1fr] items-center gap-4">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!audioUrl || isLoading}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            className="relative flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border border-white/30 bg-[radial-gradient(circle_at_center,#f8fafc_0%,#e2e8f0_25%,#0f172a_26%,#020617_55%,#164e63_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18),0_18px_40px_rgba(15,23,42,0.18)] transition duration-300 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10"
          >
            <span className={`absolute inset-2 rounded-full border border-white/10 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            <span className="absolute h-7 w-7 rounded-full bg-white/90 shadow-inner dark:bg-slate-100" />
            <span className="relative z-10 text-[11px] font-bold text-slate-900">
              {isLoading ? '…' : isPlaying ? 'Ⅱ' : '▶'}
            </span>
          </button>

          <div className="min-w-0">
            <p className="truncate font-serif text-[1.1rem] font-light leading-tight tracking-wide text-slate-950 dark:text-white">
              {activeSong.name}
            </p>
            <p className="mt-1 truncate font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {activeSong.artist}
            </p>
            <div className="mt-3 flex gap-1.5">
              {SONGS.map((song, index) => (
                <button
                  type="button"
                  key={song.id}
                  onClick={() => {
                    setActiveIndex(index)
                    setIsPlaying(true)
                  }}
                  aria-label={`Play ${song.name}`}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex
                      ? 'w-7 bg-cyan-500 dark:bg-cyan-300'
                      : 'w-1.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="relative h-7">
            <div className="absolute left-0 right-0 top-3 h-px bg-slate-200 dark:bg-white/10" />
            <div
              className="absolute left-0 top-3 h-px bg-gradient-to-r from-cyan-500 via-sky-400 to-fuchsia-400"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={seek}
              className="absolute inset-0 h-7 w-full cursor-pointer opacity-0"
              aria-label="Music progress"
            />
          </div>

          <div className="flex justify-between font-heading text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-200/60 pt-3 dark:border-white/10">
          <button
            type="button"
            onClick={() => switchSong(-1)}
            className="rounded-full border border-transparent px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 transition hover:border-cyan-500/20 hover:bg-cyan-500/10 hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-300"
          >
            Prev
          </button>

          <span className="h-1 w-1 rounded-full bg-cyan-500/70 dark:bg-cyan-300/80" />

          <button
            type="button"
            onClick={() => switchSong(1)}
            className="rounded-full border border-transparent px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 transition hover:border-cyan-500/20 hover:bg-cyan-500/10 hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-300"
          >
            Next
          </button>
        </div>

        {error && (
          <p className="mt-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-[11px] leading-relaxed text-rose-600 dark:text-rose-300">
            {error}. add local audio for stable playback.
          </p>
        )}
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => switchSong(1)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onError={() => {
          if (audioUrl) {
            setError('source locked')
            setIsPlaying(false)
          }
        }}
      />
    </section>
  )
}
