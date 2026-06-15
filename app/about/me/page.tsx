import { components } from '@/components/MDXComponents'
import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import { allBlogs } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { notFound } from 'next/navigation'

const reflexionContentClassName =
  'prose max-w-none dark:prose-invert prose-p:font-serif prose-p:text-[1.05rem] prose-p:leading-9 prose-p:text-slate-100 prose-p:tracking-normal prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-cyan-300/45 prose-h2:pl-5 prose-h2:font-sans prose-h2:text-2xl prose-h2:font-black prose-h2:tracking-normal prose-h2:text-white prose-strong:block prose-strong:my-8 prose-strong:font-serif prose-strong:text-xl prose-strong:font-bold prose-strong:leading-10 prose-strong:text-cyan-100 prose-blockquote:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-cyan-300/30 prose-blockquote:bg-slate-950/35 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:font-serif prose-blockquote:text-slate-100 prose-blockquote:not-italic prose-hr:my-12 prose-hr:border-white/10 prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:text-cyan-100'

const profileItems = [
  ['Identity', 'Kieran'],
  ['State', '18 / Night'],
  ['Signal', 'Music · Game · 24fps'],
]

const keywords = ['Reflexion', '个人博客', '音乐', '游戏', '电影', '学习记录']

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
          一页更私人的自我介绍。它不太像简历，也不太像说明书，更像是给这个博客留下的一段自白。
        </p>
      </div>

      <div className="grid gap-6 pt-8 lg:grid-cols-[18rem_1fr] lg:gap-8 sm:pt-10">
        <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-slate-950/48 shadow-xl shadow-slate-950/20 backdrop-blur-2xl">
            <div className="relative px-6 py-7">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
              <p className="font-heading text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-300">
                Profile
              </p>
              <h2 className="mt-4 font-serif text-3xl font-light tracking-wide text-white">Kieran</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                写一点技术，也写一点生活。这里比首页更私人，比文章页更松弛。
              </p>
            </div>
            <div className="border-t border-white/10 px-6 py-5">
              <dl className="space-y-4">
                {profileItems.map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-heading text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm text-slate-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/12 bg-white/6 p-5 backdrop-blur-xl">
            <p className="font-heading text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300">
              Keywords
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-white/12 bg-white/7 px-3 py-1.5 text-xs text-slate-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/about"
              className="font-heading inline-flex flex-1 items-center justify-center rounded-full border border-white/15 bg-white/8 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-white/12 hover:text-white"
            >
              返回关于页
            </Link>
            <Link
              href="/articles/reflexion"
              className="font-heading inline-flex flex-1 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-400/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:bg-cyan-400/15 hover:text-white"
            >
              查看文章页
            </Link>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="overflow-hidden rounded-[2rem] border border-white/12 bg-slate-950/42 shadow-2xl shadow-slate-950/25 backdrop-blur-2xl">
            <header className="relative border-b border-white/10 bg-gradient-to-br from-slate-950/70 via-slate-900/42 to-cyan-950/18 px-6 py-7 sm:px-9 sm:py-9 md:px-10 md:py-10">
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
            </header>

            <div className="px-6 py-8 sm:px-9 sm:py-10 md:px-10">
              <div className={reflexionContentClassName}>
                <MDXLayoutRenderer code={reflexion.body.code} components={components} toc={reflexion.toc} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </section>
  )
}
