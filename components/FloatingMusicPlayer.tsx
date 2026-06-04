'use client'

import { useState } from 'react'
import MusicPlayer from '@/components/MusicPlayer'

export default function FloatingMusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end sm:right-6 sm:bottom-6">
      {/* Floating Trigger Note Button */}
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

      {/* Holographic Circular Turntable Panel */}
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
          <MusicPlayer />

          {/* Floating Glassmorphic Close Button (matching orbital style) */}
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            aria-label="Close music player"
            className="absolute top-[-8px] right-[-8px] z-30 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/8 bg-slate-950/60 text-[13px] leading-none text-white/50 shadow-md backdrop-blur-md transition hover:scale-105 hover:bg-slate-900 hover:text-white active:scale-95"
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
