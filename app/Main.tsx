import Link from '@/components/Link'
import Tag from '@/components/Tag'

import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import Image from '@/components/Image'
import EditorialPagination from '@/components/EditorialPagination'

const POSTS_PER_PAGE = 5
const CHINESE_CHARS_PER_MINUTE = 400
const ENGLISH_WORDS_PER_MINUTE = 225

type RecordedAt = {
  location?: string
  weather?: string
}

function formatRecordedAt(recordedAt?: RecordedAt | string) {
  if (!recordedAt) {
    return null
  }

  if (typeof recordedAt === 'string') {
    return recordedAt
  }

  return [recordedAt.location, recordedAt.weather].filter(Boolean).join(' · ') || null
}

function estimateReadingTime(raw?: string) {
  if (!raw) {
    return null
  }

  const text = raw
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[{}`*_#[\]()!>\-.|:]/g, ' ')
  const chineseChars = text.match(/[\u3400-\u9fff]/g)?.length || 0
  const englishWords = text.match(/[A-Za-z]+(?:['-][A-Za-z]+)?/g)?.length || 0
  const totalSeconds = Math.max(
    1,
    Math.round(
      (chineseChars / CHINESE_CHARS_PER_MINUTE + englishWords / ENGLISH_WORDS_PER_MINUTE) * 60
    )
  )
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes <= 0) {
    return `${seconds}秒`
  }

  return `${minutes}分钟${seconds}秒`
}

type Pagination = {
  currentPage: number
  totalPages: number
}

function HomePagination({ currentPage, totalPages }: Pagination) {
  const prevHref =
    currentPage > 1 ? (currentPage === 2 ? '/' : `/page/${currentPage - 1}`) : undefined
  const nextHref = currentPage < totalPages ? `/page/${currentPage + 1}` : undefined

  return (
    <EditorialPagination
      currentPage={currentPage}
      totalPages={totalPages}
      prevHref={prevHref}
      nextHref={nextHref}
    />
  )
}

export default function Home({ posts, initialDisplayPosts, pagination }) {
  const currentPage = pagination?.currentPage || 1

  const recentPosts = initialDisplayPosts || posts.slice(0, POSTS_PER_PAGE)
  const isFirstPage = currentPage === 1

  // Calculate trending tags from all posts dynamically
  const tagCounts = {}
  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })
  const trendingTags = Object.keys(tagCounts)
    .sort((a, b) => tagCounts[b] - tagCounts[a])
    .slice(0, 10)

  return (
    <div className="quiet-home">
      {isFirstPage && (
        <section className="quiet-intro" aria-labelledby="space-title">
          <p className="quiet-kicker">随笔 · 学习 · 项目实践</p>
          <div className="quiet-intro-line">
            <div className="quiet-brand">
              <p className="quiet-welcome">欢迎来到</p>
              <h1 id="space-title">{siteMetadata.title}</h1>
            </div>
            <p className="quiet-description">
              记录技术学习、项目实践与日常灵感。
              <br />
              把探索的过程写下来，让值得回看的想法有迹可循。
            </p>
          </div>
        </section>
      )}
      {/* Main Content Layout with Sticky Sidebar */}
      <div
        id="journal"
        className="space-journal home-journal-grid grid grid-cols-1 gap-10 lg:grid-cols-[1fr_20rem] lg:items-start"
      >
        {/* Left Column: Recent Posts */}
        <section className={`lg:col-span-1 ${isFirstPage ? 'pb-8' : 'pt-12 pb-8 sm:pt-16'}`}>
          <div className="journal-heading mb-6 flex items-end justify-between border-b border-slate-200/50 pb-4 sm:mb-8 dark:border-white/5">
            <div>
              <p className="font-heading text-xs font-bold tracking-[0.25em] text-cyan-600 uppercase dark:text-cyan-400">
                Journal Archive
              </p>
              <h2 className="mt-2 font-serif text-2xl font-light tracking-wide text-gray-950 sm:text-3xl md:text-4xl dark:text-white">
                {isFirstPage ? '最近更新' : `最近更新 · 第 ${currentPage} 页`}
              </h2>
            </div>
            {posts.length > POSTS_PER_PAGE && (
              <Link
                href="/articles"
                className="font-heading link-underline-flow pb-0.5 text-sm font-bold tracking-[0.18em] text-cyan-600 uppercase hover:text-cyan-500 sm:block dark:text-cyan-400 dark:hover:text-white"
              >
                全部文章 →
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {!posts.length && (
              <p className="text-sm text-slate-500 dark:text-slate-400">暂无文章。</p>
            )}
            {recentPosts.map((post, index) => {
              const { slug, date, title, summary, tags, recordedAt, body } = post
              const recordedText = formatRecordedAt(recordedAt)
              const readingTimeText = estimateReadingTime(body?.raw)

              return (
                <article
                  key={slug}
                  className="post-card-motion scroll-reveal premium-row group border-b border-slate-200/50 px-1 py-5 sm:px-2 sm:py-7 dark:border-white/5"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <span className="journal-entry-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="space-y-2 sm:space-y-3 md:grid md:grid-cols-[10rem_1fr] md:gap-8 md:space-y-0">
                    <dl className="space-y-1.5">
                      <dt className="sr-only">发布时间</dt>
                      <dd className="font-heading text-xs font-bold tracking-[0.2em] text-gray-500 uppercase dark:text-gray-300">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                      {readingTimeText && (
                        <dd className="font-heading text-xs font-bold tracking-[0.18em] text-cyan-600/80 uppercase dark:text-cyan-400/80">
                          {readingTimeText}
                        </dd>
                      )}
                      {recordedText && (
                        <dd className="font-heading text-xs font-bold tracking-[0.18em] text-gray-500 uppercase dark:text-gray-300">
                          {recordedText}
                        </dd>
                      )}
                    </dl>
                    <div className="flex-1 space-y-3">
                      <h3 className="font-serif text-xl leading-tight font-light tracking-wide text-gray-950 sm:text-2xl md:text-3xl dark:text-white">
                        <Link
                          href={`/articles/${slug}`}
                          className="premium-row-link transition group-hover:text-cyan-600 dark:group-hover:text-cyan-300"
                        >
                          {title}
                        </Link>
                      </h3>
                      <div className="quiet-post-tags flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed font-light text-slate-700 dark:text-slate-300">
                        {summary}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {pagination && (
            <HomePagination currentPage={currentPage} totalPages={pagination.totalPages} />
          )}
        </section>

        {/* Right Column: Sticky Sidebar */}
        <aside className="home-index-aside space-y-4 pt-4 sm:space-y-6 sm:pt-6 lg:sticky lg:top-8 lg:h-fit lg:pt-16">
          {/* About Me Card */}
          <Link href="/about" className="home-side-panel block p-4 sm:p-6">
            <p className="font-heading text-xs font-bold tracking-[0.25em] text-cyan-600 uppercase dark:text-cyan-400">
              About Author
            </p>
            <div className="mt-4 flex items-center gap-3 sm:mt-5 sm:gap-4.5">
              <div className="h-12 w-12 shrink-0 rounded-full border border-white/15 bg-transparent p-0.5">
                <Image
                  src="/static/images/kieran-icon.jpg"
                  alt={siteMetadata.author}
                  width={48}
                  height={48}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-serif text-xl font-light tracking-wide text-gray-900 dark:text-white">
                  {siteMetadata.author}
                </h4>
                <p className="font-heading mt-0.5 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-400">
                  Developer / Writer
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed font-light text-slate-600 sm:mt-5 dark:text-slate-400">
              这里是 {siteMetadata.author}{' '}
              的个人博客。持续整理正在学习的内容、遇到的问题，以及一些值得回看的想法。
            </p>
          </Link>

          {/* Trending Tags Card */}
          {trendingTags.length > 0 && (
            <div className="home-side-panel home-side-panel-tags p-4 sm:p-6">
              <p className="font-heading text-[10px] font-bold tracking-[0.25em] text-cyan-600 uppercase dark:text-cyan-400">
                Trending Tags
              </p>
              <div className="mt-4.5 flex flex-wrap gap-2.5">
                {trendingTags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
