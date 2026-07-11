import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="editorial-article-title font-serif text-xl leading-tight font-light tracking-wide text-gray-950 sm:text-2xl sm:leading-8 md:text-[1.75rem] md:leading-9 lg:text-3xl lg:leading-10 dark:text-white">
      {children}
    </h1>
  )
}
