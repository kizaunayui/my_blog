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
        className="music-trigger group relative flex h-11 w-11 items-center justify-center rounded-full text-white transition duration-300 hover:-translate-y-0.5"
      >
        <span
          className="absolute inset-1 rounded-full bg-white/0 transition duration-300 group-hover:bg-white/8 group-hover:backdrop-blur-md"
          aria-hidden="true"
        />
        <span
          className="relative flex h-7 w-7 items-center justify-center rounded-full"
          aria-hidden="true"
        >
          <span className="flex h-5 items-end gap-1 drop-shadow-[0_2px_9px_rgba(15,23,42,0.42)]">
            <span className="music-bar h-2 w-1 rounded-full bg-white/70" />
            <span className="music-bar delay-1 h-5 w-1 rounded-full bg-cyan-100/90" />
            <span className="music-bar delay-2 h-3 w-1 rounded-full bg-white/62" />
            <span className="music-bar delay-3 h-4 w-1 rounded-full bg-white/76" />
          </span>
        </span>
      </button>

      <div
        aria-hidden={!isExpanded}
        style={{ width: 'calc(100vw - 1.5rem)', maxWidth: '22rem' }}
        className={`music-float-strip absolute right-0 bottom-12 text-white transition duration-300 sm:bottom-12 ${
          isExpanded
            ? 'visible pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'invisible pointer-events-none translate-y-3 scale-95 opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          aria-label="Collapse music player"
          className="absolute -top-3 right-1 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/12 bg-white/8 text-xs leading-none text-white/55 backdrop-blur-md transition duration-300 hover:bg-white/16 hover:text-white"
        >
          -
        </button>
        <div className="relative pr-5 drop-shadow-[0_10px_28px_rgba(15,23,42,0.28)]">
          <MusicPlayer />
        </div>
      </div>

      <style jsx>{`
        .music-float-strip {
          transform-origin: bottom right;
        }

        .music-trigger {
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

        .music-bar.delay-3 {
          animation-delay: 420ms;
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
          .music-trigger,
          .music-bar {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
