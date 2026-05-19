import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: '个人记录' })

export default function PersonalAboutPage() {
  return (
    <section className="author-page py-10 sm:py-14">
      <div className="author-heading animate-fade-up pb-10">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-pink-200 drop-shadow-[0_10px_26px_rgba(0,0,0,0.55)]">
          Personal Notes
        </p>
        <h1 className="mt-3 text-4xl leading-tight font-black tracking-tight text-white drop-shadow-[0_18px_48px_rgba(0,0,0,0.72)] sm:text-5xl md:text-6xl">
          个人记录
        </h1>
      </div>

      <div className="rounded-[2rem] border border-white/28 bg-white/68 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl dark:border-slate-400/20 dark:bg-slate-950/62 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary-600 dark:text-primary-300">
          About Kieran
        </p>
        <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          这里记录更个人一点的事情。
        </h2>
        <div className="mt-5 h-px w-24 bg-gradient-to-r from-primary-400 via-cyan-300 to-transparent" />
        <p className="mt-7 max-w-3xl text-base leading-8 text-slate-700 dark:text-slate-200 sm:text-lg sm:leading-9">
          这一页和博客内容介绍分开，用来放一些关于我本人的记录：经历、兴趣、阶段性的想法，或者不太适合放进课程笔记和项目文章里的内容。
        </p>
        <Link
          href="/about"
          className="mt-8 inline-flex rounded-full border border-primary-200/70 bg-primary-50/70 px-5 py-3 text-sm font-bold text-primary-700 transition hover:bg-primary-100 dark:border-primary-400/20 dark:bg-primary-400/10 dark:text-primary-200 dark:hover:bg-primary-400/20"
        >
          返回关于页
        </Link>
      </div>
    </section>
  )
}
