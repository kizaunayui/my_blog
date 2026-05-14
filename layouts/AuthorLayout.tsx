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
    <>
      <div className="animate-fade-up pt-8 pb-10">
        <p className="text-primary-600 dark:text-primary-300 text-sm font-semibold">个人介绍</p>
        <h1 className="mt-2 text-4xl leading-tight font-black tracking-tight text-gray-950 sm:text-5xl md:text-6xl dark:text-white">
          关于
        </h1>
      </div>
      <div className="items-start gap-8 xl:grid xl:grid-cols-3">
        <aside className="post-card-motion rounded-3xl border border-gray-200/80 bg-white/75 p-8 text-center shadow-xl shadow-gray-200/50 backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/60 dark:shadow-black/30">
          <div className="relative mx-auto h-48 w-48">
            <div className="from-primary-300 to-primary-500 absolute inset-0 rounded-full bg-gradient-to-tr via-teal-300 opacity-70 blur-xl" />
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
          <h3 className="pt-6 pb-2 text-2xl leading-8 font-bold tracking-tight text-gray-950 dark:text-white">
            {name}
          </h3>
          <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
          <div className="text-gray-500 dark:text-gray-400">{company}</div>
          <div className="flex justify-center space-x-3 pt-6">
            <SocialIcon kind="mail" href={`mailto:${email}`} />
            <SocialIcon kind="github" href={github} />
            <SocialIcon kind="linkedin" href={linkedin} />
            <SocialIcon kind="x" href={twitter} />
            <SocialIcon kind="bluesky" href={bluesky} />
          </div>
        </aside>
        <div className="prose dark:prose-invert post-card-motion mt-8 max-w-none rounded-3xl border border-gray-200/80 bg-white/75 p-8 shadow-sm backdrop-blur xl:col-span-2 xl:mt-0 dark:border-gray-800/80 dark:bg-gray-900/60">
          {children}
        </div>
      </div>
    </>
  )
}
