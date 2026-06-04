'use client'

import { useState } from 'react'
import MusicPlayer from '@/components/MusicPlayer'

export default function FloatingMusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end sm:right-6 sm:bottom-6">
      {/* Floating Jumping Volume Spectrum Trigger Button */}
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

        {/* Animated Soundwave / Spectrum Bars */}
        <div
          className="relative flex h-4.5 w-7 items-end justify-center gap-[3px]"
          aria-hidden="true"
        >
          <span
            className={`w-[3px] rounded-full bg-white transition-all duration-300 ${isPlaying ? 'animate-bar-1' : 'h-1.5'}`}
          />
          <span
            className={`w-[3px] rounded-full bg-white transition-all duration-300 ${isPlaying ? 'animate-bar-2' : 'h-3'}`}
          />
          <span
            className={`w-[3px] rounded-full bg-white transition-all duration-300 ${isPlaying ? 'animate-bar-3' : 'h-2'}`}
          />
          <span
            className={`w-[3px] rounded-full bg-white transition-all duration-300 ${isPlaying ? 'animate-bar-4' : 'h-3.5'}`}
          />
          <span
            className={`w-[3px] rounded-full bg-white transition-all duration-300 ${isPlaying ? 'animate-bar-5' : 'h-1'}`}
          />
        </div>
      </button>

      {/* Floating Expandable Music Player Panel (Reverted to Glass Card) */}
      <div
        aria-hidden={!isExpanded}
        style={{ width: 'calc(100vw - 2rem)', maxWidth: '21rem' }}
        className={`music-float-strip absolute right-0 bottom-15 transform transition-all duration-300 ${
          isExpanded
            ? 'pointer-events-auto visible translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none invisible translate-y-4 scale-95 opacity-0'
        }`}
      >
        <div className="relative rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <MusicPlayer onPlayStateChange={setIsPlaying} />

          {/* Subtle overlay Close Button on the card top right */}
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            aria-label="Close music player"
            className="absolute top-3.5 right-3.5 z-30 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-[12px] leading-none text-white/40 transition hover:bg-white/10 hover:text-white"
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

        /* Waveform Animation Keyframes */
        @keyframes bar-1 {
          0%,
          100% {
            height: 6px;
          }
          50% {
            height: 14px;
          }
        }
        @keyframes bar-2 {
          0%,
          100% {
            height: 16px;
          }
          50% {
            height: 6px;
          }
        }
        @keyframes bar-3 {
          0%,
          100% {
            height: 8px;
          }
          50% {
            height: 18px;
          }
        }
        @keyframes bar-4 {
          0%,
          100% {
            height: 14px;
          }
          50% {
            height: 4px;
          }
        }
        @keyframes bar-5 {
          0%,
          100% {
            height: 4px;
          }
          50% {
            height: 10px;
          }
        }

        .animate-bar-1 {
          animation: bar-1 0.8s ease-in-out infinite;
        }
        .animate-bar-2 {
          animation: bar-2 1s ease-in-out infinite;
        }
        .animate-bar-3 {
          animation: bar-3 0.75s ease-in-out infinite;
        }
        .animate-bar-4 {
          animation: bar-4 0.9s ease-in-out infinite;
        }
        .animate-bar-5 {
          animation: bar-5 1.1s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .music-trigger,
          .animate-bar-1,
          .animate-bar-2,
          .animate-bar-3,
          .animate-bar-4,
          .animate-bar-5 {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
