import Link from '@/components/Link'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  const totalTagUses = Object.values(tagCounts).reduce((sum, count) => sum + count, 0)

  return (
    <section className="tags-page animate-fade-up py-12 sm:py-16">
      <div className="tags-page-hero subpage-masthead relative px-1 py-8 sm:py-12">
        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-heading mb-4 flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] text-pink-300 uppercase">
              <span className="masthead-kicker-line is-pink" aria-hidden="true" />
              分类索引 · 快速检索
            </p>
            <h1 className="font-serif text-4xl font-light tracking-wide text-white sm:text-5xl md:text-6xl">
              标签
              <span className="ml-4 bg-gradient-to-r from-pink-300 via-violet-200 to-cyan-200 bg-clip-text font-light text-transparent italic">
                Tags
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 font-light text-slate-200 sm:text-base">
              按主题查看文章，把学习笔记、项目实践和随笔内容整理成更清晰的入口。
            </p>
          </div>

          <div className="tag-metrics flex items-center text-left">
            <div className="pr-7">
              <div className="font-serif text-3xl font-light text-white">{sortedTags.length}</div>
              <div className="font-heading mt-1 text-[9px] font-bold tracking-[0.24em] text-slate-300 uppercase">
                Tags
              </div>
            </div>
            <div className="border-l border-white/15 pl-7">
              <div className="font-serif text-3xl font-light text-white">{totalTagUses}</div>
              <div className="font-heading mt-1 text-[9px] font-bold tracking-[0.24em] text-slate-300 uppercase">
                Posts
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tag-index-grid mt-10 grid sm:grid-cols-2">
        {tagKeys.length === 0 && (
          <div className="tags-page-card border-t border-white/15 p-6 text-white/70">
            No tags found.
          </div>
        )}

        {sortedTags.map((t, index) => (
          <Link
            key={t}
            href={`/tags/${slug(t)}`}
            className="tags-page-card group relative overflow-hidden border-t border-white/15 px-1 py-6 transition duration-500"
            aria-label={`View posts tagged ${t}`}
          >
            <div className="tag-index-glow pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="font-heading text-[9px] font-bold tracking-[0.24em] text-pink-300/80 uppercase">
                  Index {String(index + 1).padStart(2, '0')}
                </div>
                <h2 className="mt-3 font-serif text-2xl font-light tracking-wide text-white transition duration-500 group-hover:translate-x-1 group-hover:text-cyan-100">
                  #{t.split(' ').join('-')}
                </h2>
              </div>
              <div className="font-heading flex items-center gap-3 text-[10px] font-bold tracking-[0.16em] text-white/45">
                <span>{String(tagCounts[t]).padStart(2, '0')}</span>
                <span
                  className="text-sm transition duration-500 group-hover:translate-x-1 group-hover:text-cyan-200"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
