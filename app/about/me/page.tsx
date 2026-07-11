import { components } from '@/components/MDXComponents'
import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import { allBlogs } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { notFound } from 'next/navigation'

const reflexionContentClassName =
  'prose max-w-none dark:prose-invert prose-p:font-serif prose-p:text-[1.05rem] prose-p:leading-9 prose-p:text-slate-100 prose-p:tracking-normal prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-cyan-300/45 prose-h2:pl-5 prose-h2:font-sans prose-h2:text-2xl prose-h2:font-black prose-h2:tracking-normal prose-h2:text-white prose-strong:block prose-strong:my-8 prose-strong:font-serif prose-strong:text-xl prose-strong:font-bold prose-strong:leading-10 prose-strong:text-cyan-100 prose-blockquote:border-l-4 prose-blockquote:border-cyan-300/35 prose-blockquote:bg-transparent prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:font-serif prose-blockquote:text-slate-100 prose-blockquote:not-italic prose-hr:my-12 prose-hr:border-white/10 prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:text-cyan-100'

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
      <div className="author-heading editorial-masthead animate-fade-up border-b border-white/10 pb-7 sm:pb-9">
        <p className="editorial-kicker font-heading text-xs font-bold tracking-[0.25em] text-cyan-400 uppercase">
          About Me
        </p>
        <h1 className="editorial-title mt-3 font-serif text-4xl leading-tight font-light tracking-wide text-white drop-shadow-[0_18px_48px_rgba(0,0,0,0.72)] sm:text-5xl md:text-6xl">
          Reflexion
        </h1>
        <p className="editorial-summary mt-4 max-w-2xl text-sm leading-7 font-light text-slate-300 sm:text-base sm:leading-8">
          一页更私人的自我介绍。它不太像简历，也不太像说明书，更像是给这个博客留下的一段自白。
        </p>
      </div>

      <div className="grid gap-10 pt-8 sm:pt-10 lg:grid-cols-[16rem_1fr] lg:gap-12">
        <aside className="space-y-8 border-t border-white/10 pt-6 lg:border-t-0 lg:border-r lg:border-white/10 lg:pt-0 lg:pr-8">
          <section>
            <p className="font-heading text-[10px] font-bold tracking-[0.28em] text-cyan-300 uppercase">
              Profile
            </p>
            <h2 className="mt-4 font-serif text-3xl font-light tracking-wide text-white">Kieran</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              写一点技术，也写一点生活。这里比首页更私人，比文章页更松弛。
            </p>
          </section>

          <section className="border-t border-white/10 pt-6">
            <dl className="space-y-5">
              {profileItems.map(([label, value]) => (
                <div key={label}>
                  <dt className="font-heading text-[10px] font-bold tracking-[0.22em] text-slate-500 uppercase">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm text-slate-100">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="border-t border-white/10 pt-6">
            <p className="font-heading text-[10px] font-bold tracking-[0.24em] text-cyan-300 uppercase">
              Keywords
            </p>
            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
              {keywords.map((keyword) => (
                <span key={keyword} className="text-xs text-slate-300">
                  #{keyword}
                </span>
              ))}
            </div>
          </section>

          <nav className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row lg:flex-col">
            <Link
              href="/about"
              className="font-heading inline-flex items-center text-xs font-bold tracking-[0.16em] text-cyan-200 uppercase transition hover:text-white"
            >
              ← 返回关于页
            </Link>
            <Link
              href="/articles/reflexion"
              className="font-heading inline-flex items-center text-xs font-bold tracking-[0.16em] text-cyan-200 uppercase transition hover:text-white"
            >
              查看文章页 →
            </Link>
          </nav>
        </aside>

        <main className="min-w-0">
          <header className="border-b border-white/10 pb-8">
            <p className="font-heading text-[10px] font-bold tracking-[0.28em] text-cyan-300 uppercase sm:text-xs">
              Personal Notes
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight font-light tracking-wide text-white sm:text-4xl md:text-5xl">
              {reflexion.title}
            </h2>
            {reflexion.summary && (
              <p className="mt-5 max-w-3xl font-serif text-base leading-8 text-slate-200 sm:text-lg sm:leading-9">
                {reflexion.summary}
              </p>
            )}
          </header>

          <div className="pt-8 sm:pt-10">
            <div className={reflexionContentClassName}>
              <MDXLayoutRenderer
                code={reflexion.body.code}
                components={components}
                toc={reflexion.toc}
              />
            </div>
          </div>
        </main>
      </div>
    </section>
  )
}
