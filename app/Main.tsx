import Link from '@/components/Link'
import Tag from '@/components/Tag'
import ContentSectionGrid from '@/components/ContentSectionGrid'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'

const MAX_DISPLAY = 6

export default function Home({ posts }) {
  const recentPosts = posts.slice(0, MAX_DISPLAY)

  return (
    <>
      <section className="home-hero relative overflow-hidden pt-10 pb-12 sm:pt-16 md:pb-16">
        <div className="home-hero-bg pointer-events-none absolute inset-0">
          <div className="hero-grid" />
        </div>

        <div className="home-hero-content animate-fade-up max-w-4xl">
          <p className="mb-5 inline-flex rounded-full border border-primary-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm backdrop-blur dark:border-primary-500/20 dark:bg-gray-900/60 dark:text-primary-300">
            Prompt · 课程复习 · 作品展示 · 项目研究
          </p>
          <h1 className="text-4xl leading-tight font-black tracking-tight text-gray-950 sm:text-5xl md:text-6xl dark:text-white">
            <span className="gradient-text">{siteMetadata.title}</span>
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl dark:text-gray-300">
            这是一个用于记录 Prompt 模板、课程复习笔记、作品展示和项目研究的个人知识型博客。内容主要围绕 AI 工具实践、课程学习整理、个人作品沉淀以及多智能体协同调度研究展开。
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/articles" className="button-primary">
              浏览全部文章
            </Link>
            <Link href="/content" className="button-secondary">
              进入内容中心
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-300">Content Center</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
              核心栏目
            </h2>
          </div>
          <Link href="/content" className="hidden text-sm font-semibold text-primary-600 hover:text-primary-700 sm:block dark:text-primary-300">
            查看内容中心 →
          </Link>
        </div>
        <ContentSectionGrid />
      </section>

      <section className="pb-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-300">Latest Articles</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
              最新文章
            </h2>
          </div>
          {posts.length > MAX_DISPLAY && (
            <Link href="/articles" className="hidden text-sm font-semibold text-primary-600 hover:text-primary-700 sm:block dark:text-primary-300">
              全部文章 →
            </Link>
          )}
        </div>

        <div className="grid gap-5">
          {!posts.length && '暂无文章。'}
          {recentPosts.map((post, index) => {
            const { slug, date, title, summary, tags, category } = post

            return (
              <Link key={slug} href={`/articles/${slug}`} className="group block">
                <article
                  className="post-card-motion rounded-2xl border border-gray-200/80 bg-white/75 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-100/70 dark:border-gray-800/80 dark:bg-gray-900/60 dark:hover:border-primary-800 dark:hover:shadow-primary-950/30"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="space-y-4 md:grid md:grid-cols-4 md:gap-8 md:space-y-0">
                    <dl>
                      <dt className="sr-only">发布时间</dt>
                      <dd className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                      <dd className="mt-2 inline-flex rounded-full bg-gradient-to-r from-pink-500/80 to-sky-400/70 px-3 py-1 text-xs font-black text-white">
                        {category}
                      </dd>
                    </dl>
                    <div className="md:col-span-3">
                      <h3 className="text-2xl font-bold tracking-tight text-gray-950 transition group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-300">
                        {title}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                      <p className="mt-4 text-gray-600 dark:text-gray-300">{summary}</p>
                      <div className="mt-5 text-sm font-semibold text-primary-600 transition group-hover:translate-x-1 dark:text-primary-300">
                        阅读全文 →
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>

        {posts.length > MAX_DISPLAY && (
          <div className="mt-8 flex justify-center sm:hidden">
            <Link href="/articles" className="button-secondary">
              全部文章
            </Link>
          </div>
        )}
      </section>

      {siteMetadata.newsletter?.provider && (
        <div className="home-newsletter-panel flex items-center justify-center pt-8">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
