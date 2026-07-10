'use client'

import { useMemo, useState } from 'react'
import Link from '@/components/Link'
import type { PromptItem } from '@/data/promptsData'
import { getPromptSlug } from '@/data/promptSlugs'

const allCategory = '全部'

type PromptLibraryProps = {
  prompts: PromptItem[]
}

export default function PromptLibrary({ prompts }: PromptLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState(allCategory)
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null)

  const categories = useMemo(
    () => [allCategory, ...Array.from(new Set(prompts.map((item) => item.category)))],
    [prompts]
  )

  const filteredPrompts = useMemo(() => {
    if (selectedCategory === allCategory) return prompts
    return prompts.filter((item) => item.category === selectedCategory)
  }, [prompts, selectedCategory])

  const handleCopy = async (item: PromptItem) => {
    await navigator.clipboard.writeText(item.prompt)
    setCopiedTitle(item.title)
    window.setTimeout(() => setCopiedTitle(null), 1800)
  }

  return (
    <div className="pt-8 pb-10 sm:pt-12 sm:pb-14">
      <section className="border-b border-white/10 pb-7 sm:pb-9">
        <h1 className="mt-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text font-serif text-3xl font-semibold tracking-wide text-transparent sm:text-4xl md:text-5xl">
          Prompt Library
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed font-light text-slate-200 sm:text-base">
          记录平时高频使用的 AI Prompt，方便复制、复用和持续迭代。
        </p>
      </section>

      <div className="gap-8 lg:grid lg:grid-cols-[12rem_minmax(0,1fr)]">
        <aside
          aria-label="Prompt 分类筛选"
          className="border-b border-white/10 py-5 sm:py-6 lg:border-b-0 lg:pr-2"
        >
          <div className="lg:sticky lg:top-24">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:block">
              <div>
                <p className="font-heading text-xs font-bold tracking-[0.25em] text-cyan-600 uppercase dark:text-cyan-400">
                  Categories
                </p>
                <h2 className="mt-2 font-serif text-2xl font-light tracking-wide text-white">
                  分类筛选
                </h2>
              </div>
              <p className="text-sm font-light text-slate-300 lg:mt-5">
                {filteredPrompts.length} / {prompts.length} 条
              </p>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:border-l lg:border-white/10 lg:pb-0">
              {categories.map((category) => {
                const isActive = category === selectedCategory
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      isActive
                        ? 'font-heading shrink-0 rounded-full bg-cyan-600 px-4 py-2 text-left text-xs font-bold tracking-[0.14em] text-white uppercase transition duration-300 hover:bg-cyan-500 lg:w-full lg:rounded-none lg:border-l-2 lg:border-cyan-300 lg:bg-transparent lg:py-2 lg:pl-4 lg:text-cyan-200 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:lg:bg-transparent dark:lg:hover:bg-white/5'
                        : 'font-heading shrink-0 rounded-full border border-white/15 bg-transparent px-4 py-2 text-left text-xs font-bold tracking-[0.14em] text-slate-100 uppercase transition duration-300 hover:border-cyan-200/35 lg:w-full lg:rounded-none lg:border-y-0 lg:border-r-0 lg:border-l-2 lg:border-transparent lg:py-2 lg:pl-4 lg:text-slate-300 lg:hover:border-white/20 lg:hover:text-white'
                    }
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        <section className="space-y-1 lg:min-w-0">
          {filteredPrompts.map((item, index) => (
            <article
              key={item.title}
              className="premium-row group border-b border-white/10 px-1 py-6 sm:px-2 sm:py-7"
              style={{ animationDelay: `${index * 55}ms` }}
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-heading inline-flex rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-bold tracking-[0.16em] text-cyan-200 uppercase">
                    {item.category}
                  </span>
                  <time
                    className="font-heading text-xs font-bold tracking-[0.18em] text-slate-300/80 uppercase"
                    dateTime={item.updatedAt}
                  >
                    更新于 {item.updatedAt}
                  </time>
                </div>

                <div>
                  <h3 className="font-serif text-xl leading-tight font-light tracking-wide text-white sm:text-2xl md:text-3xl">
                    <Link href={`/content/${getPromptSlug(item)}`} className="hover:text-cyan-200">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed font-light text-slate-200">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-heading rounded-full border border-white/15 bg-transparent px-3 py-1 text-xs font-bold text-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <pre className="max-h-64 overflow-auto border-y border-white/10 bg-slate-950/90 p-4 text-sm leading-7 break-words whitespace-pre-wrap text-slate-100">
                  {item.prompt}
                </pre>

                <div className="flex flex-wrap justify-end gap-3">
                  <Link
                    href={`/content/${getPromptSlug(item)}`}
                    className="font-heading inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold tracking-[0.16em] text-slate-100 uppercase transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/50 hover:text-cyan-100"
                  >
                    查看详情
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className="font-heading inline-flex min-w-32 items-center justify-center rounded-full bg-cyan-600 px-5 py-2.5 text-xs font-bold tracking-[0.16em] text-white uppercase transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400"
                  >
                    {copiedTitle === item.title ? '已复制' : '复制 Prompt'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
