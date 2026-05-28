import { formatDate } from 'pliny/utils/formatDate'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'

type ContentPostListProps = {
  posts: CoreContent<Blog>[]
  title: string
  description: string
  emptyText: string
}

export default function ContentPostList({ posts, title, description, emptyText }: ContentPostListProps) {
  return (
    <section className="py-10 sm:py-14">
      <div className="mb-6 rounded-2xl border border-white/25 bg-white/28 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl sm:mb-8 sm:rounded-[2rem] sm:p-7 md:p-9 dark:border-slate-400/20 dark:bg-slate-950/45">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-pink-600 dark:text-pink-200">
          Content Center
        </p>
        <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl md:text-4xl lg:text-5xl dark:text-white">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 font-semibold text-slate-700 sm:mt-4 sm:text-base sm:leading-8 dark:text-slate-200">
          {description}
        </p>
      </div>

      {!posts.length ? (
        <div className="rounded-3xl border border-white/25 bg-white/45 p-8 text-center font-semibold text-slate-700 shadow-xl shadow-slate-950/15 backdrop-blur-2xl dark:border-slate-400/20 dark:bg-slate-950/45 dark:text-slate-200">
          {emptyText}
        </div>
      ) : (
        <div className="grid gap-5">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-white/28 bg-white/55 p-4 shadow-xl shadow-slate-950/15 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/65 hover:shadow-2xl hover:shadow-pink-950/20 sm:rounded-[1.75rem] sm:p-6 dark:border-slate-400/20 dark:bg-slate-950/45 dark:hover:bg-slate-900/60"
            >
              <div className="space-y-3 sm:space-y-4 md:grid md:grid-cols-[11rem_1fr] md:gap-7 md:space-y-0">
                <time
                  dateTime={post.date}
                  className="block text-sm font-black uppercase tracking-wide text-slate-600 dark:text-slate-300"
                >
                  {formatDate(post.date, siteMetadata.locale)}
                </time>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl dark:text-white">
                    <Link href={`/articles/${post.slug}`} className="hover:text-pink-600 dark:hover:text-pink-200">
                      {post.title}
                    </Link>
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags?.map((tag) => <Tag key={`${post.slug}-${tag}`} text={tag} />)}
                  </div>
                  <p className="mt-3 text-sm leading-7 font-semibold text-slate-700 sm:mt-4 sm:text-base sm:leading-8 dark:text-slate-200">
                    {post.summary}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
