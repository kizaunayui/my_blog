'use client'

import { useMemo, useState } from 'react'
import { formatDate } from 'pliny/utils/formatDate'
import { slug } from 'github-slugger'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { contentSections } from '@/data/contentSections'

type ArticleListProps = {
  posts: CoreContent<Blog>[]
  title: string
  description?: string
  fixedCategory?: string
  showFilters?: boolean
}

const allValue = '全部'

function getPostUrl(post: CoreContent<Blog>) {
  return `/articles/${post.slug}`
}

export default function ArticleList({
  posts,
  title,
  description,
  fixedCategory,
  showFilters = true,
}: ArticleListProps) {
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(fixedCategory || allValue)
  const [selectedTag, setSelectedTag] = useState(allValue)

  const tags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((post) => post.tags?.forEach((tag) => tagSet.add(tag)))
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'zh-CN'))
  }, [posts])

  const categories = contentSections.map((section) => section.category)

  const filteredPosts = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase()
    return posts.filter((post) => {
      const categoryMatched =
        fixedCategory || selectedCategory === allValue ? true : post.category === selectedCategory
      const tagMatched = selectedTag === allValue ? true : post.tags?.some((tag) => tag === selectedTag)
      const searchText = `${post.title || ''} ${post.summary || ''}`.toLowerCase()
      const searchMatched = keyword ? searchText.includes(keyword) : true
      return categoryMatched && tagMatched && searchMatched
    })
  }, [fixedCategory, posts, searchValue, selectedCategory, selectedTag])

  return (
    <section className="py-10 sm:py-14">
      <div className="mb-8 rounded-[2rem] border border-white/25 bg-white/28 p-7 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl sm:p-9 dark:border-slate-400/20 dark:bg-slate-950/45">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-pink-600 dark:text-pink-200">
          Knowledge Archive
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-3xl text-base leading-8 font-semibold text-slate-700 dark:text-slate-200">
            {description}
          </p>
        )}
      </div>

      {showFilters && (
        <div className="mb-8 grid gap-4 rounded-[1.75rem] border border-white/25 bg-white/35 p-5 shadow-xl shadow-slate-950/15 backdrop-blur-2xl dark:border-slate-400/20 dark:bg-slate-950/45 lg:grid-cols-[1.2fr_1fr_1fr]">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
              搜索
            </span>
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="搜索标题或摘要"
              className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-2xl border border-white/40 bg-white/75 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            />
          </label>

          {!fixedCategory && (
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
                分类
              </span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-2xl border border-white/40 bg-white/75 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
              >
                <option value={allValue}>全部分类</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
              标签
            </span>
            <select
              value={selectedTag}
              onChange={(event) => setSelectedTag(event.target.value)}
              className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-2xl border border-white/40 bg-white/75 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            >
              <option value={allValue}>全部标签</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="mb-4 text-sm font-bold text-slate-600 dark:text-slate-300">
        共 {filteredPosts.length} 篇文章
      </div>

      <div className="grid gap-5">
        {!filteredPosts.length && (
          <div className="rounded-3xl border border-white/25 bg-white/45 p-6 font-semibold text-slate-700 shadow-xl shadow-slate-950/15 backdrop-blur-2xl dark:border-slate-400/20 dark:bg-slate-950/45 dark:text-slate-200">
            没有找到符合条件的文章。
          </div>
        )}
        {filteredPosts.map((post, index) => (
          <Link key={post.slug} href={getPostUrl(post)} className="group block">
            <article
              className="post-card-motion rounded-[1.75rem] border border-white/28 bg-white/55 p-6 shadow-xl shadow-slate-950/15 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/65 hover:shadow-2xl hover:shadow-pink-950/20 dark:border-slate-400/20 dark:bg-slate-950/45 dark:hover:bg-slate-900/60"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col gap-4 md:grid md:grid-cols-[11rem_1fr] md:gap-7">
                <div className="space-y-3">
                  <time
                    dateTime={post.date}
                    className="block text-sm font-black uppercase tracking-wide text-slate-600 dark:text-slate-300"
                  >
                    {formatDate(post.date, siteMetadata.locale)}
                  </time>
                  <span className="inline-flex rounded-full bg-gradient-to-r from-pink-500/80 to-sky-400/70 px-3 py-1 text-xs font-black text-white shadow-lg shadow-pink-950/20">
                    {post.category}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-950 transition group-hover:text-pink-600 dark:text-white dark:group-hover:text-pink-200">
                    {post.title}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags?.map((tag) => <Tag key={`${post.slug}-${slug(tag)}`} text={tag} />)}
                  </div>
                  <p className="mt-4 text-base leading-8 font-semibold text-slate-700 dark:text-slate-200">
                    {post.summary}
                  </p>
                  <div className="mt-5 text-sm font-black text-pink-600 transition group-hover:translate-x-1 dark:text-pink-200">
                    阅读全文 →
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
