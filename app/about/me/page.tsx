import { components } from '@/components/MDXComponents'
import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import { allBlogs } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { notFound } from 'next/navigation'

const reflexionContentClassName =
  'prose max-w-none dark:prose-invert prose-p:font-serif prose-p:text-[1.08rem] prose-p:leading-9 prose-p:text-slate-100 prose-p:tracking-normal prose-h2:mt-14 prose-h2:mb-7 prose-h2:border-l-4 prose-h2:border-cyan-300/45 prose-h2:pl-5 prose-h2:font-sans prose-h2:text-2xl prose-h2:font-black prose-h2:tracking-normal prose-h2:text-white prose-strong:block prose-strong:my-8 prose-strong:font-serif prose-strong:text-xl prose-strong:font-bold prose-strong:leading-10 prose-strong:text-cyan-100 prose-blockquote:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-cyan-300/30 prose-blockquote:bg-slate-950/35 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:font-serif prose-blockquote:text-slate-100 prose-blockquote:not-italic prose-hr:my-14 prose-hr:border-white/10 prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:text-cyan-100'

export const metadata = genPageMetadata({ title: 'Reflexion' })

export default function PersonalAboutPage() {
  const reflexion = allBlogs.find((post) => post.slug === 'reflexion')

  if (!reflexion) {
    return notFound()
  }

  return (
    <section className="author-page py-8 sm:py-12 md:py-14">
      <div className="author-heading animate-fade-up border-b border-white/10 pb-7 sm:pb-9">
        <p className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
          About Me
        </p>
        <h1 className="mt-3 font-serif text-4xl font-light leading-tight tracking-wide text-white drop-shadow-[0_18px_48px_rgba(0,0,0,0.72)] sm:text-5xl md:text-6xl">
          Reflexion
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 font-light text-slate-300 sm:text-base sm:leading-8">
          一页更私人的自我介绍。保留一点夜晚感，也保留一点还在路上的痕迹。
        </p>
      </div>

      <article className="mt-8 overflow-hidden rounded-[2rem] border border-white/12 bg-slate-950/46 shadow-2xl shadow-slate-950/25 backdrop-blur-2xl sm:mt-10 dark:border-slate-400/20 dark:bg-slate-950/52">
        <header className="relative border-b border-white/10 bg-gradient-to-br from-slate-950/72 via-slate-900/44 to-cyan-950/20 px-6 py-7 sm:px-9 sm:py-9 md:px-10 md:py-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
          <p className="font-heading text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-300 sm:text-xs">
            Personal Notes
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light leading-tight tracking-wide text-white sm:text-4xl md:text-5xl">
            {reflexion.title}
          </h2>
          {reflexion.summary && (
            <p className="mt-5 max-w-3xl font-serif text-base leading-8 text-slate-200 sm:text-lg sm:leading-9">
              {reflexion.summary}
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/about"
              className="font-heading inline-flex rounded-full border border-white/15 bg-white/8 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-white/12 hover:text-white"
            >
              返回关于页
            </Link>
            <Link
              href="/articles/reflexion"
              className="font-heading inline-flex rounded-full border border-cyan-300/25 bg-cyan-400/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:bg-cyan-400/15 hover:text-white"
            >
              查看文章页
            </Link>
          </div>
        </header>

        <div className="px-6 py-8 sm:px-9 sm:py-10 md:px-10">
          <div className={reflexionContentClassName}>
            <MDXLayoutRenderer code={reflexion.body.code} components={components} toc={reflexion.toc} />
          </div>
        </div>
      </article>
    </section>
  )
}
