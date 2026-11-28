'use client'

import { useEffect, useRef, useState } from 'react'
import { elapsedAt, formatClock, initialTimer, readTimer, storageKey, toggleTimer } from './timer'
import type { Timer } from './timer'
import styles from './study.module.css'

const backgrounds = [
  { file: 'taeyeon_gravity.webp', position: '73% center' },
  { file: 'liz_blue_bird.webp', position: '66% center' },
  { file: '若叶睦background.webp', position: '72% center' },
]
const rotationInterval = 60_000

export default function StudyRoom({ basePath }: { basePath: string }) {
  const [timer, setTimer] = useState(initialTimer)
  const [now, setNow] = useState(0)
  const [scene, setScene] = useState(0)
  const [canFullscreen, setCanFullscreen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [fullscreenNotice, setFullscreenNotice] = useState('')
  const room = useRef<HTMLElement>(null)
  const running = timer.startedAt !== null

  useEffect(() => {
    const target = room.current
    setCanFullscreen(document.fullscreenEnabled && typeof target?.requestFullscreen === 'function')
    function syncFullscreen() {
      setFullscreen(document.fullscreenElement === target)
    }
    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])

  useEffect(() => {
    function sync(event?: StorageEvent) {
      if (event && event.key !== storageKey && event.key !== null) return
      setTimer(readTimer())
      setNow(Date.now())
    }

    sync()
    window.addEventListener('storage', sync)
    const rotation = window.setInterval(() => {
      setScene((index) => (index + 1) % backgrounds.length)
    }, rotationInterval)

    return () => {
      window.removeEventListener('storage', sync)
      window.clearInterval(rotation)
    }
  }, [])

  useEffect(() => {
    if (!running) return
    const updateClock = () => setNow(Date.now())
    const tick = window.setInterval(updateClock, 250)
    document.addEventListener('visibilitychange', updateClock)
    return () => {
      window.clearInterval(tick)
      document.removeEventListener('visibilitychange', updateClock)
    }
  }, [running])

  function save(next: Timer, time: number) {
    setNow(time)
    setTimer(next)
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // The current session still works with storage disabled.
    }
  }

  async function toggleFullscreen() {
    const target = room.current
    if (!target) return
    setFullscreenNotice('')
    try {
      if (document.fullscreenElement === target) await document.exitFullscreen()
      else await target.requestFullscreen()
    } catch {
      setFullscreenNotice('浏览器未能切换全屏。')
    }
  }

  const elapsed = elapsedAt(timer, now)

  return (
    <section ref={room} className={styles.room} aria-labelledby="study-title">
      <div className={styles.backdrop} aria-hidden="true">
        {backgrounds.map(({ file, position }, index) => (
          <div
            key={file}
            className={styles.scene}
            data-active={scene === index}
            style={{
              backgroundImage: `url("${basePath}/static/images/${encodeURIComponent(file)}")`,
              backgroundPosition: position,
            }}
          />
        ))}
      </div>

      {canFullscreen && (
        <div className={styles.viewControls}>
          <button type="button" className={styles.fullscreen} onClick={toggleFullscreen}>
            {fullscreen ? '退出全屏' : '全屏'}
          </button>
          <span role="status" className={styles.fullscreenNotice}>
            {fullscreenNotice}
          </span>
        </div>
      )}

      <div className={styles.desk}>
        <h1 id="study-title">自习室</h1>
        <div className={styles.clock} data-long={elapsed >= 3_600_000} role="timer">
          {formatClock(elapsed)}
        </div>
        <div className={styles.actions}>
          <button
            className={styles.primary}
            type="button"
            onClick={() => {
              const time = Date.now()
              save(toggleTimer(timer, time), time)
            }}
          >
            {running ? '暂停' : elapsed > 0 ? '继续' : '开始学习'}
          </button>
          <button
            className={styles.reset}
            type="button"
            disabled={!running && elapsed === 0}
            onClick={() => save(initialTimer, Date.now())}
          >
            重置
          </button>
        </div>
      </div>
    </section>
  )
}
