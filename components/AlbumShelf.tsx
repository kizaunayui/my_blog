'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
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
  const galleryRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const position = useRef(0)
  const target = useRef(0)
  const velocity = useRef(0)
  const selected = useRef(0)
  const frame = useRef<number | null>(null)
  const coverWidth = useRef(440)
  const reduced = useRef(false)
  const gesture = useRef<{
    x: number
    y: number
    pointerId: number
    start: number
    lastX: number
    lastTime: number
    velocity: number
    step: number
    previousTarget: number
  } | null>(null)
  const dragged = useRef(false)
  const active = albums[activeIndex]
  const tracks = active ? tracksByAlbum[active.id] || [] : []

  const paint = useCallback(
    (value: number) => {
      const width = coverWidth.current
      cards.current.forEach((card, index) => {
        if (!card) return
        const offset = circularOffset(index, value, albums.length)
        const distance = Math.abs(offset)
        if (distance >= 3.6) {
          if (card.style.visibility !== 'hidden') {
            card.style.visibility = 'hidden'
            card.style.willChange = 'auto'
          }
          return
        }
        // A continuous curve keeps rotation and depth smooth when passing the centre.
        const depth = Math.sqrt(offset * offset + 0.16) - 0.4
        const edge = Math.max(0, Math.min(1, (3.6 - distance) / 0.8))
        const fade = edge * edge * (3 - 2 * edge)
        card.style.visibility = 'visible'
        card.style.willChange = 'transform, opacity'
        card.style.transform = `translate3d(${offset * width * 0.8}px, ${10 * (1 - Math.exp(-distance * distance))}px, ${-depth * width * 0.65}px) rotateY(${-Math.tanh(offset * 1.25) * 52}deg)`
        card.style.opacity = String((1 - Math.min(distance / 3.6, 1) * 0.45) * fade)
        card.style.zIndex = String(Math.round(100 - distance * 10))
      })
    },
    [albums.length]
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const resize = () => {
      coverWidth.current = cards.current[0]?.offsetWidth || 440
      paint(position.current)
    }
    const changeMotion = () => {
      reduced.current = media.matches
      if (media.matches) {
        if (frame.current !== null) cancelAnimationFrame(frame.current)
        frame.current = null
        position.current = target.current
        velocity.current = 0
        paint(position.current)
      }
    }
    changeMotion()
    resize()
    const observer = new ResizeObserver(resize)
    if (stageRef.current) observer.observe(stageRef.current)
    media.addEventListener('change', changeMotion)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', changeMotion)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [paint])

  const settle = (destination: number) => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    target.current = destination
    if (reduced.current) {
      position.current = destination
      velocity.current = 0
      paint(destination)
      frame.current = null
      return
    }
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(40, now - last) / 1000
      last = now
      // Analytic critically damped spring: retains momentum on interrupted swipes.
      const displacement = position.current - target.current
      const frequency = 13
      const decay = Math.exp(-frequency * dt)
      const momentum = velocity.current + frequency * displacement
      position.current = target.current + (displacement + momentum * dt) * decay
      velocity.current = (velocity.current - frequency * momentum * dt) * decay
      if (
        Math.abs(target.current - position.current) < 0.001 &&
        Math.abs(velocity.current) < 0.015
      ) {
        position.current = target.current
        velocity.current = 0
        frame.current = null
        paint(position.current)
      } else {
        paint(position.current)
        frame.current = requestAnimationFrame(tick)
      }
    }
    frame.current = requestAnimationFrame(tick)
  }

  const select = (index: number) => {
    if (!albums.length) return
    const next = ((index % albums.length) + albums.length) % albums.length
    const destination = target.current + circularOffset(next, selected.current, albums.length)
    selected.current = next
    setActiveIndex(next)
    settle(destination)
  }

  const finishDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const start = gesture.current
    if (!start || start.pointerId !== event.pointerId) return
    gesture.current = null
    delete event.currentTarget.dataset.dragging
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (!cancelled && dragged.current) {
      const releaseVelocity = performance.now() - start.lastTime > 100 ? 0 : start.velocity
      velocity.current = Math.max(-18, Math.min(18, (-releaseVelocity * 1000) / start.step))
      const inertia = Math.max(-4, Math.min(4, velocity.current * 0.16))
      const destination = Math.round(position.current + inertia)
      selected.current = ((destination % albums.length) + albums.length) % albums.length
      setActiveIndex(selected.current)
      settle(destination)
    } else {
      velocity.current = 0
      settle(start.previousTarget)
    }
  }
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    if (event.key === 'Home') select(0)
    else if (event.key === 'End') select(albums.length - 1)
    else select(selected.current + (event.key === 'ArrowRight' ? 1 : -1))
  }

  return (
    <section
      className={styles.page}
      style={{ '--album-accent': active?.accent || '#6576bf' } as CSSProperties}
    >
      <header className={styles.masthead}>
        <div>
          <h1 className={styles.title}>The Albums That Compose Me</h1>
        </div>
        <p className={styles.collectionCount}>
          <span>{number(albums.length)}</span> RECORDS
        </p>
      </header>

      {active ? (
        <>
          <section
            className={styles.gallery}
            ref={galleryRef}
            aria-label="专辑封面浏览，使用左右方向键切换"
            aria-roledescription="轮播"
          >
            <div className={styles.stageHeading}>
              <span aria-hidden="true">SELECTED / {number(activeIndex + 1)}</span>
            </div>
            <div
              className={styles.stage}
              ref={stageRef}
              onPointerDown={(event) => {
                if (!event.isPrimary || event.button !== 0 || gesture.current) return
                if (frame.current !== null) cancelAnimationFrame(frame.current)
                frame.current = null
                velocity.current = 0
                gesture.current = {
                  x: event.clientX,
                  y: event.clientY,
                  pointerId: event.pointerId,
                  start: position.current,
                  lastX: event.clientX,
                  lastTime: performance.now(),
                  velocity: 0,
                  step: Math.max(90, coverWidth.current * 0.48),
                  previousTarget: target.current,
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
                dragged.current = true
                event.currentTarget.dataset.dragging = 'true'
                event.currentTarget.setPointerCapture(event.pointerId)
                const now = performance.now()
                start.velocity =
                  start.velocity * 0.6 +
                  ((event.clientX - start.lastX) / Math.max(1, now - start.lastTime)) * 0.4
                start.lastX = event.clientX
                start.lastTime = now
                position.current = start.start - dx / start.step
                if (frame.current === null) {
                  frame.current = requestAnimationFrame(() => {
                    frame.current = null
                    paint(position.current)
                  })
                }
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
                if (dragged.current) {
                  event.preventDefault()
                  event.stopPropagation()
                  dragged.current = false
                }
              }}
            >
              <div className={styles.halo} aria-hidden="true" />
              {albums.map((album, index) => {
                const offset = circularOffset(index, activeIndex, albums.length)
                const distance = Math.abs(offset)
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
                    style={
                      {
                        // Only initial SSR placement; the animation owns these styles afterwards.
                        '--offset': circularOffset(index, 0, albums.length),
                        '--distance': Math.abs(circularOffset(index, 0, albums.length)),
                        '--side': Math.sign(circularOffset(index, 0, albums.length)),
                      } as CSSProperties
                    }
                  >
                    <span className={styles.artwork}>
                      <span className={styles.sleeve}>
                        <Image
                          src={album.cover}
                          alt={`${album.title}${album.demo ? ' 临时示意封面' : ' 专辑封面'}`}
                          loading="eager"
                          width={640}
                          height={640}
                          sizes="(max-width: 767px) 76vw, 440px"
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
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              className={`${styles.arrow} ${styles.previous}`}
              disabled={albums.length < 2}
              onClick={() => select(selected.current - 1)}
              aria-label="上一张专辑"
              onKeyDown={onKeyDown}
            >
              <Arrow />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.next}`}
              disabled={albums.length < 2}
              onClick={() => select(selected.current + 1)}
              aria-label="下一张专辑"
              onKeyDown={onKeyDown}
            >
              <Arrow next />
            </button>
            <div className={styles.details}>
              <div className={styles.albumInfo} aria-live="polite" aria-atomic="true">
                <div key={active.id} className={styles.infoContent}>
                  <p className={styles.albumTag}>
                    {active.demo ? '封面预览' : 'IN MY COLLECTION'}
                    {active.year ? ` · ${active.year}` : ''}
                  </p>
                  <h2>{active.title}</h2>
                  <p className={styles.artist}>{active.artist}</p>
                  {active.note && <p className={styles.note}>{active.note}</p>}
                  {active.url && (
                    <a
                      className={styles.listen}
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      聆听专辑 <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className={styles.tracklist} aria-label={`${active.title} 收录曲`}>
            <div className={styles.tracklistHeading}>
              <div>
                <p>TRACKLIST</p>
                <h2>收录曲</h2>
              </div>
              <span>
                {tracks.length} 首{' '}
                <span className={styles.trackTotal}>
                  {' '}
                  / {Math.round(
                    tracks.reduce((sum, track) => sum + track.durationMs, 0) / 60000
                  )}{' '}
                  MIN
                </span>
              </span>
            </div>
            {tracks.length ? (
              <ol key={active.id} className={styles.trackRows}>
                {tracks.map((track, index) => (
                  <li
                    key={`${track.href}-${index}`}
                    style={{ '--row-delay': `${Math.min(index, 8) * 22}ms` } as CSSProperties}
                  >
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

          <section className={styles.index} aria-label="全部专辑">
            <div className={styles.indexHeading}>
              <h2>
                全部收藏 <span>THE COLLECTION</span>
              </h2>
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
                  <span className={styles.indexNumber}>{number(index + 1)}</span>
                  <Image
                    src={album.cover}
                    alt=""
                    width={64}
                    height={64}
                    sizes="48px"
                    style={{ objectPosition: album.coverPosition }}
                  />
                  <span className={styles.indexText}>
                    <strong>{album.title}</strong>
                    <span>{album.artist}</span>
                  </span>
                  <span className={styles.indexIndicator} aria-hidden="true">
                    {activeIndex === index ? '浏览中' : '↗'}
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
