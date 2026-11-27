'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  advance,
  durations,
  elapsedAt,
  initialTimer,
  minute,
  reset,
  todayAt,
  toggle,
} from './timer'
import type { Mode, Timer } from './timer'
import styles from './study.module.css'

const storageKey = 'kieran-study-room-v1'
const pictureKey = 'kieran-study-picture-v1'
const dateFormat = new Intl.DateTimeFormat('zh-CN', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

const scenes = {
  gravity: { title: '泰妍 · Gravity', file: 'taeyeon_gravity.webp', position: '73% center' },
  bird: { title: '利兹与青鸟', file: 'liz_blue_bird.webp', position: '66% center' },
  mutsumi: { title: '若叶睦', file: '若叶睦background.webp', position: '72% center' },
} as const

type Scene = keyof typeof scenes | 'custom'
type RoomState = { timer: Timer; scene: Scene; task: string; sound: boolean }

const defaults: RoomState = { timer: initialTimer, scene: 'gravity', task: '', sound: false }
const modes: { id: Mode; name: string; start: string }[] = [
  { id: 'focus', name: '专注', start: '开始专注' },
  { id: 'stopwatch', name: '正计时', start: '开始计时' },
  { id: 'break', name: '休息', start: '开始休息' },
]

function readRoom(): RoomState {
  try {
    return { ...defaults, ...JSON.parse(window.localStorage.getItem(storageKey) || '{}') }
  } catch {
    return defaults
  }
}

function readPicture() {
  try {
    return window.localStorage.getItem(pictureKey) || ''
  } catch {
    return ''
  }
}

function formatClock(seconds: number, showHours: boolean) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  const parts = showHours ? [h, m % 60, s] : [m, s]
  return parts.map((part) => String(part).padStart(2, '0')).join(':')
}

function chime(context: AudioContext | null) {
  if (context?.state !== 'running') return
  const start = context.currentTime
  for (const [index, frequency] of [523.25, 659.25].entries()) {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const at = start + index * 0.17
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.001, at)
    gain.gain.exponentialRampToValueAtTime(0.12, at + 0.045)
    gain.gain.exponentialRampToValueAtTime(0.001, at + 0.5)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(at)
    oscillator.stop(at + 0.51)
  }
}

