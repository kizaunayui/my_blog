import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import PostSideInfo from '@/components/PostSideInfo'
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

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { slug: string; title: string }
  prev?: { slug: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, slug, date, title, tags, recordedAt, category, pdf } = content

  return (
    <>
      <ScrollTopAndComment />
      <article className="py-10 sm:py-12">
        <header className="post-title-card animate-fade-up mb-10 rounded-[2rem] border border-white/25 bg-white/22 px-6 py-10 text-center shadow-2xl shadow-slate-950/25 backdrop-blur-2xl sm:px-10 dark:border-slate-400/20 dark:bg-slate-950/45">
          <dl>
            <dt className="sr-only">Published on</dt>
            <dd className="text-base leading-6 font-bold text-slate-200/90">
              <time dateTime={date}>
                {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
              </time>
            </dd>
          </dl>
          {category && (
            <div className="mt-4 inline-flex rounded-full bg-gradient-to-r from-pink-500/80 to-sky-400/70 px-4 py-1.5 text-sm font-black text-white shadow-lg shadow-pink-950/20">
              {category}
            </div>
          )}
          <div className="mt-4 text-white drop-shadow-[0_18px_42px_rgba(0,0,0,0.65)]">
            <PageTitle>{title}</PageTitle>
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-4 xl:gap-x-8">
          <aside className="post-side-card h-fit rounded-[2rem] border border-white/25 bg-white/30 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl dark:border-slate-400/20 dark:bg-slate-950/45 xl:sticky xl:top-8">
            <dl>
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="space-y-5">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-3" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={42}
                          height={42}
                          alt="avatar"
                          className="h-11 w-11 rounded-full border border-white/40 shadow-lg shadow-slate-950/20"
                        />
                      )}
                      <dl className="text-sm leading-5 font-bold whitespace-nowrap">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]">
                          {author.name}
                        </dd>
                        <dt className="sr-only">Twitter</dt>
                        <dd>
                          {author.twitter && (
                            <Link
                              href={author.twitter}
                              className="text-pink-200 hover:text-white"
                            >
                              {author.twitter
                                .replace('https://twitter.com/', '@')
                                .replace('https://x.com/', '@')}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>

            <PostSideInfo recordedAt={recordedAt} />

            {pdf && (
              <div className="mt-8 border-t border-white/25 pt-6">
                <h2 className="text-xs font-black tracking-[0.22em] text-slate-200 uppercase">PDF</h2>
                <Link
                  href={pdf}
                  className="mt-3 inline-flex rounded-full bg-white/90 px-4 py-2 text-sm font-black text-slate-950 shadow-lg shadow-slate-950/20 transition hover:bg-white dark:bg-slate-100"
                >
                  下载 PDF
                </Link>
              </div>
            )}

            {tags && (
              <div className="mt-8 border-t border-white/25 pt-6">
                <h2 className="text-xs font-black tracking-[0.22em] text-slate-200 uppercase">Tags</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              </div>
            )}

            {(next || prev) && (
              <div className="mt-8 space-y-5 border-t border-white/25 pt-6 text-sm font-bold">
                {prev && prev.slug && (
                  <div>
                    <h2 className="text-xs font-black tracking-[0.18em] text-slate-300 uppercase">
                      Previous
                    </h2>
                    <Link href={`/articles/${prev.slug}`} className="mt-1 block text-pink-200 hover:text-white">
                      {prev.title}
                    </Link>
                  </div>
                )}
                {next && next.slug && (
                  <div>
                    <h2 className="text-xs font-black tracking-[0.18em] text-slate-300 uppercase">Next</h2>
                    <Link href={`/articles/${next.slug}`} className="mt-1 block text-pink-200 hover:text-white">
                      {next.title}
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 border-t border-white/25 pt-6">
              <Link
                href="/articles"
                className="text-sm font-black text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)] hover:text-pink-100"
                aria-label="Back to articles"
              >
                ← 返回文章列表
              </Link>
            </div>
          </aside>

          <div className="space-y-6 xl:col-span-3">
            {pdf && (
              <section className="post-content-card rounded-[2rem] border border-white/30 bg-white/68 p-6 shadow-2xl shadow-slate-950/24 backdrop-blur-2xl dark:border-slate-400/20 dark:bg-slate-950/62">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                      PDF 复习资料
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      支持在线预览；手机端阅读不便时可直接下载 PDF。
                    </p>
                  </div>
                  <Link href={pdf} className="button-primary shrink-0">
                    下载 PDF
                  </Link>
                </div>
                <div className="mt-5 hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-inner shadow-slate-200/60 md:block dark:border-slate-700 dark:bg-slate-950">
                  <iframe src={pdf} title={`${title} PDF 预览`} className="h-[720px] w-full" />
                </div>
              </section>
            )}

            <div className="post-content-card prose max-w-none rounded-[2rem] border border-white/30 bg-white/68 p-7 shadow-2xl shadow-slate-950/24 backdrop-blur-2xl sm:p-9 dark:prose-invert dark:border-slate-400/20 dark:bg-slate-950/62">
              {children}
            </div>

            <div className="post-meta-card rounded-3xl border border-white/25 bg-white/38 p-5 text-sm font-bold text-slate-800 shadow-xl shadow-slate-950/20 backdrop-blur-2xl dark:border-slate-400/20 dark:bg-slate-950/52 dark:text-slate-100">
              <Link href={discussUrl(slug)} rel="nofollow" className="text-pink-600 hover:text-pink-700 dark:text-pink-200 dark:hover:text-white">
                Discuss on Twitter
              </Link>
              {` • `}
              <Link href={editUrl(filePath)} className="text-pink-600 hover:text-pink-700 dark:text-pink-200 dark:hover:text-white">
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
        </div>
      </article>
    </>
  )
}
