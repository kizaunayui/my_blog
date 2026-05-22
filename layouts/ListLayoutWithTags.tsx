'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="list-pagination space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between rounded-3xl border border-white/25 bg-white/30 px-5 py-4 text-sm font-bold shadow-xl shadow-slate-950/20 backdrop-blur-2xl">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className="list-layout-page py-10 sm:py-14">
      <div className="list-layout-heading mb-8 rounded-[2rem] border border-white/25 bg-white/24 px-6 py-8 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl sm:px-8">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-white drop-shadow-[0_10px_26px_rgba(0,0,0,0.62)]">
          Blog Archive
        </p>
        <h1 className="text-4xl leading-tight font-black tracking-tight text-white drop-shadow-[0_18px_48px_rgba(0,0,0,0.72)] sm:text-5xl md:text-6xl">
          {title}
        </h1>
      </div>

      <div className="list-layout-grid flex gap-8 sm:gap-10">
        <aside className="list-sidebar hidden h-fit max-h-[calc(100vh-3rem)] max-w-[280px] min-w-[280px] overflow-auto rounded-[1.75rem] border border-white/25 bg-white/30 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl sm:block dark:border-slate-400/20 dark:bg-slate-950/45">
          {pathname.startsWith('/blog') ? (
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">All Posts</h3>
          ) : (
            <Link
              href={`/blog`}
              className="text-sm font-black uppercase tracking-[0.18em] text-white hover:text-cyan-100"
            >
              All Posts
            </Link>
          )}
          <ul className="mt-5 space-y-2">
            {sortedTags.map((t) => {
              const isActive = decodeURIComponent(pathname.split('/tags/')[1] || '') === slug(t)
              return (
                <li key={t}>
                  {isActive ? (
                    <h3 className="inline-flex rounded-full bg-gradient-to-r from-cyan-600/80 to-sky-400/70 px-3 py-2 text-sm font-black uppercase text-white shadow-lg shadow-cyan-950/20">
                      {`${t} (${tagCounts[t]})`}
                    </h3>
                  ) : (
                    <Link
                      href={`/tags/${slug(t)}`}
                      className="inline-flex rounded-full px-3 py-2 text-sm font-bold uppercase text-slate-100 transition hover:bg-white/14 hover:text-white"
                      aria-label={`View posts tagged ${t}`}
                    >
                      {`${t} (${tagCounts[t]})`}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </aside>

        <div className="list-content min-w-0 flex-1">
          <ul className="space-y-5">
            {displayPosts.map((post) => {
              const { path, date, title, summary, tags } = post
              return (
                <li key={path}>
                  <article className="list-post-card rounded-[1.75rem] border border-white/28 bg-white/48 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/56 hover:shadow-cyan-950/20 dark:border-slate-400/20 dark:bg-slate-950/45 dark:hover:bg-slate-900/60">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-sm leading-6 font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">
                        <time dateTime={date} suppressHydrationWarning>
                          {formatDate(date, siteMetadata.locale)}
                        </time>
                      </dd>
                    </dl>
                    <div className="mt-3 space-y-3">
                      <div>
                        <h2 className="text-2xl leading-8 font-black tracking-tight">
                          <Link href={`/${path}`} className="text-slate-950 hover:text-cyan-700 dark:text-white dark:hover:text-cyan-200">
                            {title}
                          </Link>
                        </h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                        </div>
                      </div>
                      <p className="max-w-none text-base leading-7 font-semibold text-slate-700 dark:text-slate-200">
                        {summary}
                      </p>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
          {pagination && pagination.totalPages > 1 && (
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          )}
        </div>
      </div>
    </div>
  )
}
