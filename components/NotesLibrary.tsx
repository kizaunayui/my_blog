'use client'

import { useMemo, useState } from 'react'
import type { NoteItem } from '@/data/notesData'
import Link from '@/components/Link'

const allSubject = '全部'

type NotesLibraryProps = {
  notes: NoteItem[]
}

export default function NotesLibrary({ notes }: NotesLibraryProps) {
  const [selectedSubject, setSelectedSubject] = useState(allSubject)

  const subjects = useMemo(
    () => [allSubject, ...Array.from(new Set(notes.map((item) => item.subject)))],
    [notes]
  )

  const filteredNotes = useMemo(() => {
    if (selectedSubject === allSubject) return notes
    return notes.filter((item) => item.subject === selectedSubject)
  }, [notes, selectedSubject])

  return (
    <div className="space-y-10 pb-14 pt-8 sm:pt-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 px-5 py-9 shadow-2xl shadow-primary-100/70 backdrop-blur-md sm:px-8 sm:py-12 dark:border-white/10 dark:bg-gray-950/50 dark:shadow-primary-950/30">
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className="relative max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-primary-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm backdrop-blur dark:border-primary-500/20 dark:bg-gray-900/60 dark:text-primary-300">
            按科目整理 · PDF 复习资料
          </p>
          <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl md:text-6xl dark:text-white">
            课程复习<span className="gradient-text">笔记</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg dark:text-gray-300">
            这里按科目整理课程复习笔记和 PDF 资料。当前没有添加内容，后续新增科目笔记后会自动显示在这里。
          </p>
        </div>
      </section>

      <section aria-label="科目筛选" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-300">Subjects</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white">
              科目分类
            </h2>
          </div>
          <p className="hidden text-sm font-semibold text-gray-500 sm:block dark:text-gray-400">
            {filteredNotes.length} / {notes.length} 条
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {subjects.map((subject) => {
            const isActive = subject === selectedSubject
            return (
              <button
                key={subject}
                type="button"
                onClick={() => setSelectedSubject(subject)}
                className={
                  isActive
                    ? 'button-primary shrink-0 text-sm'
                    : 'button-secondary shrink-0 text-sm text-gray-700 dark:text-gray-100'
                }
              >
                {subject}
              </button>
            )
          })}
        </div>
      </section>

      {!filteredNotes.length ? (
        <section className="rounded-3xl border border-white/60 bg-white/70 p-8 text-center shadow-lg shadow-primary-100/50 backdrop-blur-md dark:border-white/10 dark:bg-gray-900/60 dark:shadow-black/30">
          <h3 className="text-2xl font-black tracking-tight text-gray-950 dark:text-white">暂无复习笔记</h3>
          <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
            后续在 <code>data/notesData.ts</code> 添加科目复习资料后，这里会按科目显示。
          </p>
        </section>
      ) : (
        <section className="grid gap-5 lg:grid-cols-2">
          {filteredNotes.map((item, index) => (
            <article
              key={item.title}
              className="post-card-motion group flex flex-col rounded-3xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-primary-100/50 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-100/80 sm:p-6 dark:border-white/10 dark:bg-gray-900/60 dark:shadow-black/30 dark:hover:border-primary-800 dark:hover:shadow-primary-950/30"
              style={{ animationDelay: `${index * 55}ms` }}
            >
              <div className="flex flex-1 flex-col gap-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-primary-200/70 bg-primary-50/80 px-3 py-1 text-xs font-bold text-primary-700 dark:border-primary-800/70 dark:bg-primary-950/30 dark:text-primary-300">
                    {item.subject}
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

                {item.outline && item.outline.length > 0 && (
                  <ul className="rounded-2xl border border-gray-200/80 bg-white/60 p-4 text-sm leading-7 text-gray-700 shadow-inner shadow-gray-100/60 backdrop-blur dark:border-gray-800/80 dark:bg-gray-950/50 dark:text-gray-200 dark:shadow-black/20">
                    {item.outline.map((line) => (
                      <li key={line}>· {line}</li>
                    ))}
                  </ul>
                )}
              </div>

              {item.pdf && (
                <div className="mt-5 flex justify-end">
                  <Link href={item.pdf} className="button-primary min-w-32">
                    下载 PDF
                  </Link>
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
