import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import Link from '@/components/Link'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content

  return (
    <section className="author-page py-6 sm:py-10 md:py-14">
      <div className="author-heading animate-fade-up pb-6 sm:pb-10">
        <p className="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">
          个人介绍
        </p>
        <h1 className="mt-2 font-serif text-2xl font-light tracking-wide text-white sm:mt-3 sm:text-3xl md:text-4xl lg:text-5xl">
          关于我
        </h1>
      </div>
      <div className="items-start gap-6 sm:gap-8 xl:grid xl:grid-cols-3">
        <div className="space-y-4 sm:space-y-5">
          <aside className="author-profile-card rounded-2xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-slate-950/20 p-5 text-center shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-md sm:rounded-3xl sm:p-8">
            <div className="relative mx-auto h-48 w-48">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-300 via-teal-300 to-cyan-500 opacity-50 blur-xl" />
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
            <h3 className="pt-6 pb-2 text-2xl font-light font-serif tracking-wide text-slate-950 dark:text-white">
              {name}
            </h3>
            <div className="font-heading text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300">{occupation}</div>
            <div className="font-heading text-[11px] tracking-wider text-slate-500 dark:text-slate-400 mt-1">{company}</div>
            <div className="flex justify-center space-x-3 pt-6">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="x" href={twitter} />
              <SocialIcon kind="bluesky" href={bluesky} />
            </div>
          </aside>
          <Link
            href="/about/me"
            aria-label="reflexion"
            className="mx-auto inline-flex w-full items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-4 font-heading text-xs font-bold uppercase tracking-[0.24em] text-cyan-800 dark:text-cyan-200 shadow-sm backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:bg-white/20"
          >
            reflexion
          </Link>
        </div>
        <div className="author-content-card prose mt-6 max-w-none rounded-2xl border border-white/10 dark:border-white/5 bg-white/60 dark:bg-slate-950/20 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] backdrop-blur-md sm:mt-8 sm:rounded-3xl sm:p-8 dark:prose-invert xl:col-span-2 xl:mt-0">
          {children}
        </div>
      </div>
    </section>
  )
}
