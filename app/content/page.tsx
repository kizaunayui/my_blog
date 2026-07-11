import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { formatDate } from 'pliny/utils/formatDate'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { genPageMetadata } from 'app/seo'
import ContentSectionGrid from '@/components/ContentSectionGrid'
import { contentSections } from '@/data/contentSections'
import { getPromptSlug } from '@/data/promptSlugs'
import { promptsData } from '@/data/promptsData'
import siteMetadata from '@/data/siteMetadata'

export const metadata = genPageMetadata({ title: '内容中心' })

export default function ContentPage() {
  const promptItems = [...promptsData].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const posts = allCoreContent(sortPosts(allBlogs)).filter((post) => !post.draft)
  const contentPosts = posts.filter((post) =>
    contentSections.some((section) => section.category === post.category)
  )
  const recentItems = [
    ...promptItems.slice(0, 5).map((prompt) => ({
      type: 'Prompt',
      title: prompt.title,
      description: prompt.description,
      href: `/content/${getPromptSlug(prompt)}`,
      date: prompt.updatedAt,
      tags: prompt.tags,
    })),
    ...contentPosts.slice(0, 5).map((post) => ({
      type: post.category || '文章',
      title: post.title,
      description: post.summary,
      href: `/articles/${post.slug}`,
      date: post.date,
      tags: post.tags || [],
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)

  return (
    <section className="content-page py-10 sm:py-14">
      <div className="content-page-heading mb-8 border-b border-white/10 px-1 py-7 sm:mb-10 sm:py-9">
        <p className="mb-3 text-sm font-black tracking-[0.2em] text-pink-600 uppercase dark:text-pink-200">
          Content Center
        </p>
        <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl md:text-4xl lg:text-5xl dark:text-white">
          内容中心
        </h1>
        <p className="content-page-summary mt-3 max-w-3xl text-sm leading-7 font-semibold text-slate-700 sm:mt-4 sm:text-base sm:leading-8 dark:text-slate-200">
          这里集中整理 Prompt
          模板、作品展示和项目研究内容，用于长期沉淀实践经验、创作成果和研究过程。
        </p>
      </div>

      <ContentSectionGrid showIntro reveal={false} />

      <section className="content-latest-section mt-10 sm:mt-12">
        <div className="content-latest-heading mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black tracking-[0.2em] text-pink-600 uppercase dark:text-pink-200">
              Latest Updates
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              最近更新
            </h2>
          </div>
          <Link
            href="/content/prompts"
            className="text-sm font-black text-pink-600 transition hover:text-pink-700 dark:text-pink-200 dark:hover:text-white"
          >
            查看 Prompt Library →
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {recentItems.map((item) => (
            <article
              key={`${item.type}-${item.title}`}
              className="content-update-row premium-row group border-t border-white/10 px-1 py-6 transition duration-300 sm:px-2 sm:py-7"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-heading border-primary-300/25 text-primary-200 rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase">
                  {item.type}
                </span>
                <time
                  className="text-xs font-bold text-slate-600 dark:text-slate-300"
                  dateTime={item.date}
                >
                  {formatDate(item.date, siteMetadata.locale)}
                </time>
              </div>
              <h3 className="content-update-title mt-4 text-xl font-black tracking-tight text-slate-950 dark:text-white">
                <Link href={item.href} className="hover:text-pink-600 dark:hover:text-pink-200">
                  {item.title}
                </Link>
              </h3>
              <p className="content-update-description mt-3 text-sm leading-7 font-semibold text-slate-700 dark:text-slate-200">
                {item.description}
              </p>
              <div className="content-update-tags mt-4 flex flex-wrap gap-2">
                {item.tags.slice(0, 4).map((tag) => (
                  <Tag key={`${item.title}-${tag}`} text={tag} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
