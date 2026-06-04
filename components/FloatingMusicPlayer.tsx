'use client'

import { useState } from 'react'
import MusicPlayer from '@/components/MusicPlayer'

export default function FloatingMusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end sm:right-6 sm:bottom-6">
      {/* Floating Toggle Trigger Button */}
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        aria-label={isExpanded ? 'Toggle music player' : 'Open music player'}
        aria-expanded={isExpanded}
        className="music-trigger group relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-0.5 active:scale-95"
      >
        <span
          className="absolute inset-0 rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-md transition duration-300 group-hover:bg-slate-900/80"
          aria-hidden="true"
        />
        <span
          className="relative flex h-8 w-8 items-center justify-center text-white/80 transition duration-300 group-hover:scale-105 group-hover:text-cyan-400"
          aria-hidden="true"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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

      {/* Floating Expandable Music Player Panel */}
      <div
        aria-hidden={!isExpanded}
        style={{ width: 'calc(100vw - 2rem)', maxWidth: '21rem' }}
        className={`music-float-strip absolute right-0 bottom-14 transform transition-all duration-300 ${
          isExpanded
            ? 'pointer-events-auto visible translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none invisible translate-y-4 scale-95 opacity-0'
        }`}
      >
        <div className="relative rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <MusicPlayer />

          {/* Subtle overlay Close Button on the card top right */}
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            aria-label="Close music player"
            className="absolute top-3 right-3 z-30 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-[12px] leading-none text-white/40 transition hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </div>
      </div>

      <style jsx>{`
        .music-float-strip {
          transform-origin: bottom right;
        }

        .music-trigger {
          animation: chip-in 300ms cubic-bezier(0.19, 1, 0.22, 1) both;
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

        @media (prefers-reduced-motion: reduce) {
          .music-trigger {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
