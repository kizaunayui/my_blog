'use client'

import { useMemo, useState } from 'react'
import type { PromptItem } from '@/data/promptsData'

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
    <div className="space-y-10 pb-14 pt-8 sm:pt-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 px-5 py-9 shadow-2xl shadow-primary-100/70 backdrop-blur-md sm:px-8 sm:py-12 dark:border-white/10 dark:bg-gray-950/50 dark:shadow-primary-950/30">
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className="relative max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-primary-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm backdrop-blur dark:border-primary-500/20 dark:bg-gray-900/60 dark:text-primary-300">
            AI Prompt 使用记录库
          </p>
          <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl md:text-6xl dark:text-white">
            Prompt <span className="gradient-text">Library</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg dark:text-gray-300">
            记录我平时高频使用的 AI Prompt，方便复制、复用和持续迭代。
          </p>
        </div>
      </section>

      <section aria-label="Prompt 分类筛选" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-300">Categories</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white">
              分类筛选
            </h2>
          </div>
          <p className="hidden text-sm font-semibold text-gray-500 sm:block dark:text-gray-400">
            {filteredPrompts.length} / {prompts.length} 条
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const isActive = category === selectedCategory
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={
                  isActive
                    ? 'button-primary shrink-0 text-sm'
                    : 'button-secondary shrink-0 text-sm text-gray-700 dark:text-gray-100'
                }
              >
                {category}
              </button>
            )
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {filteredPrompts.map((item, index) => (
          <article
            key={item.title}
            className="post-card-motion group flex flex-col rounded-3xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-primary-100/50 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-100/80 sm:p-6 dark:border-white/10 dark:bg-gray-900/60 dark:shadow-black/30 dark:hover:border-primary-800 dark:hover:shadow-primary-950/30"
            style={{ animationDelay: `${index * 55}ms` }}
          >
            <div className="flex flex-1 flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary-200/70 bg-primary-50/80 px-3 py-1 text-xs font-bold text-primary-700 dark:border-primary-800/70 dark:bg-primary-950/30 dark:text-primary-300">
                  {item.category}
                </span>
                <time className="text-xs font-semibold text-gray-500 dark:text-gray-400" dateTime={item.updatedAt}>
                  更新于 {item.updatedAt}
                </time>
              </div>

              <div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gray-200/70 bg-white/60 px-3 py-1 text-xs font-bold text-gray-600 dark:border-gray-700/70 dark:bg-gray-950/40 dark:text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-gray-200/80 bg-white/60 p-4 text-sm leading-7 text-gray-700 shadow-inner shadow-gray-100/60 backdrop-blur dark:border-gray-800/80 dark:bg-gray-950/50 dark:text-gray-200 dark:shadow-black/20">
                {item.prompt}
              </pre>
            </div>

            <div className="mt-5 flex justify-end">
              <button type="button" onClick={() => handleCopy(item)} className="button-primary min-w-32">
                {copiedTitle === item.title ? '已复制' : '复制 Prompt'}
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
