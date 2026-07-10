import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return <section className="site-shell mx-auto px-4 sm:px-6">{children}</section>
}