export default function StudyRoom({ basePath }: { basePath: string }) {
  const [room, setRoom] = useState(defaults)
  const [picture, setPicture] = useState('')
  const [now, setNow] = useState(0)
  const [notice, setNotice] = useState('')
  const [canFullscreen, setCanFullscreen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const current = useRef(defaults)
  const audio = useRef<AudioContext | null>(null)
  const stage = useRef<HTMLElement>(null)

  const saveRoom = useCallback((next: RoomState) => {
    current.current = next
    setRoom(next)
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // The timer remains usable when browser storage is unavailable.
    }
  }, [])

  const tick = useCallback(() => {
    const time = Date.now()
    const latest = current.current
    const next = advance(latest.timer, time)
    setNow(time)
    if (next !== latest.timer) {
      saveRoom({ ...latest, timer: next })
      if (latest.sound) chime(audio.current)
    }
  }, [saveRoom])

  useEffect(() => {
    function sync(event?: StorageEvent) {
      if (!event || event.key === storageKey || event.key === null) {
        current.current = readRoom()
        setRoom(current.current)
        tick()
      }
      if (!event || event.key === pictureKey || event.key === null) setPicture(readPicture())
    }
    function syncFullscreen() {
      setFullscreen(document.fullscreenElement === stage.current)
    }
    sync()
    setCanFullscreen(document.fullscreenEnabled)
    window.addEventListener('storage', sync)
    document.addEventListener('fullscreenchange', syncFullscreen)
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.removeEventListener('storage', sync)
      document.removeEventListener('fullscreenchange', syncFullscreen)
      document.removeEventListener('visibilitychange', tick)
      if (audio.current) void audio.current.close()
      audio.current = null
    }
  }, [tick])

  const running = room.timer.startedAt !== null
  useEffect(() => {
    const id = window.setInterval(tick, running ? 250 : 15_000)
    return () => window.clearInterval(id)
  }, [running, tick])

  function unlockSound() {
    if (!window.AudioContext) return
    try {
      audio.current ??= new AudioContext()
      void audio.current.resume().catch(() => {})
    } catch {
      // Browser audio support is optional.
    }
  }

  const changeTimer = useCallback(
    (change: (timer: Timer, time: number) => Timer) => {
      const time = Date.now()
      const latest = current.current
      saveRoom({ ...latest, timer: change(latest.timer, time) })
      setNow(time)
    },
    [saveRoom]
  )

  const toggleTimer = useCallback(() => {
    if (current.current.sound) unlockSound()
    changeTimer(toggle)
  }, [changeTimer])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (
        event.code !== 'Space' ||
        event.defaultPrevented ||
        event.repeat ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        (event.target instanceof Element &&
          event.target.closest('input, button, textarea, select, a, [contenteditable]'))
      )
        return
      event.preventDefault()
      toggleTimer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleTimer])

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await stage.current?.requestFullscreen()
    } catch {
      setNotice('浏览器暂时无法进入全屏。')
    }
  }

  async function choosePicture(file?: File) {
    if (!file) return
    setNotice('')
    const source = URL.createObjectURL(file)
    try {
      const image = new Image()
      image.src = source
      await image.decode()
      const canvas = document.createElement('canvas')
      const ratio = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight))
      canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio))
      canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio))
      const drawing = canvas.getContext('2d')
      if (!drawing) throw new Error('Canvas unavailable')
      drawing.drawImage(image, 0, 0, canvas.width, canvas.height)
      const result = canvas.toDataURL('image/jpeg', 0.82)
      setPicture(result)
      try {
        window.localStorage.setItem(pictureKey, result)
      } catch {
        setNotice('当前图片可用，浏览器无法保存到下次。')
      }
      saveRoom({ ...current.current, scene: 'custom' })
    } catch {
      setNotice('图片无法打开，请试试 JPG、PNG 或 WebP。')
    } finally {
      URL.revokeObjectURL(source)
    }
  }

  const { timer, task, sound } = room
  const activeScene =
    room.scene === 'custom' && picture ? 'custom' : room.scene in scenes ? room.scene : 'gravity'
  const background = activeScene === 'custom' ? null : scenes[activeScene]
  const path = background
    ? `${basePath}/static/images/${encodeURIComponent(background.file)}`
    : picture
  const backgroundStyle = {
    backgroundImage: `url("${path}")`,
    '--scene-position': background?.position ?? 'center',
  } as CSSProperties
  const elapsed = elapsedAt(timer, now)
  const limit = timer.minutes * minute
  const stopwatch = timer.mode === 'stopwatch'
  const seconds = stopwatch ? Math.floor(elapsed / 1000) : Math.ceil((limit - elapsed) / 1000)
  const showHours = stopwatch && seconds >= 3600
  const clock = formatClock(seconds, showHours)
  const today = todayAt(timer, now)
  const activeMode = modes.find((mode) => mode.id === timer.mode) ?? modes[0]
  const startLabel = running
    ? '暂停'
    : timer.finished
      ? '再来一轮'
      : elapsed > 0
        ? '继续'
        : activeMode.start
  const timerNotice = timer.finished
    ? timer.mode === 'break'
      ? '休息结束'
      : '这一轮专注已完成'
    : ''

  return (
    <section ref={stage} className={styles.room} aria-labelledby="study-title">
      <div className={styles.backdrop} aria-hidden="true" style={backgroundStyle} />
      <div className={styles.content}>
        <div className={styles.desk}>
          <div className={styles.titleBlock}>
            <p className={styles.date}>{now ? dateFormat.format(now) : '\u00a0'}</p>
            <h1 id="study-title">自习室</h1>
          </div>

          <div className={styles.modes} role="group" aria-label="计时模式">
            {modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                aria-pressed={timer.mode === mode.id}
                onClick={() => {
                  if (timer.mode !== mode.id) {
                    changeTimer((value, time) =>
                      reset(value, time, mode.id, mode.id === 'break' ? 5 : 25)
                    )
                  }
                }}
              >
                {mode.name}
              </button>
            ))}
          </div>

          <div className={styles.clock} data-long={showHours} role="timer">
            {clock}
          </div>
          <div className={styles.progress} aria-hidden="true">
            {!stopwatch && <span style={{ transform: `scaleX(${elapsed / limit})` }} />}
          </div>
          <div className={styles.durations} role="group" aria-label="计时时长">
            {!stopwatch &&
              durations[timer.mode].map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  aria-pressed={timer.minutes === minutes}
                  onClick={() => {
                    if (timer.minutes !== minutes) {
                      changeTimer((value, time) => reset(value, time, value.mode, minutes))
                    }
                  }}
                >
                  {minutes} 分钟
                </button>
              ))}
          </div>
          <div className={styles.actions}>
            <button className={styles.primary} type="button" onClick={toggleTimer}>
              {startLabel}
            </button>
            <button type="button" onClick={() => changeTimer(reset)}>
              重置
            </button>
            <span className={styles.keyboard}>
              <kbd>空格</kbd> 开始 / 暂停
            </span>
          </div>
          <p className={styles.timerNotice} role="status">
            {timerNotice}
          </p>

          <div className={styles.log}>
            <label className={styles.task}>
              这轮学什么？
              <input
                value={task}
                maxLength={80}
                placeholder="例如，复习三相逆变"
                onChange={(event) => saveRoom({ ...current.current, task: event.target.value })}
              />
            </label>
            <dl className={styles.stats}>
              <div>
                <dt>今日专注</dt>
                <dd>
                  {Math.floor(today.elapsed / minute)} <small>分钟</small>
                </dd>
              </div>
              <div>
                <dt>完成轮数</dt>
                <dd>
                  {today.rounds} <small>轮</small>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className={styles.settings}>
          <label className={styles.scene}>
            <span>背景</span>
            <select
              value={activeScene}
              onChange={(event) =>
                saveRoom({ ...current.current, scene: event.target.value as Scene })
              }
            >
              {Object.entries(scenes).map(([id, scene]) => (
                <option key={id} value={id}>
                  {scene.title}
                </option>
              ))}
              {picture && <option value="custom">我的图片</option>}
            </select>
          </label>
          <div className={styles.utilities}>
            <label className={styles.upload}>
              自定义图片
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  event.target.value = ''
                  void choosePicture(file)
                }}
              />
            </label>
            <button
              type="button"
              aria-pressed={sound}
              onClick={() => {
                if (!sound) unlockSound()
                saveRoom({ ...current.current, sound: !sound })
              }}
            >
              提示音<span aria-hidden="true"> · {sound ? '开' : '关'}</span>
            </button>
            {canFullscreen && (
              <button type="button" onClick={toggleFullscreen}>
                {fullscreen ? '退出全屏' : '全屏'}
              </button>
            )}
          </div>
          {notice && (
            <p className={styles.notice} role="status">
              {notice}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
