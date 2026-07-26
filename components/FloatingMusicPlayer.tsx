'use client'

import { useEffect, useRef, useState } from 'react'
import MusicPlayer from '@/components/MusicPlayer'

export default function FloatingMusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPageScrolling, setIsPageScrolling] = useState(false)
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleTogglePlayer = () => {
    setIsExpanded((value) => !value)
    setIsPageScrolling(false)
  }

  const handleClosePlayer = () => {
    setIsExpanded(false)
    setIsPageScrolling(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (isExpanded) return

      setIsPageScrolling(true)
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current)
      scrollEndTimer.current = setTimeout(() => setIsPageScrolling(false), 550)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current)
    }
  }, [isExpanded])

  return (
    <div
      className={`music-floating-shell fixed right-4 bottom-4 z-50 flex flex-col items-end sm:right-6 sm:bottom-6 ${
        isPageScrolling && !isExpanded ? 'music-floating-shell--quiet' : ''
      }`}
    >
      {/* Floating Music Note Trigger Button (Bigger & Easy to click) */}
      <button
        type="button"
        onClick={handleTogglePlayer}
        aria-label={isExpanded ? 'Close music player' : 'Open music player'}
        aria-expanded={isExpanded}
        className={`music-trigger group relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-0.5 active:scale-95 ${
          isPlaying ? 'breathing-ring-playing' : 'breathing-ring-idle'
        }`}
      >
        <span
          className="absolute inset-0 rounded-full border border-white/12 bg-slate-950 transition duration-300 group-hover:border-cyan-300/30"
          aria-hidden="true"
        />
        <span
          className={`music-note-icon relative flex h-8 w-8 items-center justify-center transition duration-300 ${
            isPlaying ? 'scale-105 text-cyan-400' : 'text-white/70 group-hover:text-cyan-400'
          }`}
          aria-hidden="true"
        >
          <svg
            className="h-5 w-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18.5a2.5 2.5 0 1 1-2.5-2.5H9v2.5Z" />
            <path d="M18 16.5a2.5 2.5 0 1 1-2.5-2.5H18v2.5Z" />
            <path d="M9 16V6.8L18 5v11" />
            <path d="M9 9.2 18 7.4" />
          </svg>
        </span>
      </button>

      {/* Holographic Cardless Oscilloscope Player */}
      <div
        aria-hidden={!isExpanded}
        style={{ width: 'calc(100vw - 2.5rem)', maxWidth: '17rem' }}
        className={`music-float-strip absolute right-0 bottom-15 transform transition-all duration-300 ${
          isExpanded
            ? 'pointer-events-auto visible translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none invisible translate-y-4 scale-95 opacity-0'
        }`}
      >
        <div className="relative flex flex-col items-center">
          <MusicPlayer onPlayStateChange={setIsPlaying} />

          {/* Floating close Button on top right */}
          <button
            type="button"
            onClick={handleClosePlayer}
            aria-label="Close music player"
            className="absolute top-[-8px] right-[-8px] z-30 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-[12px] leading-none text-white/40 transition duration-300 hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </div>
      </div>

      <style jsx>{`
        .music-float-strip {
          transform-origin: bottom right;
        }

        .music-floating-shell {
          transition:
            transform 240ms cubic-bezier(0.19, 1, 0.22, 1),
            opacity 240ms ease;
        }

        .music-trigger {
          animation: chip-in 300ms cubic-bezier(0.19, 1, 0.22, 1) both;
          border: 1px solid transparent;
        }

        @keyframes chip-in {
          from {
            transform: translateY(12px) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        /* Breathing Ring Playing Animation (Cyan/Pink rhythmic pulse) */
        @keyframes pulse-glow-playing {
          0%,
          100% {
            box-shadow:
              0 0 12px rgba(6, 182, 212, 0.35),
              inset 0 0 5px rgba(6, 182, 212, 0.15);
            border-color: rgba(6, 182, 212, 0.4);
          }
          50% {
            box-shadow:
              0 0 24px rgba(236, 72, 153, 0.65),
              inset 0 0 10px rgba(236, 72, 153, 0.35);
            border-color: rgba(236, 72, 153, 0.55);
          }
        }

        /* 待机态是静止的:脉冲只属于播放状态(design.md §7.5) */
        .breathing-ring-idle {
          animation: chip-in 300ms cubic-bezier(0.19, 1, 0.22, 1) both;
          border-color: rgba(6, 182, 212, 0.25);
          box-shadow:
            0 0 10px rgba(6, 182, 212, 0.2),
            inset 0 0 4px rgba(6, 182, 212, 0.1);
        }

        .breathing-ring-playing {
          animation:
            chip-in 300ms cubic-bezier(0.19, 1, 0.22, 1) both,
            pulse-glow-playing 2.2s ease-in-out infinite;
        }

        .breathing-ring-playing .music-note-icon {
          animation: slow-rotate 8s linear infinite;
        }

        @keyframes slow-rotate {
          from {
            transform: rotate(0deg) scale(1.05);
          }
          to {
            transform: rotate(360deg) scale(1.05);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .music-trigger,
          .breathing-ring-idle,
          .breathing-ring-playing,
          .breathing-ring-playing .music-note-icon {
            animation: none;
          }
        }

        @media (max-width: 640px) {
          .music-floating-shell {
            right: max(0.55rem, env(safe-area-inset-right));
            bottom: max(0.7rem, env(safe-area-inset-bottom));
          }

          .music-floating-shell--quiet {
            transform: translateX(1.85rem);
            opacity: 0.38;
            pointer-events: none;
          }

          .music-trigger {
            width: 2.5rem;
            height: 2.5rem;
          }

          .music-note-icon {
            width: 1.75rem;
            height: 1.75rem;
          }
        }
      `}</style>
    </div>
  )
}
