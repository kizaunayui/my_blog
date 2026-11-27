export type Timer = {
  elapsed: number
  startedAt: number | null
}

export const storageKey = 'kieran-study-clock-v2'
export const initialTimer: Timer = { elapsed: 0, startedAt: null }

export function readTimer(): Timer {
  try {
    const store = window.localStorage
    const current = store.getItem(storageKey)
    const saved = current
      ? JSON.parse(current)
      : JSON.parse(store.getItem('kieran-study-room-v1') || '{}')?.timer
    if (!saved || !Number.isFinite(saved.elapsed) || saved.elapsed < 0) return initialTimer
    if (current === null && saved.mode !== 'stopwatch') return initialTimer
    const startedAt =
      Number.isFinite(saved.startedAt) && saved.startedAt > 0 ? saved.startedAt : null
    return { elapsed: saved.elapsed, startedAt }
  } catch {
    return initialTimer
  }
}

export function elapsedAt(timer: Timer, now: number) {
  return timer.elapsed + (timer.startedAt === null ? 0 : Math.max(0, now - timer.startedAt))
}

export function toggleTimer(timer: Timer, now: number): Timer {
  return timer.startedAt === null
    ? { ...timer, startedAt: now }
    : { elapsed: elapsedAt(timer, now), startedAt: null }
}

export function formatClock(elapsed: number) {
  const seconds = Math.floor(elapsed / 1000)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor(seconds / 60) % 60
  const parts = hours ? [hours, minutes, seconds % 60] : [minutes, seconds % 60]
  return parts.map((part) => String(part).padStart(2, '0')).join(':')
}
