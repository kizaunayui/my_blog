'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import Image from '@/components/Image'
import type { Album } from '@/data/albumsData'
import albumTracks from '../lib/albumTracks.json'
import styles from './AlbumShelf.module.css'

const number = (value: number) => String(value).padStart(2, '0')
const tracksByAlbum: Record<string, { title: string; href: string; durationMs: number }[]> =
  albumTracks
const formatDuration = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

function circularOffset(index: number, current: number, count: number) {
  if (!count) return 0
  let offset = (((index - current) % count) + count) % count
  if (offset > count / 2) offset -= count
  return offset
}

const visibleRadius = 3.7

// Express the whole rack in sleeve widths so the perspective survives resizing mid-swipe.
function coverPose(offset: number, travel: number) {
  const distance = Math.abs(offset)
  const recession = Math.hypot(offset, 0.42) - 0.42
  const wing = 1 - Math.exp(-1.35 * offset * offset)
  const x = 0.53 * offset + 0.19 * Math.tanh(2 * offset)
  const y = 0.055 * wing - 0.012 * travel * (1 - wing)
  const z = -1.04 * recession - 0.12 * wing - travel * (0.14 + 0.29 * wing)
  const angle = -59 * Math.tanh(1.42 * offset)
  const edge = Math.max(0, Math.min(1, (visibleRadius - distance) / 0.65))
  return {
    transform: `translate3d(${(100 * x).toFixed(3)}%, ${(100 * y).toFixed(3)}%, calc(var(--cover-size) * ${z.toFixed(5)})) rotateY(${angle.toFixed(3)}deg)`,
    // Neighbours exchange stacking order halfway through, when their inner edges clear.
    layer: String(Math.ceil(visibleRadius) - Math.floor(distance + 0.5)),
    opacity: String(Math.round(edge * edge * (3 - 2 * edge) * 1000) / 1000),
    shade: String(Math.round(Math.min(0.48, 0.18 * wing + 0.085 * recession) * 1000) / 1000),
  }
}

type Drag = {
  x: number
  y: number
  pointerId: number
  start: number
  position: number
  lastX: number
  lastTime: number
  speed: number
  step: number
}

function sampleDrag(drag: Drag, x: number, time: number) {
  if (drag.lastX === x) return
  const elapsed = Math.max(1, time - drag.lastTime)
  const speed = ((drag.lastX - x) * 1000) / (elapsed * drag.step)
  // Use elapsed time so release momentum is consistent across pointer polling rates.
  drag.speed += (Math.max(-20, Math.min(20, speed)) - drag.speed) * -Math.expm1(-elapsed / 40)
  drag.lastX = x
  drag.lastTime = time
  drag.position = drag.start - (x - drag.x) / drag.step
}

function dragSpeed(drag: Drag, now: number) {
  // Holding the sleeve still before release cancels the flick naturally.
  return drag.speed * Math.exp(-Math.max(0, now - drag.lastTime - 20) / 48)
}

