export const minute = 60_000
export const durations = { focus: [25, 45, 60], break: [5, 10, 15] }

export type Mode = 'focus' | 'stopwatch' | 'break'

type Day = { elapsed: number; rounds: number }

export type Timer = {
  mode: Mode
  minutes: number
  elapsed: number
  startedAt: number | null
  finished: boolean
  days: Record<string, Day>
}

export const initialTimer: Timer = {
  mode: 'focus',
  minutes: 25,
  elapsed: 0,
  startedAt: null,
  finished: false,
  days: {},
}

function dayKey(time: number) {
  const date = new Date(time)
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
}

function startOfDay(time: number) {
  return new Date(time).setHours(0, 0, 0, 0)
}

function segmentEnd(timer: Timer, now: number) {
  if (timer.startedAt === null) return now
  const limit =
    timer.mode === 'stopwatch' ? Infinity : timer.startedAt + timer.minutes * minute - timer.elapsed
  return Math.max(timer.startedAt, Math.min(now, limit))
}

export function elapsedAt(timer: Timer, now: number) {
  return timer.elapsed + (timer.startedAt === null ? 0 : segmentEnd(timer, now) - timer.startedAt)
}

export function todayAt(timer: Timer, now: number): Day {
  const stored = timer.days[dayKey(now)] ?? { elapsed: 0, rounds: 0 }
  if (timer.startedAt === null || timer.mode === 'break') return stored
  const live = Math.max(0, segmentEnd(timer, now) - Math.max(timer.startedAt, startOfDay(now)))
  return { ...stored, elapsed: stored.elapsed + live }
}

function settle(timer: Timer, now: number, finished: boolean): Timer {
  if (timer.startedAt === null) return timer
  const end = segmentEnd(timer, now)
  const days = { ...timer.days }
  if (timer.mode !== 'break') {
    let cursor = timer.startedAt
    while (cursor < end) {
      const key = dayKey(cursor)
      const boundary = Math.min(end, new Date(cursor).setHours(24, 0, 0, 0))
      const day = days[key] ?? { elapsed: 0, rounds: 0 }
      days[key] = { ...day, elapsed: day.elapsed + boundary - cursor }
      cursor = boundary
    }
    if (finished) {
      const key = dayKey(end)
      const day = days[key] ?? { elapsed: 0, rounds: 0 }
      days[key] = { ...day, rounds: day.rounds + 1 }
    }
  }
  return { ...timer, elapsed: elapsedAt(timer, now), startedAt: null, finished, days }
}

export function advance(timer: Timer, now: number) {
  if (
    timer.startedAt !== null &&
    timer.mode !== 'stopwatch' &&
    elapsedAt(timer, now) >= timer.minutes * minute
  ) {
    return settle(timer, now, true)
  }
  return timer
}

export function toggle(timer: Timer, now: number): Timer {
  const current = advance(timer, now)
  if (timer.startedAt !== null) return settle(current, now, false)
  return {
    ...current,
    startedAt: now,
    finished: false,
    elapsed: current.finished ? 0 : current.elapsed,
  }
}

export function reset(
  timer: Timer,
  now: number,
  mode = timer.mode,
  minutes = timer.minutes
): Timer {
  const current = settle(advance(timer, now), now, false)
  return { ...current, mode, minutes, startedAt: null, elapsed: 0, finished: false }
}
