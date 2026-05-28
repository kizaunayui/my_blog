import Link from '@/components/Link'
import { contentSections } from '@/data/contentSections'

type ContentSectionGridProps = {
  showIntro?: boolean
}

export default function ContentSectionGrid({ showIntro = false }: ContentSectionGridProps) {
  return (
    <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
      {contentSections.map((section) => (
        <Link
          key={section.href}
          href={section.href}
          className="scroll-reveal group relative overflow-hidden rounded-2xl border border-white/28 bg-white/52 p-4 shadow-xl shadow-slate-950/15 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:bg-white/64 hover:shadow-2xl hover:shadow-pink-950/20 sm:rounded-[1.75rem] sm:p-6 dark:border-slate-400/20 dark:bg-slate-950/45 dark:hover:bg-slate-900/60"
        >
          <div className={`mb-5 h-1.5 w-24 rounded-full bg-gradient-to-r ${section.accent}`} />
          <h3 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl dark:text-white">
            {section.title}
          </h3>
          <p className="mt-4 text-sm leading-7 font-semibold text-slate-700 dark:text-slate-200">
            {section.description}
          </p>
          <div className="mt-6 text-sm font-black text-pink-600 transition group-hover:translate-x-1 dark:text-pink-200">
            {showIntro ? '进入栏目 →' : '查看内容 →'}
          </div>
        </Link>
      ))}
    </div>
  )
}
