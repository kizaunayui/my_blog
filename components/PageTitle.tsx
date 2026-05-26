import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="font-serif font-light text-3xl leading-9 tracking-wide text-gray-950 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-white">
      {children}
    </h1>
  )
}
