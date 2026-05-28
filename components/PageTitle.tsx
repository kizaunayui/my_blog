import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="font-serif font-light text-2xl leading-tight tracking-wide text-gray-950 sm:text-3xl sm:leading-9 md:text-4xl md:leading-10 lg:text-5xl lg:leading-14 dark:text-white">
      {children}
    </h1>
  )
}
