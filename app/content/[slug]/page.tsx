import { allBlogs } from 'contentlayer/generated'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { genPageMetadata } from 'app/seo'
import { findPromptBySlug, getPromptSlug } from '@/data/promptSlugs'
import { promptsData } from '@/data/promptsData'

type ContentDetailPageProps = {
  params: Promise<{ slug: string }>
}

function decodeSlug(slug: string) {
  return decodeURIComponent(slug)
}

export async function generateMetadata(props: ContentDetailPageProps): Promise<Metadata> {
  const params = await props.params
  const requestedSlug = decodeSlug(params.slug)
  const prompt = findPromptBySlug(promptsData, requestedSlug)

  if (prompt) {
    return genPageMetadata({ title: prompt.title, description: prompt.description })
  }

  return genPageMetadata({ title: '内容中心' })
}

export function generateStaticParams() {
  return promptsData.map((item) => ({ slug: getPromptSlug(item) }))
}

export default async function ContentDetailPage(props: ContentDetailPageProps) {
  const params = await props.params
  const requestedSlug = decodeSlug(params.slug)
  const prompt = findPromptBySlug(promptsData, requestedSlug)

  if (!prompt) {
    const article = allBlogs.find((post) => post.slug === requestedSlug)
    if (article) {
      redirect(`/articles/${article.slug}`)
    }

    redirect('/content')
  }

  return (
    <article className="py-10 sm:py-14">
      <header className="border-b border-white/10 pb-7 sm:pb-9">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="font-heading inline-flex rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-bold tracking-[0.16em] text-cyan-200 uppercase">
            {prompt.category}
          </span>
          <time
            className="font-heading text-xs font-bold tracking-[0.18em] text-slate-300/80 uppercase"
            dateTime={prompt.updatedAt}
          >
            更新于 {prompt.updatedAt}
          </time>
        </div>
        <h1 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text font-serif text-3xl font-semibold tracking-wide text-transparent sm:text-4xl md:text-5xl">
          {prompt.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed font-light text-slate-200 sm:text-base">
          {prompt.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
      </header>

      <section className="mt-8">
        <pre className="overflow-auto rounded-xl bg-slate-950/35 p-5 text-sm leading-7 break-words whitespace-pre-wrap text-slate-100 sm:p-6">
          {prompt.prompt}
        </pre>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/content/prompts"
          className="font-heading inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-2.5 text-xs font-bold tracking-[0.16em] text-white uppercase transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400"
        >
          返回 Prompt Library
        </Link>
        <Link
          href="/content"
          className="font-heading inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold tracking-[0.16em] text-slate-100 uppercase transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/50 hover:text-cyan-100"
        >
          内容中心
        </Link>
      </div>
    </article>
  )
}
