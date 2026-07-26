import Link from '@/components/Link'
import { contentSections } from '@/data/contentSections'
import SpotlightCard from '@/components/SpotlightCard'

type ContentSectionGridProps = {
  showIntro?: boolean
  reveal?: boolean
}

export default function ContentSectionGrid({
  showIntro = false,
  reveal = true,
}: ContentSectionGridProps) {
  return (
    <div className="content-section-grid grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
      {contentSections.map((section) => (
        <Link
          key={section.href}
          href={section.href}
          className={reveal ? 'scroll-reveal block' : 'block'}
        >
          <SpotlightCard
            className="content-section-card p-5 sm:p-6"
            glowColor="rgba(6, 182, 212, 0.15)"
            glowSize={300}
          >
            <div
              className={`content-section-accent mb-5 h-0.5 w-24 rounded-full bg-gradient-to-r ${section.accent}`}
            />
            <h3 className="content-section-title font-serif text-xl font-light tracking-wide text-slate-900 sm:text-2xl dark:text-white">
              {section.title}
            </h3>
            <p className="content-section-description mt-4 text-sm leading-7 font-normal text-slate-700 dark:text-slate-200">
              {section.description}
            </p>
            <div className="content-section-cta mt-6 text-sm font-bold text-pink-600 transition duration-300 group-hover:translate-x-1.5 dark:text-pink-200">
              {showIntro ? '进入栏目 →' : '查看内容 →'}
            </div>
          </SpotlightCard>
        </Link>
      ))}
    </div>
  )
}
