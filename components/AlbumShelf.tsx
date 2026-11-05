'use client'

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import Image from '@/components/Image'
import type { Album } from '@/data/albumsData'
import styles from './AlbumShelf.module.css'

const number = (value: number) => String(value).padStart(2, '0')

function Arrow({ next = false }: { next?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={next ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
    </svg>
  )
}

export default function AlbumShelf({ albums }: { albums: Album[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const motionLayers = useRef<(HTMLSpanElement | null)[]>([])
  const gesture = useRef<{ x: number; y: number; pointerId: number; time: number } | null>(null)
  const dragged = useRef(false)
  const active = albums[activeIndex]

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const layers = motionLayers.current
    const cancelMotion = () => {
      if (preference.matches)
        layers.forEach((layer) =>
          layer?.getAnimations({ subtree: true }).forEach((animation) => animation.cancel())
        )
    }
    preference.addEventListener('change', cancelMotion)
    return () => {
      preference.removeEventListener('change', cancelMotion)
      layers.forEach((layer) =>
        layer?.getAnimations({ subtree: true }).forEach((animation) => animation.cancel())
      )
    }
  }, [])

  const animateSelection = (next: number, direction: number) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    motionLayers.current.forEach((layer, index) => {
      if (!layer || (Math.abs(index - activeIndex) > 2 && Math.abs(index - next) > 2)) return
      // Capture an interrupted transition before replacing it, so rapid input stays continuous.
      const start = getComputedStyle(layer).transform
      layer.getAnimations().forEach((animation) => animation.cancel())
      const incoming = index === next
      const frames: Keyframe[] = [
        { transform: start, offset: 0 },
        {
          transform: `translate3d(${direction * (incoming ? -16 : 12)}px, ${incoming ? -12 : 8}px, ${incoming ? 72 : -65}px) rotateX(${incoming ? -4 : 3}deg) rotateY(${-direction * (incoming ? 26 : 12)}deg) rotateZ(${direction * 1.2}deg)`,
          offset: 0.28,
        },
        {
          transform: `translate3d(${direction * (incoming ? 3 : -3)}px, -3px, ${incoming ? 22 : -14}px) rotateX(-1deg) rotateY(${-direction * 7}deg)`,
          offset: 0.58,
        },
        {
          transform: `translateZ(${incoming ? -5 : 3}px) rotateY(${direction * 2}deg)`,
          offset: 0.8,
        },
        { transform: 'none', offset: 1 },
      ]
      layer.animate(
        frames.map((frame) => ({ ...frame, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' })),
        {
          duration: 1000,
          easing: 'linear',
        }
      )
    })
  }
  const select = (index: number) => {
    if (!albums.length) return
    const next = ((index % albums.length) + albums.length) % albums.length
    if (next === activeIndex) return
    animateSelection(next, Math.sign(index - activeIndex) || 1)
    setActiveIndex(next)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    if (event.key === 'Home') select(0)
    else if (event.key === 'End') select(albums.length - 1)
    else select(activeIndex + (event.key === 'ArrowRight' ? 1 : -1))
  }

  return (
    <section
      className={styles.page}
      style={{ '--album-accent': active?.accent || '#6576bf' } as CSSProperties}
    >
      <header className={styles.masthead}>
        <div>
          <p className={styles.kicker}>THE RECORD SHELF</p>
          <h1 className={styles.title}>
            专辑<span>收藏的声音</span>
          </h1>
          <p className={styles.intro}>一些喜欢的专辑，一些反复回来的时刻。</p>
        </div>
        <p className={styles.collectionCount}>
          <span>{number(albums.length)}</span> RECORDS
        </p>
      </header>

      {active ? (
        <>
          <section
            className={styles.gallery}
            aria-label="专辑封面浏览，使用左右方向键切换"
            aria-roledescription="轮播"
          >
            <div className={styles.stageHeading}>
              <span aria-hidden="true">SELECTED / {number(activeIndex + 1)}</span>
            </div>
            <div
              className={styles.stage}
              onPointerDown={(event) => {
                if (!event.isPrimary || event.button !== 0) return
                gesture.current = {
                  x: event.clientX,
                  y: event.clientY,
                  pointerId: event.pointerId,
                  time: performance.now(),
                }
                dragged.current = false
              }}
              onPointerMove={(event) => {
                const start = gesture.current
                if (!start || start.pointerId !== event.pointerId) return
                const dx = event.clientX - start.x
                if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(event.clientY - start.y)) {
                  dragged.current = true
                  event.currentTarget.setPointerCapture(event.pointerId)
                  event.currentTarget.dataset.dragging = 'true'
                  event.currentTarget.style.setProperty(
                    '--drag-x',
                    `${Math.max(-120, Math.min(120, dx * 0.8))}px`
                  )
                }
              }}
              onPointerUp={(event) => {
                const start = gesture.current
                if (!start || start.pointerId !== event.pointerId) return
                const dx = event.clientX - start.x
                const velocity = Math.abs(dx) / Math.max(1, performance.now() - start.time)
                delete event.currentTarget.dataset.dragging
                event.currentTarget.style.setProperty('--drag-x', '0px')
                if (
                  (Math.abs(dx) > 40 || (Math.abs(dx) > 18 && velocity > 0.35)) &&
                  Math.abs(dx) > Math.abs(event.clientY - start.y)
                ) {
                  select(activeIndex + (dx < 0 ? 1 : -1))
                }
                gesture.current = null
              }}
              onPointerCancel={(event) => {
                gesture.current = null
                delete event.currentTarget.dataset.dragging
                event.currentTarget.style.setProperty('--drag-x', '0px')
              }}
              onLostPointerCapture={(event) => {
                gesture.current = null
                delete event.currentTarget.dataset.dragging
                event.currentTarget.style.setProperty('--drag-x', '0px')
              }}
              onClickCapture={(event) => {
                if (dragged.current) {
                  event.preventDefault()
                  event.stopPropagation()
                  dragged.current = false
                }
              }}
            >
              {albums.map((album, index) => (
                <div
                  key={album.id}
                  className={styles.halo}
                  aria-hidden="true"
                  style={
                    {
                      '--album-accent': album.accent,
                      opacity: index === activeIndex ? 0.8 : 0,
                    } as CSSProperties
                  }
                />
              ))}
              {albums.map((album, index) => {
                const offset = index - activeIndex
                const distance = Math.abs(offset)
                return (
                  <button
                    key={album.id}
                    type="button"
                    className={styles.album}
                    aria-label={`查看专辑 ${album.title}，${album.artist}`}
                    aria-pressed={index === activeIndex}
                    tabIndex={distance > 2 ? -1 : 0}
                    onClick={() => select(index)}
                    onKeyDown={onKeyDown}
                    onPointerMove={(event) => {
                      if (index !== activeIndex || gesture.current || event.pointerType !== 'mouse')
                        return
                      const bounds = event.currentTarget.getBoundingClientRect()
                      const x = (event.clientX - bounds.left) / bounds.width - 0.5
                      const y = (event.clientY - bounds.top) / bounds.height - 0.5
                      event.currentTarget.style.setProperty('--tilt-x', `${-y * 7}deg`)
                      event.currentTarget.style.setProperty('--tilt-y', `${x * 9}deg`)
                    }}
                    onPointerLeave={(event) => {
                      event.currentTarget.style.setProperty('--tilt-x', '0deg')
                      event.currentTarget.style.setProperty('--tilt-y', '0deg')
                    }}
                    style={
                      {
                        '--offset': offset,
                        '--distance': distance,
                        '--side': Math.sign(offset),
                        zIndex: albums.length - distance,
                        visibility: distance > 2 ? 'hidden' : 'visible',
                      } as CSSProperties
                    }
                  >
                    <span
                      className={styles.motionLayer}
                      ref={(node) => {
                        motionLayers.current[index] = node
                      }}
                    >
                      <span className={styles.artwork}>
                        <span className={styles.sleeve}>
                          <Image
                            src={album.cover}
                            alt={`${album.title}${album.demo ? ' 临时示意封面' : ' 专辑封面'}`}
                            width={640}
                            height={640}
                            sizes="(max-width: 640px) 68vw, 380px"
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
                        <span className={styles.reflection} aria-hidden="true">
                          <Image
                            src={album.cover}
                            alt=""
                            width={640}
                            height={640}
                            sizes="(max-width: 640px) 68vw, 380px"
                            priority={index === 0}
                            draggable={false}
                            style={{ objectPosition: album.coverPosition }}
                          />
                        </span>
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div className={styles.details}>
              <button
                type="button"
                className={styles.arrow}
                disabled={albums.length < 2}
                onClick={() => select(activeIndex - 1)}
                aria-label="上一张专辑"
                onKeyDown={onKeyDown}
              >
                <Arrow />
              </button>
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
                      聆听专辑 ↗
                    </a>
                  )}
                </div>
              </div>
              <button
                type="button"
                className={styles.arrow}
                disabled={albums.length < 2}
                onClick={() => select(activeIndex + 1)}
                aria-label="下一张专辑"
                onKeyDown={onKeyDown}
              >
                <Arrow next />
              </button>
            </div>
            <p className={styles.hint}>
              拖动封面或使用 ← → 切换
              <span>
                {number(activeIndex + 1)} / {number(albums.length)}
              </span>
            </p>
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
                  onClick={() => select(index)}
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
