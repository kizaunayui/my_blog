import { components } from '@/components/MDXComponents'
import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import { allBlogs } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { notFound } from 'next/navigation'

const reflexionContentClassName =
  'prose max-w-none dark:prose-invert prose-p:font-serif prose-p:text-[1.08rem] prose-p:leading-9 prose-p:text-slate-800 prose-p:tracking-normal dark:prose-p:text-slate-100 prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-l-4 prose-h2:border-primary-300 prose-h2:pl-5 prose-h2:font-sans prose-h2:text-2xl prose-h2:font-black prose-h2:tracking-normal prose-h2:text-slate-950 dark:prose-h2:border-primary-400/60 dark:prose-h2:text-white prose-strong:block prose-strong:my-8 prose-strong:font-serif prose-strong:text-xl prose-strong:font-bold prose-strong:leading-10 prose-strong:text-primary-700 dark:prose-strong:text-primary-200 prose-blockquote:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-primary-300 prose-blockquote:bg-primary-50/70 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:font-serif prose-blockquote:not-italic dark:prose-blockquote:border-primary-400/60 dark:prose-blockquote:bg-primary-400/10 prose-hr:my-14 prose-hr:border-primary-200/70 dark:prose-hr:border-primary-400/20'

export const metadata = genPageMetadata({ title: 'Reflexion' })

export default function PersonalAboutPage() {
  const reflexion = allBlogs.find((post) => post.slug === 'reflexion')

  if (!reflexion) {
    return notFound()
  }

  return (
    <section className="author-page py-10 sm:py-14">
      <div className="author-heading animate-fade-up pb-10">
        <p className="text-sm font-black tracking-[0.22em] text-pink-200 uppercase drop-shadow-[0_10px_26px_rgba(0,0,0,0.55)]">
          About Me
        </p>
        <h1 className="mt-3 text-4xl leading-tight font-black tracking-tight text-white drop-shadow-[0_18px_48px_rgba(0,0,0,0.72)] sm:text-5xl md:text-6xl">
          Reflexion
        </h1>
      </div>

      <article className="overflow-hidden rounded-[2rem] border border-white/28 bg-white/78 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl dark:border-slate-400/20 dark:bg-slate-950/66">
        <header className="via-primary-50/45 dark:via-primary-950/30 relative border-b border-slate-200/70 bg-gradient-to-br from-white/88 to-cyan-50/55 px-7 py-8 sm:px-10 sm:py-10 dark:border-slate-700/70 dark:from-slate-950/88 dark:to-cyan-950/25">
          <p className="text-primary-600 dark:text-primary-300 text-xs font-black tracking-[0.28em] uppercase sm:text-sm">
            Personal Notes
          </p>
          <h2 className="mt-4 text-4xl leading-tight font-black tracking-normal text-slate-950 sm:text-5xl dark:text-white">
            {reflexion.title}
          </h2>
          {reflexion.summary && (
            <p className="mt-5 max-w-3xl font-serif text-base leading-8 text-slate-700 sm:text-lg sm:leading-9 dark:text-slate-200">
              {reflexion.summary}
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/about"
              className="border-primary-200/70 bg-primary-50/80 text-primary-700 hover:bg-primary-100 dark:border-primary-400/20 dark:bg-primary-400/10 dark:text-primary-200 dark:hover:bg-primary-400/20 inline-flex rounded-full border px-5 py-3 text-sm font-bold transition"
            >
              返回关于页
            </Link>
            <Link
              href="/articles/reflexion"
              className="inline-flex rounded-full border border-white/65 bg-white/70 px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-white dark:border-slate-400/20 dark:bg-slate-900/55 dark:text-slate-100 dark:hover:bg-slate-900/80"
            >
              查看文章页
            </Link>
          </div>
        </header>

        <div className="px-7 py-8 sm:px-10 sm:py-10">
          <div className={reflexionContentClassName}>
            <MDXLayoutRenderer
              code={reflexion.body.code}
              components={components}
              toc={reflexion.toc}
            />
          </div>
        </div>
      </article>
    </section>
  )
}
