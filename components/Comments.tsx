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
            className="group font-heading relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/15 bg-transparent px-8 py-3.5 text-[10px] font-bold tracking-[0.2em] text-slate-200 uppercase transition-all duration-300 hover:border-cyan-500/35 hover:text-cyan-300 focus:outline-none"
          >
            <span className="relative z-10">点击加载评论 / Load Comments</span>
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        </div>
      )}
    </>
  )
}
