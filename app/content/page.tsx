import { genPageMetadata } from 'app/seo'
import ContentSectionGrid from '@/components/ContentSectionGrid'

export const metadata = genPageMetadata({ title: '内容中心' })

export default function ContentPage() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mb-8 rounded-[2rem] border border-white/25 bg-white/28 p-7 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl sm:p-9 dark:border-slate-400/20 dark:bg-slate-950/45">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-pink-600 dark:text-pink-200">
          Content Center
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          内容中心
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 font-semibold text-slate-700 dark:text-slate-200">
          这里集中整理 Prompt 模板、课程复习笔记、作品展示和项目研究内容，用于长期沉淀学习资料、实践经验和研究过程。
        </p>
      </div>
      <ContentSectionGrid showIntro />
    </section>
  )
}
