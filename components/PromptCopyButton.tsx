'use client'

import { useEffect, useRef, useState } from 'react'

export default function PromptCopyButton({ prompt }: { prompt: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  const handleCopy = async () => {
    if (resetTimer.current) clearTimeout(resetTimer.current)

    try {
      await navigator.clipboard.writeText(prompt)
      setStatus('copied')
    } catch {
      setStatus('error')
    }

    resetTimer.current = setTimeout(() => setStatus('idle'), 2400)
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <span role="status" className="text-sm text-slate-200">
        {status === 'error' ? '复制失败，请手动选择模板正文。' : ''}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="editorial-action editorial-action--primary font-heading inline-flex min-w-32 items-center justify-center rounded-full bg-cyan-600 px-5 py-2.5 text-xs font-bold tracking-[0.16em] text-white uppercase transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400"
        aria-live="polite"
      >
        {status === 'copied' ? '已复制' : '复制 Prompt'}
      </button>
    </div>
  )
}
