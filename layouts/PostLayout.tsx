import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (slug) =>
  `https://x.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/articles/${slug}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

const defaultPostContentClassName =
  'post-content-card prose max-w-none p-1 sm:p-2 dark:prose-invert'

const reflexionPostContentClassName =
  'post-content-card prose max-w-none p-1 sm:p-2 dark:prose-invert prose-p:font-serif prose-p:text-[1.08rem] prose-p:leading-9 prose-p:text-slate-200 prose-p:tracking-normal dark:prose-p:text-slate-100 prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-l-4 prose-h2:border-cyan-300/50 prose-h2:pl-5 prose-h2:font-sans prose-h2:text-2xl prose-h2:font-black prose-h2:tracking-normal prose-h2:text-white dark:prose-h2:border-cyan-300/40 dark:prose-h2:text-white prose-strong:block prose-strong:my-8 prose-strong:font-serif prose-strong:text-xl prose-strong:font-bold prose-strong:leading-10 prose-strong:text-cyan-200 dark:prose-strong:text-cyan-100 prose-blockquote:border-l-4 prose-blockquote:border-cyan-400/30 prose-blockquote:pl-5 prose-blockquote:font-serif prose-blockquote:not-italic dark:prose-blockquote:border-cyan-300/25 prose-hr:my-14 prose-hr:border-white/10 dark:prose-hr:border-white/8'

type RecordedAt = {
  location?: string
  weather?: string
}

function normalizeRecordedAt(recordedAt?: RecordedAt | string | null): RecordedAt | null {
  if (!recordedAt) {
    return null
  }

  if (typeof recordedAt === 'string') {
    return { location: recordedAt }
  }

  return recordedAt
}

function articleHref(item?: { path: string; slug?: string }) {
  if (!item) {
    return ''
  }

  return `/articles/${item.slug || item.path.replace(/^blog\//, '')}`
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; slug?: string; title: string }
  prev?: { path: string; slug?: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, slug, date, title, tags, recordedAt, pdf } = content
  const postContentClassName =
    slug === 'reflexion' ? reflexionPostContentClassName : defaultPostContentClassName
  const record = normalizeRecordedAt(recordedAt as RecordedAt | string | null)

  return (
    <>
      <ScrollTopAndComment />
      <article className="py-6 sm:py-10 md:py-12">
        {/* Title header — transparent */}
        <header className="post-header animate-fade-up mb-6 px-1 py-6 text-center sm:mb-8 sm:px-2 sm:py-8 md:py-10">
          <dl>
            <dt className="sr-only">Published on</dt>
            <dd className="inline-flex items-center gap-2 font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-500 dark:text-cyan-400">
              <span className="h-px w-6 bg-gradient-to-r from-cyan-500/50 to-transparent" />
              <time dateTime={date}>
                {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
              </time>
              <span className="h-px w-6 bg-gradient-to-l from-cyan-500/50 to-transparent" />
            </dd>
          </dl>
          <div className="mt-4 text-white">
            <PageTitle>{title}</PageTitle>
          </div>
          {/* Bottom gradient line */}
          <div className="mx-auto mt-6 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-white/15 to-transparent sm:mt-8" />
        </header>

        {/* Meta bar — transparent */}
        <section className="post-meta-bar mb-6 px-1 py-4 sm:mb-8 sm:px-2 sm:py-5">
          <div className="grid gap-4 sm:gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,1fr)] xl:items-center">
            <div className="flex flex-wrap items-center gap-4">
              {authorDetails.map((author) => (
                <div className="flex items-center gap-3" key={author.name}>
                  {author.avatar && (
                    <Image
                      src={author.avatar}
                      width={42}
                      height={42}
                      alt="avatar"
                      className="h-10 w-10 rounded-full border border-white/15 shadow-sm"
                    />
                  )}
                  <div className="text-xs font-bold whitespace-nowrap">
                    <p className="text-white font-serif">{author.name}</p>
                    {author.twitter && (
                      <Link href={author.twitter} className="text-cyan-400/70 hover:text-cyan-300 font-heading text-[10px] uppercase tracking-wider">
                        {author.twitter
                          .replace('https://twitter.com/', '@')
                          .replace('https://x.com/', '@')}
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {record && (record.location || record.weather) && (
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
                  <span className="font-heading text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                    记于
                  </span>
                  {record.location && <span>{record.location}</span>}
                  {record.weather && <span className="text-white/50">{record.weather}</span>}
                </div>
              )}
            </div>

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Tags</span>
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold xl:justify-end font-heading uppercase tracking-wider">
              {prev && (prev.slug || prev.path) && (
                <Link href={articleHref(prev)} className="text-cyan-400/70 hover:text-cyan-300">
                  ← Previous
                </Link>
              )}
              {next && (next.slug || next.path) && (
                <Link href={articleHref(next)} className="text-cyan-400/70 hover:text-cyan-300">
                  Next →
                </Link>
              )}
              <Link
                href="/articles"
                className="rounded-full border border-white/10 px-4 py-2 text-white/70 transition hover:border-white/20 hover:text-white"
                aria-label="Back to articles"
              >
                返回列表
              </Link>
            </div>
          </div>
          {/* Bottom separator */}
          <div className="mt-5 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
        </section>

        <div className="space-y-6">
          {pdf && (
            <section className="post-pdf-section px-1 py-5 sm:px-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">PDF 资料</h2>
                  <p className="mt-1 text-sm font-semibold text-white/60">
                    这篇文章绑定了 PDF 文件，可下载或在桌面端在线预览。
                  </p>
                </div>
                <Link
                  href={pdf}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:border-white/25 hover:text-cyan-200"
                >
                  下载 PDF
                </Link>
              </div>
              <div className="mt-5 hidden overflow-hidden rounded-xl border border-white/10 md:block">
                <iframe src={pdf} title={`${title} PDF 预览`} className="h-[760px] w-full" />
              </div>
            </section>
          )}

          <div className={postContentClassName}>{children}</div>

          <div className="post-footer-links px-1 py-4 text-sm font-bold text-white/60 sm:px-2">
            <div className="mb-4 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
            <Link href={discussUrl(slug)} rel="nofollow" className="text-cyan-400/70 hover:text-cyan-300">
              Discuss on Twitter
            </Link>
            {` • `}
            <Link href={editUrl(filePath)} className="text-cyan-400/70 hover:text-cyan-300">
              View on GitHub
            </Link>
          </div>

          {siteMetadata.comments && (
            <div
              className="post-comments px-1 py-4 text-center font-bold text-white sm:px-2 sm:py-6"
              id="comment"
            >
              <Comments slug={slug} />
            </div>
          )}
        </div>
      </article>
    </>
  )
}
