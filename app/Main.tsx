import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { contentSections } from '@/data/contentSections'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'

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
    <nav className="mt-8 flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white/70 p-4 text-sm font-semibold shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/60">
      {prevPage ? (
        <Link href={previousHref} rel="prev" className="text-cyan-700 hover:text-cyan-800 dark:text-cyan-200 dark:hover:text-white">
          上一页
        </Link>
      ) : (
        <span className="text-gray-400">上一页</span>
      )}
      <span className="text-gray-500 dark:text-gray-400">
        {currentPage} / {totalPages}
      </span>
      {nextPage ? (
        <Link href={nextHref} rel="next" className="text-cyan-700 hover:text-cyan-800 dark:text-cyan-200 dark:hover:text-white">
          下一页
        </Link>
      ) : (
        <span className="text-gray-400">下一页</span>
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
        <section className="home-hero relative overflow-hidden pt-10 pb-12 sm:pt-16 sm:pb-16">
          <div className="home-hero-bg pointer-events-none absolute inset-0">
            <div className="hero-grid" />
          </div>

          <div className="home-hero-content animate-fade-up max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-400 shadow-sm backdrop-blur">
              随笔 · 学习 · 项目实践
            </p>
            <h1 className="text-4xl leading-[1.05] font-light tracking-wide text-gray-950 sm:text-5xl md:text-6.5xl dark:text-white font-serif">
              欢迎来到 <span className="font-serif italic font-light gradient-text block sm:inline mt-1.5 sm:mt-0">{siteMetadata.title}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed font-light text-slate-700 dark:text-slate-300">
              {siteMetadata.description}这里会持续整理正在学习的内容、遇到的问题，以及一些值得回看的想法。
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href="/articles" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/30">
                浏览文章
              </Link>
              {contentSections.map((section) => (
                <Link key={section.href} href={section.href} className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 dark:bg-slate-900/30 hover:bg-white/20 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-0.5">
                  {section.title}
                </Link>
              ))}
              <Link href="/about" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 dark:bg-slate-900/30 hover:bg-white/20 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-0.5">
                关于我
              </Link>
            </div>
          </div>

          {featuredPost && (
            <Link
              href={`/articles/${featuredPost.slug}`}
              className="featured-card animate-fade-up-delay mt-10 block rounded-3xl border border-white/15 bg-white/40 dark:bg-slate-950/30 p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-[0_20px_40px_rgba(6,182,212,0.1)]"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <p className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">
                    Featured Article · 最新推荐
                  </p>
                  <h2 className="font-serif text-2xl font-light tracking-wide text-gray-950 sm:text-3xl dark:text-white leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-light">{featuredPost.summary}</p>
                </div>
                <span className="shrink-0 font-heading text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400 border-b border-cyan-500/20 pb-0.5 group-hover:border-cyan-500 transition duration-300">
                  Read Article →
                </span>
              </div>
            </Link>
          )}
        </section>
      )}

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
        {/* Left Column: Recent Posts */}
        <section className={`lg:col-span-1 ${isFirstPage ? 'pb-8' : 'pt-12 pb-8 sm:pt-16'}`}>
          <div className="mb-8 flex items-end justify-between border-b border-slate-200/50 dark:border-white/5 pb-4">
            <div>
              <p className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">Journal Archive</p>
              <h2 className="mt-2 font-serif text-3xl font-light tracking-wide text-gray-950 dark:text-white">
                {isFirstPage ? '最近更新' : `最近更新 · 第 ${currentPage} 页`}
              </h2>
            </div>
            {posts.length > POSTS_PER_PAGE && (
              <Link href="/articles" className="hidden font-heading text-xs font-bold uppercase tracking-[0.18em] text-cyan-600 hover:text-cyan-500 sm:block dark:text-cyan-400 dark:hover:text-white border-b border-transparent hover:border-cyan-500/30 pb-0.5 transition duration-300">
                All Articles →
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {!posts.length && <p className="text-sm text-slate-500 dark:text-slate-400">暂无文章。</p>}
            {recentPosts.map((post, index) => {
              const { slug, date, title, summary, tags, recordedAt, body } = post
              const recordedText = formatRecordedAt(recordedAt)
              const readingTimeText = estimateReadingTime(body?.raw)

              return (
                <article
                  key={slug}
                  className="post-card-motion premium-row group border-b border-slate-200/50 dark:border-white/5 py-7 px-2"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="space-y-3 md:grid md:grid-cols-[10rem_1fr] md:gap-8 md:space-y-0">
                    <dl className="space-y-1.5">
                      <dt className="sr-only">发布时间</dt>
                      <dd className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                      {readingTimeText && (
                        <dd className="font-heading text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-600/80 dark:text-cyan-400/80">
                          {readingTimeText}
                        </dd>
                      )}
                      {recordedText && (
                        <dd className="font-heading text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                          {recordedText}
                        </dd>
                      )}
                    </dl>
                    <div className="flex-1 space-y-3">
                      <h3 className="font-serif text-2xl font-light tracking-wide text-gray-950 dark:text-white leading-tight">
                        <Link href={`/articles/${slug}`} className="premium-row-link transition group-hover:text-cyan-600 dark:group-hover:text-cyan-300">
                          {title}
                        </Link>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[13.5px] leading-relaxed font-light">{summary}</p>
                      <div className="inline-flex items-center gap-1 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition duration-300 pt-1">
                        Read Full Post <span className="text-[12px] leading-none">→</span>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {pagination && <HomePagination currentPage={currentPage} totalPages={pagination.totalPages} />}
        </section>

        {/* Right Column: Sticky Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-8 lg:h-fit lg:pt-16 pt-6">
          {/* About Me Card */}
          <div className="border border-white/10 dark:border-white/5 bg-white/40 dark:bg-slate-950/20 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-md p-6 rounded-3xl">
            <p className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">About Author</p>
            <div className="mt-5 flex items-center gap-4.5">
              <div className="h-12 w-12 shrink-0 rounded-full border border-white/20 bg-white/10 p-0.5 shadow-sm backdrop-blur-sm">
                <img
                  src={`${basePath}/static/images/kieran-icon.jpg`}
                  alt={siteMetadata.author}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-serif text-lg font-light tracking-wide text-gray-900 dark:text-white">{siteMetadata.author}</h4>
                <p className="font-heading text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-0.5">Developer / Writer</p>
              </div>
            </div>
            <p className="mt-5 text-xs leading-relaxed font-light text-slate-600 dark:text-slate-400">
              这里是 {siteMetadata.author} 的个人博客。持续整理正在学习的内容、遇到的问题，以及一些值得回看的想法。
            </p>
          </div>

          {/* Trending Tags Card */}
          {trendingTags.length > 0 && (
            <div className="border border-white/10 dark:border-white/5 bg-white/40 dark:bg-slate-950/20 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-md p-6 rounded-3xl">
              <p className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">Trending Tags</p>
              <div className="mt-4.5 flex flex-wrap gap-2.5">
                {trendingTags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            </div>
          )}

          {/* Newsletter Card */}
          {siteMetadata.newsletter?.provider && (
            <div className="border border-white/10 dark:border-white/5 bg-white/40 dark:bg-slate-950/20 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-md p-6 rounded-3xl">
              <p className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">Newsletter</p>
              <p className="mt-2 text-xs leading-relaxed font-light text-slate-600 dark:text-slate-400">
                第一时间获取最新文章与推送。
              </p>
              <div className="mt-4.5 home-newsletter-panel !border-0 !p-0 !shadow-none !bg-transparent">
                <NewsletterForm />
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}
