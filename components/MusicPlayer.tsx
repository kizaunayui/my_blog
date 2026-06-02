'use client'

import { useEffect, useRef, useState } from 'react'

const SONGS = [
  { name: 'wind,glass,girls', artist: '牛尾憲輔', id: '554245323' },
  { name: 'Gravity', artist: 'TAEYEON', id: '1399689812' },
  { name: 'Mice on Venus', artist: 'C418', id: '4010207' },
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
          setError('音源暂时不可用')
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
        setError('浏览器阻止自动播放，请手动点击播放')
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
        setError('播放失败，音源可能受限制')
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

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return

    const nextTime = (Number(event.target.value) / 100) * duration
    audio.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/40 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-md dark:border-white/5 dark:bg-slate-950/20 sm:rounded-3xl sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">
          Listening
        </p>
        <span className="h-px flex-1 bg-slate-200/70 dark:bg-white/10" />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!audioUrl || isLoading}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 text-sm font-bold text-cyan-700 transition hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-40 dark:text-cyan-300"
        >
          {isLoading ? '…' : isPlaying ? 'Ⅱ' : '▶'}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-base font-light tracking-wide text-gray-900 dark:text-white">
            {activeSong.name}
          </p>
          <p className="mt-0.5 truncate font-heading text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            {activeSong.artist}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={seek}
          className="h-1 w-full cursor-pointer accent-cyan-500"
          aria-label="Music progress"
        />
        <div className="mt-1.5 flex justify-between font-heading text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => switchSong(-1)}
          className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 transition hover:bg-slate-100 hover:text-cyan-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-cyan-300"
        >
          Prev
        </button>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          {activeIndex + 1} / {SONGS.length}
        </span>
        <button
          type="button"
          onClick={() => switchSong(1)}
          className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 transition hover:bg-slate-100 hover:text-cyan-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-cyan-300"
        >
          Next
        </button>
      </div>

      {error && <p className="mt-3 text-[11px] leading-relaxed text-rose-500 dark:text-rose-300">{error}</p>}

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
            setError('播放失败，音源可能受限制')
            setIsPlaying(false)
          }
        }}
      />
    </section>
  )
}
