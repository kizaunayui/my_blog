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
      <nav className="flex justify-between rounded-3xl border border-white/25 bg-white/30 px-5 py-4 text-sm font-bold shadow-xl shadow-slate-950/20 backdrop-blur-2xl dark:bg-slate-950/45 dark:text-slate-100">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            className="dark:text-cyan-100 dark:hover:text-white"
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
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next" className="dark:text-cyan-100 dark:hover:text-white">
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
      <div className="list-layout-heading mb-8 rounded-3xl border border-white/10 dark:border-white/10 bg-white/40 dark:bg-slate-950/35 px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-md sm:px-8">
        <p className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-100 dark:drop-shadow-[0_0_10px_rgba(103,232,249,0.32)]">
          Blog Archive · 文章归档
        </p>
        <h1 className="font-serif text-3xl font-light tracking-wide text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
          {title}
        </h1>
      </div>

      <div className="list-layout-grid flex gap-8 sm:gap-10">
        <aside className="list-sidebar hidden h-fit max-h-[calc(100vh-3rem)] max-w-[280px] min-w-[280px] overflow-auto rounded-3xl border border-white/10 dark:border-white/10 bg-white/40 dark:bg-slate-950/35 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-md sm:block">
          {pathname.startsWith('/blog') ? (
            <h3 className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-100">All Posts · 所有文章</h3>
          ) : (
            <Link
              href={`/blog`}
              className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-600 hover:text-cyan-500 dark:text-cyan-100 dark:hover:text-white"
            >
              All Posts · 所有文章
            </Link>
          )}
          <ul className="mt-5 space-y-2">
            {sortedTags.map((t) => {
              const isActive = decodeURIComponent(pathname.split('/tags/')[1] || '') === slug(t)
              return (
                <li key={t}>
                  {isActive ? (
                    <h3 className="inline-flex rounded-full bg-gradient-to-r from-cyan-600 to-sky-500 px-3 py-1.5 font-heading text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      {`${t} (${tagCounts[t]})`}
                    </h3>
                  ) : (
                    <Link
                      href={`/tags/${slug(t)}`}
                      className="inline-flex rounded-full px-3 py-1.5 font-heading text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-100 transition"
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
          <ul className="space-y-2">
            {displayPosts.map((post) => {
              const { path, date, title, summary, tags } = post
              return (
                <li key={path}>
                  <article className="premium-row group border-b border-slate-200/50 dark:border-white/10 py-7 px-2">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-cyan-100 dark:drop-shadow-[0_0_10px_rgba(103,232,249,0.32)]">
                        <time dateTime={date} suppressHydrationWarning>
                          {formatDate(date, siteMetadata.locale)}
                        </time>
                      </dd>
                    </dl>
                    <div className="mt-3.5 space-y-3">
                      <div>
                        <h2 className="font-serif text-2xl font-light tracking-wide text-gray-950 dark:text-white leading-tight">
                          <Link href={`/${path}`} className="premium-row-link text-slate-950 hover:text-cyan-600 dark:text-white dark:hover:text-cyan-100">
                            {title}
                          </Link>
                        </h2>
                        <div className="mt-3 flex flex-wrap gap-2.5">
                          {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                        </div>
                      </div>
                      <p className="max-w-none text-[13.5px] leading-relaxed font-light text-slate-700 dark:text-slate-100">
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
