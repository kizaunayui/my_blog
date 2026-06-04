'use client'

import { useState } from 'react'
import MusicPlayer from '@/components/MusicPlayer'

export default function FloatingMusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed right-3 bottom-4 z-50 flex max-w-[calc(100vw-1.5rem)] flex-col items-end sm:right-6 sm:bottom-6">
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        aria-label={isExpanded ? 'Toggle music player' : 'Open music player'}
        aria-expanded={isExpanded}
        className="music-chip group relative flex h-11 items-center gap-2 overflow-hidden rounded-full border border-white/25 bg-white/12 px-3 text-white shadow-[0_10px_34px_rgba(15,23,42,0.16)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-cyan-100/55 hover:bg-white/22 hover:shadow-[0_16px_42px_rgba(8,145,178,0.2)] dark:bg-slate-950/18"
      >
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/12 via-cyan-100/8 to-white/5" />
        <span
          className="relative flex h-7 w-7 items-center justify-center rounded-full border border-white/18 bg-white/10"
          aria-hidden="true"
        >
          <span className="flex h-4 items-end gap-0.5">
            <span className="music-bar h-2 w-1 rounded-full bg-white/85" />
            <span className="music-bar delay-1 h-4 w-1 rounded-full bg-cyan-100" />
            <span className="music-bar delay-2 h-3 w-1 rounded-full bg-white/75" />
          </span>
        </span>
        <span className="relative hidden pr-1 font-heading text-[9px] font-bold uppercase tracking-[0.28em] text-white/82 sm:inline">
          Music
        </span>
      </button>

      <section
        aria-hidden={!isExpanded}
        style={{ width: 'calc(100vw - 1.5rem)', maxWidth: '22rem' }}
        className={`music-float-panel absolute right-0 bottom-14 overflow-hidden rounded-[1.35rem] border border-white/18 bg-white/10 p-3 text-white shadow-[0_18px_52px_rgba(15,23,42,0.2)] backdrop-blur-2xl transition duration-300 dark:bg-slate-950/16 sm:bottom-14 sm:rounded-[1.6rem] sm:p-3.5 ${
          isExpanded
            ? 'visible pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'invisible pointer-events-none translate-y-2 scale-95 opacity-0'
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(8,145,178,0.08),rgba(15,23,42,0.1))]" />
        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          aria-label="Collapse music player"
          className="absolute top-2 right-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/12 bg-white/8 text-sm leading-none text-white/62 transition duration-300 hover:bg-white/16 hover:text-white"
        >
          -
        </button>
        <div className="relative pr-5">
          <MusicPlayer />
        </div>
      </section>

      <style jsx>{`
        .music-float-panel {
          transform-origin: bottom right;
        }

        .music-chip {
          animation: chip-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .music-bar {
          animation: music-bar 980ms ease-in-out infinite;
          transform-origin: bottom;
        }

        .music-bar.delay-1 {
          animation-delay: 140ms;
        }

        .music-bar.delay-2 {
          animation-delay: 280ms;
        }

        @keyframes chip-in {
          from {
            transform: translateY(8px) scale(0.9);
            opacity: 0;
          }

          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes music-bar {
          0%,
          100% {
            transform: scaleY(0.58);
          }

          50% {
            transform: scaleY(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .music-chip,
          .music-bar {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