function Arrow({ next = false }: { next?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={next ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
    </svg>
  )
}

export default function AlbumShelf({ albums }: { albums: Album[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const cards = useRef<(HTMLButtonElement | null)[]>([])
  const shades = useRef<(HTMLSpanElement | null)[]>([])
  const galleryRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const motion = useRef({
    position: 0,
    target: 0,
    speed: 0, // Albums per second, positive towards the next album.
    travel: 0,
    frequency: 14,
    lastTime: 0,
    frame: null as number | null,
  })
  const gesture = useRef<Drag | null>(null)
  const reduced = useRef(false)
  const dragged = useRef(false)
  const pendingIndex = useRef<number | null>(null)
  const active = albums[activeIndex]
  const tracks = active ? tracksByAlbum[active.id] || [] : []
  const initialPoses = useMemo(
    () =>
      Array.from({ length: albums.length }, (_, index) =>
        coverPose(circularOffset(index, 0, albums.length), 0)
      ),
    [albums.length]
  )

  const paint = useCallback(
    (position: number, travel: number) => {
      let focusedCoverHidden = false
      cards.current.forEach((card, index) => {
        if (!card) return
        const offset = circularOffset(index, position, albums.length)
        if (Math.abs(offset) >= visibleRadius) {
          if (card.style.visibility !== 'hidden') {
            if (document.activeElement === card) focusedCoverHidden = true
            card.style.visibility = 'hidden'
            card.style.willChange = 'auto'
          }
          return
        }
        if (card.style.visibility !== 'visible') {
          card.style.willChange = 'transform, opacity'
          card.style.visibility = 'visible'
        }
        const pose = coverPose(offset, travel)
        card.style.transform = pose.transform
        if (card.style.zIndex !== pose.layer) card.style.zIndex = pose.layer
        if (card.style.opacity !== pose.opacity) card.style.opacity = pose.opacity
        const shade = shades.current[index]
        if (shade && shade.style.opacity !== pose.shade) shade.style.opacity = pose.shade
      })
      if (focusedCoverHidden) {
        // Keep repeated arrow keys on the rack as the previously focused sleeve leaves it.
        const nearest = ((Math.round(position) % albums.length) + albums.length) % albums.length
        cards.current[nearest]?.focus({ preventScroll: true })
      }
    },
    [albums.length]
  )

  const commitSelection = useCallback(() => {
    if (pendingIndex.current === null) return
    setActiveIndex(pendingIndex.current)
    if (stageRef.current?.contains(document.activeElement)) {
      cards.current[pendingIndex.current]?.focus({ preventScroll: true })
    }
    pendingIndex.current = null
  }, [])

  const releasePointer = useCallback(() => {
    const drag = gesture.current
    gesture.current = null
    const stage = stageRef.current
    if (!stage || !drag) return
    delete stage.dataset.dragging
    if (stage.hasPointerCapture(drag.pointerId)) stage.releasePointerCapture(drag.pointerId)
  }, [])

  const snap = useCallback(() => {
    const state = motion.current
    if (state.frame !== null) cancelAnimationFrame(state.frame)
    state.frame = null
    state.position = state.target
    state.speed = state.travel = 0
    paint(state.position, 0)
    commitSelection()
  }, [paint, commitSelection])

  const tick = useCallback(
    function advance(now: number) {
      const state = motion.current
      const dt = Math.max(0, (now - state.lastTime) / 1000)
      state.lastTime = now
      const drag = gesture.current
      if (drag) {
        state.position = drag.position
        state.speed = dragSpeed(drag, now)
      } else {
        // Exact critically damped spring. Retargeting keeps the current position and velocity.
        const delta = state.position - state.target
        const momentum = state.speed + state.frequency * delta
        const decay = Math.exp(-state.frequency * dt)
        state.position = state.target + (delta + momentum * dt) * decay
        state.speed = (state.speed - state.frequency * momentum * dt) * decay
        if (Math.abs(state.target - state.position) < 0.0008 && Math.abs(state.speed) < 0.015) {
          state.position = state.target
          state.speed = 0
        }
        // Swap the caption and full tracklist only as the destination comes into focus.
        if (Math.abs(state.target - state.position) < 0.42) commitSelection()
      }

      const depthTarget = reduced.current ? 0 : 1 - Math.exp(-Math.abs(state.speed) / 7)
      const response = depthTarget > state.travel ? 19 : 12
      state.travel += (depthTarget - state.travel) * -Math.expm1(-response * dt)
      if (state.travel < 0.001 && depthTarget < 0.001) state.travel = 0
      paint(state.position, state.travel)
      const moving = drag
        ? !reduced.current && Math.abs(state.speed) > 0.01
        : state.position !== state.target || state.speed !== 0
      state.frame = moving || state.travel > 0 ? requestAnimationFrame(advance) : null
    },
    [paint, commitSelection]
  )

  const wake = () => {
    const state = motion.current
    if (state.frame !== null) return
    state.lastTime = performance.now()
    state.frame = requestAnimationFrame(tick)
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const changeMotion = () => {
      reduced.current = media.matches
      if (media.matches) {
        releasePointer()
        snap()
      }
    }
    changeMotion()
    media.addEventListener('change', changeMotion)
    const state = motion.current
    return () => {
      media.removeEventListener('change', changeMotion)
      if (state.frame !== null) cancelAnimationFrame(state.frame)
      state.frame = null
    }
  }, [releasePointer, snap])

  const settle = (destination: number) => {
    if (!albums.length) return
    const state = motion.current
    releasePointer()
    state.target = destination
    state.frequency = 14 - Math.min(3.5, Math.abs(destination - state.position) * 0.85)
    pendingIndex.current = ((destination % albums.length) + albums.length) % albums.length
    if (
      reduced.current ||
      (state.position === destination && state.speed === 0 && state.travel === 0)
    )
      snap()
    else wake()
  }

  const select = (index: number) => {
    const from = motion.current.position
    settle(Math.round(from + circularOffset(index, from, albums.length)))
  }

  const step = (direction: number) => {
    if (albums.length > 1) settle(motion.current.target + direction)
  }

  const finishDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const drag = gesture.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const state = motion.current
    if (cancelled || !dragged.current) {
      settle(state.target)
      return
    }
    sampleDrag(drag, event.clientX, event.timeStamp)
    state.position = drag.position
    state.speed = dragSpeed(drag, event.timeStamp)
    const coast = reduced.current ? 0 : Math.max(-4, Math.min(4, state.speed * 0.21))
    settle(Math.round(state.position + coast))
  }
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    if (event.key === 'Home') select(0)
    else if (event.key === 'End') select(albums.length - 1)
    else step(event.key === 'ArrowRight' ? 1 : -1)
  }

  return (
    <section className={styles.page}>
      <header className={styles.masthead}>
        <h1 className={styles.title}>The Albums That Compose Me</h1>
        {active && (
          <a href="#album-collection" className={styles.collectionCount}>
            <span>{number(albums.length)}</span> 张收藏 <span aria-hidden="true">↓</span>
          </a>
        )}
      </header>

      {active ? (
        <>
          <section
            className={styles.gallery}
            ref={galleryRef}
            aria-label="专辑封面浏览，使用左右方向键切换"
            aria-roledescription="轮播"
          >
            <div
              className={styles.stage}
              ref={stageRef}
              onPointerDown={(event) => {
                if (albums.length < 2 || !event.isPrimary || event.button !== 0 || gesture.current)
                  return
                const position = motion.current.position
                gesture.current = {
                  x: event.clientX,
                  y: event.clientY,
                  pointerId: event.pointerId,
                  start: position,
                  position,
                  lastX: event.clientX,
                  lastTime: event.timeStamp,
                  speed: 0,
                  step: Math.max(90, (cards.current[0]?.offsetWidth || 440) * 0.48),
                }
                dragged.current = false
              }}
              onPointerMove={(event) => {
                const start = gesture.current
                if (!start || start.pointerId !== event.pointerId) return
                const dx = event.clientX - start.x
                if (
                  !dragged.current &&
                  (Math.abs(dx) <= 8 || Math.abs(dx) <= Math.abs(event.clientY - start.y))
                )
                  return
                if (!dragged.current) {
                  dragged.current = true
                  event.currentTarget.dataset.dragging = 'true'
                  event.currentTarget.setPointerCapture(event.pointerId)
                }
                sampleDrag(start, event.clientX, event.timeStamp)
                wake()
              }}
              onPointerUp={(event) => finishDrag(event)}
              onPointerCancel={(event) => finishDrag(event, true)}
              onPointerLeave={(event) => {
                if (!dragged.current) finishDrag(event, true)
              }}
              onLostPointerCapture={(event) => {
                // Touch starts with implicit capture on the image; ignore its transfer to the stage.
                if (event.target === event.currentTarget) finishDrag(event, true)
              }}
              onClickCapture={(event) => {
                if (dragged.current && event.detail !== 0) {
                  event.preventDefault()
                  event.stopPropagation()
                  dragged.current = false
                }
              }}
            >
              {albums.map((album, index) => {
                const offset = circularOffset(index, activeIndex, albums.length)
                const distance = Math.abs(offset)
                const initial = initialPoses[index]
                return (
                  <button
                    key={album.id}
                    type="button"
                    className={styles.album}
                    ref={(node) => {
                      cards.current[index] = node
                    }}
                    aria-label={`查看专辑 ${album.title}，${album.artist}`}
                    aria-pressed={index === activeIndex}
                    tabIndex={distance > 2 ? -1 : 0}
                    onClick={() => select(index)}
                    onKeyDown={onKeyDown}
                    style={{
                      // React holds the initial pose; the animation owns subsequent frame writes.
                      transform: initial.transform,
                      zIndex: initial.layer,
                      opacity: initial.opacity,
                      visibility: initial.opacity === '0' ? 'hidden' : 'visible',
                      willChange: initial.opacity === '0' ? 'auto' : 'transform, opacity',
                    }}
                  >
                    <span className={styles.sleeve}>
                      <Image
                        src={album.cover}
                        alt={`${album.title}${album.demo ? ' 临时示意封面' : ' 专辑封面'}`}
                        loading="eager"
                        width={640}
                        height={640}
                        sizes="(max-width: 700px) min(76vw, 390px), clamp(440px, 36vw, 510px)"
                        priority={index === 0}
                        draggable={false}
                        style={{ objectPosition: album.coverPosition }}
                      />
                      {album.demo && (
                        <span className={styles.coverType} aria-hidden="true">
                          <span>COLLECTION / {number(index + 1)}</span>
                          <strong>{album.title}</strong>
                          <span>ARTWORK STUDY</span>
                        </span>
                      )}
                      <span
                        aria-hidden="true"
                        className={styles.shade}
                        ref={(node) => {
                          shades.current[index] = node
                        }}
                        style={{ opacity: initial.shade }}
                      />
                    </span>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              className={`${styles.arrow} ${styles.previous}`}
              disabled={albums.length < 2}
              onClick={() => step(-1)}
              aria-label="上一张专辑"
              onKeyDown={onKeyDown}
            >
              <Arrow />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.next}`}
              disabled={albums.length < 2}
              onClick={() => step(1)}
              aria-label="下一张专辑"
              onKeyDown={onKeyDown}
            >
              <Arrow next />
            </button>
          </section>
          <div className={styles.albumInfo} aria-live="polite" aria-atomic="true">
            <div key={active.id} className={styles.infoContent}>
              <h2>{active.title}</h2>
              <div className={styles.credits}>
                <p>
                  {active.artist}
                  {active.year && <span> · {active.year}</span>}
                </p>
                {active.url && (
                  <a
                    className={styles.listen}
                    href={active.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Spotify 聆听 <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
              {active.note && <p className={styles.note}>{active.note}</p>}
            </div>
          </div>
          <section className={styles.tracklist} aria-label={`${active.title} 收录曲`}>
            <div className={styles.tracklistHeading}>
              <h2>收录曲</h2>
              <span>
                {tracks.length} 首 ·{' '}
                {Math.round(tracks.reduce((sum, track) => sum + track.durationMs, 0) / 60000)} 分钟
              </span>
            </div>
            {tracks.length ? (
              <ol key={active.id} className={styles.trackRows} data-columns={tracks.length > 6}>
                {tracks.map((track, index) => (
                  <li key={`${track.href}-${index}`}>
                    <a
                      href={track.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${track.title}，在 Spotify 打开`}
                    >
                      <span className={styles.trackNumber}>{number(index + 1)}</span>
                      <span className={styles.trackTitle}>{track.title}</span>
                      <span className={styles.trackDuration}>
                        {formatDuration(track.durationMs)}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            ) : (
              <p className={styles.trackEmpty}>暂无曲目信息</p>
            )}
          </section>
          <section id="album-collection" className={styles.index} aria-label="全部专辑">
            <div className={styles.indexHeading}>
              <h2>全部收藏</h2>
              {albums.some((album) => album.demo) && <p>暂以示意封面展示</p>}
            </div>
            <div className={styles.indexList}>
              {albums.map((album, index) => (
                <button
                  key={album.id}
                  type="button"
                  className={styles.indexItem}
                  aria-pressed={activeIndex === index}
                  onClick={() => {
                    select(index)
                    galleryRef.current?.scrollIntoView({
                      behavior: reduced.current ? 'instant' : 'smooth',
                      block: 'start',
                    })
                  }}
                  onKeyDown={onKeyDown}
                >
                  <Image
                    src={album.cover}
                    alt=""
                    width={320}
                    height={320}
                    sizes="(max-width: 599px) 43vw, (max-width: 900px) 29vw, 195px"
                    style={{ objectPosition: album.coverPosition }}
                  />
                  <span className={styles.indexText}>
                    <strong>{album.title}</strong>
                    <span>{album.artist}</span>
                  </span>
                  <span className={styles.indexIndicator} aria-hidden="true">
                    {activeIndex === index ? '当前专辑' : ''}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </>
      ) : (
        <p className={styles.empty}>唱片架暂时留白，等待下一张喜欢的专辑。</p>
      )}
    </section>
  )
}
