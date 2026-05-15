import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content

  return (
    <section className="author-page py-10 sm:py-14">
      <div className="author-heading animate-fade-up pb-10">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-pink-200 drop-shadow-[0_10px_26px_rgba(0,0,0,0.55)]">
          个人介绍
        </p>
        <h1 className="mt-3 text-4xl leading-tight font-black tracking-tight text-white drop-shadow-[0_18px_48px_rgba(0,0,0,0.72)] sm:text-5xl md:text-6xl">
          关于
        </h1>
      </div>
      <div className="items-start gap-8 xl:grid xl:grid-cols-3">
        <aside className="author-profile-card rounded-[2rem] border border-white/28 bg-white/42 p-8 text-center shadow-2xl shadow-slate-950/24 backdrop-blur-2xl dark:border-slate-400/20 dark:bg-slate-950/52">
          <div className="relative mx-auto h-48 w-48">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-300 via-teal-300 to-primary-500 opacity-70 blur-xl" />
            {avatar && (
              <Image
                src={avatar}
                alt="头像"
                width={192}
                height={192}
                className="relative h-48 w-48 rounded-full border-4 border-white object-cover shadow-2xl transition duration-300 hover:scale-105 dark:border-gray-900"
              />
            )}
          </div>
          <h3 className="pt-6 pb-2 text-2xl leading-8 font-black tracking-tight text-slate-950 dark:text-white">
            {name}
          </h3>
          <div className="font-semibold text-slate-700 dark:text-slate-200">{occupation}</div>
          <div className="font-semibold text-slate-700 dark:text-slate-200">{company}</div>
          <div className="flex justify-center space-x-3 pt-6">
            <SocialIcon kind="mail" href={`mailto:${email}`} />
            <SocialIcon kind="github" href={github} />
            <SocialIcon kind="linkedin" href={linkedin} />
            <SocialIcon kind="x" href={twitter} />
            <SocialIcon kind="bluesky" href={bluesky} />
          </div>
        </aside>
        <div className="author-content-card prose mt-8 max-w-none rounded-[2rem] border border-white/28 bg-white/68 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl dark:prose-invert dark:border-slate-400/20 dark:bg-slate-950/62 xl:col-span-2 xl:mt-0">
          {children}
        </div>
      </div>
    </section>
  )
}
