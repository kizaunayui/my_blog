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
      <div className="tags-page-hero relative overflow-hidden rounded-[2rem] border border-white/25 bg-white/28 p-8 shadow-2xl shadow-slate-950/25 backdrop-blur-2xl sm:p-10 dark:border-slate-400/20 dark:bg-slate-950/45">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(236,72,153,0.18),transparent_24rem),radial-gradient(circle_at_86%_18%,rgba(14,165,233,0.16),transparent_26rem)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/14 px-4 py-2 text-sm font-bold text-pink-200 shadow-sm backdrop-blur-xl">
              分类索引 · 快速检索
            </p>
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
              标签
              <span className="ml-4 bg-gradient-to-r from-pink-300 via-sky-200 to-cyan-200 bg-clip-text text-transparent">
                Tags
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              按主题查看文章，把学习笔记、项目实践和随笔内容整理成更清晰的入口。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center sm:flex sm:items-center">
            <div className="rounded-2xl border border-white/20 bg-white/16 px-5 py-4 backdrop-blur-xl">
              <div className="text-3xl font-black text-white">{sortedTags.length}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-300">Tags</div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/16 px-5 py-4 backdrop-blur-xl">
              <div className="text-3xl font-black text-white">{totalTagUses}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-300">Posts</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tagKeys.length === 0 && (
          <div className="tags-page-card rounded-3xl border border-white/25 bg-white/40 p-6 text-slate-900 shadow-xl shadow-slate-950/20 backdrop-blur-2xl">
            No tags found.
          </div>
        )}

        {sortedTags.map((t) => (
          <Link
            key={t}
            href={`/tags/${slug(t)}`}
            className="tags-page-card group relative overflow-hidden rounded-3xl border border-white/25 bg-white/42 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:bg-white/52 hover:shadow-2xl hover:shadow-pink-950/20 dark:border-slate-400/20 dark:bg-slate-950/45 dark:hover:bg-slate-900/60"
            aria-label={`View posts tagged ${t}`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(236,72,153,0.18),rgba(14,165,233,0.14),transparent_72%)] opacity-70 transition group-hover:opacity-100" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-pink-600 dark:text-pink-300">
                  Tag
                </div>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  #{t.split(' ').join('-')}
                </h2>
              </div>
              <div className="rounded-full bg-gradient-to-br from-pink-500/85 to-sky-400/75 px-4 py-2 text-sm font-black text-white shadow-lg shadow-pink-900/20">
                {tagCounts[t]}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
