'use client'

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
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div>
        <div className="animate-fade-up space-y-4 pt-6 pb-8 sm:space-y-6 sm:pt-8 sm:pb-10 md:pt-12 md:pb-12">
          <div>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-300">Archive</p>
            <h1 className="mt-2 text-2xl leading-tight font-black tracking-tight text-gray-950 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl dark:text-white">
              {title}
            </h1>
          </div>
        </div>
        <ul className="grid gap-5">
          {!displayPosts.length && '暂无文章。'}
          {displayPosts.map((post, index) => {
            const { path, date, title, summary, tags } = post
            return (
              <li key={path} className="post-card-motion" style={{ animationDelay: `${index * 60}ms` }}>
                <article className="group rounded-xl border border-gray-200/80 bg-white/75 p-4 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-100/70 sm:rounded-2xl sm:p-6 dark:border-gray-800/80 dark:bg-gray-900/60 dark:hover:border-primary-800 dark:hover:shadow-primary-950/30 md:grid md:grid-cols-4 md:gap-8">
                  <dl>
                    <dt className="sr-only">发布时间</dt>
                    <dd className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                    </dd>
                  </dl>
                  <div className="mt-4 md:col-span-3 md:mt-0">
                    <h3 className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl dark:text-white">
                      <Link href={`/${path}`} className="transition group-hover:text-primary-600 dark:group-hover:text-primary-300">
                        {title}
                      </Link>
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">{summary}</p>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
