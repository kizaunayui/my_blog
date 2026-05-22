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
  'post-content-card prose max-w-none rounded-[2rem] border border-white/30 bg-white/68 p-7 shadow-2xl shadow-slate-950/24 backdrop-blur-2xl sm:p-9 dark:prose-invert dark:border-slate-400/20 dark:bg-slate-950/62'

const reflexionPostContentClassName =
  'post-content-card prose max-w-none rounded-[2rem] border border-white/35 bg-white/78 p-7 shadow-2xl shadow-slate-950/24 backdrop-blur-2xl sm:p-10 dark:prose-invert dark:border-slate-400/20 dark:bg-slate-950/66 prose-p:font-serif prose-p:text-[1.08rem] prose-p:leading-9 prose-p:text-slate-800 prose-p:tracking-normal dark:prose-p:text-slate-100 prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-l-4 prose-h2:border-cyan-300 prose-h2:pl-5 prose-h2:font-sans prose-h2:text-2xl prose-h2:font-black prose-h2:tracking-normal prose-h2:text-slate-950 dark:prose-h2:border-cyan-400/60 dark:prose-h2:text-white prose-strong:block prose-strong:my-8 prose-strong:font-serif prose-strong:text-xl prose-strong:font-bold prose-strong:leading-10 prose-strong:text-cyan-800 dark:prose-strong:text-cyan-200 prose-blockquote:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-cyan-300 prose-blockquote:bg-cyan-50/70 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:font-serif prose-blockquote:not-italic dark:prose-blockquote:border-cyan-400/60 dark:prose-blockquote:bg-cyan-400/10 prose-hr:my-14 prose-hr:border-cyan-200/70 dark:prose-hr:border-cyan-400/20'

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
      <article className="py-10 sm:py-12">
        <header className="post-title-card animate-fade-up mb-6 rounded-[2rem] border border-white/25 bg-white/22 px-6 py-10 text-center shadow-2xl shadow-slate-950/25 backdrop-blur-2xl sm:px-10 dark:border-slate-400/20 dark:bg-slate-950/45">
          <dl>
            <dt className="sr-only">Published on</dt>
            <dd className="text-base leading-6 font-bold text-slate-200/90">
              <time dateTime={date}>
                {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
              </time>
            </dd>
          </dl>
          <div className="mt-4 text-white drop-shadow-[0_18px_42px_rgba(0,0,0,0.65)]">
            <PageTitle>{title}</PageTitle>
          </div>
        </header>

        <section className="post-side-card mb-8 rounded-[2rem] border border-white/25 bg-white/32 p-5 shadow-2xl shadow-slate-950/18 backdrop-blur-2xl dark:border-slate-400/20 dark:bg-slate-950/45 sm:p-6">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,1fr)] xl:items-center">
            <div className="flex flex-wrap items-center gap-4">
              {authorDetails.map((author) => (
                <div className="flex items-center gap-3" key={author.name}>
                  {author.avatar && (
                    <Image
                      src={author.avatar}
                      width={42}
                      height={42}
                      alt="avatar"
                      className="h-11 w-11 rounded-full border border-white/40 shadow-lg shadow-slate-950/20"
                    />
                  )}
                  <div className="text-sm leading-5 font-bold whitespace-nowrap">
                    <p className="text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]">{author.name}</p>
                    {author.twitter && (
                      <Link href={author.twitter} className="text-cyan-100 hover:text-white">
                        {author.twitter
                          .replace('https://twitter.com/', '@')
                          .replace('https://x.com/', '@')}
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {record && (record.location || record.weather) && (
                <div className="flex flex-wrap items-center gap-2 text-sm font-black text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]">
                  <span className="rounded-full border border-white/25 bg-white/16 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-slate-200">
                    记于
                  </span>
                  {record.location && <span>{record.location}</span>}
                  {record.weather && <span className="text-slate-200">{record.weather}</span>}
                </div>
              )}
            </div>

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-200">Tags</span>
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm font-black xl:justify-end">
              {prev && (prev.slug || prev.path) && (
                <Link href={articleHref(prev)} className="text-cyan-100 hover:text-white">
                  上一篇：{prev.title}
                </Link>
              )}
              {next && (next.slug || next.path) && (
                <Link href={articleHref(next)} className="text-cyan-100 hover:text-white">
                  下一篇：{next.title}
                </Link>
              )}
              <Link
                href="/articles"
                className="rounded-full border border-white/25 bg-white/16 px-4 py-2 text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)] transition hover:bg-white/24 hover:text-cyan-100"
                aria-label="Back to articles"
              >
                返回文章
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
                  <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
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

          <div className="post-meta-card rounded-3xl border border-white/25 bg-white/38 p-5 text-sm font-bold text-slate-800 shadow-xl shadow-slate-950/20 backdrop-blur-2xl dark:border-slate-400/20 dark:bg-slate-950/52 dark:text-slate-100">
            <Link href={discussUrl(slug)} rel="nofollow" className="text-cyan-800 hover:text-cyan-900 dark:text-cyan-200 dark:hover:text-white">
              Discuss on Twitter
            </Link>
            {` • `}
            <Link href={editUrl(filePath)} className="text-cyan-800 hover:text-cyan-900 dark:text-cyan-200 dark:hover:text-white">
              View on GitHub
            </Link>
          </div>

          {siteMetadata.comments && (
            <div
              className="post-meta-card rounded-3xl border border-white/25 bg-white/38 p-6 text-center font-bold text-slate-800 shadow-xl shadow-slate-950/20 backdrop-blur-2xl dark:border-slate-400/20 dark:bg-slate-950/52 dark:text-slate-100"
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
