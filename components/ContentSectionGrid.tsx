import Link from '@/components/Link'
import { contentSections } from '@/data/contentSections'
import SpotlightCard from '@/components/SpotlightCard'

type ContentSectionGridProps = {
  showIntro?: boolean
}

export default function ContentSectionGrid({ showIntro = false }: ContentSectionGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
      {contentSections.map((section) => (
        <Link key={section.href} href={section.href} className="scroll-reveal block">
          <SpotlightCard
            variant="transparent"
            className="p-5 sm:p-6"
            glowColor="rgba(6, 182, 212, 0.15)"
            glowSize={300}
          >
            <div className={`mb-5 h-1.5 w-24 rounded-full bg-gradient-to-r ${section.accent}`} />
            <h3 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              {section.title}
            </h3>
            <p className="mt-4 text-sm leading-7 font-semibold text-slate-700 dark:text-slate-200">
              {section.description}
            </p>
            <div className="mt-6 text-sm font-black text-pink-600 transition duration-300 group-hover:translate-x-1.5 dark:text-pink-200">
              {showIntro ? '进入栏目 →' : '查看内容 →'}
            </div>
          </SpotlightCard>
        </Link>
      ))}
    </div>
  )
}
