import Link from '@/components/Link'
import Tag from '@/components/Tag'
import SpotlightCard from '@/components/SpotlightCard'
import { contentSections } from '@/data/contentSections'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

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
  const prevPage = currentPage > 1
  const nextPage = currentPage < totalPages
  const previousHref = currentPage === 2 ? '/' : `/page/${currentPage - 1}`
  const nextHref = `/page/${currentPage + 1}`

  if (totalPages <= 1) {
    return null
  }

  return (
    <nav className="mx-auto mt-7 flex w-fit items-center gap-1 rounded-full border border-gray-200/70 bg-white/65 p-1 text-xs font-bold shadow-lg shadow-slate-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      {prevPage ? (
        <Link
          href={previousHref}
          rel="prev"
          className="rounded-full px-3.5 py-2 text-cyan-700 transition hover:bg-cyan-50 hover:text-cyan-800 dark:text-cyan-100 dark:hover:bg-white/10 dark:hover:text-white"
        >
          上一页
        </Link>
      ) : (
        <span className="rounded-full px-3.5 py-2 text-gray-400 dark:text-slate-500">上一页</span>
      )}
      <span className="min-w-[3.75rem] rounded-full border border-slate-200/70 bg-white/65 px-3 py-2 text-center text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
        {currentPage} / {totalPages}
      </span>
      {nextPage ? (
        <Link
          href={nextHref}
          rel="next"
          className="rounded-full px-3.5 py-2 text-cyan-700 transition hover:bg-cyan-50 hover:text-cyan-800 dark:text-cyan-100 dark:hover:bg-white/10 dark:hover:text-white"
        >
          下一页
        </Link>
      ) : (
        <span className="rounded-full px-3.5 py-2 text-gray-400 dark:text-slate-500">下一页</span>
      )}
    </nav>
  )
}

