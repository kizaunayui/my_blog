import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-auto max-w-4xl px-3 sm:px-4 md:px-6 xl:max-w-6xl xl:px-0">{children}</section>
  )
}
