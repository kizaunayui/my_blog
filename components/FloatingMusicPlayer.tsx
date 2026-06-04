'use client'

import { useState } from 'react'
import MusicPlayer from '@/components/MusicPlayer'

export default function FloatingMusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="fixed right-0 bottom-24 z-50 flex items-center">
      {/* Sleek Side Drawer Tab Trigger (Sticks to screen edge) */}
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        aria-label={isExpanded ? 'Close music player' : 'Open music player'}
        aria-expanded={isExpanded}
        className="group relative flex h-18 w-5.5 items-center justify-center rounded-l-xl border-y border-l border-white/10 bg-slate-950/60 text-white shadow-[-4px_4px_16px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-300 hover:w-6.5 hover:bg-slate-950/80 active:scale-95"
      >
        <div className="flex flex-col items-center gap-1 text-white/60 transition group-hover:text-cyan-400">
          {/* Arrow indicator */}
          <span className="text-[12px] leading-none font-bold transition-transform duration-300 select-none">
            {isExpanded ? '›' : '‹'}
          </span>
          {/* Minimal Music Note Icon */}
          <svg
            className={`h-3.5 w-3.5 ${isPlaying ? 'animate-music-pulse' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18.5a2.5 2.5 0 1 1-2.5-2.5H9v2.5Z" />
            <path d="M9 16V6.8L18 5v11" />
          </svg>
        </div>
      </button>

      {/* Holographic Cardless Oscilloscope Player */}
      <div
        aria-hidden={!isExpanded}
        className={`absolute right-7 bottom-[-60px] transform transition-all duration-300 ${
          isExpanded
            ? 'pointer-events-auto visible translate-x-0 scale-100 opacity-100'
            : 'pointer-events-none invisible translate-x-4 scale-95 opacity-0'
        }`}
      >
        <div className="relative">
          <MusicPlayer onPlayStateChange={setIsPlaying} />

          {/* Floating close Button on top right */}
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            aria-label="Close music player"
            className="absolute top-[-4px] right-[-4px] z-30 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-[12px] leading-none text-white/40 transition duration-300 hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes music-pulse {
          0%,
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 2px rgba(6, 182, 212, 0.4));
          }
          50% {
            transform: scale(1.15);
            filter: drop-shadow(0 0 6px rgba(6, 182, 212, 0.8));
          }
        }

        :global(.animate-music-pulse) {
          animation: music-pulse 1.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.animate-music-pulse) {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
