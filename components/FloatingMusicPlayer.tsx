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
          className="absolute inset-0 rounded-full bg-white/0 transition duration-300 group-hover:bg-white/8 group-hover:backdrop-blur-md"
          aria-hidden="true"
        />
        <span
          className="music-note relative flex h-8 w-8 items-center justify-center rounded-full text-white/78 drop-shadow-[0_3px_12px_rgba(15,23,42,0.42)] transition duration-300 group-hover:text-cyan-100"
          aria-hidden="true"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.85"
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

        :global(.music-float-strip .scan-line) {
          display: none;
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

        @media (prefers-reduced-motion: reduce) {
          .music-trigger {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
