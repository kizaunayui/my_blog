'use client'

import siteMetadata from '@/data/siteMetadata'
import { useEffect, useState } from 'react'

const ScrollTopAndComment = () => {
  const [show, setShow] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 50) {
        setShow(true)
      } else {
        setShow(false)
      }

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setProgress(window.scrollY / totalHeight)
      }
    }

    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    handleWindowScroll()
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleScrollToComment = () => {
    document.getElementById('comment')?.scrollIntoView({ behavior: 'smooth' })
  }

  const radius = 17
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - progress * circumference

  return (
    <div
      className={`fixed right-6 bottom-6 z-50 flex flex-col gap-3.5 transition-all duration-500 transform ${
        show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'
      }`}
    >
      {siteMetadata.comments?.provider && (
        <button
          aria-label="Scroll To Comment"
          onClick={handleScrollToComment}
          className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-95"
        >
          <svg className="h-5 w-5 z-10 transition-transform group-hover:scale-105" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      <button
        aria-label="Scroll To Top"
        onClick={handleScrollTop}
        className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-95"
      >
        {/* Progress Circular Stroke */}
        <svg className="absolute inset-0 h-10 w-10 -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-200/40 dark:text-slate-800/40"
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="transparent"
            stroke="url(#top-progress-gradient)"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-75 ease-out"
          />
          <defs>
            <linearGradient id="top-progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <svg className="h-5 w-5 z-10 transition-transform group-hover:-translate-y-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

export default ScrollTopAndComment
