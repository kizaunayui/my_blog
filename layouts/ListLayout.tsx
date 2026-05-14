'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'

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
    <div className="space-y-2 pt-8 pb-8 md:space-y-5">
      <nav className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white/70 p-4 text-sm font-semibold shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/60">
        {!prevPage && (
          <button className="cursor-auto text-gray-400 disabled:opacity-50" disabled={!prevPage}>
            上一页
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-300"
          >
            上一页
          </Link>
        )}
        <span className="text-gray-500 dark:text-gray-400">
          {currentPage} / {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto text-gray-400 disabled:opacity-50" disabled={!nextPage}>
            下一页
          </button>
        )}
        {nextPage && (
          <Link
            href={`/${basePath}/page/${currentPage + 1}`}
            rel="next"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-300"
          >
            下一页
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div>
        <div className="animate-fade-up space-y-6 pt-8 pb-10 md:pt-12 md:pb-12">
          <div>
            <p className="text-primary-600 dark:text-primary-300 text-sm font-semibold">Archive</p>
            <h1 className="mt-2 text-4xl leading-tight font-black tracking-tight text-gray-950 sm:text-5xl md:text-6xl dark:text-white">
              {title}
            </h1>
          </div>
          <div className="relative max-w-2xl">
            <label>
              <span className="sr-only">搜索文章</span>
              <input
                aria-label="搜索文章"
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索标题、摘要或标签"
                className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-full border border-gray-200 bg-white/80 px-5 py-3 pr-12 text-gray-900 shadow-sm backdrop-blur transition dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-100"
              />
            </label>
            <svg
              className="absolute top-3.5 right-4 h-5 w-5 text-gray-400 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <ul className="grid gap-5">
          {!filteredBlogPosts.length && '没有找到文章。'}
          {displayPosts.map((post, index) => {
            const { path, date, title, summary, tags } = post
            return (
              <li
                key={path}
                className="post-card-motion"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <article className="group hover:border-primary-200 hover:shadow-primary-100/70 dark:hover:border-primary-800 dark:hover:shadow-primary-950/30 rounded-2xl border border-gray-200/80 bg-white/75 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl md:grid md:grid-cols-4 md:gap-8 dark:border-gray-800/80 dark:bg-gray-900/60">
                  <dl>
                    <dt className="sr-only">发布时间</dt>
                    <dd className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                    </dd>
                  </dl>
                  <div className="mt-4 md:col-span-3 md:mt-0">
                    <h3 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
                      <Link
                        href={`/${path}`}
                        className="group-hover:text-primary-600 dark:group-hover:text-primary-300 transition"
                      >
                        {title}
                      </Link>
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags?.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">{summary}</p>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
