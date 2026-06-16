import Link from '@/components/Link'
import Tag from '@/components/Tag'
import SpotlightCard from '@/components/SpotlightCard'
import { contentSections } from '@/data/contentSections'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import Magnetic from '@/components/Magnetic'
import TextScramble from '@/components/TextScramble'

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
    <>
      {isFirstPage && (
        <section className="home-hero relative overflow-hidden pt-6 pb-8 sm:pt-10 sm:pb-12 md:pt-16 md:pb-16">
          <div className="home-hero-bg pointer-events-none absolute inset-0">
            <div className="hero-grid" />
          </div>

          <div className="home-hero-content animate-fade-up max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4.5 py-1.5 text-xs font-bold tracking-[0.22em] text-cyan-600 uppercase shadow-sm backdrop-blur dark:text-cyan-400">
              随笔 · 学习 · 项目实践
            </p>
            <h1 className="animate-fade-in-up font-serif text-[2rem] leading-tight font-light tracking-wide text-gray-950 sm:text-[2.5rem] sm:leading-[1.05] md:text-[3.5rem] lg:text-[4.5rem] dark:text-white">
              欢迎来到{' '}
              <span className="gradient-text animate-pulse-glow mt-1 block font-serif font-light break-words italic sm:mt-0 sm:inline">
                {siteMetadata.title}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed font-light text-slate-700 md:text-lg dark:text-slate-300">
              {siteMetadata.description}
              这里会持续整理正在学习的内容、遇到的问题，以及一些值得回看的想法。
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3.5">
              <Magnetic range={60} actionStrength={0.25}>
                <Link
                  href="/articles"
                  className="btn-shimmer inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-sky-500 px-6 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-0.5 hover:from-cyan-500 hover:to-sky-400 hover:shadow-cyan-500/30 sm:px-6.5"
                >
                  浏览文章
                </Link>
              </Magnetic>
              {contentSections.map((section) => (
                <Magnetic key={section.href} range={60} actionStrength={0.25}>
                  <Link
                    href={section.href}
                    className="btn-shimmer inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/20 sm:px-5.5 dark:bg-slate-900/30"
                  >
                    {section.title}
                  </Link>
                </Magnetic>
              ))}
              <Magnetic range={60} actionStrength={0.25}>
                <Link
                  href="/about"
                  className="btn-shimmer inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/20 sm:px-5.5 dark:bg-slate-900/30"
                >
                  关于我
                </Link>
              </Magnetic>
            </div>
          </div>

          {featuredPost && (
            <Link
              href={`/articles/${featuredPost.slug}`}
              className="featured-spotlight group animate-fade-up-delay mt-8 block transition duration-400 sm:mt-12 md:mt-14"
            >
              {/* Decorative gradient top line */}
              <div className="featured-spotlight-line h-px w-full" />

              <div className="px-1 pt-6 pb-2 sm:px-2 sm:pt-8 sm:pb-4 md:pt-10 md:pb-6">
                {/* Label row with reading time */}
                <div className="mb-4 flex items-center gap-3 sm:mb-5">
                  <span className="font-heading text-[10px] font-bold tracking-[0.3em] text-cyan-500 uppercase dark:text-cyan-400">
                    <TextScramble text="✦ Featured" triggerOn="hover" />
                  </span>
                  <span className="h-px max-w-16 flex-1 bg-gradient-to-r from-cyan-500/40 to-transparent" />
                  {estimateReadingTime(featuredPost.body?.raw) && (
                    <span className="font-heading text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                      {estimateReadingTime(featuredPost.body?.raw)}
                    </span>
                  )}
                </div>

                {/* Big title */}
                <h2 className="font-serif text-3xl leading-snug font-light tracking-wide text-white transition-colors duration-300 group-hover:text-cyan-100 sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
                  <TextScramble text={featuredPost.title} triggerOn="hover" />
                </h2>

                {/* Summary */}
                <p className="mt-3 max-w-2xl text-sm leading-relaxed font-light text-white/55 transition-colors duration-300 group-hover:text-white/70 sm:mt-4 sm:text-base">
                  {featuredPost.summary}
                </p>

                {/* Tags + CTA row */}
                <div className="mt-5 flex items-center justify-between sm:mt-6">
                  <div className="flex flex-wrap gap-2">
                    {featuredPost.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="font-heading rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white/45 uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-heading flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-cyan-400/80 uppercase transition-all duration-300 group-hover:gap-2.5 group-hover:text-cyan-300">
                    Read
                    <span className="text-sm leading-none transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </div>

              {/* Bottom fade line */}
              <div className="h-px w-full bg-gradient-to-r from-white/8 via-white/5 to-transparent" />
            </Link>
          )}
        </section>
      )}

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
        {/* Left Column: Recent Posts */}
        <section className={`lg:col-span-1 ${isFirstPage ? 'pb-8' : 'pt-12 pb-8 sm:pt-16'}`}>
          <div className="mb-6 flex items-end justify-between border-b border-slate-200/50 pb-4 sm:mb-8 dark:border-white/5">
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
                className="font-heading link-underline-flow hidden pb-0.5 text-sm font-bold tracking-[0.18em] text-cyan-600 uppercase hover:text-cyan-500 sm:block dark:text-cyan-400 dark:hover:text-white"
              >
                All Articles →
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
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed font-light text-slate-700 dark:text-slate-300">
                        {summary}
                      </p>
                      <Link
                        href={`/articles/${slug}`}
                        className="font-heading inline-flex items-center gap-1 pt-1 text-xs font-bold tracking-[0.2em] text-cyan-600 uppercase transition duration-300 group-hover:translate-x-1 dark:text-cyan-400"
                      >
                        Read Full Post <span className="text-[12px] leading-none">→</span>
                      </Link>
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
        <aside className="space-y-4 pt-4 sm:space-y-6 sm:pt-6 lg:sticky lg:top-8 lg:h-fit lg:pt-16">
          {/* About Me Card */}
          <Link href="/about" className="home-side-panel block p-4 sm:p-6">
            <p className="font-heading text-xs font-bold tracking-[0.25em] text-cyan-600 uppercase dark:text-cyan-400">
              About Author
            </p>
            <div className="mt-4 flex items-center gap-3 sm:mt-5 sm:gap-4.5">
              <div className="h-12 w-12 shrink-0 rounded-full border border-white/20 bg-white/10 p-0.5 shadow-sm backdrop-blur-sm">
                <img
                  src={`${basePath}/static/images/kieran-icon.jpg`}
                  alt={siteMetadata.author}
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
    </>
  )
}
