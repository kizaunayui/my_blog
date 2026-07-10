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
      <nav className="archive-pagination flex justify-between px-1 py-5 text-sm font-bold dark:text-slate-100">
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
          <Link
            href={`/${basePath}/page/${currentPage + 1}`}
            rel="next"
            className="dark:text-cyan-100 dark:hover:text-white"
          >
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
    <div className="list-layout-page py-6 sm:py-10 md:py-14">
      <div className="list-layout-heading subpage-masthead mb-8 px-1 py-8 sm:mb-12 sm:py-12">
        <div>
          <p className="font-heading mb-3 flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] text-cyan-300 uppercase">
            <span className="masthead-kicker-line" aria-hidden="true" />
            Blog Archive · 文章归档
          </p>
          <h1 className="font-serif text-3xl font-light tracking-wide text-white sm:text-4xl md:text-5xl">
            {title}
          </h1>
        </div>
        <p className="masthead-edition font-heading text-[9px] font-semibold tracking-[0.3em] text-white/35 uppercase">
          Curated notes / 2026
        </p>
      </div>

      <div className="list-layout-grid flex gap-6 sm:gap-10 lg:gap-20">
        <aside className="list-sidebar hidden h-fit max-h-[calc(100vh-3rem)] max-w-[210px] min-w-[210px] overflow-auto px-1 py-2 sm:block">
          {pathname.startsWith('/articles') ? (
            <h3 className="font-heading text-[10px] font-bold tracking-[0.25em] text-cyan-600 uppercase dark:text-cyan-100">
              All Posts · 所有文章
            </h3>
          ) : (
            <Link
              href={`/articles`}
              className="font-heading text-[10px] font-bold tracking-[0.25em] text-cyan-600 uppercase hover:text-cyan-500 dark:text-cyan-100 dark:hover:text-white"
            >
              All Posts · 所有文章
            </Link>
          )}
          <ul className="mt-6 space-y-1">
            {sortedTags.map((t, index) => {
              const isActive = decodeURIComponent(pathname.split('/tags/')[1] || '') === slug(t)
              return (
                <li key={t}>
                  {isActive ? (
                    <h3 className="archive-filter-link is-active font-heading flex items-center justify-between py-2 text-[10px] font-bold tracking-wider text-white uppercase">
                      <span>{`${String(index + 1).padStart(2, '0')} · ${t}`}</span>
                      <span>{tagCounts[t]}</span>
                    </h3>
                  ) : (
                    <Link
                      href={`/tags/${slug(t)}`}
                      className="archive-filter-link font-heading flex items-center justify-between py-2 text-[10px] font-bold tracking-wider text-slate-200 uppercase transition hover:text-cyan-100"
                      aria-label={`View posts tagged ${t}`}
                    >
                      <span>{`${String(index + 1).padStart(2, '0')} · ${t}`}</span>
                      <span>{tagCounts[t]}</span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </aside>

        <div className="list-content min-w-0 flex-1">
          <ul className="space-y-2">
            {displayPosts.map((post, index) => {
              const { path, date, title, summary, tags } = post
              return (
                <li key={path}>
                  <article className="archive-row premium-row group border-b border-white/10 px-1 py-6 sm:px-2 sm:py-8">
                    <span className="archive-row-index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="archive-date font-heading inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-cyan-300 uppercase">
                        <span className="h-px w-5 bg-cyan-300/50" aria-hidden="true" />
                        <time dateTime={date} suppressHydrationWarning>
                          {formatDate(date, siteMetadata.locale)}
                        </time>
                      </dd>
                    </dl>
                    <div className="archive-row-body mt-3.5 space-y-3 md:mt-0">
                      <div>
                        <h2 className="font-serif text-xl leading-tight font-light tracking-wide text-gray-950 sm:text-2xl dark:text-white">
                          <Link
                            href={`/${path}`}
                            className="premium-row-link text-slate-950 hover:text-cyan-600 dark:text-white dark:hover:text-cyan-100"
                          >
                            {title}
                          </Link>
                        </h2>
                        <div className="mt-3 flex flex-wrap gap-2.5">
                          {tags?.map((tag) => (
                            <Tag key={tag} text={tag} />
                          ))}
                        </div>
                      </div>
                      <p className="max-w-3xl text-[13.5px] leading-relaxed font-light text-slate-200">
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
