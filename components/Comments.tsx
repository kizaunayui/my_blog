'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)

  if (!siteMetadata.comments?.provider) {
    return null
  }
  return (
    <>
      {loadComments ? (
        <div className="w-full transition-all duration-300 ease-in-out">
          <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />
        </div>
      ) : (
        <div className="flex justify-center py-4">
          <button
            onClick={() => setLoadComments(true)}
            className="group font-heading relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-[10px] font-bold tracking-[0.2em] text-slate-800 uppercase shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/10 hover:text-cyan-400 focus:outline-none dark:border-white/5 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/60"
          >
            <span className="relative z-10">点击加载评论 / Load Comments</span>
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        </div>
      )}
    </>
  )
}
