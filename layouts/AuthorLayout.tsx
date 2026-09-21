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
    <section className="author-page py-8 sm:py-12 md:py-14">
      <div className="author-heading editorial-masthead animate-fade-up border-b border-white/10 pb-7 sm:pb-9">
        <h1 className="editorial-title mt-2 font-serif text-3xl font-light tracking-wide text-white sm:text-4xl md:text-5xl">
          关于我
        </h1>
      </div>

      <div className="author-intro-grid">
        <div className="author-profile-card space-y-5">
          <aside className="author-profile-aside text-center">
            <div className="author-avatar relative">
              {avatar && (
                <Image
                  src={avatar}
                  alt="头像"
                  width={176}
                  height={176}
                  className="h-full w-full rounded-full object-cover transition duration-300 hover:scale-105"
                />
              )}
            </div>
            <h2 className="author-name font-serif text-2xl font-light text-white">{name}</h2>
            <div className="font-heading text-xs font-semibold tracking-wider text-slate-200">
              {occupation}
            </div>
            <div className="font-heading mt-1 text-[11px] tracking-wider text-slate-300">
              {company}
            </div>
            <div className="flex justify-center space-x-3 pt-6">
              <SocialIcon kind="mail" href={email ? `mailto:${email}` : undefined} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="x" href={twitter} />
              <SocialIcon kind="bluesky" href={bluesky} />
            </div>
          </aside>
          <Link
            href="/about/me"
            aria-label="reflexion"
            className="editorial-action editorial-action--quiet font-heading inline-flex w-full items-center justify-center rounded-full border border-white/15 px-5 py-3 text-xs font-bold tracking-[0.2em] text-cyan-200 uppercase transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:text-cyan-100"
          >
            reflexion
          </Link>
        </div>

        <div className="author-content-area prose dark:prose-invert">{children}</div>
      </div>
    </section>
  )
}
