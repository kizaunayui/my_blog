import { genPageMetadata } from 'app/seo'
import ContentSectionGrid from '@/components/ContentSectionGrid'

export const metadata = genPageMetadata({ title: '内容中心' })

export default function ContentPage() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mb-6 rounded-2xl border border-white/25 bg-white/28 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl sm:mb-8 sm:rounded-[2rem] sm:p-7 md:p-9 dark:border-slate-400/20 dark:bg-slate-950/45">
        <p className="mb-3 text-sm font-black tracking-[0.2em] text-pink-600 uppercase dark:text-pink-200">
          Content Center
        </p>
        <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl md:text-4xl lg:text-5xl dark:text-white">
          内容中心
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 font-semibold text-slate-700 sm:mt-4 sm:text-base sm:leading-8 dark:text-slate-200">
          这里集中整理 Prompt
          模板、作品展示和项目研究内容，用于长期沉淀实践经验、创作成果和研究过程。
        </p>
      </div>
      <ContentSectionGrid showIntro />
    </section>
  )
}
