'use client'

import { useState } from 'react'
import MusicPlayer from '@/components/MusicPlayer'

export default function FloatingMusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed right-3 bottom-4 z-50 flex max-w-[calc(100vw-1.5rem)] flex-col items-end sm:right-5 sm:bottom-5">
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        aria-label={isExpanded ? 'Toggle music player' : 'Open music player'}
        aria-expanded={isExpanded}
        className="music-orb group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-slate-950/34 text-white shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:bg-slate-950/48 hover:shadow-[0_18px_48px_rgba(8,145,178,0.28)] sm:h-14 sm:w-14"
      >
        <span className="absolute inset-0 bg-gradient-to-br from-white/22 via-transparent to-cyan-300/18" />
        <span className="absolute inset-2 rounded-full border border-white/12" />
        <span className="relative flex h-5 items-end gap-0.5" aria-hidden="true">
          <span className="music-bar h-2 w-1 rounded-full bg-white/85" />
          <span className="music-bar delay-1 h-4 w-1 rounded-full bg-cyan-100" />
          <span className="music-bar delay-2 h-3 w-1 rounded-full bg-white/75" />
        </span>
      </button>

      <section
        aria-hidden={!isExpanded}
        style={{ width: 'calc(100vw - 1.5rem)', maxWidth: '22rem' }}
        className={`music-float-panel absolute right-0 bottom-14 overflow-hidden rounded-2xl border border-white/18 bg-slate-950/38 p-3.5 text-white shadow-[0_18px_55px_rgba(0,0,0,0.32)] backdrop-blur-2xl transition duration-300 sm:bottom-16 sm:rounded-3xl sm:p-4 ${
          isExpanded
            ? 'visible pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'invisible pointer-events-none translate-y-2 scale-95 opacity-0'
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-cyan-400/10" />
        <div className="relative mb-1 flex items-center justify-between gap-3">
          <p className="font-heading text-[9px] font-bold uppercase tracking-[0.34em] text-cyan-100/80">
            Listening
          </p>
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            aria-label="Collapse music player"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/16 bg-white/10 text-lg leading-none text-white/75 transition duration-300 hover:bg-white/18 hover:text-white"
          >
            -
          </button>
        </div>
        <div className="relative">
          <MusicPlayer />
        </div>
      </section>

      <style jsx>{`
        .music-float-panel {
          transform-origin: bottom right;
        }

        .music-orb {
          animation: orb-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
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

        @keyframes orb-in {
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
          .music-orb,
          .music-bar {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
