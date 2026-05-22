import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { contentSections } from '@/data/contentSections'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'

const MAX_DISPLAY = 6

type RecordedAt = {
  location?: string
  weather?: string
}

type ReadingTime = {
  minutes?: number
  time?: number
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

function formatReadingTime(readingTime?: ReadingTime) {
  if (!readingTime) {
    return null
  }

  const totalSeconds = Math.max(
    0,
    Math.round(
      typeof readingTime.time === 'number'
        ? readingTime.time / 1000
        : (readingTime.minutes || 0) * 60
    )
  )
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `(${minutes}分钟)${seconds}秒`
}

export default function Home({ posts }) {
  const featuredPost = posts[0]
  const recentPosts = posts.slice(0, MAX_DISPLAY)

  return (
    <>
      <section className="home-hero relative overflow-hidden pt-10 pb-14 sm:pt-16 md:pb-20">
        <div className="home-hero-bg pointer-events-none absolute inset-0">
          <div className="hero-grid" />
        </div>

        <div className="home-hero-content animate-fade-up max-w-3xl">
          <p className="mb-5 inline-flex rounded-full border border-primary-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm backdrop-blur dark:border-primary-500/20 dark:bg-gray-900/60 dark:text-primary-300">
            随笔 · 学习 · 项目实践
          </p>
          <h1 className="text-5xl leading-[0.95] font-black tracking-tight text-gray-950 sm:text-6xl md:text-7xl dark:text-white">
            欢迎来到 <span className="gradient-text">{siteMetadata.title}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl dark:text-gray-300">
            {siteMetadata.description}这里会持续整理正在学习的内容、遇到的问题，以及一些值得回看的想法。
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/articles" className="button-primary">
              浏览文章
            </Link>
            {contentSections.map((section) => (
              <Link key={section.href} href={section.href} className="button-secondary">
                {section.title}
              </Link>
            ))}
            <Link href="/about" className="button-secondary">
              关于我
            </Link>
          </div>
        </div>

        {featuredPost && (
          <Link
            href={`/articles/${featuredPost.slug}`}
            className="home-featured-card featured-card animate-fade-up-delay mt-12 block rounded-3xl border border-gray-200/80 bg-white/80 p-6 shadow-xl shadow-gray-200/50 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-200/50 dark:border-gray-800/80 dark:bg-gray-900/70 dark:shadow-black/30 dark:hover:shadow-primary-950/40"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-sm font-semibold text-primary-600 dark:text-primary-300">
                  最新文章
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
                  {featuredPost.title}
                </h2>
                <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-300">{featuredPost.summary}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-primary-600 dark:text-primary-300">
                继续阅读 →
              </span>
            </div>
          </Link>
        )}
      </section>

      <section className="pb-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-300">Latest Posts</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
              最近更新
            </h2>
          </div>
          {posts.length > MAX_DISPLAY && (
            <Link href="/articles" className="hidden text-sm font-semibold text-primary-600 hover:text-primary-700 sm:block dark:text-primary-300">
              全部文章 →
            </Link>
          )}
        </div>

        <div className="grid gap-5">
          {!posts.length && '暂无文章。'}
          {recentPosts.map((post, index) => {
            const { slug, date, title, summary, tags, recordedAt, readingTime } = post
            const recordedText = formatRecordedAt(recordedAt)
            const readingTimeText = formatReadingTime(readingTime)

            return (
              <article
                key={slug}
                className="post-card-motion group rounded-2xl border border-gray-200/80 bg-white/75 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-100/70 dark:border-gray-800/80 dark:bg-gray-900/60 dark:hover:border-primary-800 dark:hover:shadow-primary-950/30"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="space-y-4 md:grid md:grid-cols-4 md:gap-8 md:space-y-0">
                  <dl>
                    <dt className="sr-only">发布时间</dt>
                    <dd className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                    </dd>
                    {readingTimeText && (
                      <dd className="mt-2 text-xs font-bold tracking-wide text-primary-600 dark:text-primary-300">
                        {readingTimeText}
                      </dd>
                    )}
                    {recordedText && (
                      <dd className="mt-2 text-xs font-bold tracking-wide text-gray-500/90 dark:text-gray-300/90">
                        {recordedText}
                      </dd>
                    )}
                  </dl>
                  <div className="md:col-span-3">
                    <h3 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
                      <Link href={`/articles/${slug}`} className="transition group-hover:text-primary-600 dark:group-hover:text-primary-300">
                        {title}
                      </Link>
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">{summary}</p>
                    <div className="mt-5 text-sm font-semibold text-primary-600 transition group-hover:translate-x-1 dark:text-primary-300">
                      阅读全文 →
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {posts.length > MAX_DISPLAY && (
          <div className="mt-8 flex justify-center sm:hidden">
            <Link href="/articles" className="button-secondary">
              全部文章
            </Link>
          </div>
        )}
      </section>

      {siteMetadata.newsletter?.provider && (
        <div className="home-newsletter-panel flex items-center justify-center pt-8">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