export default function Home({ posts, initialDisplayPosts, pagination }) {
  const currentPage = pagination?.currentPage || 1
  const featuredPost = currentPage === 1 ? posts[0] : null
  const recentPosts = initialDisplayPosts || posts.slice(0, POSTS_PER_PAGE)
  const isFirstPage = currentPage === 1
  const basePath = process.env.BASE_PATH || ''

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
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[22rem_1fr] xl:grid-cols-[26rem_1fr] lg:items-start pt-6 pb-8 sm:pt-10 md:pt-16">
      
      {/* Left Column: Sticky Profile, Hero & Featured Post */}
      <div className="lg:sticky lg:top-12 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:flex lg:flex-col lg:justify-between space-y-10 lg:space-y-0 py-2 pr-2 scrollbar-none">
        
        {/* Top Part: Author Profile & Site Intro */}
        <div className="space-y-6">
          {/* Author Profile Card (Borderless, elegant) */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-sky-500 rounded-full blur opacity-35 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <img
                src={`${basePath}/static/images/kieran-icon.jpg`}
                alt={siteMetadata.author}
                className="relative h-14 w-14 rounded-full object-cover border-2 border-white/80 dark:border-slate-900/80 shadow-md"
              />
            </div>
            <div>
              <h4 className="font-serif text-lg font-light tracking-wide text-gray-900 dark:text-white">
                {siteMetadata.author}
              </h4>
              <p className="font-heading text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mt-0.5">
                Developer / Writer
              </p>
            </div>
          </div>

          {/* Hero Section */}
          <div className="space-y-4">
            <p className="inline-flex rounded-full border border-cyan-500/10 bg-cyan-500/5 dark:border-cyan-400/10 dark:bg-cyan-400/5 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 shadow-sm">
              随笔 · 学习 · 项目实践
            </p>
            <h1 className="text-[2.25rem] leading-tight font-light tracking-wide text-gray-950 dark:text-white font-serif">
              欢迎来到 <span className="font-serif italic font-light gradient-text block sm:inline mt-1 sm:mt-0 break-words animate-pulse-glow">{siteMetadata.title}</span>
            </h1>
            <p className="text-sm leading-relaxed font-light text-slate-600 dark:text-slate-400 max-w-sm">
              {siteMetadata.description}这里会持续整理正在学习的内容、遇到的问题，以及一些值得回看的想法。
            </p>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <Link href="/articles" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white shadow-md shadow-cyan-500/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/20 btn-shimmer">
              浏览文章
            </Link>
            {contentSections.map((section) => (
              <Link key={section.href} href={section.href} className="inline-flex items-center justify-center rounded-full border border-slate-200/50 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 px-4.5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200 transition duration-300 hover:-translate-y-0.5">
                {section.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Middle/Bottom Part: Featured Post (Sticky left side) */}
        {featuredPost && (
          <div className="border-t border-slate-200/60 dark:border-white/5 pt-8 lg:pt-6 space-y-3.5">
            <p className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              Featured · 最新推荐
            </p>
            <div className="relative group border-l-2 border-cyan-500/20 hover:border-cyan-500 pl-4 transition duration-300">
              <Link href={`/articles/${featuredPost.slug}`} className="block space-y-1.5">
                <h3 className="font-serif text-lg leading-snug font-light text-gray-900 dark:text-white transition group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                  {featuredPost.title}
                </h3>
                <p className="text-xs line-clamp-2 leading-relaxed text-slate-600 dark:text-slate-400 font-light">
                  {featuredPost.summary}
                </p>
                <span className="inline-flex items-center gap-1 font-heading text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition duration-300 pt-1">
                  Read Article →
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Part: Trending Tags */}
        {trendingTags.length > 0 && (
          <div className="hidden lg:block border-t border-slate-200/60 dark:border-white/5 pt-6 space-y-3">
            <p className="font-heading text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              Trending Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {trendingTags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Right Column: Scrollable Recent Posts & Mobile Widgets */}
      <div className="flex-1 space-y-10 lg:pl-6 xl:pl-10">
        
        {/* Recent Posts Section */}
        <section className="space-y-6">
          <div className="mb-6 flex items-end justify-between border-b border-slate-200/50 dark:border-white/5 pb-4">
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">Journal Archive</p>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-light tracking-wide text-gray-950 dark:text-white">
                {isFirstPage ? '最近更新' : `最近更新 · 第 ${currentPage} 页`}
              </h2>
            </div>
            {posts.length > POSTS_PER_PAGE && (
              <Link href="/articles" className="hidden sm:inline-flex font-heading text-xs font-bold uppercase tracking-[0.15em] text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-white link-underline-flow pb-0.5">
                All Articles →
              </Link>
            )}
          </div>

          <div className="space-y-2">
            {!posts.length && <p className="text-sm text-slate-500 dark:text-slate-400">暂无文章。</p>}
            {recentPosts.map((post, index) => {
              const { slug, date, title, summary, tags, recordedAt, body } = post
              const recordedText = formatRecordedAt(recordedAt)
              const readingTimeText = estimateReadingTime(body?.raw)

              return (
                <article
                  key={slug}
                  className="post-card-motion scroll-reveal premium-row group border-b border-slate-100 dark:border-white/5 py-6 px-1 sm:px-3 hover:bg-slate-500/5 dark:hover:bg-white/5 rounded-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="space-y-2 sm:space-y-3 md:grid md:grid-cols-[10rem_1fr] md:gap-8 md:space-y-0 items-start">
                    <dl className="space-y-1.5 md:pt-1">
                      <dt className="sr-only">发布时间</dt>
                      <dd className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                      {readingTimeText && (
                        <dd className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-cyan-600/80 dark:text-cyan-400/80">
                          {readingTimeText}
                        </dd>
                      )}
                      {recordedText && (
                        <dd className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                          {recordedText}
                        </dd>
                      )}
                    </dl>
                    <div className="flex-1 space-y-2.5">
                      <h3 className="font-serif text-xl sm:text-2xl font-light tracking-wide text-gray-950 dark:text-white leading-snug">
                        <Link href={`/articles/${slug}`} className="transition group-hover:text-cyan-600 dark:group-hover:text-cyan-400 block duration-300">
                          {title}
                        </Link>
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-light">{summary}</p>
                      <Link
                        href={`/articles/${slug}`}
                        className="inline-flex items-center gap-1 font-heading text-xs font-bold uppercase tracking-[0.15em] text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition duration-300 pt-1"
                      >
                        Read Full Post <span className="text-[12px] leading-none">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {pagination && <HomePagination currentPage={currentPage} totalPages={pagination.totalPages} />}
        </section>

        {/* Mobile/Tablet Fallback for Trending Tags */}
        {trendingTags.length > 0 && (
          <div className="block lg:hidden border-t border-slate-200/50 dark:border-white/5 pt-8 space-y-4">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              Trending Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
