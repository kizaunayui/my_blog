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
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/articles/${slug}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

const defaultPostContentClassName =
  'post-content-card prose max-w-none rounded-[2rem] border border-white/30 bg-white/90 p-7 shadow-2xl shadow-slate-950/24 backdrop-blur-2xl sm:p-9 dark:prose-invert dark:border-slate-400/20 dark:bg-slate-950/88'

const reflexionPostContentClassName =
  'post-content-card prose max-w-none rounded-[2rem] border border-white/35 bg-white/92 p-7 shadow-2xl shadow-slate-950/24 backdrop-blur-2xl sm:p-10 dark:prose-invert dark:border-slate-400/20 dark:bg-slate-950/88 prose-p:font-serif prose-p:text-[1.08rem] prose-p:leading-9 prose-p:text-slate-800 prose-p:tracking-normal dark:prose-p:text-slate-100 prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-l-4 prose-h2:border-cyan-300 prose-h2:pl-5 prose-h2:font-sans prose-h2:text-2xl prose-h2:font-black prose-h2:tracking-normal prose-h2:text-slate-950 dark:prose-h2:border-cyan-300/80 dark:prose-h2:text-white prose-strong:block prose-strong:my-8 prose-strong:font-serif prose-strong:text-xl prose-strong:font-bold prose-strong:leading-10 prose-strong:text-cyan-800 dark:prose-strong:text-cyan-100 prose-blockquote:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-cyan-300 prose-blockquote:bg-cyan-50/70 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:font-serif prose-blockquote:not-italic dark:prose-blockquote:border-cyan-300/80 dark:prose-blockquote:bg-cyan-400/10 prose-hr:my-14 prose-hr:border-cyan-200/70 dark:prose-hr:border-cyan-300/35'

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
        <header className="animate-fade-up mb-6 rounded-2xl border border-white/10 dark:border-white/10 bg-white/40 dark:bg-slate-950/35 px-4 py-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-md sm:mb-8 sm:rounded-3xl sm:px-6 sm:py-10 md:px-10 md:py-12">
          <dl>
            <dt className="sr-only">Published on</dt>
            <dd className="inline-flex items-center rounded-full border border-cyan-200/70 bg-cyan-50/80 px-3 py-1 font-heading text-xs font-black uppercase tracking-[0.18em] text-cyan-800 shadow-sm sm:px-4 sm:py-1.5 sm:text-sm dark:border-cyan-300/55 dark:bg-cyan-950/80 dark:text-white dark:shadow-[0_0_22px_rgba(34,211,238,0.28)]">
              <time dateTime={date}>
                {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
              </time>
            </dd>
          </dl>
          <div className="mt-5 text-gray-950 dark:text-white">
            <PageTitle>{title}</PageTitle>
          </div>
        </header>

        <section className="mb-6 rounded-2xl border border-white/10 dark:border-white/10 bg-white/40 dark:bg-slate-950/35 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-md sm:mb-8 sm:rounded-3xl sm:p-6">
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
                      className="h-10 w-10 rounded-full border border-white/20 shadow-sm"
                    />
                  )}
                  <div className="text-xs font-bold whitespace-nowrap">
                    <p className="text-gray-900 dark:text-white font-serif">{author.name}</p>
                    {author.twitter && (
                      <Link href={author.twitter} className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-100 dark:hover:text-white font-heading text-[10px] uppercase tracking-wider">
                        {author.twitter
                          .replace('https://twitter.com/', '@')
                          .replace('https://x.com/', '@')}
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {record && (record.location || record.weather) && (
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-800 dark:text-slate-100">
                  <span className="rounded-full border border-white/20 bg-white/10 dark:border-white/15 dark:bg-slate-900/40 px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-200">
                    记于
                  </span>
                  {record.location && <span>{record.location}</span>}
                  {record.weather && <span className="text-slate-500 dark:text-slate-100">{record.weather}</span>}
                </div>
              )}
            </div>

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-200">Tags</span>
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold xl:justify-end font-heading uppercase tracking-wider">
              {prev && (prev.slug || prev.path) && (
                <Link href={articleHref(prev)} className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-100 dark:hover:text-white">
                  ← Previous
                </Link>
              )}
              {next && (next.slug || next.path) && (
                <Link href={articleHref(next)} className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-100 dark:hover:text-white">
                  Next →
                </Link>
              )}
              <Link
                href="/articles"
                className="rounded-full border border-white/20 bg-white/10 dark:border-white/15 dark:bg-slate-900/40 px-4 py-2 text-slate-800 dark:text-white transition hover:bg-white/20 dark:hover:bg-slate-800/75"
                aria-label="Back to articles"
              >
                返回列表
              </Link>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          {pdf && (
            <section className="post-meta-card rounded-[2rem] border border-white/25 bg-white/44 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl dark:border-slate-400/20 dark:bg-slate-950/52">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-950 dark:text-white">PDF 资料</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-100">
                    这篇文章绑定了 PDF 文件，可下载或在桌面端在线预览。
                  </p>
                </div>
                <Link
                  href={pdf}
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  下载 PDF
                </Link>
              </div>
              <div className="mt-5 hidden overflow-hidden rounded-2xl border border-white/30 bg-white/70 shadow-inner shadow-slate-950/10 md:block dark:border-slate-400/20 dark:bg-slate-900/70">
                <iframe src={pdf} title={`${title} PDF 预览`} className="h-[760px] w-full" />
              </div>
            </section>
          )}

          <div className={postContentClassName}>{children}</div>

          <div className="post-meta-card rounded-2xl border border-white/25 bg-white/50 p-4 text-sm font-bold text-slate-800 shadow-xl shadow-slate-950/20 backdrop-blur-2xl sm:rounded-3xl sm:p-5 dark:border-slate-400/20 dark:bg-slate-950/60 dark:text-slate-100">
            <Link href={discussUrl(slug)} rel="nofollow" className="text-cyan-800 hover:text-cyan-900 dark:text-cyan-100 dark:hover:text-white">
              Discuss on Twitter
            </Link>
            {` • `}
            <Link href={editUrl(filePath)} className="text-cyan-800 hover:text-cyan-900 dark:text-cyan-100 dark:hover:text-white">
              View on GitHub
            </Link>
          </div>

          {siteMetadata.comments && (
            <div
              className="post-meta-card rounded-2xl border border-white/25 bg-white/50 p-4 text-center font-bold text-slate-800 shadow-xl shadow-slate-950/20 backdrop-blur-2xl sm:rounded-3xl sm:p-6 dark:border-slate-400/20 dark:bg-slate-950/60 dark:text-slate-100"
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
