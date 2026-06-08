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

export default function ContentPostList({
  posts,
  title,
  description,
  emptyText,
}: ContentPostListProps) {
  return (
    <section className="py-10 sm:py-14">
      <div className="mb-8 border-b border-white/10 pb-5 sm:mb-10 sm:pb-6">
        <p className="font-heading text-xs font-bold tracking-[0.25em] text-cyan-600 uppercase dark:text-cyan-400">
          Content Center
        </p>
        <h1 className="mt-2 font-serif text-3xl font-light tracking-wide text-white sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed font-light text-slate-200 sm:text-base">
          {description}
        </p>
      </div>

      {!posts.length ? (
        <div className="border-b border-white/10 py-10 text-center text-sm font-light text-slate-200">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-1">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              className="premium-row group border-b border-white/10 px-1 py-5 sm:px-2 sm:py-7"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="space-y-3 md:grid md:grid-cols-[10rem_1fr] md:gap-8 md:space-y-0">
                <time
                  dateTime={post.date}
                  className="font-heading block text-xs font-bold tracking-[0.2em] text-slate-300/80 uppercase"
                >
                  {formatDate(post.date, siteMetadata.locale)}
                </time>
                <div className="space-y-3">
                  <h2 className="font-serif text-xl leading-tight font-light tracking-wide text-white sm:text-2xl md:text-3xl">
                    <Link
                      href={`/articles/${post.slug}`}
                      className="premium-row-link transition group-hover:text-cyan-600 dark:group-hover:text-cyan-300"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag) => (
                      <Tag key={`${post.slug}-${tag}`} text={tag} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed font-light text-slate-200">
                    {post.summary}
                  </p>
                  <Link
                    href={`/articles/${post.slug}`}
                    className="font-heading inline-flex items-center gap-1 pt-1 text-xs font-bold tracking-[0.2em] text-cyan-600 uppercase transition duration-300 group-hover:translate-x-1 dark:text-cyan-400"
                  >
                    Read Full Post <span className="text-[12px] leading-none">-&gt;</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
